#!/usr/bin/env python3
"""
Strapi v5 组件自动翻译脚本
为每种目标语言创建独立的组件副本，并更新页面关联表

用法: python translate-components.py [target_lang]
  默认目标语言: en
  示例: python translate-components.py en
"""

import sqlite3
import json
import re
import sys
from pathlib import Path

# 数据库路径（使用 /tmp 副本避免锁定问题）
DB_PATH = Path("/tmp/xmax_work.db")

# 翻译映射表路径
TRANSLATION_MAP_PATH = Path("/tmp/translation_map.json")

# 目标语言
TARGET_LANG = sys.argv[1] if len(sys.argv) > 1 else "en"

# === 组件表定义 ===
# 普通组件（无嵌套）: 表名 -> 需要翻译的字段集合
FLAT_COMPONENTS = {
    "components_home_hero_slides": {"title", "subtitle", "tags"},
    "components_home_update_items": {"title", "tag"},
    "components_home_nav_cards": {"title", "description"},
    "components_home_stat_items": {"label"},
    "components_home_cta_buttons": {"text"},
    "components_about_value_items": {"title", "description"},
    "components_about_highlight_items": {"content"},
    "components_about_subsidiarys": {"business", "legal_name"},
    "components_infra_layers": {"title", "subtitle", "description", "details"},
    "components_product_items": {"name", "description", "scene", "details"},
    "components_contact_points": {"title", "description"},
    "components_contact_suggestions": {"content"},
    "components_contact_use_cases": {"content"},
    "components_aws_capability_mappings": {"capability", "description"},
    "components_aws_core_messages": {"content"},
    "components_aws_narrative_points": {"title", "description"},
    "components_aws_stat_items": {"label"},
    "components_site_nav_items": {"label"},
    "components_site_footer_link_groups": {"title"},
}

# 嵌套组件: 父表 -> (子关联表, 子表)
NESTED_PARENTS = {
    "components_business_units": ("components_business_units_cmps", "components_business_sections"),
}

# Media 关联映射: 表名 -> Strapi related_type
MEDIA_TYPES = {
    "components_home_hero_slides": "home.hero-slide",
    "components_home_update_items": "home.update-item",
    "components_home_nav_cards": "home.nav-card",
    "components_business_units": "business.unit",
    "components_business_sections": "business.section",
    "components_product_items": "product.item",
}

# 页面关联表
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


def load_translation_map():
    """加载翻译映射表"""
    if TRANSLATION_MAP_PATH.exists():
        with open(TRANSLATION_MAP_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}


def translate_text(text, trans_map):
    """翻译文本，先在映射表中查找，找不到则保留原文"""
    if not text or not str(text).strip():
        return text

    text_str = str(text).strip()

    # 直接在映射表中查找
    if text_str in trans_map:
        return trans_map[text_str]

    # 尝试处理换行版本（数据库中可能存储为 \n 或实际换行）
    normalized = text_str.replace('\r\n', '\n').replace('\r', '\n')
    if normalized in trans_map:
        return trans_map[normalized]

    # 未找到映射，保留原文并记录
    return text_str


def get_columns(conn, table):
    return [r[1] for r in conn.execute(f"PRAGMA table_info({table})")]


def clone_records(conn, table, translate_fields, id_map, trans_map):
    """克隆表记录，翻译指定字段，返回新旧ID映射"""
    print(f"\n📦 {table}")
    cols = get_columns(conn, table)
    rows = conn.execute(f"SELECT * FROM {table}").fetchall()

    if not rows:
        print("   (empty)")
        return

    untranslated = []

    for row in rows:
        record = dict(zip(cols, row))
        old_id = record["id"]

        # 构建插入数据
        data = {}
        for c in cols:
            if c == "id":
                continue
            v = record.get(c)
            if c in translate_fields and v is not None:
                translated = translate_text(v, trans_map)
                if translated == str(v).strip() and str(v).strip():
                    # 检查是否包含中文字符
                    if re.search(r'[\u4e00-\u9fff]', str(v)):
                        untranslated.append(str(v)[:60])
                data[c] = translated
            else:
                data[c] = v

        # 插入
        ph = ", ".join(["?"] * len(data))
        cur = conn.execute(
            f"INSERT INTO {table} ({', '.join(data.keys())}) VALUES ({ph})",
            list(data.values())
        )
        new_id = cur.lastrowid
        id_map[old_id] = new_id

        # 复制 media 关联
        rtype = MEDIA_TYPES.get(table)
        if rtype:
            for link in conn.execute(
                "SELECT file_id, field, \"order\" FROM files_related_mph WHERE related_type = ? AND related_id = ?",
                (rtype, old_id)
            ).fetchall():
                conn.execute(
                    "INSERT INTO files_related_mph (file_id, related_id, related_type, field, \"order\") VALUES (?, ?, ?, ?, ?)",
                    (link[0], new_id, rtype, link[1], link[2])
                )

    if untranslated:
        print(f"   ⚠️ {len(untranslated)} untranslated texts (logged)")
        # 将未翻译文本写入日志
        with open('/tmp/untranslated.log', 'a', encoding='utf-8') as f:
            for t in untranslated:
                f.write(f"{table}: {t}\n")

    print(f"   ✓ Created {len(rows)} records")


def clone_nested(conn, parent_table, child_cmps_table, child_table, id_map, trans_map):
    """克隆嵌套组件：先克隆子表，再更新关联"""
    child_cols = get_columns(conn, child_table)
    child_rows = conn.execute(f"SELECT * FROM {child_table}").fetchall()

    # 先克隆所有子组件记录
    child_id_map = {}
    print(f"\n📦 {child_table} (nested)")
    for row in child_rows:
        record = dict(zip(child_cols, row))
        old_id = record["id"]

        data = {}
        for c in child_cols:
            if c == "id":
                continue
            v = record.get(c)
            tf = FLAT_COMPONENTS.get(child_table, set())
            if c in tf and v is not None:
                data[c] = translate_text(v, trans_map)
            else:
                data[c] = v

        ph = ", ".join(["?"] * len(data))
        cur = conn.execute(
            f"INSERT INTO {child_table} ({', '.join(data.keys())}) VALUES ({ph})",
            list(data.values())
        )
        new_id = cur.lastrowid
        child_id_map[old_id] = new_id

    print(f"   ✓ Created {len(child_rows)} records")

    # 更新嵌套关联表
    cmps_cols = get_columns(conn, child_cmps_table)
    cmps_rows = conn.execute(f"SELECT * FROM {child_cmps_table}").fetchall()

    for row in cmps_rows:
        rec = dict(zip(cmps_cols, row))
        old_parent = rec["entity_id"]
        old_child = rec["cmp_id"]
        new_parent = id_map.get(parent_table, {}).get(old_parent)
        new_child = child_id_map.get(old_child)

        if new_parent and new_child:
            conn.execute(
                f"INSERT INTO {child_cmps_table} (entity_id, cmp_id, component_type, field, \"order\") VALUES (?, ?, ?, ?, ?)",
                (new_parent, new_child, rec["component_type"], rec["field"], rec.get("order"))
            )

    print(f"   ✓ Updated nested links")

    # 将子组件映射合并到主映射
    id_map[child_table] = child_id_map


def update_page_links(conn, page_table, cmps_table, all_id_maps):
    """更新英文页面的组件关联"""
    print(f"\n📝 {cmps_table}")

    # 找到中英文页面ID
    zh = conn.execute(f"SELECT id FROM {page_table} WHERE locale = 'zh-Hans'").fetchone()
    en = conn.execute(f"SELECT id FROM {page_table} WHERE locale = ?", (TARGET_LANG,)).fetchone()

    if not zh or not en:
        print(f"   SKIP (zh={zh}, en={en})")
        return

    zh_id, en_id = zh[0], en[0]

    # 删除英文页面旧关联
    conn.execute(f"DELETE FROM {cmps_table} WHERE entity_id = ?", (en_id,))

    # 复制中文页面的关联，映射到新组件ID
    links = conn.execute(
        f"SELECT field, component_type, cmp_id, \"order\" FROM {cmps_table} WHERE entity_id = ?",
        (zh_id,)
    ).fetchall()

    if not links:
        print(f"   No links")
        return

    inserted = 0
    for field, ctype, old_cmp_id, order in links:
        # 查找 old_cmp_id 在哪个表中有映射
        new_cmp_id = None

        # 从 component_type 推断表名
        ctype_slug = ctype.replace(".", "_").replace("-", "_")
        for table in all_id_maps:
            if ctype_slug in table:
                if old_cmp_id in all_id_maps[table]:
                    new_cmp_id = all_id_maps[table][old_cmp_id]
                    break

        # 如果没找到，尝试在所有映射中查找
        if new_cmp_id is None:
            for table, mapping in all_id_maps.items():
                if old_cmp_id in mapping:
                    new_cmp_id = mapping[old_cmp_id]
                    break

        # 如果没找到映射，保留原ID
        final_id = new_cmp_id if new_cmp_id else old_cmp_id

        conn.execute(
            f"INSERT INTO {cmps_table} (entity_id, cmp_id, component_type, field, \"order\") VALUES (?, ?, ?, ?, ?)",
            (en_id, final_id, ctype, field, order)
        )
        inserted += 1

    print(f"   ✓ {inserted} links")


def main():
    print(f"🚀 Strapi Component Translation")
    print(f"   Target: {TARGET_LANG}")
    print(f"   DB: {DB_PATH}")

    if not DB_PATH.exists():
        print(f"❌ DB not found: {DB_PATH}")
        sys.exit(1)

    # 加载翻译映射
    trans_map = load_translation_map()
    print(f"   Translation map: {len(trans_map)} entries")

    # 清空未翻译日志
    open('/tmp/untranslated.log', 'w').close()

    conn = sqlite3.connect(str(DB_PATH))

    # 所有ID映射: {表名: {旧ID: 新ID}}
    all_id_maps = {}

    try:
        # 1. 翻译普通组件
        for table, fields in FLAT_COMPONENTS.items():
            all_id_maps[table] = {}
            clone_records(conn, table, fields, all_id_maps[table], trans_map)

        # 2. 翻译嵌套组件
        for parent, (cmps, child) in NESTED_PARENTS.items():
            all_id_maps[parent] = {}
            tf = {"title", "alias", "subtitle", "description", "tags", "scenes", "infra_relation"}
            clone_records(conn, parent, tf, all_id_maps[parent], trans_map)
            clone_nested(conn, parent, cmps, child, all_id_maps, trans_map)

        # 3. 更新页面关联
        for page, cmps in PAGE_CMPS.items():
            update_page_links(conn, page, cmps, all_id_maps)

        conn.commit()

        total = sum(len(m) for m in all_id_maps.values())
        print(f"\n✅ Done! Created {total} translated component records.")

        # 报告未翻译内容
        if Path('/tmp/untranslated.log').exists():
            with open('/tmp/untranslated.log', 'r') as f:
                lines = f.readlines()
            if lines:
                print(f"\n⚠️ {len(lines)} texts were not translated (see /tmp/untranslated.log)")

    except Exception as e:
        conn.rollback()
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
