#!/usr/bin/env python3
"""使用合并映射表更新所有英文组件"""
import sqlite3
import json
from pathlib import Path

DB_PATH = Path("/tmp/xmax_work.db")
MAP_PATH = Path("/tmp/merged_map.json")

COMPONENT_TABLES = {
    "components_home_hero_slides": ["title", "subtitle", "tags"],
    "components_home_update_items": ["title", "tag"],
    "components_home_nav_cards": ["title", "description"],
    "components_home_stat_items": ["label"],
    "components_home_cta_buttons": ["text"],
    "components_business_sections": ["heading", "body"],
    "components_business_units": ["title", "alias", "subtitle", "description", "tags", "scenes", "infra_relation"],
    "components_about_value_items": ["title", "description"],
    "components_about_highlight_items": ["content"],
    "components_about_subsidiarys": ["business", "legal_name"],
    "components_infra_layers": ["title", "subtitle", "description", "details"],
    "components_product_items": ["name", "description", "scene", "details"],
    "components_contact_points": ["title", "description"],
    "components_contact_suggestions": ["content"],
    "components_contact_use_cases": ["content"],
    "components_aws_capability_mappings": ["capability", "description"],
    "components_aws_core_messages": ["content"],
    "components_aws_narrative_points": ["title", "description"],
    "components_aws_stat_items": ["label"],
    "components_site_nav_items": ["label"],
    "components_site_footer_link_groups": ["title"],
}

PAGE_CMPS = {
    "home_pages": "home_pages_cmps",
    "about_pages": "about_pages_cmps",
    "business_pages": "business_pages_cmps",
    "contact_pages": "contact_pages_cmps",
    "infrastructure_pages": "infrastructure_pages_cmps",
    "products_pages": "products_pages_cmps",
    "aws_pages": "aws_pages_cmps",
    "site_settings": "site_settings_cmps",
}


def main():
    with open(MAP_PATH, 'r', encoding='utf-8') as f:
        trans_map = json.load(f)
    print(f"Loaded {len(trans_map)} translations")

    conn = sqlite3.connect(str(DB_PATH))

    # 收集英文页面引用的所有组件 ID
    en_component_ids = {}
    for page_table, cmps_table in PAGE_CMPS.items():
        en_page = conn.execute(f"SELECT id FROM {page_table} WHERE locale = 'en'").fetchone()
        if not en_page:
            continue
        en_id = en_page[0]
        for row in conn.execute(f"SELECT component_type, cmp_id FROM {cmps_table} WHERE entity_id = ?", (en_id,)):
            ctype, cmp_id = row
            ctype_slug = ctype.replace(".", "_").replace("-", "_")
            for table in COMPONENT_TABLES:
                if ctype_slug in table:
                    en_component_ids.setdefault(table, set()).add(cmp_id)
                    break

    # 嵌套组件
    en_bu = en_component_ids.get("components_business_units", set())
    if en_bu:
        ph = ",".join(["?"] * len(en_bu))
        for row in conn.execute(f"SELECT cmp_id FROM components_business_units_cmps WHERE entity_id IN ({ph})", list(en_bu)):
            en_component_ids.setdefault("components_business_sections", set()).add(row[0])

    total_updated = 0
    for table, fields in COMPONENT_TABLES.items():
        if table not in en_component_ids:
            continue
        ids = list(en_component_ids[table])
        if not ids:
            continue

        ph = ",".join(["?"] * len(ids))
        rows = conn.execute(f"SELECT * FROM {table} WHERE id IN ({ph})", ids).fetchall()
        cols = [desc[0] for desc in conn.execute(f"SELECT * FROM {table} WHERE id = -1").description]

        updated = 0
        for row in rows:
            record = dict(zip(cols, row))
            rec_id = record["id"]
            changes = {}
            for field in fields:
                val = record.get(field)
                if val and str(val).strip():
                    text = str(val).strip()
                    if text in trans_map:
                        changes[field] = trans_map[text]
            if changes:
                set_clause = ", ".join([f"{k} = ?" for k in changes])
                conn.execute(f"UPDATE {table} SET {set_clause} WHERE id = ?", list(changes.values()) + [rec_id])
                updated += 1

        print(f"{table}: {updated}/{len(rows)} updated")
        total_updated += updated

    conn.commit()
    print(f"\nTotal updated: {total_updated}")
    conn.close()

if __name__ == "__main__":
    main()
