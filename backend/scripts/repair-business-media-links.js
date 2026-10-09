"use strict";

const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const rootDir = path.resolve(__dirname, "..");
const dbPath = path.resolve(rootDir, ".tmp/data.db");

const UNIT_IMAGE_FILE_IDS = [122, 55, 132, 124, 39, 102, 147, 101, 104];

const SECTION_IMAGE_FILE_IDS = [
  [118, 119, 120],
  [125, 126, 127],
  [37, 129, 130],
  [133, 134, 135],
  [136, 137, 138],
  [141, 144, 140],
  [143, 142, 145],
  [148, 149, 150],
  [151, 152, 153],
];

function backupDatabase() {
  const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const backupPath = path.resolve(rootDir, `.tmp/data.db.bak-before-business-media-${stamp}`);
  fs.copyFileSync(dbPath, backupPath);
  return backupPath;
}

function insertMediaLink(db, fileId, relatedId, relatedType, field) {
  db.prepare(
    `
      INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order")
      VALUES (?, ?, ?, ?, 1)
    `
  ).run(fileId, relatedId, relatedType, field);
}

function getBusinessPageUnitIds(db, locale) {
  const page = db.prepare("SELECT id FROM business_pages WHERE locale = ? ORDER BY id LIMIT 1").get(locale);
  if (!page) {
    throw new Error(`Missing business page for locale ${locale}`);
  }

  const unitIds = db.prepare(`
    SELECT cmp_id
    FROM business_pages_cmps
    WHERE entity_id = ?
      AND component_type = 'business.unit'
      AND field = 'businessUnits'
    ORDER BY "order", id
  `).all(page.id).map((row) => row.cmp_id);

  if (unitIds.length !== UNIT_IMAGE_FILE_IDS.length) {
    throw new Error(`Expected ${UNIT_IMAGE_FILE_IDS.length} business units for ${locale}, found ${unitIds.length}`);
  }

  return unitIds;
}

function ensureUnitImages(db, unitIds) {
  db.prepare(`
    DELETE FROM files_related_mph
    WHERE related_type = 'business.unit'
      AND field = 'image'
      AND related_id IN (${unitIds.map(() => "?").join(",")})
  `).run(...unitIds);

  unitIds.forEach((unitId, index) => {
    insertMediaLink(db, UNIT_IMAGE_FILE_IDS[index], unitId, "business.unit", "image");
  });
}

function getSectionIdsByUnit(db, unitIds) {
  const rows = db.prepare(`
    SELECT entity_id AS unit_id, cmp_id AS section_id, "order" AS sort_order
    FROM components_business_units_cmps
    WHERE field = 'sections'
      AND component_type = 'business.section'
      AND entity_id IN (${unitIds.map(() => "?").join(",")})
    ORDER BY entity_id, "order"
  `).all(...unitIds);

  const grouped = new Map();
  for (const row of rows) {
    if (!grouped.has(row.unit_id)) grouped.set(row.unit_id, []);
    grouped.get(row.unit_id).push(row.section_id);
  }

  return grouped;
}

function ensureSectionImages(db, unitIds) {
  const grouped = getSectionIdsByUnit(db, unitIds);
  const sectionIds = [...grouped.values()].flat();

  if (sectionIds.length !== unitIds.length * 3) {
    throw new Error(`Expected ${unitIds.length * 3} sections for units ${unitIds.join(", ")}, found ${sectionIds.length}`);
  }

  db.prepare(`
    DELETE FROM files_related_mph
    WHERE related_type = 'business.section'
      AND field = 'image'
      AND related_id IN (${sectionIds.map(() => "?").join(",")})
  `).run(...sectionIds);

  unitIds.forEach((unitId, unitIndex) => {
    const sectionIdsForUnit = grouped.get(unitId) || [];
    sectionIdsForUnit.forEach((sectionId, sectionIndex) => {
      insertMediaLink(db, SECTION_IMAGE_FILE_IDS[unitIndex][sectionIndex], sectionId, "business.section", "image");
    });
  });
}

function assertFilesExist(db) {
  const requiredFileIds = [...new Set([...UNIT_IMAGE_FILE_IDS, ...SECTION_IMAGE_FILE_IDS.flat()])];
  const rows = db.prepare(`
    SELECT id
    FROM files
    WHERE id IN (${requiredFileIds.map(() => "?").join(",")})
  `).all(...requiredFileIds);
  const found = new Set(rows.map((row) => row.id));
  const missing = requiredFileIds.filter((id) => !found.has(id));

  if (missing.length > 0) {
    throw new Error(`Missing media file rows: ${missing.join(", ")}`);
  }
}

function summarize(db) {
  return db.prepare(`
    SELECT related_type, field, COUNT(*) AS count
    FROM files_related_mph
    WHERE (related_type = 'business.unit' AND field = 'image')
       OR (related_type = 'business.section' AND field = 'image')
    GROUP BY related_type, field
    ORDER BY related_type, field
  `).all();
}

function main() {
  const backupPath = backupDatabase();
  const db = new Database(dbPath);

  try {
    const transaction = db.transaction(() => {
      const zhUnitIds = getBusinessPageUnitIds(db, "zh-Hans");
      const enUnitIds = getBusinessPageUnitIds(db, "en");

      assertFilesExist(db);
      ensureUnitImages(db, zhUnitIds);
      ensureUnitImages(db, enUnitIds);
      ensureSectionImages(db, zhUnitIds);
      ensureSectionImages(db, enUnitIds);
    });

    transaction();
    console.log(`[repair:business-media] Backup created: ${backupPath}`);
    console.log("[repair:business-media] Summary:", summarize(db));
  } finally {
    db.close();
  }
}

main();
