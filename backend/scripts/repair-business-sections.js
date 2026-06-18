"use strict";

const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const rootDir = path.resolve(__dirname, "..");
const currentDbPath = path.resolve(rootDir, ".tmp/data.db");
const backupDbPath = path.resolve(rootDir, "../.codex-backups/20260601-022849/data.db");
const translationsPath = path.resolve(rootDir, "../frontend/src/lib/translations-static.ts");

const ZH_UNIT_IDS = [118, 119, 120, 121, 122, 123, 124, 125, 126];
const EN_UNIT_IDS = [172, 173, 174, 175, 176, 177, 178, 179, 180];

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

function loadStaticTranslations() {
  const source = fs.readFileSync(translationsPath, "utf8");
  const start = source.indexOf("const TRANS_MAP");
  const objectStart = source.indexOf("{", start);
  const objectEnd = source.indexOf("};", objectStart);
  if (start < 0 || objectStart < 0 || objectEnd < 0) {
    throw new Error("Could not parse frontend static translation map");
  }
  const objectLiteral = source.slice(objectStart, objectEnd + 1);
  return Function(`"use strict"; return (${objectLiteral});`)();
}

function translateText(text, map) {
  if (!text) return text;
  if (map[text]) return map[text];
  const trimmed = text.trim();
  if (map[trimmed]) return map[trimmed];

  if (text.includes("\n")) {
    return text
      .split("\n")
      .map((line) => {
        const prefix = line.match(/^(\s*·\s*)/)?.[1] || "";
        const bare = line.replace(/^\s*·\s*/, "").trim();
        return `${prefix}${map[bare] || bare}`;
      })
      .join("\n");
  }

  return text;
}

function fetchBackupSections() {
  const backup = new Database(backupDbPath, { readonly: true });
  try {
    const rows = backup
      .prepare(`
        SELECT c.entity_id AS unit_id, c."order" AS sort_order, s.heading, s.body
        FROM components_business_units_cmps c
        JOIN components_business_sections s ON s.id = c.cmp_id
        WHERE c.entity_id BETWEEN 19 AND 27
          AND c.field = 'sections'
          AND c.component_type = 'business.section'
        ORDER BY c.entity_id, c."order"
      `)
      .all();

    const grouped = new Map();
    for (const row of rows) {
      const index = row.unit_id - 19;
      if (!grouped.has(index)) grouped.set(index, []);
      grouped.get(index).push(row);
    }
    return grouped;
  } finally {
    backup.close();
  }
}

function clearComponentLinks(db, unitIds) {
  const placeholders = unitIds.map(() => "?").join(",");
  db.prepare(`DELETE FROM components_business_units_cmps WHERE entity_id IN (${placeholders}) AND field = 'sections'`).run(...unitIds);
}

function getSectionIdsByUnit(db, unitIds) {
  const placeholders = unitIds.map(() => "?").join(",");
  const rows = db.prepare(`
    SELECT entity_id AS unit_id, cmp_id AS section_id
    FROM components_business_units_cmps
    WHERE field = 'sections'
      AND component_type = 'business.section'
      AND entity_id IN (${placeholders})
    ORDER BY entity_id, "order"
  `).all(...unitIds);

  const grouped = new Map();
  for (const row of rows) {
    if (!grouped.has(row.unit_id)) grouped.set(row.unit_id, []);
    grouped.get(row.unit_id).push(row.section_id);
  }
  return grouped;
}

function deleteSectionMediaForUnits(db, unitIds) {
  const sectionIds = [...getSectionIdsByUnit(db, unitIds).values()].flat();
  if (sectionIds.length === 0) return;

  db.prepare(`
    DELETE FROM files_related_mph
    WHERE related_type = 'business.section'
      AND field = 'image'
      AND related_id IN (${sectionIds.map(() => "?").join(",")})
  `).run(...sectionIds);
}

function insertMediaLink(db, fileId, relatedId, relatedType, field) {
  db.prepare(`
    INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order")
    VALUES (?, ?, ?, ?, 1)
  `).run(fileId, relatedId, relatedType, field);
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

function assertMediaFilesExist(db) {
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

function relinkBusinessPage(db, pageId, unitIds) {
  db.prepare("DELETE FROM business_pages_cmps WHERE entity_id = ? AND field = 'businessUnits'").run(pageId);
  const insert = db.prepare(`
    INSERT INTO business_pages_cmps (entity_id, cmp_id, component_type, field, "order")
    VALUES (?, ?, 'business.unit', 'businessUnits', ?)
  `);
  unitIds.forEach((unitId, index) => insert.run(pageId, unitId, index + 1));
}

function insertSections(db, unitIds, groupedSections, translateMap, locale) {
  const insertSection = db.prepare("INSERT INTO components_business_sections (heading, body) VALUES (?, ?)");
  const linkSection = db.prepare(`
    INSERT INTO components_business_units_cmps (entity_id, cmp_id, component_type, field, "order")
    VALUES (?, ?, 'business.section', 'sections', ?)
  `);

  unitIds.forEach((unitId, unitIndex) => {
    const sections = groupedSections.get(unitIndex) || [];
    sections.forEach((section, sectionIndex) => {
      const heading = locale === "en" ? translateText(section.heading, translateMap) : section.heading;
      const body = locale === "en" ? translateText(section.body, translateMap) : section.body;
      const info = insertSection.run(heading, body);
      linkSection.run(unitId, info.lastInsertRowid, sectionIndex + 1);
    });
  });
}

function normalizeBusinessPages(db) {
  db.prepare(`
    UPDATE business_pages
    SET header_label = 'Business',
        header_heading = '九大业务板块',
        header_paragraph = '一套基础设施，九大产业场景。电商、互娱、供应链、太空计算、机器人、生命科学、金融、安全、企业服务 —— 每个板块都是对 XMAX AI 统一推理能力的真实压测与价值验证。'
    WHERE id = 1
  `).run();

  db.prepare(`
    UPDATE business_pages
    SET header_label = 'BUSINESS UNITS',
        header_heading = 'Nine Business Units',
        header_paragraph = 'One infrastructure foundation, nine industry scenarios. E-commerce, interactive entertainment, supply chain services, space computing, robotics, life sciences, finance, security, and enterprise services each validate XMAX AI''s unified inference capabilities in real-world business contexts.'
    WHERE id = 2
  `).run();
}

function main() {
  const map = loadStaticTranslations();
  const groupedSections = fetchBackupSections();
  const db = new Database(currentDbPath);

  const transaction = db.transaction(() => {
    assertMediaFilesExist(db);
    normalizeBusinessPages(db);
    relinkBusinessPage(db, 1, ZH_UNIT_IDS);
    relinkBusinessPage(db, 2, EN_UNIT_IDS);
    deleteSectionMediaForUnits(db, [...ZH_UNIT_IDS, ...EN_UNIT_IDS]);
    clearComponentLinks(db, [...ZH_UNIT_IDS, ...EN_UNIT_IDS]);
    insertSections(db, ZH_UNIT_IDS, groupedSections, map, "zh-Hans");
    insertSections(db, EN_UNIT_IDS, groupedSections, map, "en");
    ensureUnitImages(db, ZH_UNIT_IDS);
    ensureUnitImages(db, EN_UNIT_IDS);
    ensureSectionImages(db, ZH_UNIT_IDS);
    ensureSectionImages(db, EN_UNIT_IDS);
  });

  try {
    transaction();
    console.log("[repair:business] Restored 9 business units and 27 sections for zh-Hans/en");
  } finally {
    db.close();
  }
}

main();
