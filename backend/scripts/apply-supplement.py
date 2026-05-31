#!/usr/bin/env python3
"""
应用补充翻译映射到数据库中的英文组件记录
"""

import sqlite3
import json
from pathlib import Path

DB_PATH = Path("/tmp/xmax_work.db")
MAP_PATH = Path("/tmp/supplement_map.json")

# 组件表和需要翻译的字段
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

    print(f"Loaded {len(trans_map)} supplemental translations")

    conn = sqlite3.connect(str(DB_PATH))

    # 收集英文页面引用的所有组件 ID
    en_component_ids = {}  # {table_name: set of cmp_ids}

    for page_table, cmps_table in PAGE_CMPS.items():
        en_page = conn.execute(
            f"SELECT id FROM {page_table} WHERE locale = 'en'"
        ).fetchone()
        if not en_page:
            continue
        en_id = en_page[0]

        # 获取关联的组件类型和ID
        for row in conn.execute(
            f"SELECT component_type, cmp_id FROM {cmps_table} WHERE entity_id = ?",
            (en_id,)
        ):
            ctype, cmp_id = row
            # 从 component_type 推断表名
            ctype_slug = ctype.replace(".", "_").replace("-", "_")
            for table in COMPONENT_TABLES:
                if ctype_slug in table:
                    if table not in en_component_ids:
                        en_component_ids[table] = set()
                    en_component_ids[table].add(cmp_id)
                    break

    # 嵌套组件: business_units_cmps
    en_bu_ids = en_component_ids.get("components_business_units", set())
    if en_bu_ids:
        for row in conn.execute(
            "SELECT cmp_id FROM components_business_units_cmps WHERE entity_id IN ({})".format(
                ",".join(map(str, en_bu_ids))
            )
        ):
            if "components_business_sections" not in en_component_ids:
                en_component_ids["components_business_sections"] = set()
            en_component_ids["components_business_sections"].add(row[0])

    print(f"Found {sum(len(s) for s in en_component_ids.values())} English component instances")

    # 更新这些组件记录
    total_updated = 0
    for table, fields in COMPONENT_TABLES.items():
        if table not in en_component_ids:
            continue

        ids = list(en_component_ids[table])
        if not ids:
            continue

        print(f"\n📦 {table} ({len(ids)} records)")

        # 读取所有相关记录
        id_placeholders = ",".join(["?"] * len(ids))
        rows = conn.execute(
            f"SELECT * FROM {table} WHERE id IN ({id_placeholders})", ids
        ).fetchall()
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
                conn.execute(
                    f"UPDATE {table} SET {set_clause} WHERE id = ?",
                    list(changes.values()) + [rec_id]
                )
                updated += 1

        print(f"   ✓ Updated {updated} records")
        total_updated += updated

    conn.commit()
    print(f"\n✅ Done! Updated {total_updated} component records.")
    conn.close()


if __name__ == "__main__":
    main()
