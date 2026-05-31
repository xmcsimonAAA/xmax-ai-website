#!/usr/bin/env python3
"""
检查 en locale 数据中仍然包含中文字符的字段。
用于找出翻译遗漏。
"""

import json
import requests
import re

BASE_URL = "http://localhost:1337"
ADMIN_EMAIL = "xmc@163.com"
ADMIN_PASSWORD = "Xmax2026!"

# 中文检测正则
CHINESE_PATTERN = re.compile(r'[\u4e00-\u9fff]')

CONTENT_TYPES = {
    "home-page": "api::home-page.home-page",
    "about-page": "api::about-page.about-page",
    "aws-page": "api::aws-page.aws-page",
    "business-page": "api::business-page.business-page",
    "contact-page": "api::contact-page.contact-page",
    "infrastructure-page": "api::infrastructure-page.infrastructure-page",
    "products-page": "api::products-page.products-page",
    "site-setting": "api::site-setting.site-setting",
}

SKIP_FIELDS = {"id", "documentId", "createdAt", "updatedAt", "publishedAt", "locale",
               "localizations", "createdBy", "updatedBy", "__component",
               "formats", "url", "previewUrl", "provider", "width", "height",
               "hash", "ext", "mime", "size", "name", "alternativeText",
               "caption", "folder", "folderPath", "provider_metadata",
               "icon", "bgGradient", "alias"}

def find_chinese_fields(data, path=""):
    """递归查找包含中文的字段"""
    issues = []
    if isinstance(data, dict):
        for key, value in data.items():
            if key in SKIP_FIELDS:
                continue
            new_path = f"{path}.{key}" if path else key
            if isinstance(value, str) and CHINESE_PATTERN.search(value):
                issues.append((new_path, value))
            elif isinstance(value, dict):
                issues.extend(find_chinese_fields(value, new_path))
            elif isinstance(value, list):
                for i, item in enumerate(value):
                    issues.extend(find_chinese_fields(item, f"{new_path}[{i}]"))
    elif isinstance(data, list):
        for i, item in enumerate(data):
            issues.extend(find_chinese_fields(item, f"{path}[{i}]"))
    return issues

def main():
    login_resp = requests.post(f"{BASE_URL}/admin/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    token = login_resp.json()["data"]["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ Admin login successful\n")

    total_issues = 0
    for slug, api_uid in CONTENT_TYPES.items():
        url = f"{BASE_URL}/content-manager/single-types/{api_uid}?locale=en"
        resp = requests.get(url, headers=headers)
        if resp.status_code != 200:
            print(f"❌ {slug}: Failed to fetch (status: {resp.status_code})")
            continue

        data = resp.json().get("data", {})
        issues = find_chinese_fields(data)

        if issues:
            print(f"🔍 {slug} - {len(issues)} fields with Chinese:")
            for path, value in issues:
                val_preview = value[:80] + "..." if len(value) > 80 else value
                print(f"   {path}: {val_preview}")
            total_issues += len(issues)
        else:
            print(f"✅ {slug} - All English!")

    print(f"\n总计: {total_issues} 个字段仍含中文")

if __name__ == "__main__":
    main()
