"use strict";

/**
 * Strapi v5 bootstrap — register public read permissions and auto-translation hooks.
 * Uses DeepL REST API to translate localized fields, including nested components.
 *
 * Set DEEPL_API_KEY in .env to enable. Free key: https://www.deepl.com/pro-api
 *
 * TRANSLATE_TARGET_LOCALES defaults to "zh-Hans,en". Add more Strapi locale codes later,
 * for example: TRANSLATE_TARGET_LOCALES=zh-Hans,en,ja,ko,zh-Hant
 */

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

const PUBLIC_READ_APIS = new Set(LOCALIZED_TYPES.map((uid) => uid.split(".")[0]));
const PUBLIC_READ_ACTIONS = new Set(["find", "findOne"]);
const TRANSLATABLE_TYPES = new Set(["string", "text", "richtext"]);
const NON_TRANSLATABLE_FIELD_NAMES = new Set([
  "id",
  "documentId",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "createdBy",
  "updatedBy",
  "locale",
]);
const DEFAULT_TARGET_LOCALES = ["zh-Hans", "en"];
const AUTO_TRANSLATING = new Set();
const TRANSLATION_JOBS = new Set();
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

function toGlobalId(uid) {
  return uid
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function serializeComponentSchema(uid, schema) {
  const [category, modelName] = uid.split(".");

  return {
    collectionName: schema.collectionName,
    info: schema.info || {},
    options: schema.options || {},
    attributes: schema.attributes || {},
    category,
    uid,
    modelType: "component",
    modelName,
    globalId: schema.globalId || toGlobalId(uid),
    ...(schema.pluginOptions ? { pluginOptions: schema.pluginOptions } : {}),
    __schema__: {
      collectionName: schema.collectionName,
      info: schema.info || {},
      options: schema.options || {},
      attributes: schema.attributes || {},
    },
  };
}

async function ensureComponentSchemasInCoreStore(strapi) {
  const components = Object.entries(strapi.components || {});
  if (components.length === 0) return;

  const tableName = "strapi_core_store_settings";
  const cacheKey = "strapi_content_types_schema";
  const row = await strapi.db.connection(tableName).where({ key: cacheKey }).first();

  if (!row?.value) {
    strapi.log.warn("[schema-cache] Content type schema cache not found; skipping component cache repair");
    return;
  }

  let cachedSchemas;
  try {
    cachedSchemas = JSON.parse(row.value);
  } catch (err) {
    strapi.log.warn(`[schema-cache] Could not parse content type schema cache: ${err.message}`);
    return;
  }

  let repairedCount = 0;
  for (const [uid, schema] of components) {
    if (cachedSchemas[uid]?.modelType === "component" && cachedSchemas[uid]?.attributes) {
      continue;
    }

    cachedSchemas[uid] = serializeComponentSchema(uid, schema);
    repairedCount += 1;
  }

  if (repairedCount === 0) return;

  await strapi.db.connection(tableName).where({ key: cacheKey }).update({
    value: JSON.stringify(cachedSchemas),
  });

  strapi.log.info(`[schema-cache] Repaired ${repairedCount} component schema cache entries`);
}

async function ensureContentManagerEditorConfigurations(strapi) {
  const contentManager = strapi.plugin("content-manager");
  if (!contentManager) {
    strapi.log.warn("[content-manager] Plugin not found; skipping editor configuration sync");
    return;
  }

  await contentManager.service("components").syncConfigurations();
  await contentManager.service("content-types").syncConfigurations();

  const componentUids = Object.keys(strapi.components || {});
  const missingOrMalformed = [];

  for (const uid of componentUids) {
    const row = await strapi.db.connection("strapi_core_store_settings")
      .where({ key: `plugin_content_manager_configuration_components::${uid}` })
      .first();

    if (!row?.value) {
      missingOrMalformed.push(uid);
      continue;
    }

    try {
      const config = JSON.parse(row.value);
      if (!Array.isArray(config?.layouts?.edit) || !config.metadatas || !config.settings) {
        missingOrMalformed.push(uid);
      }
    } catch (err) {
      missingOrMalformed.push(uid);
    }
  }

  if (missingOrMalformed.length > 0) {
    strapi.log.warn(
      `[content-manager] Component editor configuration still incomplete for: ${missingOrMalformed.join(", ")}`
    );
    return;
  }

  strapi.log.info(`[content-manager] Synced ${componentUids.length} component editor configurations`);
}

async function ensureDefaultContentLocale(strapi) {
  const localesService = strapi.plugin("i18n")?.service("locales");
  if (!localesService) {
    strapi.log.warn("[i18n] Plugin not found; skipping default content locale check");
    return;
  }

  const preferredLocale = process.env.STRAPI_DEFAULT_LOCALE || "en";
  const locale = await localesService.findByCode(preferredLocale);
  if (!locale) {
    strapi.log.warn(`[i18n] Locale ${preferredLocale} not found; keeping existing default locale`);
    return;
  }

  const currentDefault = await localesService.getDefaultLocale();
  if (currentDefault === preferredLocale) return;

  await localesService.setDefaultLocale({ code: preferredLocale });
  strapi.log.info(`[i18n] Set default content locale to ${preferredLocale}`);
}

async function ensurePublicReadPermissions(strapi) {
  const role = await strapi.db.query("plugin::users-permissions.role").findOne({
    where: { type: "public" },
    populate: ["permissions"],
  });

  if (!role) {
    strapi.log.warn("[permissions] Public role not found; skipping public API permission bootstrap");
    return;
  }

  const actions = strapi
    .plugin("users-permissions")
    .service("users-permissions")
    .getActions();

  const existingActions = new Set((role.permissions || []).map((permission) => permission.action));
  const readActions = [];

  for (const [apiName, config] of Object.entries(actions)) {
    if (!PUBLIC_READ_APIS.has(apiName)) continue;

    for (const [controllerName, controller] of Object.entries(config.controllers || {})) {
      for (const actionName of Object.keys(controller || {})) {
        if (!PUBLIC_READ_ACTIONS.has(actionName)) continue;
        readActions.push(`${apiName}.${controllerName}.${actionName}`);
      }
    }
  }

  const missingActions = readActions.filter((action) => !existingActions.has(action));
  if (missingActions.length === 0) return;

  await Promise.all(
    missingActions.map((action) =>
      strapi.db.query("plugin::users-permissions.permission").create({
        data: {
          action,
          role: role.id,
        },
      })
    )
  );

  strapi.log.info(`[permissions] Enabled ${missingActions.length} public read permissions`);
}

function getTranslationTargets(sourceLocale) {
  const raw = process.env.TRANSLATE_TARGET_LOCALES || DEFAULT_TARGET_LOCALES.join(",");
  return raw
    .split(",")
    .map((locale) => locale.trim())
    .filter((locale) => locale && locale !== sourceLocale);
}

function translationKey(uid, documentId, locale) {
  return `${uid}:${documentId}:${locale}`;
}

function getDeepLLang(locale) {
  return DEEPL_LANGS[locale] || locale.toUpperCase();
}

async function translateText(text, sourceLocale, targetLocale) {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey || !text || typeof text !== "string" || text.trim().length === 0) return text;

  const apiBase = process.env.DEEPL_API_URL || (apiKey.endsWith(":fx")
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate");
  const params = new URLSearchParams();
  params.set("auth_key", apiKey);
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

async function translateBySchema(strapi, modelUid, sourceValue, targetValue, sourceLocale, targetLocale) {
  if (!sourceValue) return undefined;

  const schema = strapi.getModel(modelUid);
  if (!schema?.attributes) return undefined;

  const result = {};

  for (const [field, attr] of Object.entries(schema.attributes)) {
    if (NON_TRANSLATABLE_FIELD_NAMES.has(field)) continue;

    const sourceFieldValue = sourceValue[field];
    if (sourceFieldValue === null || sourceFieldValue === undefined) continue;

    if (TRANSLATABLE_TYPES.has(attr.type) && attr.pluginOptions?.i18n?.localized) {
      result[field] = await translateText(sourceFieldValue, sourceLocale, targetLocale);
      continue;
    }

    if (attr.type === "media" && shouldCopySharedField(attr)) {
      const mediaValue = serializeMediaValue(sourceFieldValue, attr);
      if (hasStoredValue(mediaValue)) result[field] = mediaValue;
      continue;
    }

    if (attr.type !== "component" && attr.type !== "relation" && shouldCopySharedField(attr)) {
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
            targetLocale
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
          targetLocale
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

async function translateEntry(strapi, uid, documentId, sourceLocale) {
  if (!process.env.DEEPL_API_KEY) return;

  try {
    const populate = buildPopulate(strapi, uid);
    const sourceEntry = await strapi.documents(uid).findOne({
      documentId,
      locale: sourceLocale,
      populate,
    });
    if (!sourceEntry) return;

    for (const targetLocale of getTranslationTargets(sourceLocale)) {
      const targetKey = translationKey(uid, documentId, targetLocale);
      const existingTarget = await strapi.documents(uid).findOne({
        documentId,
        locale: targetLocale,
        populate,
      });
      const targetData = await translateBySchema(strapi, uid, sourceEntry, existingTarget, sourceLocale, targetLocale);
      if (!targetData || Object.keys(targetData).length === 0) continue;

      AUTO_TRANSLATING.add(targetKey);
      try {
        if (existingTarget) {
          await strapi.documents(uid).update({
            documentId,
            locale: targetLocale,
            data: targetData,
          });
        } else {
          await strapi.documents(uid).create({
            documentId,
            locale: targetLocale,
            data: targetData,
            status: "published",
          });
        }
      } finally {
        setTimeout(() => AUTO_TRANSLATING.delete(targetKey), 1000);
      }
      strapi.log.info(`[auto-translate] ✓ ${uid}/${documentId}: ${sourceLocale} → ${targetLocale}`);
    }
  } catch (err) {
    strapi.log.error(`[auto-translate] ${uid}/${documentId}: ${err.message}`);
  }
}

function scheduleTranslation(strapi, uid, result) {
  if (!result?.documentId || !result.locale) return;

  const key = translationKey(uid, result.documentId, result.locale);
  if (AUTO_TRANSLATING.has(key) || TRANSLATION_JOBS.has(key)) return;

  TRANSLATION_JOBS.add(key);
  setTimeout(async () => {
    try {
      await translateEntry(strapi, uid, result.documentId, result.locale);
    } finally {
      TRANSLATION_JOBS.delete(key);
    }
  }, 5000);
}

module.exports = {
  async bootstrap({ strapi }) {
    await ensureComponentSchemasInCoreStore(strapi);
    await ensureContentManagerEditorConfigurations(strapi);
    await ensureDefaultContentLocale(strapi);
    await ensurePublicReadPermissions(strapi);

    if (!process.env.DEEPL_API_KEY) {
      strapi.log.info("[auto-translate] DEEPL_API_KEY not set — skipping lifecycle registration");
      return;
    }

    for (const uid of LOCALIZED_TYPES) {
      strapi.db.lifecycles.subscribe({
        models: [uid],
        async afterCreate(event) {
          scheduleTranslation(strapi, uid, event.result);
        },
        async afterUpdate(event) {
          scheduleTranslation(strapi, uid, event.result);
        },
      });
    }
    strapi.log.info(`[auto-translate] Registered for ${LOCALIZED_TYPES.length} content types`);
  },
};
