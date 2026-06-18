"use strict";

/**
 * Generate/update target locale entries from a source locale using the same
 * Strapi document APIs as the admin panel. This keeps runtime translation out
 * of the frontend: the website reads only the selected locale.
 *
 * Usage:
 *   npm run sync:locales -- --from zh-Hans --to en
 *
 * Add --static to use the bundled static dictionary when DEEPL_API_KEY is not
 * available. Without --static and without DEEPL_API_KEY, the script fails fast.
 */

const { createStrapi } = require("@strapi/strapi");
const fs = require("fs");
const path = require("path");

const LOCALIZED_TYPES = [
  "api::home-page.home-page",
  "api::about-page.about-page",
  "api::infrastructure-page.infrastructure-page",
  "api::products-page.products-page",
  "api::business-page.business-page",
  "api::aws-page.aws-page",
  "api::contact-page.contact-page",
  "api::site-setting.site-setting",
  "api::privacy-page.privacy-page",
  "api::terms-page.terms-page",
  "api::enterprise-service-page.enterprise-service-page",
  "api::security-governance-page.security-governance-page",
];

const TRANSLATABLE_TYPES = new Set(["string", "text", "richtext"]);
const NON_DATA_FIELDS = new Set([
  "id",
  "documentId",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "createdBy",
  "updatedBy",
  "locale",
  "localizations",
]);

const DEEPL_LANGS = {
  en: "EN-US",
  "zh-Hans": "ZH-HANS",
  "zh-Hant": "ZH-HANT",
  ja: "JA",
  ko: "KO",
  fr: "FR",
  de: "DE",
  es: "ES",
  it: "IT",
  pt: "PT-PT",
  ru: "RU",
};

function parseArgs(argv) {
  const args = {
    from: "zh-Hans",
    to: "en",
    static: false,
    force: false,
    publish: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--from") args.from = argv[++index];
    else if (arg === "--to") args.to = argv[++index];
    else if (arg === "--static") args.static = true;
    else if (arg === "--force") args.force = true;
    else if (arg === "--draft") args.publish = false;
  }

  return args;
}

function getDeepLLang(locale) {
  return DEEPL_LANGS[locale] || locale.toUpperCase();
}

function hasChinese(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

function shouldWriteTranslatedValue(sourceValue, translatedValue, targetLocale, options) {
  if (!options.static || targetLocale !== "en") return true;
  if (typeof sourceValue !== "string" || typeof translatedValue !== "string") return true;
  return !hasChinese(translatedValue);
}

async function createTranslator(options) {
  if (process.env.DEEPL_API_KEY) {
    return async (text, sourceLocale, targetLocale) => {
      if (!text || typeof text !== "string" || text.trim().length === 0) return text;

      const apiBase = process.env.DEEPL_API_URL || (process.env.DEEPL_API_KEY.endsWith(":fx")
        ? "https://api-free.deepl.com/v2/translate"
        : "https://api.deepl.com/v2/translate");
      const params = new URLSearchParams();
      params.set("auth_key", process.env.DEEPL_API_KEY);
      params.set("text", text);
      params.set("source_lang", getDeepLLang(sourceLocale));
      params.set("target_lang", getDeepLLang(targetLocale));

      const response = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`DeepL HTTP ${response.status}: ${body.slice(0, 200)}`);
      }

      const json = await response.json();
      return json.translations?.[0]?.text || text;
    };
  }

  if (!options.static) {
    throw new Error("DEEPL_API_KEY is not set. Add --static to use the bundled static dictionary instead.");
  }

  const staticMap = loadStaticTranslations();
  const reverseMap = Object.fromEntries(Object.entries(staticMap).map(([key, value]) => [value, key]));
  return async (text, _sourceLocale, targetLocale) => {
    if (!text || typeof text !== "string") return text;
    if (targetLocale === "en") return translateWithStaticMap(text, staticMap);
    if (targetLocale === "zh-Hans") return translateWithStaticMap(text, reverseMap);
    return text;
  };
}

function loadStaticTranslations() {
  const filePath = path.resolve(__dirname, "../../frontend/src/lib/translations-static.ts");
  const source = fs.readFileSync(filePath, "utf8");
  const start = source.indexOf("const TRANS_MAP");
  if (start < 0) throw new Error("Could not find TRANS_MAP in translations-static.ts");

  const objectStart = source.indexOf("{", start);
  const objectEnd = source.indexOf("};", objectStart);
  if (objectStart < 0 || objectEnd < 0) throw new Error("Could not parse TRANS_MAP in translations-static.ts");

  const objectLiteral = source.slice(objectStart, objectEnd + 1);
  return Function(`"use strict"; return (${objectLiteral});`)();
}

function translateWithStaticMap(text, translations) {
  if (!text || typeof text !== "string") return text;
  const trimmed = text.trim();
  if (translations[text]) return translations[text];
  if (translations[trimmed]) return translations[trimmed];

  if (text.includes("\n")) {
    return text
      .split("\n")
      .map((line) => translateWithStaticMap(line.trim(), translations))
      .join("\n");
  }

  if (targetSeparatorCandidate(text, ",")) {
    return text
      .split(",")
      .map((segment) => translateWithStaticMap(segment.trim(), translations))
      .join(", ");
  }

  if (targetSeparatorCandidate(text, "、")) {
    return text
      .split("、")
      .map((segment) => translateWithStaticMap(segment.trim(), translations))
      .join(", ");
  }

  return text;
}

function targetSeparatorCandidate(text, separator) {
  return text.includes(separator) && text.split(separator).length > 1;
}

function buildPopulate(strapi, modelUid, depth = 0) {
  if (depth > 4) return "*";

  const schema = strapi.getModel(modelUid);
  if (!schema?.attributes) return "*";

  const populate = {};
  for (const [field, attr] of Object.entries(schema.attributes)) {
    if (attr.type === "media") {
      populate[field] = {
        fields: ["id", "documentId", "name", "alternativeText", "caption", "width", "height", "url", "formats"],
      };
    }
    if (attr.type === "component" && attr.component) {
      populate[field] = { populate: buildPopulate(strapi, attr.component, depth + 1) };
    }
  }

  return Object.keys(populate).length > 0 ? populate : "*";
}

function shouldKeepTargetValue(targetValue, sourceValue, options) {
  if (options.force) return false;
  if (targetValue === null || targetValue === undefined || targetValue === "") return false;
  if (targetValue === sourceValue) return false;
  if (typeof targetValue === "string" && hasChinese(targetValue)) return false;
  return true;
}

function hasStoredValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && value !== "";
}

function serializeMediaValue(value, attr) {
  if (!hasStoredValue(value)) return value;
  if (attr.multiple) {
    return (Array.isArray(value) ? value : [value])
      .map((item) => (typeof item === "object" ? item.id : item))
      .filter(Boolean);
  }
  return typeof value === "object" ? value.id : value;
}

function shouldCopySharedField(attr) {
  return attr.pluginOptions?.i18n?.localized !== true;
}

async function translateBySchema(strapi, modelUid, sourceValue, targetValue, sourceLocale, targetLocale, translateText, options) {
  if (!sourceValue) return undefined;

  const schema = strapi.getModel(modelUid);
  if (!schema?.attributes) return undefined;

  const result = {};

  for (const [field, attr] of Object.entries(schema.attributes)) {
    if (NON_DATA_FIELDS.has(field)) continue;

    const sourceFieldValue = sourceValue[field];
    if (sourceFieldValue === null || sourceFieldValue === undefined) continue;

    if (TRANSLATABLE_TYPES.has(attr.type) && attr.pluginOptions?.i18n?.localized) {
      if (shouldKeepTargetValue(targetValue?.[field], sourceFieldValue, options)) continue;
      const translatedValue = await translateText(sourceFieldValue, sourceLocale, targetLocale);
      if (!shouldWriteTranslatedValue(sourceFieldValue, translatedValue, targetLocale, options)) continue;
      result[field] = translatedValue;
      continue;
    }

    if (attr.type === "media" && shouldCopySharedField(attr)) {
      if (!options.force && hasStoredValue(targetValue?.[field])) continue;
      const mediaValue = serializeMediaValue(sourceFieldValue, attr);
      if (hasStoredValue(mediaValue)) result[field] = mediaValue;
      continue;
    }

    if (attr.type !== "component" && attr.type !== "relation" && shouldCopySharedField(attr)) {
      if (!options.force && hasStoredValue(targetValue?.[field])) continue;
      result[field] = sourceFieldValue;
      continue;
    }

    if (attr.type === "component" && attr.component && attr.pluginOptions?.i18n?.localized !== false) {
      if (attr.repeatable) {
        const sourceItems = Array.isArray(sourceFieldValue) ? sourceFieldValue : [];
        const targetItems = Array.isArray(targetValue?.[field]) ? targetValue[field] : [];
        result[field] = await Promise.all(sourceItems.map(async (sourceItem, index) => {
          const translated = await translateBySchema(
            strapi,
            attr.component,
            sourceItem,
            targetItems[index],
            sourceLocale,
            targetLocale,
            translateText,
            options
          );
          return {
            ...(targetItems[index]?.id ? { id: targetItems[index].id } : {}),
            ...translated,
          };
        }));
      } else {
        const translated = await translateBySchema(
          strapi,
          attr.component,
          sourceFieldValue,
          targetValue?.[field],
          sourceLocale,
          targetLocale,
          translateText,
          options
        );
        if (translated && Object.keys(translated).length > 0) {
          result[field] = {
            ...(targetValue?.[field]?.id ? { id: targetValue[field].id } : {}),
            ...translated,
          };
        }
      }
    }
  }

  return result;
}

async function syncContentType(strapi, uid, options, translateText) {
  const populate = buildPopulate(strapi, uid);
  const sourceEntry = await strapi.documents(uid).findFirst({
    locale: options.from,
    populate,
  });

  if (!sourceEntry?.documentId) {
    console.log(`[sync:locales] ${uid}: no ${options.from} entry`);
    return;
  }

  const targetEntry = await strapi.documents(uid).findOne({
    documentId: sourceEntry.documentId,
    locale: options.to,
    populate,
  });

  const data = await translateBySchema(
    strapi,
    uid,
    sourceEntry,
    targetEntry,
    options.from,
    options.to,
    translateText,
    options
  );

  if (!data || Object.keys(data).length === 0) {
    console.log(`[sync:locales] ${uid}: no changes`);
    return;
  }

  if (targetEntry) {
    await strapi.documents(uid).update({
      documentId: sourceEntry.documentId,
      locale: options.to,
      data,
      status: options.publish ? "published" : undefined,
    });
    console.log(`[sync:locales] ${uid}: updated ${options.to}`);
  } else {
    await strapi.documents(uid).create({
      documentId: sourceEntry.documentId,
      locale: options.to,
      data,
      status: options.publish ? "published" : undefined,
    });
    console.log(`[sync:locales] ${uid}: created ${options.to}`);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.from === options.to) {
    throw new Error("--from and --to must be different locales");
  }

  const translateText = await createTranslator(options);
  const app = await createStrapi();
  await app.load();

  try {
    for (const uid of LOCALIZED_TYPES) {
      await syncContentType(app, uid, options, translateText);
    }
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error(`[sync:locales] ${err.stack || err.message}`);
  process.exit(1);
});
