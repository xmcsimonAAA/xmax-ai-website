"use strict";

const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const backendDir = path.resolve(__dirname, "..");
const dbPath = path.resolve(backendDir, process.env.DATABASE_FILENAME || ".tmp/data.db");
const componentsDir = path.join(backendDir, "src", "components");
const cacheKey = "strapi_content_types_schema";

function toGlobalId(uid) {
  return uid
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function walkJsonFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkJsonFiles(fullPath));
    if (entry.isFile() && entry.name.endsWith(".json")) files.push(fullPath);
  }
  return files;
}

function serializeComponent(uid, schema) {
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

if (!fs.existsSync(dbPath)) {
  throw new Error(`Database file not found: ${dbPath}`);
}

const db = new Database(dbPath);
const row = db.prepare("select value from strapi_core_store_settings where key = ?").get(cacheKey);

if (!row?.value) {
  throw new Error(`Core store key not found: ${cacheKey}`);
}

const schemaCache = JSON.parse(row.value);
let repairedCount = 0;

for (const file of walkJsonFiles(componentsDir)) {
  const relativePath = path.relative(componentsDir, file).replace(/\.json$/, "");
  const [category, name] = relativePath.split(path.sep);
  if (!category || !name) continue;

  const uid = `${category}.${name}`;
  const componentSchema = JSON.parse(fs.readFileSync(file, "utf8"));

  if (schemaCache[uid]?.modelType === "component" && schemaCache[uid]?.attributes) {
    continue;
  }

  schemaCache[uid] = serializeComponent(uid, componentSchema);
  repairedCount += 1;
}

db.prepare("update strapi_core_store_settings set value = ? where key = ?").run(
  JSON.stringify(schemaCache),
  cacheKey
);

console.log(`Component schema cache repaired. Updated entries: ${repairedCount}`);
