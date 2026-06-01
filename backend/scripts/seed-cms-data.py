#!/usr/bin/env python3
"""批量填充 Strapi CMS 所有页面的 PRD 内容到 SQLite 数据库"""
import sqlite3
import time

DB_PATH = ".tmp/data.db"
NOW = int(time.time() * 1000)

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# ─── Helper: insert component and link ──────────────────
def insert_component(table, fields, values, page_table, page_id, component_type, field_name, order, single=False):
    """Insert a component record and link it to the page."""
    cols = ", ".join(fields)
    placeholders = ", ".join(["?"] * len(values))
    cur.execute(f"INSERT INTO {table} ({cols}) VALUES ({placeholders})", values)
    cmp_id = cur.lastrowid

    cmps_table = f"{page_table}_cmps"
    if single:
        # Single component (dZ, not repeatable) — order is NULL
        cur.execute(f"INSERT INTO {cmps_table} (entity_id, cmp_id, component_type, field, `order`) VALUES (?, ?, ?, ?, NULL)",
                     (page_id, cmp_id, component_type, field_name))
    else:
        cur.execute(f"INSERT INTO {cmps_table} (entity_id, cmp_id, component_type, field, `order`) VALUES (?, ?, ?, ?, ?)",
                     (page_id, cmp_id, component_type, field_name, order))
    return cmp_id


def copy_header_image_to_localizations(page_table, related_type):
    """Copy header image media relations from the populated locale to sibling locales."""
    cur.execute(f"""
        INSERT INTO files_related_mph (file_id, related_id, related_type, field, `order`)
        SELECT src.file_id, target.id, src.related_type, src.field, src.`order`
        FROM files_related_mph src
        JOIN {page_table} source ON source.id = src.related_id
        JOIN {page_table} target
          ON target.document_id = source.document_id
         AND target.id != source.id
        WHERE src.related_type = ?
          AND src.field = 'headerImage'
          AND NOT EXISTS (
            SELECT 1
            FROM files_related_mph existing
            WHERE existing.related_type = src.related_type
              AND existing.related_id = target.id
              AND existing.field = src.field
          )
    """, (related_type,))


# ─── Home Page ─────────────────────────────────────────
print("Filling Home page...")
cur.execute("SELECT id FROM home_pages LIMIT 1")
row = cur.fetchone()
if not row:
    cur.execute("""INSERT INTO home_pages (document_id, mission_label, mission_heading, mission_paragraph,
        created_at, updated_at, published_at, created_by_id, updated_by_id, locale)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, ?)""",
        ("home-page-doc", "Our Mission",
         "连接全球 AI 推理服务基础设施与产业创新",
         "XMAX AI Inc 是 XMAX 集团的 AI 能力平台与产业服务载体，统一推进平台能力、产品化输出与行业化落地。",
         NOW, NOW, NOW, "zh-Hans"))
    home_id = cur.lastrowid
else:
    home_id = row[0]
    cur.execute("""UPDATE home_pages SET mission_label=?, mission_heading=?, mission_paragraph=?,
        updated_at=?, locale=? WHERE id=?""",
        ("Our Mission", "连接全球 AI 推理服务基础设施与产业创新",
         "XMAX AI Inc 是 XMAX 集团的 AI 能力平台与产业服务载体，统一推进平台能力、产品化输出与行业化落地。",
         NOW, "zh-Hans", home_id))
    cur.execute("DELETE FROM home_pages_cmps WHERE entity_id = ?", (home_id,))

order = 1.0
for title, subtitle, tags, bg in [
    (
        "全球 AI 推理服务基础设施",
        "基于云原生架构与行业化能力，为全球多场景业务提供可扩展、低时延、高可用的 AI 推理服务。",
        "AI Inference,Cloud Native,Global Infrastructure",
        "blue",
    ),
    (
        "平台能力 × 行业落地",
        "通过 9 大业务板块把模型服务、智能体、知识检索与安全治理转化为真实产业价值。",
        "Platform,Products,Industry Deployment",
        "indigo",
    ),
]:
    insert_component("components_home_hero_slides", ["title", "subtitle", "tags", "bg_gradient"],
                     [title, subtitle, tags, bg], "home_pages", home_id, "home.hero-slide", "heroSlides", order)
    order += 2.0

order = 1.0
for icon, title, desc, url in [
    ("Globe", "AI 基础设施", "全球推理服务底座与跨区域部署能力", "/infrastructure"),
    ("Box", "AI 产品矩阵", "模型网关、智能体、知识引擎与安全治理产品", "/products"),
    ("Building2", "九大业务板块", "面向电商、互娱、金融、生命科学等行业落地", "/business"),
]:
    insert_component("components_home_nav_cards", ["icon", "title", "description", "url"],
                     [icon, title, desc, url], "home_pages", home_id, "home.nav-card", "navCards", order)
    order += 2.0

order = 1.0
for value, label in [
    ("9", "业务板块"),
    ("5", "平台能力层"),
    ("24/7", "全球服务愿景"),
]:
    insert_component("components_home_stat_items", ["value", "label"],
                     [value, label], "home_pages", home_id, "home.stat-item", "stats", order)
    order += 2.0

order = 1.0
for date, title, tag in [
    ("2026", "XMAX AI Inc 官网内容管理体系启动", "CMS"),
    ("2026", "全球 AI 推理服务基础设施叙事升级", "Infrastructure"),
    ("2026", "九大业务板块内容结构完成", "Business"),
]:
    insert_component("components_home_update_items", ["date", "title", "tag"],
                     [date, title, tag], "home_pages", home_id, "home.update-item", "recentUpdates", order)
    order += 2.0

insert_component("components_home_cta_buttons", ["text", "url"],
                 ["联系我们", "/contact"], "home_pages", home_id, "home.cta-button", "ctaPrimaryButton", 1.0, single=True)
insert_component("components_home_cta_buttons", ["text", "url"],
                 ["了解更多", "/about"], "home_pages", home_id, "home.cta-button", "ctaSecondaryButton", 1.0, single=True)

print("  ✓ Home page done")


# ─── About Page ────────────────────────────────────────
print("Filling About page...")
cur.execute("SELECT id FROM about_pages LIMIT 1")
row = cur.fetchone()
if not row:
    cur.execute("""INSERT INTO about_pages (document_id, header_label, header_heading, header_paragraph,
        narrative_label, narrative_heading, narrative_paragraph,
        group_label, group_heading, group_paragraph,
        created_at, updated_at, published_at, created_by_id, updated_by_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1)""",
        ("about-page-doc", "About XMAX AI",
         "XMAX 集团 AI 能力与产业服务平台",
         "XMAX AI Inc 作为集团 AI 体系的重要运营与能力承载主体，统一推进平台能力、产品化输出与行业化落地。",
         "Our Mission",
         "以可信、可扩展的 AI 推理服务基础设施连接产业创新与社会需求",
         "XMAX AI Inc 处于 XMAX 集团体系之下，核心定位不是单点 AI 应用公司，而是围绕全球 AI 推理服务基础设施，构建面向全社会的产业级 AI 能力平台，并通过 9 大业务板块进行行业化落地。",
         "XMAX Group",
         "XMAX 集团体系下的 AI 能力承载",
         "XMAX AI Inc 是 XMAX 集团的 AI 能力平台与产业服务载体，在集团体系内统一推进平台能力、产品化输出与行业化落地。",
         NOW, NOW, NOW))
    about_id = cur.lastrowid
else:
    about_id = row[0]
    cur.execute("""UPDATE about_pages SET header_label=?, header_heading=?, header_paragraph=?,
        narrative_label=?, narrative_heading=?, narrative_paragraph=?,
        group_label=?, group_heading=?, group_paragraph=?,
        updated_at=? WHERE id=?""",
        ("About XMAX AI", "XMAX 集团 AI 能力与产业服务平台",
         "XMAX AI Inc 作为集团 AI 体系的重要运营与能力承载主体，统一推进平台能力、产品化输出与行业化落地。",
         "Our Mission",
         "以可信、可扩展的 AI 推理服务基础设施连接产业创新与社会需求",
         "XMAX AI Inc 处于 XMAX 集团体系之下，核心定位不是单点 AI 应用公司，而是围绕全球 AI 推理服务基础设施，构建面向全社会的产业级 AI 能力平台，并通过 9 大业务板块进行行业化落地。",
         "XMAX Group",
         "XMAX 集团体系下的 AI 能力承载",
         "XMAX AI Inc 是 XMAX 集团的 AI 能力平台与产业服务载体，在集团体系内统一推进平台能力、产品化输出与行业化落地。",
         NOW, about_id))
    # Clean existing component links
    cur.execute(f"DELETE FROM about_pages_cmps WHERE entity_id = ?", (about_id,))

order = 1.0
for icon, title, desc in [
    ("Shield", "可信", "安全治理、访问控制与合规要求贯穿全栈"),
    ("Expand", "可扩展", "弹性扩容、跨区域部署与多场景复用"),
    ("Target", "可落地", "9 大业务板块推动 AI 在商业与社会场景中的持续应用"),
]:
    insert_component("components_about_value_items", ["icon", "title", "description"],
                     [icon, title, desc], "about_pages", about_id, "about.value-item", "values", order)
    order += 2.0

order = 1.0
for content in [
    "全球 AI 推理服务基础设施构建者",
    "9 大业务板块覆盖电商、互娱、金融、生命科学等产业",
    "基于 AWS 全球基础设施的云原生架构",
]:
    insert_component("components_about_highlight_items", ["content"],
                     [content], "about_pages", about_id, "about.highlight-item", "highlights", order)
    order += 2.0

order = 1.0
for biz, legal in [
    ("管理运营平台", "XMAX AI Inc"),
    ("电商", "XMAX E-Commerce Pte. Ltd."),
    ("互娱", "XMAX Interactive Entertainment Pte. Ltd."),
    ("供应链服务", "XMAX Supply Chain Pte. Ltd."),
    ("太空计算", "XMAX Space Computing Pte. Ltd."),
    ("机器人", "XMAX Robotics Pte. Ltd."),
    ("生命科学", "XMAX Life Sciences Pte. Ltd."),
    ("金融", "XMAX Financial Services Pte. Ltd."),
    ("安全", "XMAX Security Pte. Ltd."),
    ("企业服务", "XMAX Enterprise Services Pte. Ltd."),
]:
    insert_component("components_about_subsidiarys", ["business", "legal_name"],
                     [biz, legal], "about_pages", about_id, "about.subsidiary", "subsidiaries", order)
    order += 2.0

print("  ✓ About page done")


# ─── Infrastructure Page ──────────────────────────────
print("Filling Infrastructure page...")
cur.execute("SELECT id FROM infrastructure_pages LIMIT 1")
row = cur.fetchone()
if not row:
    cur.execute("""INSERT INTO infrastructure_pages (document_id, header_label, header_heading, header_paragraph,
        key_principle_heading, key_principle_paragraph,
        created_at, updated_at, published_at, created_by_id, updated_by_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1)""",
        ("infra-page-doc", "Infrastructure",
         "全球 AI 推理服务基础设施",
         "XMAX AI Inc 基于 AWS 全球基础设施构建统一推理服务能力，支持跨区域部署、低时延响应和高可用运行。",
         "核心设计原则",
         "不强调单模型，强调统一推理服务能力；强调跨场景、跨区域、跨业务板块复用。",
         NOW, NOW, NOW))
    infra_id = cur.lastrowid
else:
    infra_id = row[0]
    cur.execute("""UPDATE infrastructure_pages SET header_label=?, header_heading=?, header_paragraph=?,
        key_principle_heading=?, key_principle_paragraph=?, updated_at=? WHERE id=?""",
        ("Infrastructure", "全球 AI 推理服务基础设施",
         "XMAX AI Inc 基于 AWS 全球基础设施构建统一推理服务能力，支持跨区域部署、低时延响应和高可用运行。",
         "核心设计原则",
         "不强调单模型，强调统一推理服务能力；强调跨场景、跨区域、跨业务板块复用。",
         NOW, infra_id))
    cur.execute(f"DELETE FROM infrastructure_pages_cmps WHERE entity_id = ?", (infra_id,))

order = 1.0
for title, subtitle, icon, desc, details in [
    ("Inference Fabric", "推理底座", "Cpu", "统一承载大模型与行业模型的推理调用", "面向多业务场景提供弹性扩容与服务路由，支撑高并发推理需求"),
    ("Model Gateway", "模型网关", "Network", "统一接入模型、版本、策略、配额与调用日志", "为业务系统提供标准化模型服务入口，统一治理模型版本与路由策略"),
    ("Agent Runtime", "智能体运行层", "Bot", "支撑工作流、工具调用、企业任务编排", "面向行业智能体构建，支持任务链编排与多轮工具调用"),
    ("Data & Retrieval Layer", "数据检索层", "Database", "支撑企业知识库、行业数据、RAG 与检索增强", "整合结构化与非结构化数据，支撑知识管理与检索增强生成"),
    ("Security & Governance", "安全治理层", "ShieldCheck", "支撑访问控制、审计、内容安全与合规要求", "全栈安全能力覆盖 IAM、KMS、日志审计、网络隔离与策略管理"),
]:
    insert_component("components_infra_layers", ["title", "subtitle", "icon", "description", "details"],
                     [title, subtitle, icon, desc, details], "infrastructure_pages", infra_id, "infra.layer", "layers", order)
    order += 2.0

print("  ✓ Infrastructure page done")


# ─── Products Page ─────────────────────────────────────
print("Filling Products page...")
cur.execute("SELECT id FROM products_pages LIMIT 1")
row = cur.fetchone()
if not row:
    cur.execute("""INSERT INTO products_pages (document_id, header_label, header_heading, header_paragraph,
        created_at, updated_at, published_at, created_by_id, updated_by_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)""",
        ("products-page-doc", "Products",
         "AI 产品矩阵",
         "向外部展示可被采购、集成、合作的产品化能力。",
         NOW, NOW, NOW))
    products_id = cur.lastrowid
else:
    products_id = row[0]
    cur.execute("""UPDATE products_pages SET header_label=?, header_heading=?, header_paragraph=?,
        updated_at=? WHERE id=?""",
        ("Products", "AI 产品矩阵",
         "向外部展示可被采购、集成、合作的产品化能力。",
         NOW, products_id))
    cur.execute(f"DELETE FROM products_pages_cmps WHERE entity_id = ?", (products_id,))

order = 1.0
for name, icon, desc, scene, details in [
    ("XMAX Inference Grid", "Cpu", "面向企业与业务系统的统一 AI 推理服务入口",
     "企业推理服务,行业模型部署,多区域推理",
     "提供统一推理 API，支持多模型接入、弹性扩容与跨区域服务路由，满足企业级推理需求。"),
    ("XMAX Model Gateway", "Network", "模型接入、路由、配额、监控与治理平台",
     "模型管理,API 治理,配额控制",
     "统一管理模型版本、调用策略与配额，提供调用日志与监控，支撑模型服务的规范化运营。"),
    ("XMAX Agent Studio", "Bot", "面向工作流、任务自动化和行业智能体构建",
     "智能体开发,工作流编排,任务自动化",
     "提供可视化智能体编排能力，支持工具调用、多轮对话与任务链构建，加速行业智能体落地。"),
    ("XMAX Knowledge Engine", "Database", "面向企业知识、检索增强和数据协同的智能引擎",
     "知识管理,RAG,检索增强",
     "整合企业知识库与行业数据，支持 RAG 与检索增强生成，为业务提供智能知识服务。"),
    ("XMAX Security Mesh", "ShieldCheck", "面向安全审计、访问控制、护栏策略与运营治理",
     "安全审计,访问控制,合规治理",
     "提供全栈安全能力，覆盖 IAM、内容安全、审计日志与护栏策略，保障 AI 服务的合规运行。"),
]:
    insert_component("components_product_items", ["name", "icon", "description", "scene", "details"],
                     [name, icon, desc, scene, details], "products_pages", products_id, "product.product-item", "products", order)
    order += 2.0

print("  ✓ Products page done")


# ─── Business Page ─────────────────────────────────────
print("Filling Business page...")
cur.execute("SELECT id FROM business_pages LIMIT 1")
row = cur.fetchone()
if not row:
    cur.execute("""INSERT INTO business_pages (document_id, header_label, header_heading, header_paragraph,
        created_at, updated_at, published_at, created_by_id, updated_by_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)""",
        ("business-page-doc", "Business",
         "九大业务板块",
         "将平台能力与行业场景结合，形成平台能力 × 行业落地的结构感。",
         NOW, NOW, NOW))
    biz_id = cur.lastrowid
else:
    biz_id = row[0]
    cur.execute("""UPDATE business_pages SET header_label=?, header_heading=?, header_paragraph=?,
        updated_at=? WHERE id=?""",
        ("Business", "九大业务板块",
         "将平台能力与行业场景结合，形成平台能力 × 行业落地的结构感。",
         NOW, biz_id))
    cur.execute(f"DELETE FROM business_pages_cmps WHERE entity_id = ?", (biz_id,))

order = 1.0
biz_units = [
    ("电商", "XMAX E-Commerce Pte. Ltd.", "XMAX E-Commerce", "XMAX 电商", "AI 驱动的交易、运营与用户增长体系",
     "电商运营,用户增长,智能推荐", "推理底座,模型网关", "Building AI-driven transaction, operations and user growth systems"),
    ("互娱", "XMAX Interactive Entertainment Pte. Ltd.", "XMAX Interactive Entertainment", "XMAX 互娱", "内容生成、互动体验与数字娱乐能力",
     "内容生成,互动体验,数字娱乐", "推理底座,智能体运行层", "Building content generation, interactive experience and digital entertainment capabilities"),
    ("供应链服务", "XMAX Supply Chain Pte. Ltd.", "XMAX Supply Chain", "XMAX 供应链", "智能调度、预测与协同网络",
     "智能调度,供应链预测,协同网络", "推理底座,数据检索层", "Building intelligent scheduling, forecasting and collaboration networks"),
    ("太空计算", "XMAX Space Computing Pte. Ltd.", "XMAX Space Computing", "XMAX 太空", "探索高性能算力、边缘连接与未来计算场景",
     "高性能算力,边缘计算,太空数据", "推理底座,安全治理层", "Exploring high-performance computing, edge connectivity and future computing scenarios"),
    ("机器人", "XMAX Robotics Pte. Ltd.", "XMAX Robotics", "XMAX 机器人", "推进感知、决策与执行一体化智能系统",
     "智能感知,自主决策,执行控制", "推理底座,智能体运行层", "Advancing integrated intelligent systems for perception, decision-making and execution"),
    ("生命科学", "XMAX Life Sciences Pte. Ltd.", "XMAX Life Sciences", "XMAX 生命科学", "面向研发、分析与智能辅助决策提供能力",
     "药物研发,临床分析,辅助决策", "推理底座,数据检索层", "Providing capabilities for R&D, analysis and intelligent decision support"),
    ("金融", "XMAX Financial Services Pte. Ltd.", "XMAX Financial Services", "XMAX 金融", "面向风控、运营、服务与智能金融流程提供能力",
     "智能风控,金融运营,智能客服", "推理底座,安全治理层", "Providing capabilities for risk management, operations and intelligent financial processes"),
    ("安全", "XMAX Security Pte. Ltd.", "XMAX Security", "XMAX 安全", "面向数字安全、监测、审计与治理提供能力",
     "安全监测,威胁检测,合规审计", "推理底座,安全治理层", "Providing capabilities for digital security, monitoring, auditing and governance"),
    ("企业服务", "XMAX Enterprise Services Pte. Ltd.", "XMAX Enterprise Services", "XMAX 企业服务", "面向组织数字化、知识管理与流程智能化提供能力",
     "企业数字化,知识管理,流程智能", "推理底座,数据检索层", "Providing capabilities for organizational digitalization, knowledge management and process intelligence"),
]
for title, legal, en_title, alias, desc, tags, infra, en_desc in biz_units:
    insert_component("components_business_units",
                     ["title", "alias", "subtitle", "description", "tags", "scenes", "infra_relation"],
                     [title, alias, legal, desc, tags, tags, infra],
                     "business_pages", biz_id, "business.unit", "businessUnits", order)
    order += 2.0

print("  ✓ Business page done")


# ─── AWS Page ──────────────────────────────────────────
print("Filling AWS page...")
cur.execute("SELECT id FROM aws_pages LIMIT 1")
row = cur.fetchone()
if not row:
    cur.execute("""INSERT INTO aws_pages (document_id, header_label, header_heading, header_paragraph,
        quote_chinese,
        created_at, updated_at, published_at, created_by_id, updated_by_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1)""",
        ("aws-page-doc", "AWS Infrastructure",
         "基于 AWS 全球基础设施构建 AI 推理服务能力",
         "XMAX AI Inc leverages AWS global infrastructure to build scalable AI inference services for multi-industry deployment.",
         "XMAX AI Inc 基于 AWS 全球基础设施构建可扩展的 AI 推理服务能力，支持跨区域部署、低时延响应、高可用运行及多行业场景复制。",
         NOW, NOW, NOW))
    aws_id = cur.lastrowid
else:
    aws_id = row[0]
    cur.execute("""UPDATE aws_pages SET header_label=?, header_heading=?, header_paragraph=?,
        quote_chinese=?, updated_at=? WHERE id=?""",
        ("AWS Infrastructure", "基于 AWS 全球基础设施构建 AI 推理服务能力",
         "XMAX AI Inc leverages AWS global infrastructure to build scalable AI inference services for multi-industry deployment.",
         "XMAX AI Inc 基于 AWS 全球基础设施构建可扩展的 AI 推理服务能力，支持跨区域部署、低时延响应、高可用运行及多行业场景复制。",
         NOW, aws_id))
    cur.execute(f"DELETE FROM aws_pages_cmps WHERE entity_id = ?", (aws_id,))

order = 1.0
for icon, title, desc in [
    ("Globe", "全球基础设施布局", "基于 AWS 全球基础设施布局全球服务能力，面向跨区域访问、低时延响应和高可用部署进行架构设计"),
    ("Server", "弹性计算与推理优化", "通过云原生能力支持业务弹性增长和行业场景快速复制，利用 Inferentia/Inferentia2 实例优化推理性能"),
    ("Lock", "安全治理与合规", "基于 AWS IAM、KMS、日志审计与网络隔离构建全栈安全治理能力"),
    ("Zap", "全球分发与低时延", "通过 CloudFront 边缘节点、Local Zones 和 Wavelength 实现全球低时延分发"),
]:
    insert_component("components_aws_narrative_points", ["icon", "title", "description"],
                     [icon, title, desc], "aws_pages", aws_id, "aws.narrative-point", "narrativePoints", order)
    order += 2.0

order = 1.0
for value, label in [
    ("39", "Geographic Regions"),
    ("123", "Availability Zones"),
    ("750+", "CloudFront POP 节点"),
]:
    insert_component("components_aws_stat_items", ["value", "label"],
                     [value, label], "aws_pages", aws_id, "aws.stat-item", "awsStats", order)
    order += 2.0

order = 1.0
for content in [
    "公司在 AWS 全球基础设施上建设 AI 服务能力",
    "公司业务适合多区域部署、弹性扩容与低时延推理",
    "公司在 AI 推理、模型服务、数据检索、安全治理方面形成平台能力",
    "公司有多个垂直行业场景，具备与 AWS 联合拓展空间",
]:
    insert_component("components_aws_core_messages", ["content"],
                     [content], "aws_pages", aws_id, "aws.core-message", "coreMessages", order)
    order += 2.0

order = 1.0
for cap, desc in [
    ("全球推理入口", "多 Region 部署、弹性计算、全球网络接入"),
    ("模型与推理服务", "Amazon Bedrock、Amazon SageMaker AI、EC2 推理实例"),
    ("高性能推理优化", "AWS Inferentia / Inferentia2、Neuron SDK"),
    ("数据与检索层", "对象存储、数据湖、检索与向量扩展能力"),
    ("安全治理层", "IAM、KMS、日志审计、网络隔离、策略管理"),
    ("全球分发与低时延", "CloudFront、边缘节点、Local Zones、Wavelength"),
]:
    insert_component("components_aws_capability_mappings", ["capability", "description"],
                     [cap, desc], "aws_pages", aws_id, "aws.capability-mapping", "capabilityMappings", order)
    order += 2.0

print("  ✓ AWS page done")


# ─── Contact Page ──────────────────────────────────────
print("Filling Contact page...")
cur.execute("SELECT id FROM contact_pages LIMIT 1")
row = cur.fetchone()
if not row:
    cur.execute("""INSERT INTO contact_pages (document_id, header_label, header_heading, header_paragraph,
        cta_heading, cta_paragraph,
        created_at, updated_at, published_at, created_by_id, updated_by_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1)""",
        ("contact-page-doc", "Contact",
         "联系我们",
         "无论是商务合作、生态对接还是人才加入，我们都期待与您连接。",
         "与 XMAX AI 共建全球 AI 推理服务未来",
         "无论是商务合作、生态对接还是人才加入，我们都期待与您连接。",
         NOW, NOW, NOW))
    contact_id = cur.lastrowid
else:
    contact_id = row[0]
    cur.execute("""UPDATE contact_pages SET header_label=?, header_heading=?, header_paragraph=?,
        cta_heading=?, cta_paragraph=?, updated_at=? WHERE id=?""",
        ("Contact", "联系我们",
         "无论是商务合作、生态对接还是人才加入，我们都期待与您连接。",
         "与 XMAX AI 共建全球 AI 推理服务未来",
         "无论是商务合作、生态对接还是人才加入，我们都期待与您连接。",
         NOW, contact_id))
    cur.execute(f"DELETE FROM contact_pages_cmps WHERE entity_id = ?", (contact_id,))

order = 1.0
for icon, title, desc, value in [
    ("Mail", "商务合作", "商务合作与生态对接", "business@xmaxai.com"),
    ("Users", "人才加入", "加入 XMAX AI 团队", "careers@xmaxai.com"),
    ("Globe", "全球办公室", "全球办公地点", "Singapore / Beijing / Shenzhen"),
]:
    insert_component("components_contact_points", ["icon", "title", "description", "value"],
                     [icon, title, desc, value], "contact_pages", contact_id, "contact.contact-point", "contactPoints", order)
    order += 2.0

order = 1.0
for content in [
    "商务合作与生态对接",
    "技术合作与集成方案",
    "投资与战略咨询",
]:
    insert_component("components_contact_use_cases", ["content"],
                     [content], "contact_pages", contact_id, "contact.contact-use-case", "useCases", order)
    order += 2.0

order = 1.0
for content in [
    "请提供您的公司名称与联系方式",
    "描述您感兴趣的合作方向",
    "我们的团队将在 2 个工作日内回复",
]:
    insert_component("components_contact_suggestions", ["content"],
                     [content], "contact_pages", contact_id, "contact.contact-suggestion", "suggestions", order)
    order += 2.0

print("  ✓ Contact page done")


# ─── Site Settings ─────────────────────────────────────
print("Filling Site Settings...")
cur.execute("SELECT id FROM site_settings LIMIT 1")
row = cur.fetchone()
if not row:
    cur.execute("""INSERT INTO site_settings (document_id, company_name, tagline, footer_description,
        created_at, updated_at, published_at, created_by_id, updated_by_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)""",
        ("site-setting-doc", "XMAX AI Inc",
         "全球 AI 推理服务基础设施",
         "XMAX AI Inc 是 XMAX 集团的 AI 能力平台与产业服务载体，统一推进平台能力、产品化输出与行业化落地。",
         NOW, NOW, NOW))
    site_id = cur.lastrowid
else:
    site_id = row[0]
    cur.execute("""UPDATE site_settings SET company_name=?, tagline=?, footer_description=?,
        updated_at=? WHERE id=?""",
        ("XMAX AI Inc", "全球 AI 推理服务基础设施",
         "XMAX AI Inc 是 XMAX 集团的 AI 能力平台与产业服务载体，统一推进平台能力、产品化输出与行业化落地。",
         NOW, site_id))
    cur.execute(f"DELETE FROM site_settings_cmps WHERE entity_id = ?", (site_id,))

order = 1.0
for label, url in [
    ("首页", "/"),
    ("关于", "/about"),
    ("基础设施", "/infrastructure"),
    ("产品", "/products"),
    ("业务", "/business"),
    ("AWS", "/aws"),
    ("联系", "/contact"),
]:
    insert_component("components_site_nav_items", ["label", "url"],
                     [label, url], "site_settings", site_id, "site.nav-item", "navItems", order)
    order += 2.0

order = 1.0
for title in ["公司", "业务", "资源"]:
    insert_component("components_site_footer_link_groups", ["title"],
                     [title], "site_settings", site_id, "site.footer-link-group", "footerLinkGroups", order)
    order += 2.0

print("  ✓ Site Settings done")


# ─── Commit ────────────────────────────────────────────
for table in [
    "home_pages",
    "about_pages",
    "infrastructure_pages",
    "products_pages",
    "business_pages",
    "aws_pages",
    "contact_pages",
    "site_settings",
]:
    cur.execute(f"UPDATE {table} SET locale = ? WHERE locale IS NULL OR locale = ''", ("zh-Hans",))

for table, related_type in [
    ("about_pages", "api::about-page.about-page"),
    ("infrastructure_pages", "api::infrastructure-page.infrastructure-page"),
    ("products_pages", "api::products-page.products-page"),
    ("business_pages", "api::business-page.business-page"),
    ("aws_pages", "api::aws-page.aws-page"),
    ("contact_pages", "api::contact-page.contact-page"),
]:
    copy_header_image_to_localizations(table, related_type)

conn.commit()
conn.close()
print("\n✅ All CMS data populated successfully!")
