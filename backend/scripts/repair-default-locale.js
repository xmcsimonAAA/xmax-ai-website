"use strict";

const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.resolve(__dirname, "../.tmp/data.db");
const preferredLocale = process.env.STRAPI_DEFAULT_LOCALE || "en";

function main() {
  const db = new Database(dbPath);

  try {
    const locale = db.prepare("SELECT code FROM i18n_locale WHERE code = ?").get(preferredLocale);
    if (!locale) {
      throw new Error(`Locale ${preferredLocale} does not exist in i18n_locale`);
    }

    const value = JSON.stringify(preferredLocale);
    const existing = db
      .prepare("SELECT key FROM strapi_core_store_settings WHERE key = 'plugin_i18n_default_locale'")
      .get();

    if (existing) {
      db.prepare("UPDATE strapi_core_store_settings SET value = ? WHERE key = 'plugin_i18n_default_locale'").run(value);
    } else {
      db.prepare("INSERT INTO strapi_core_store_settings (key, value, type, environment, tag) VALUES (?, ?, ?, ?, ?)")
        .run("plugin_i18n_default_locale", value, "string", null, null);
    }

    console.log(`[repair:default-locale] Default content locale set to ${preferredLocale}`);
  } finally {
    db.close();
  }
}

main();
