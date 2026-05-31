"use strict";

/**
 * Strapi v5 bootstrap — register auto-translation lifecycle hooks
 * Uses DeepL API to auto-translate zh-Hans → en when content is created/updated.
 *
 * Set DEEPL_API_KEY in .env to enable. Free key: https://www.deepl.com/pro-api
 *
 * NOTE: deepl-node is lazily loaded only when DEEPL_API_KEY is set.
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
];

const PUBLIC_READ_APIS = new Set(LOCALIZED_TYPES.map((uid) => uid.split(".")[0]));
const PUBLIC_READ_ACTIONS = new Set(["find", "findOne"]);
const TRANSLATABLE_TYPES = new Set(["string", "text", "richtext"]);

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

async function translateEntry(strapi, uid, entityId, sourceLocale) {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) return;

  let deepl;
  try { deepl = require("deepl-node"); } catch { return; }

  try {
    const translator = new deepl.Translator(apiKey);
    const sourceEntry = await strapi.documents(uid).findOne({
      documentId: entityId,
      locale: sourceLocale,
    });
    if (!sourceEntry) return;

    const schema = strapi.getModel(uid);
    const translatableFields = Object.entries(schema.attributes)
      .filter(([, attr]) => TRANSLATABLE_TYPES.has(attr.type) && attr.pluginOptions?.i18n?.localized)
      .map(([name]) => name);
    if (translatableFields.length === 0) return;

    const targetLocale = sourceLocale === "zh-Hans" ? "en" : "zh-Hans";
    const targetLang = targetLocale === "en" ? "en-US" : "zh";
    const sourceLang = sourceLocale === "zh-Hans" ? "zh" : "en";

    const existingTarget = await strapi.documents(uid).findOne({
      documentId: entityId,
      locale: targetLocale,
    });

    const targetData = {};
    for (const field of translatableFields) {
      const sourceText = sourceEntry[field];
      if (!sourceText || typeof sourceText !== "string" || sourceText.trim().length === 0) continue;

      // Preserve manual translations
      if (existingTarget && existingTarget[field] && existingTarget[field] !== sourceText) {
        continue;
      }

      try {
        const result = await translator.translateText(sourceText, sourceLang, targetLang);
        targetData[field] = result.text;
      } catch (err) {
        strapi.log.error(`[auto-translate] ${uid}/${field}: ${err.message}`);
      }
    }

    if (Object.keys(targetData).length === 0) return;

    if (existingTarget) {
      await strapi.documents(uid).update({
        documentId: entityId,
        locale: targetLocale,
        data: targetData,
      });
    } else {
      await strapi.documents(uid).create({
        documentId: entityId,
        locale: targetLocale,
        data: targetData,
        status: "published",
      });
    }
    strapi.log.info(`[auto-translate] ✓ ${uid}/${entityId} → ${targetLocale}`);
  } catch (err) {
    strapi.log.error(`[auto-translate] ${uid}/${entityId}: ${err.message}`);
  }
}

module.exports = {
  async bootstrap({ strapi }) {
    await ensurePublicReadPermissions(strapi);

    if (!process.env.DEEPL_API_KEY) {
      strapi.log.info("[auto-translate] DEEPL_API_KEY not set — skipping lifecycle registration");
      return;
    }

    for (const uid of LOCALIZED_TYPES) {
      strapi.db.lifecycles.subscribe({
        models: [uid],
        async afterCreate(event) {
          const { result } = event;
          if (!result?.documentId || result.locale !== "zh-Hans") return;
          setTimeout(() => translateEntry(strapi, uid, result.documentId, "zh-Hans").catch(() => {}), 5000);
        },
        async afterUpdate(event) {
          const { result } = event;
          if (!result?.documentId || result.locale !== "zh-Hans") return;
          setTimeout(() => translateEntry(strapi, uid, result.documentId, "zh-Hans").catch(() => {}), 5000);
        },
      });
    }
    strapi.log.info(`[auto-translate] Registered for ${LOCALIZED_TYPES.length} content types`);
  },
};
