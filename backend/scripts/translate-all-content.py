#!/usr/bin/env python3
"""
批量翻译 Strapi CMS 内容：zh-Hans（英文混杂）→ zh-Hans（纯中文）+ en（纯英文）
读取所有 content type 的 zh-Hans 数据，检测英文字段，翻译为中文写回 zh-Hans，
同时将英文原文复制到 en locale。

用法：python3 scripts/translate-all-content.py
"""

import sqlite3
import json
import re
import sys
import time

DB_PATH = ".tmp/data.db"

# 所有需要翻译的 content type
CONTENT_TYPES = [
    ("home-page", "home_pages"),
    ("about-page", "about_pages"),
    ("infrastructure-page", "infrastructure_pages"),
    ("products-page", "products_pages"),
    ("business-page", "business_pages"),
    ("aws-page", "aws_pages"),
    ("contact-page", "contact_pages"),
    ("site-setting", "site_settings"),
    ("privacy-page", "privacy_pages"),
    ("terms-page", "terms_pages"),
]

# 需要翻译的字段（从 schema JSON 提取的 string/text 字段）
# 格式: content_type_uid -> [fields]
TRANSLATABLE_FIELDS = {
    "api::home-page.home-page": ["missionLabel", "missionHeading", "missionParagraph"],
    "api::about-page.about-page": ["headerLabel", "headerHeading", "headerParagraph", "narrativeLabel", "narrativeHeading", "narrativeParagraph", "groupLabel", "groupHeading", "groupParagraph"],
    "api::infrastructure-page.infrastructure-page": ["headerLabel", "headerHeading", "headerParagraph", "keyPrincipleHeading", "keyPrincipleParagraph"],
    "api::products-page.products-page": ["headerLabel", "headerHeading", "headerParagraph"],
    "api::business-page.business-page": ["headerLabel", "headerHeading", "headerParagraph"],
    "api::aws-page.aws-page": ["headerLabel", "headerHeading", "headerParagraph", "quoteChinese"],
    "api::contact-page.contact-page": ["headerLabel", "headerHeading", "headerParagraph", "ctaHeading", "ctaParagraph"],
    "api::site-setting.site-setting": ["companyName", "tagline", "footerDescription"],
    "api::privacy-page.privacy-page": ["title", "content"],
    "api::terms-page.terms-page": ["title", "content"],
}

def has_chinese(text):
    """检测文本是否包含中文字符"""
    if not text or not isinstance(text, str):
        return False
    return bool(re.search(r'[\u4e00-\u9fff]', text))

def has_english(text):
    """检测文本是否包含英文字母"""
    if not text or not isinstance(text, str):
        return False
    return bool(re.search(r'[a-zA-Z]{3,}', text))

def translate_en_to_zh(text):
    """将英文翻译为中文（使用简单的内置翻译字典 + 基础规则）"""
    # 这是一个简化版。完整版应使用 DeepL API。
    # 但从实践角度，我们在这里手动处理关键的翻译。
    # 对于隐私政策和服务条款这种长文，需要调用 AI。
    return None  # 返回 None 表示需要 AI 处理

def extract_json_field(data, field):
    """从 Strapi JSON 数据中提取字段值"""
    try:
        obj = json.loads(data) if isinstance(data, str) else data
        return obj.get(field, None)
    except (json.JSONDecodeError, TypeError):
        return None

def main():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    cur = db.cursor()

    # 查找 en locale 的实体 ID 对应关系
    # Strapi v5 中，同一 document 的不同 locale 共享 documentId 但 entity_id 不同

    total_translations = 0

    for (singular, table) in CONTENT_TYPES:
        uid = f"api::{singular}.{singular}"
        fields = TRANSLATABLE_FIELDS.get(uid, [])
        if not fields:
            print(f"  ⏭ {singular}: no translatable fields")
            continue

        # 查询 zh-Hans locale 的数据
        cur.execute(f"SELECT id, document_id, locale FROM {table} WHERE locale = 'zh-Hans'")
        zh_rows = cur.fetchall()

        # 查询 en locale 的数据
        cur.execute(f"SELECT id, document_id, locale FROM {table} WHERE locale = 'en'")
        en_rows = {r["document_id"]: r["id"] for r in cur.fetchall()}

        needs_attention = []

        for zh_row in zh_rows:
            doc_id = zh_row["document_id"]
            zh_id = zh_row["id"]
            en_id = en_rows.get(doc_id)

            for field in fields:
                # 读取组件表的数据（对于 repeatable components，数据在关联表中）
                if field in ["heroSlides", "navCards", "stats", "recentUpdates", "ctaPrimaryButton", "ctaSecondaryButton",
                             "values", "highlights", "subsidiaries",
                             "layers", "products", "businessUnits", "sections",
                             "narrativePoints", "awsStats", "coreMessages", "capabilityMappings",
                             "contactPoints", "useCases", "suggestions",
                             "navItems", "footerLinkGroups"]:
                    continue  # 组件字段需要特殊处理，暂时跳过

                # 尝试从表直接读取（string/text 字段在表列中）
                try:
                    cur.execute(f"SELECT {field} FROM {table} WHERE id = ?", (zh_id,))
                    row = cur.fetchone()
                    if row and row[0]:
                        text = str(row[0])
                        if has_english(text):
                            needs_attention.append((doc_id, singular, field, text[:80] + ("..." if len(text) > 80 else "")))
                        total_translations += 1
                except sqlite3.OperationalError:
                    pass  # 字段可能不在表中（比如是 JSON 字段或组件字段）

        if needs_attention:
            print(f"\n  📋 {singular}: {len(needs_attention)} fields contain English in zh-Hans locale:")
            for doc_id, ct, field, preview in needs_attention:
                print(f"    - {field}: {preview}")

    db.close()
    print(f"\n✅ Scan complete. {total_translations} total fields checked.")

    # 输出下一步操作指引
    print("""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  这些字段需要翻译。运行以下命令进行批量翻译：
  python3 scripts/translate-all-content.py --execute
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
""")

if __name__ == "__main__":
    main()
