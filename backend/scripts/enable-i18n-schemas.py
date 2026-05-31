#!/usr/bin/env python3
"""
为所有 Strapi 内容类型和组件 schema 添加 i18n 本地化配置。

规则：
1. 内容类型（content-type）级别：添加 pluginOptions: { i18n: { localized: true } }
2. string / text 字段：添加 pluginOptions: { i18n: { localized: true } }
3. media / component / dynamiczone 字段：不标记为 localized（共享）
4. 组件字段本身不标记 localized，但组件内部的 string/text 字段需要标记
5. 删除 business/unit 中的 enTitle / enDesc 字段（i18n 插件替代它们）
"""

import json
import os
import glob

STRAPI_ROOT = "/Users/simon/Desktop/xmax-ai-studio"

# 需要本地化的字段类型
LOCALIZABLE_FIELD_TYPES = {"string", "text", "richtext", "email", "password", "uid"}

# 需要处理的字段：icon 不需要本地化（它是 Lucide 图标名，不是显示文本）
SKIP_LOCALIZE_FIELDS = {"icon", "url", "bgGradient", "alias"}

def add_i18n_to_schema(schema: dict, is_content_type: bool = False) -> dict:
    """为 schema 添加 i18n pluginOptions"""
    
    # 1. 内容类型级别启用 i18n
    if is_content_type:
        if "pluginOptions" not in schema:
            schema["pluginOptions"] = {}
        schema["pluginOptions"]["i18n"] = {"localized": True}
    
    # 2. 字段级别标记本地化
    if "attributes" in schema:
        for field_name, field_def in schema["attributes"].items():
            field_type = field_def.get("type", "")
            
            # 需要本地化的字段类型
            should_localize = (
                field_type in LOCALIZABLE_FIELD_TYPES
                and field_name not in SKIP_LOCALIZE_FIELDS
            )
            
            if should_localize:
                if "pluginOptions" not in field_def:
                    field_def["pluginOptions"] = {}
                field_def["pluginOptions"]["i18n"] = {"localized": True}
    
    return schema

def remove_en_fields_from_business_unit(schema: dict) -> dict:
    """从 business/unit 组件中移除 enTitle 和 enDesc 字段"""
    if "attributes" in schema:
        for field in ["enTitle", "enDesc"]:
            if field in schema["attributes"]:
                del schema["attributes"][field]
                print(f"  Removed field: {field}")
    return schema

def main():
    changes = []
    
    # 处理所有内容类型
    content_type_files = glob.glob(
        os.path.join(STRAPI_ROOT, "src/api/*/content-types/*/schema.json")
    )
    for fpath in sorted(content_type_files):
        with open(fpath, "r", encoding="utf-8") as f:
            schema = json.load(f)
        
        old_str = json.dumps(schema, ensure_ascii=False, indent=2)
        schema = add_i18n_to_schema(schema, is_content_type=True)
        new_str = json.dumps(schema, ensure_ascii=False, indent=2)
        
        if old_str != new_str:
            with open(fpath, "w", encoding="utf-8") as f:
                f.write(new_str + "\n")
            rel_path = os.path.relpath(fpath, STRAPI_ROOT)
            print(f"✅ Updated content type: {rel_path}")
            changes.append(rel_path)
        else:
            rel_path = os.path.relpath(fpath, STRAPI_ROOT)
            print(f"⏭️  No changes: {rel_path}")
    
    # 处理所有组件
    component_files = glob.glob(
        os.path.join(STRAPI_ROOT, "src/components/*/*.json")
    )
    for fpath in sorted(component_files):
        with open(fpath, "r", encoding="utf-8") as f:
            schema = json.load(f)
        
        old_str = json.dumps(schema, ensure_ascii=False, indent=2)
        schema = add_i18n_to_schema(schema, is_content_type=False)
        
        # 特殊处理：删除 business/unit 的 enTitle/enDesc
        if "business" in fpath and "unit.json" in fpath:
            schema = remove_en_fields_from_business_unit(schema)
        
        new_str = json.dumps(schema, ensure_ascii=False, indent=2)
        
        if old_str != new_str:
            with open(fpath, "w", encoding="utf-8") as f:
                f.write(new_str + "\n")
            rel_path = os.path.relpath(fpath, STRAPI_ROOT)
            print(f"✅ Updated component: {rel_path}")
            changes.append(rel_path)
        else:
            rel_path = os.path.relpath(fpath, STRAPI_ROOT)
            print(f"⏭️  No changes: {rel_path}")
    
    print(f"\n总计修改 {len(changes)} 个文件")

if __name__ == "__main__":
    main()
