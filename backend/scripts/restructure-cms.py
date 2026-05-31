"""
重构 Strapi CMS：将所有 JSON 字段替换为 Component + Media 字段
一次性创建所有组件 schema 和更新所有 content type schema
"""
import json
import os
import shutil

BASE = os.path.join(os.path.dirname(__file__), '..')
COMP_DIR = os.path.join(BASE, 'src', 'components')
API_DIR = os.path.join(BASE, 'src', 'api')

# ─── 组件定义 ──────────────────────────────────────────────
# 格式: (category, name, display_name, icon, fields)
# field: (name, type, extra_props)
# 类型: string, text, media, enumeration, integer, date, component, json

COMPONENTS = [
    # ── 首页 ──
    ("home", "hero-slide", "首页轮播", "picture", [
        ("image", "media", {"multiple": False, "required": False, "allowedTypes": ["images"]}),
        ("title", "string", {"required": True}),
        ("subtitle", "text", {}),
        ("tags", "text", {}),
        ("bgGradient", "string", {}),
    ]),
    ("home", "nav-card", "导航卡片", "layout", [
        ("image", "media", {"multiple": False, "required": False, "allowedTypes": ["images"]}),
        ("icon", "string", {}),
        ("title", "string", {"required": True}),
        ("description", "text", {}),
        ("url", "string", {}),
    ]),
    ("home", "stat-item", "统计数据", "chart-bar", [
        ("value", "string", {"required": True}),
        ("label", "string", {"required": True}),
    ]),
    ("home", "update-item", "最新动态", "clock", [
        ("date", "string", {}),
        ("title", "string", {"required": True}),
        ("tag", "string", {}),
    ]),
    ("home", "cta-button", "CTA按钮", "cursor", [
        ("text", "string", {"required": True}),
        ("url", "string", {}),
    ]),

    # ── 关于我们 ──
    ("about", "value-item", "价值主张", "star", [
        ("icon", "string", {}),
        ("title", "string", {"required": True}),
        ("description", "text", {}),
    ]),
    ("about", "highlight-item", "品牌亮点", "check", [
        ("content", "text", {"required": True}),
    ]),
    ("about", "subsidiary", "子公司", "building", [
        ("business", "string", {"required": True}),
        ("legalName", "string", {}),
        ("alias", "string", {}),
    ]),

    # ── AWS ──
    ("aws", "narrative-point", "叙事要点", "eye", [
        ("icon", "string", {}),
        ("title", "string", {"required": True}),
        ("description", "text", {}),
    ]),
    ("aws", "stat-item", "AWS统计", "chart-bar", [
        ("value", "string", {"required": True}),
        ("label", "string", {"required": True}),
    ]),
    ("aws", "core-message", "核心信息", "message", [
        ("content", "text", {"required": True}),
    ]),
    ("aws", "capability-mapping", "能力映射", "grid", [
        ("capability", "string", {"required": True}),
        ("description", "text", {}),
    ]),

    # ── 业务板块 ──
    ("business", "unit", "业务单元", "briefcase", [
        ("title", "string", {"required": True}),
        ("alias", "string", {}),
        ("enTitle", "string", {}),
        ("subtitle", "string", {}),
        ("description", "text", {}),
        ("tags", "text", {}),
        ("scenes", "text", {}),
        ("infraRelation", "text", {}),
        ("enDesc", "text", {}),
        ("image", "media", {"multiple": False, "required": False, "allowedTypes": ["images"]}),
    ]),

    # ── 联系我们 ──
    ("contact", "point", "联系信息", "phone", [
        ("icon", "string", {}),
        ("title", "string", {"required": True}),
        ("description", "text", {}),
        ("value", "string", {}),
    ]),
    ("contact", "use-case", "使用场景", "check-circle", [
        ("content", "string", {"required": True}),
    ]),
    ("contact", "suggestion", "建议", "lightbulb", [
        ("content", "string", {"required": True}),
    ]),

    # ── 基础设施 ──
    ("infra", "layer", "基础设施层", "layer-group", [
        ("title", "string", {"required": True}),
        ("subtitle", "string", {}),
        ("icon", "string", {}),
        ("description", "text", {}),
        ("details", "text", {}),
    ]),

    # ── 产品 ──
    ("product", "item", "产品", "box", [
        ("name", "string", {"required": True}),
        ("icon", "string", {}),
        ("description", "text", {}),
        ("scene", "string", {}),
        ("details", "text", {}),
        ("image", "media", {"multiple": False, "required": False, "allowedTypes": ["images"]}),
    ]),

    # ── 站点设置 ──
    ("site", "nav-item", "导航项", "link", [
        ("label", "string", {"required": True}),
        ("url", "string", {}),
    ]),
    ("site", "footer-link-group", "页脚链接组", "menu", [
        ("title", "string", {"required": True}),
    ]),
]

# ─── 内容类型定义 ──────────────────────────────────────────
# (api_dir_name, singular_name, display_name, description, 
#  simple_fields, component_fields)
# simple_field: (name, type, extra_props)
# component_field: (name, component_ref, repeatable)

CONTENT_TYPES = [
    ("homePage", "home-page", "首页", "首页轮播、使命陈述、导航卡片、统计数据、最新动态、CTA", [
        ("missionLabel", "string", {"default": "Our Mission"}),
        ("missionHeading", "string", {}),
        ("missionParagraph", "text", {}),
    ], [
        ("heroSlides", "home.hero-slide", True),
        ("navCards", "home.nav-card", True),
        ("stats", "home.stat-item", True),
        ("recentUpdates", "home.update-item", True),
        ("ctaPrimaryButton", "home.cta-button", False),
        ("ctaSecondaryButton", "home.cta-button", False),
    ]),

    ("aboutPage", "about-page", "关于我们", "公司定位、品牌叙事、子公司网络", [
        ("headerLabel", "string", {"default": "About Us"}),
        ("headerHeading", "string", {"default": "关于我们"}),
        ("headerParagraph", "text", {}),
        ("narrativeLabel", "string", {"default": "Our Narrative"}),
        ("narrativeHeading", "string", {}),
        ("narrativeParagraph", "text", {}),
        ("groupLabel", "string", {"default": "Group Structure"}),
        ("groupHeading", "string", {}),
        ("groupParagraph", "text", {}),
    ], [
        ("values", "about.value-item", True),
        ("highlights", "about.highlight-item", True),
        ("subsidiaries", "about.subsidiary", True),
    ]),

    ("awsPage", "aws-page", "AWS基础设施", "AWS基础设施叙事、统计、能力映射", [
        ("headerLabel", "string", {"default": "AWS Infrastructure"}),
        ("headerHeading", "string", {"default": "AWS 基础设施"}),
        ("headerParagraph", "text", {}),
        ("quoteEnglish", "text", {}),
        ("quoteChinese", "text", {}),
    ], [
        ("narrativePoints", "aws.narrative-point", True),
        ("awsStats", "aws.stat-item", True),
        ("coreMessages", "aws.core-message", True),
        ("capabilityMappings", "aws.capability-mapping", True),
    ]),

    ("businessPage", "business-page", "业务板块", "9大业务板块", [
        ("headerLabel", "string", {"default": "Business Units"}),
        ("headerHeading", "string", {"default": "9 大业务板块"}),
        ("headerParagraph", "text", {}),
    ], [
        ("businessUnits", "business.unit", True),
    ]),

    ("contactPage", "contact-page", "联系我们", "联系方式、使用场景、建议", [
        ("headerLabel", "string", {"default": "Contact Us"}),
        ("headerHeading", "string", {"default": "联系我们"}),
        ("headerParagraph", "text", {}),
        ("ctaHeading", "string", {}),
        ("ctaParagraph", "text", {}),
    ], [
        ("contactPoints", "contact.point", True),
        ("useCases", "contact.use-case", True),
        ("suggestions", "contact.suggestion", True),
    ]),

    ("infrastructurePage", "infrastructure-page", "AI基础设施", "AI推理服务基础设施层级", [
        ("headerLabel", "string", {"default": "AI Infrastructure"}),
        ("headerHeading", "string", {"default": "全球 AI 推理服务基础设施"}),
        ("headerParagraph", "text", {}),
        ("keyPrincipleHeading", "string", {}),
        ("keyPrincipleParagraph", "text", {}),
    ], [
        ("layers", "infra.layer", True),
    ]),

    ("productsPage", "products-page", "产品矩阵", "AI产品矩阵", [
        ("headerLabel", "string", {"default": "AI Products"}),
        ("headerHeading", "string", {"default": "AI 产品矩阵"}),
        ("headerParagraph", "text", {}),
    ], [
        ("products", "product.item", True),
    ]),

    ("siteSetting", "site-setting", "站点设置", "站点全局设置", [
        ("companyName", "string", {"default": "XMAX AI Inc"}),
        ("tagline", "string", {}),
        ("footerDescription", "text", {}),
        ("logo", "media", {"multiple": False, "required": False, "allowedTypes": ["images"]}),
    ], [
        ("navItems", "site.nav-item", True),
        ("footerLinkGroups", "site.footer-link-group", True),
    ]),
]


def build_attributes(simple_fields, component_fields):
    """构建 content type 的 attributes 对象"""
    attrs = {}
    for name, ftype, extra in simple_fields:
        attr = {"type": ftype}
        attr.update(extra)
        attrs[name] = attr
    for name, comp_ref, repeatable in component_fields:
        attrs[name] = {
            "type": "component",
            "repeatable": repeatable,
            "component": comp_ref,
        }
    return attrs


def create_component_schema(category, name, display_name, icon, fields):
    """生成组件 schema.json 内容"""
    attrs = {}
    for fname, ftype, extra in fields:
        attr = {"type": ftype}
        attr.update(extra)
        attrs[fname] = attr

    collection_name = f"components_{category.replace('-', '_')}_{name.replace('-', '_')}s"
    return {
        "collectionName": collection_name,
        "info": {
            "displayName": display_name,
            "icon": icon,
            "description": display_name,
        },
        "options": {},
        "attributes": attrs,
    }


def create_content_type_schema(singular_name, display_name, description, simple_fields, component_fields):
    """生成 content type schema.json 内容"""
    return {
        "kind": "singleType",
        "collectionName": f"{singular_name.replace('-', '_')}s",
        "info": {
            "singularName": singular_name,
            "pluralName": singular_name + "s",
            "displayName": display_name,
            "description": description,
        },
        "options": {
            "draftAndPublish": False,
        },
        "attributes": build_attributes(simple_fields, component_fields),
    }


def main():
    # 1. 创建所有组件
    print("=== 创建组件 ===")
    for category, name, display_name, icon, fields in COMPONENTS:
        dir_path = os.path.join(COMP_DIR, category, name)
        os.makedirs(dir_path, exist_ok=True)
        schema = create_component_schema(category, name, display_name, icon, fields)
        schema_path = os.path.join(dir_path, "schema.json")
        with open(schema_path, 'w', encoding='utf-8') as f:
            json.dump(schema, f, indent=2, ensure_ascii=False)
        print(f"  ✓ {category}.{name}")

    # 2. 更新所有 content type schema
    print("\n=== 更新内容类型 ===")
    for api_dir, singular, display, desc, simple_f, comp_f in CONTENT_TYPES:
        schema_path = os.path.join(API_DIR, api_dir, "content-types", api_dir, "schema.json")
        schema = create_content_type_schema(singular, display, desc, simple_f, comp_f)
        with open(schema_path, 'w', encoding='utf-8') as f:
            json.dump(schema, f, indent=2, ensure_ascii=False)
        print(f"  ✓ {singular}")

    # 3. 删除旧数据库
    db_path = os.path.join(BASE, '.tmp', 'data.db')
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"\n✓ 已删除旧数据库: {db_path}")
    else:
        print(f"\n- 数据库不存在，跳过")

    # 4. 清理 .strapi/client 缓存
    client_path = os.path.join(BASE, '.strapi', 'client')
    if os.path.exists(client_path):
        shutil.rmtree(client_path)
        print(f"✓ 已清理客户端缓存")

    # 5. 清理 dist 目录
    dist_path = os.path.join(BASE, 'dist')
    if os.path.exists(dist_path):
        shutil.rmtree(dist_path)
        print(f"✓ 已清理 dist 目录")

    print("\n=== 完成！接下来请运行: npm run develop ===")


if __name__ == "__main__":
    main()
