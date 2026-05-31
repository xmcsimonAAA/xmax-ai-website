"use strict";

/**
 * Auto-translation service for Strapi v5
 * Uses DeepL API to auto-translate localized fields between zh-Hans and en.
 *
 * Requires DEEPL_API_KEY environment variable.
 * Free DeepL API key: https://www.deepl.com/pro-api
 */

const deepl = require("deepl-node");

/** Fields that should be auto-translated (string/text/richtext only) */
const TRANSLATABLE_TYPES = new Set(["string", "text", "richtext"]);

/** Locales to translate between */
const SOURCE_LOCALE = "zh-Hans";
const TARGET_LOCALE = "en";

module.exports = ({ strapi }) => ({
  /**
   * Auto-translate a single entry from source locale to target locale.
   * Called after create or update of a localized content type.
   */
  async translateEntry(uid, entityId, sourceLocale = SOURCE_LOCALE) {
    const apiKey = process.env.DEEPL_API_KEY;
    if (!apiKey) {
      strapi.log.warn("[auto-translate] DEEPL_API_KEY not set — skipping translation");
      return;
    }

    try {
      const translator = new deepl.Translator(apiKey);

      // Get source entry
      const sourceEntry = await strapi.documents(uid).findOne({
        documentId: entityId,
        locale: sourceLocale,
      });

      if (!sourceEntry) {
        strapi.log.warn(`[auto-translate] No source entry for ${uid}/${entityId} in ${sourceLocale}`);
        return;
      }

      // Get content-type schema to find translatable fields
      const schema = strapi.getModel(uid);
      const translatableFields = Object.entries(schema.attributes)
        .filter(([, attr]) => TRANSLATABLE_TYPES.has(attr.type) && attr.pluginOptions?.i18n?.localized)
        .map(([name]) => name);

      if (translatableFields.length === 0) return;

      // Check existing target entry to avoid overwriting manual translations
      const existingTarget = await strapi.documents(uid).findOne({
        documentId: entityId,
        locale: TARGET_LOCALE,
      });

      const targetData = {};

      for (const field of translatableFields) {
        const sourceText = sourceEntry[field];
        if (!sourceText || typeof sourceText !== "string" || sourceText.trim().length === 0) continue;

        // Skip if target already has different content (manual translation preserved)
        if (existingTarget && existingTarget[field] && existingTarget[field] !== sourceText) {
          strapi.log.debug(`[auto-translate] Skipping ${field} — target has manual translation`);
          continue;
        }

        // Translate
        const targetLang = TARGET_LOCALE === "en" ? "en-US" : null;
        const sourceLang = sourceLocale === "zh-Hans" ? "zh" : null;

        try {
          const result = await translator.translateText(sourceText, sourceLang, targetLang);
          targetData[field] = result.text;
          strapi.log.debug(`[auto-translate] ${uid}/${field}: ${sourceText.slice(0, 40)}... → ${result.text.slice(0, 40)}...`);
        } catch (err) {
          strapi.log.error(`[auto-translate] Failed to translate ${uid}/${field}:`, err.message);
        }
      }

      if (Object.keys(targetData).length === 0) return;

      // Upsert target entry
      if (existingTarget) {
        await strapi.documents(uid).update({
          documentId: entityId,
          locale: TARGET_LOCALE,
          data: targetData,
        });
        strapi.log.info(`[auto-translate] Updated ${uid}/${entityId} in ${TARGET_LOCALE}`);
      } else {
        await strapi.documents(uid).create({
          documentId: entityId,
          locale: TARGET_LOCALE,
          data: targetData,
          status: "published",
        });
        strapi.log.info(`[auto-translate] Created ${uid}/${entityId} in ${TARGET_LOCALE}`);
      }
    } catch (err) {
      strapi.log.error(`[auto-translate] Error translating ${uid}/${entityId}:`, err.message);
    }
  },
});
