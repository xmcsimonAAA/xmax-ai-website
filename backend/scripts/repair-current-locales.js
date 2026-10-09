"use strict";

/**
 * Repair the current SQLite content so each Strapi locale points to clean,
 * language-specific copy. Images/media relationships are intentionally left
 * untouched; only visible text and icon identifiers are normalized.
 */

const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.resolve(__dirname, "../.tmp/data.db");

function pageId(db, table, locale) {
  const row = db.prepare(`SELECT id FROM ${table} WHERE locale = ? ORDER BY id LIMIT 1`).get(locale);
  if (!row) throw new Error(`Missing ${locale} row in ${table}`);
  return row.id;
}

function componentIds(db, cmpsTable, entityId, field) {
  return db
    .prepare(`SELECT cmp_id FROM ${cmpsTable} WHERE entity_id = ? AND field = ? ORDER BY "order", id`)
    .all(entityId, field)
    .map((row) => row.cmp_id);
}

function updateByLocale(db, table, locale, data) {
  const keys = Object.keys(data);
  const assignments = keys.map((key) => `${key} = ?`).join(", ");
  db.prepare(`UPDATE ${table} SET ${assignments} WHERE locale = ?`).run(...keys.map((key) => data[key]), locale);
}

function updateRows(db, table, ids, rows) {
  if (ids.length < rows.length) {
    throw new Error(`Not enough component ids for ${table}: expected ${rows.length}, got ${ids.length}`);
  }

  rows.forEach((row, index) => {
    const id = ids[index];
    const keys = Object.keys(row);
    const assignments = keys.map((key) => `${key} = ?`).join(", ");
    db.prepare(`UPDATE ${table} SET ${assignments} WHERE id = ?`).run(...keys.map((key) => row[key]), id);
  });
}

function repairHome(db) {
  const zhId = pageId(db, "home_pages", "zh-Hans");
  const enId = pageId(db, "home_pages", "en");

  updateByLocale(db, "home_pages", "zh-Hans", {
    mission_label: "使命",
    mission_heading: "以可信、可扩展的 AI 推理服务基础设施，连接产业创新与社会需求",
    mission_paragraph: "XMAX AI Inc 是 XMAX 集团的 AI 能力平台与产业服务载体，统一推进平台能力、产品化输出与行业化落地。",
  });

  updateByLocale(db, "home_pages", "en", {
    mission_label: "Our Mission",
    mission_heading: "Connecting Industrial Innovation and Social Needs Through Trusted, Scalable AI Infrastructure",
    mission_paragraph: "XMAX AI Inc is the AI platform and industry service carrier of XMAX Group, advancing platform capabilities, productized output, and industry implementation.",
  });

  const zhSlides = [
    ["构建全球 AI 推理服务基础设施", "XMAX AI Inc 依托 XMAX 集团，通过 9 大业务板块将可扩展、可治理的 AI 推理服务落地于商业与社会场景", "全球 AI 推理,AWS 基础架构,9 大业务板块,XMAX 集团体系"],
    ["电商", "智能推荐、内容生成与客服自动化，让交易效率持续升级", "智能推荐,商品内容生成,用户增长运营,智能客服"],
    ["互娱", "AIGC 内容生成 + 数字角色智能，重塑沉浸式娱乐体验", "AIGC 内容生成,互动引擎,数字角色智能,实时响应"],
    ["供应链服务", "需求预测、库存优化与履约调度，打通全链路响应网络", "需求预测,智能调度,库存优化,履约协同"],
    ["太空计算", "边缘推理、远距协同与高性能算力，探索极限场景", "高性能计算,边缘推理,远程协同,未来基础设施"],
    ["机器人", "融合环境理解、决策规划与执行控制，让机器人真正会用脑", "环境感知,智能决策,任务规划,执行控制"],
    ["生命科学", "知识检索、辅助分析与决策支持，提升研发与流程效率", "科研辅助分析,专业知识检索,数据理解,智能决策支持"],
    ["金融", "风控、客服与审计全链路可治理，安全合规驱动效率", "风险识别,智能客服,流程自动化,审计与治理"],
    ["安全", "智能监测、预警与审计，构建主动式安全运营体系", "安全监测,风险预警,审计追踪,治理策略"],
    ["企业服务", "知识引擎 + 流程自动化，打造下一代智能办公底座", "企业知识管理,流程自动化,组织协作智能化,智能办公助手"],
  ].map(([title, subtitle, tags]) => ({ title, subtitle, tags }));

  const enSlides = [
    ["Building Global AI Inference Service Infrastructure", "XMAX AI Inc deploys scalable, governable AI inference services across business and social scenarios through XMAX Group and nine business units.", "Global AI Inference,AWS Infrastructure,9 Business Units,XMAX Group"],
    ["E-Commerce", "Smart recommendations, content generation, and customer-service automation keep transaction efficiency improving.", "Smart Recommendation,Product Content Generation,User Growth,AI Customer Service"],
    ["Interactive Entertainment", "AIGC content generation and digital character intelligence reshape immersive entertainment experiences.", "AIGC Content Generation,Interactive Engine,Digital Character Intelligence,Real-time Response"],
    ["Supply Chain Services", "Demand forecasting, inventory optimization, and fulfillment orchestration connect the full-chain response network.", "Demand Forecasting,Intelligent Scheduling,Inventory Optimization,Fulfillment Collaboration"],
    ["Space Computing", "Edge inference, remote collaboration, and high-performance computing explore frontier scenarios.", "High-Performance Computing,Edge Inference,Remote Collaboration,Future Infrastructure"],
    ["Robotics", "Environmental understanding, decision planning, and execution control make robotic systems truly intelligent.", "Environmental Perception,Intelligent Decision-Making,Task Planning,Execution Control"],
    ["Life Sciences", "Knowledge retrieval, assisted analysis, and decision support improve R&D and process efficiency.", "Research Assistance,Knowledge Retrieval,Data Understanding,Decision Support"],
    ["Finance", "Governed risk control, customer service, and auditing drive efficiency through security and compliance.", "Risk Identification,AI Customer Service,Process Automation,Auditing & Governance"],
    ["Security", "Intelligent monitoring, alerting, and auditing build proactive security operations.", "Security Monitoring,Risk Alerts,Audit Trail,Governance Policy"],
    ["Enterprise Services", "Knowledge engines and workflow automation build the next-generation intelligent workplace foundation.", "Enterprise Knowledge,Workflow Automation,Collaboration Intelligence,AI Office Assistant"],
  ].map(([title, subtitle, tags]) => ({ title, subtitle, tags }));

  updateRows(db, "components_home_hero_slides", componentIds(db, "home_pages_cmps", zhId, "heroSlides"), zhSlides);
  updateRows(db, "components_home_hero_slides", componentIds(db, "home_pages_cmps", enId, "heroSlides"), enSlides);

  updateRows(db, "components_home_nav_cards", componentIds(db, "home_pages_cmps", zhId, "navCards"), [
    { icon: "Building2", title: "AI 基础设施", description: "基于 AWS 全球云基础设施构建 AI 推理、模型服务与数据安全能力", url: "/infrastructure" },
    { icon: "Box", title: "AI 产品与服务", description: "覆盖全栈 AI 产品矩阵，包括 Agent OS、模型服务平台与数据智能平台", url: "/products" },
    { icon: "Globe", title: "业务版图", description: "九大业务板块覆盖电商、互娱、金融、生命科学等领域", url: "/business" },
  ]);
  updateRows(db, "components_home_nav_cards", componentIds(db, "home_pages_cmps", enId, "navCards"), [
    { icon: "Building2", title: "AI Infrastructure", description: "AI inference, model services, and data security built on AWS global cloud infrastructure", url: "/infrastructure" },
    { icon: "Box", title: "AI Products & Services", description: "End-to-end AI product matrix covering Agent OS, model service platform, and data intelligence platform", url: "/products" },
    { icon: "Globe", title: "Business Landscape", description: "Nine business units covering e-commerce, entertainment, finance, life sciences, and more", url: "/business" },
  ]);

  updateRows(db, "components_home_stat_items", componentIds(db, "home_pages_cmps", zhId, "stats"), [
    { value: "9", label: "业务板块" },
    { value: "30+", label: "全球部署区域" },
    { value: "100+", label: "行业解决方案" },
    { value: "99.9%", label: "服务可用性" },
  ]);
  updateRows(db, "components_home_stat_items", componentIds(db, "home_pages_cmps", enId, "stats"), [
    { value: "9", label: "Business Units" },
    { value: "30+", label: "Global Deployment Regions" },
    { value: "100+", label: "Industry Solutions" },
    { value: "99.9%", label: "Service Availability" },
  ]);

  updateRows(db, "components_home_update_items", componentIds(db, "home_pages_cmps", zhId, "recentUpdates"), [
    { date: "2025-05", title: "XMAX AI Agent OS 正式发布", tag: "产品发布" },
    { date: "2025-03", title: "XMAX AI 与 AWS 深化全球合作伙伴关系", tag: "合作动态" },
    { date: "2025-01", title: "XMAX AI 完成新一轮战略融资", tag: "公司新闻" },
  ]);
  updateRows(db, "components_home_update_items", componentIds(db, "home_pages_cmps", enId, "recentUpdates"), [
    { date: "2025-05", title: "XMAX AI Agent OS Officially Launched", tag: "Product Launch" },
    { date: "2025-03", title: "XMAX AI and AWS Deepen Global Partnership", tag: "Partnership Update" },
    { date: "2025-01", title: "XMAX AI Completes New Strategic Investment Round", tag: "Company News" },
  ]);

  updateRows(db, "components_home_cta_buttons", componentIds(db, "home_pages_cmps", zhId, "ctaPrimaryButton"), [{ text: "查看业务版图", url: "/business" }]);
  updateRows(db, "components_home_cta_buttons", componentIds(db, "home_pages_cmps", zhId, "ctaSecondaryButton"), [{ text: "联系合作", url: "/contact" }]);
  updateRows(db, "components_home_cta_buttons", componentIds(db, "home_pages_cmps", enId, "ctaPrimaryButton"), [{ text: "Explore Business", url: "/business" }]);
  updateRows(db, "components_home_cta_buttons", componentIds(db, "home_pages_cmps", enId, "ctaSecondaryButton"), [{ text: "Partner With Us", url: "/contact" }]);
}

function repairAbout(db) {
  const zhId = pageId(db, "about_pages", "zh-Hans");
  const enId = pageId(db, "about_pages", "en");

  updateByLocale(db, "about_pages", "zh-Hans", {
    header_label: "关于我们",
    header_heading: "XMAX 集团 AI 能力与产业服务平台",
    header_paragraph: "XMAX AI Inc 作为集团 AI 体系的重要运营与能力承载主体，统一推进平台能力、产品化输出与行业化落地。",
    narrative_label: "使命",
    narrative_heading: "以可信、可扩展的 AI 推理服务基础设施连接产业创新与社会需求",
    narrative_paragraph: "XMAX AI Inc 是 XMAX 集团旗下的 AI 能力与产业服务平台。作为集团 AI 体系的核心运营主体，我们统一推进平台能力、产品化输出与行业化落地，通过 9 大业务板块将 AI 价值注入关键产业，让技术真正服务于社会。",
    group_label: "集团体系",
    group_heading: "XMAX 集团体系下的 AI 能力承载",
    group_paragraph: "XMAX AI Inc 是 XMAX 集团的 AI 能力平台与产业服务载体，在集团体系内统一推进平台能力、产品化输出与行业化落地。",
  });
  updateByLocale(db, "about_pages", "en", {
    header_label: "About XMAX AI",
    header_heading: "XMAX Group AI Capability and Industry Service Platform",
    header_paragraph: "XMAX AI Inc is an important operating and capability carrier within the group's AI system, advancing platform capabilities, productized output, and industry implementation.",
    narrative_label: "Our Mission",
    narrative_heading: "Connecting Industry Innovation and Social Needs Through Trusted, Scalable AI Infrastructure",
    narrative_paragraph: "XMAX AI Inc is the AI capability and industry service platform under XMAX Group. As the core operating body of the group's AI system, we advance platform capabilities, productized output, and industry implementation, bringing AI value into key industries through nine business units.",
    group_label: "XMAX Group",
    group_heading: "AI Capability Carrier Under the XMAX Group System",
    group_paragraph: "XMAX AI Inc serves as the AI platform and industry service carrier of XMAX Group, advancing platform capabilities, productized output, and industry implementation across the group system.",
  });

  updateRows(db, "components_about_value_items", componentIds(db, "about_pages_cmps", zhId, "values"), [
    { icon: "Shield", title: "可信", description: "基于 AWS 全球基础设施构建安全、合规、可审计的 AI 推理服务体系" },
    { icon: "Expand", title: "可扩展", description: "支持跨区域、跨业务板块的弹性扩展与统一调度" },
    { icon: "Target", title: "可落地", description: "通过 9 大业务板块将 AI 能力转化为可交付的产业服务" },
  ]);
  updateRows(db, "components_about_value_items", componentIds(db, "about_pages_cmps", enId, "values"), [
    { icon: "Shield", title: "Trusted", description: "Building secure, compliant, and auditable AI inference services on AWS global infrastructure" },
    { icon: "Expand", title: "Scalable", description: "Supporting elastic scaling and unified orchestration across regions and business units" },
    { icon: "Target", title: "Deployable", description: "Converting AI capabilities into deliverable industry services through nine business units" },
  ]);

  updateRows(db, "components_about_highlight_items", componentIds(db, "about_pages_cmps", zhId, "highlights"), [
    { content: "全球 AI 推理服务基础设施构建者" },
    { content: "9 大业务板块覆盖电商、互娱、金融、生命科学等行业" },
    { content: "基于 AWS 全球基础设施的云原生架构" },
  ]);
  updateRows(db, "components_about_highlight_items", componentIds(db, "about_pages_cmps", enId, "highlights"), [
    { content: "Builder of Global AI Inference Service Infrastructure" },
    { content: "Nine business units covering e-commerce, entertainment, finance, life sciences, and more" },
    { content: "Cloud-native architecture powered by AWS global infrastructure" },
  ]);

  const zhSubsidiaries = [
    ["管理与运营平台", "XMax AI Pte. Ltd."],
    ["电商", "XMax AI EC Pte. Ltd."],
    ["互娱", "XMax AI IG Pte. Ltd."],
    ["供应链服务", "XMax AI SCM Pte. Ltd."],
    ["太空计算", "XMax AI SEIC Pte. Ltd."],
    ["机器人", "XMax AI Robotics Pte. Ltd."],
    ["生命科学", "XMax AI Novalife Pte. Ltd."],
    ["金融", "XMax AI Fintech Pte. Ltd."],
    ["安全", "XMax AI Security Pte. Ltd."],
    ["企业服务", "XMax AI Enterprise Services Pte. Ltd."],
  ].map(([business, legal_name]) => ({ business, legal_name }));
  const enSubsidiaries = [
    ["Management & Operations Platform", "XMax AI Pte. Ltd."],
    ["E-Commerce", "XMax AI EC Pte. Ltd."],
    ["Interactive Entertainment", "XMax AI IG Pte. Ltd."],
    ["Supply Chain Services", "XMax AI SCM Pte. Ltd."],
    ["Space Computing", "XMax AI SEIC Pte. Ltd."],
    ["Robotics", "XMax AI Robotics Pte. Ltd."],
    ["Life Sciences", "XMax AI Novalife Pte. Ltd."],
    ["Finance", "XMax AI Fintech Pte. Ltd."],
    ["Security", "XMax AI Security Pte. Ltd."],
    ["Enterprise Services", "XMax AI Enterprise Services Pte. Ltd."],
  ].map(([business, legal_name]) => ({ business, legal_name }));
  updateRows(db, "components_about_subsidiarys", componentIds(db, "about_pages_cmps", zhId, "subsidiaries"), zhSubsidiaries);
  updateRows(db, "components_about_subsidiarys", componentIds(db, "about_pages_cmps", enId, "subsidiaries"), enSubsidiaries);
}

function repairInfrastructure(db) {
  const zhId = pageId(db, "infrastructure_pages", "zh-Hans");
  const enId = pageId(db, "infrastructure_pages", "en");

  updateByLocale(db, "infrastructure_pages", "zh-Hans", {
    header_label: "AI 基础设施",
    header_heading: "全球 AI 推理服务基础设施",
    header_paragraph: "XMAX AI Inc 的核心不是单一模型或单一应用，而是统一推理服务、模型治理、智能体运行、数据检索与安全控制面构成的平台化基础设施。",
    key_principle_heading: "我们的设计理念",
    key_principle_paragraph: "1、统一推理服务能力 —— 不绑定单一模型，提供面向全业务的统一推理入口与治理体系。\n2、跨场景、跨区域、跨业务板块复用 —— 一套基础设施，同时支撑电商、互娱、供应链等九大板块。\n3、平台层而非模型层 —— 我们强调如何让模型可靠、高效、可控地服务于业务。",
  });
  updateByLocale(db, "infrastructure_pages", "en", {
    header_label: "AI Infrastructure",
    header_heading: "Global AI Inference Service Infrastructure",
    header_paragraph: "XMAX AI Inc's core is not a single model or application, but a platform infrastructure composed of unified inference services, model governance, agent runtime, data retrieval, and a security control plane.",
    key_principle_heading: "Our Design Principles",
    key_principle_paragraph: "1. Unified inference capability — a governed inference entry point for all business needs, not a single-model dependency.\n2. Reuse across scenarios, regions, and business units — one infrastructure foundation supporting e-commerce, entertainment, supply chain, and all nine units.\n3. Platform layer over model layer — the focus is making models reliable, efficient, and controllable for real business workloads.",
  });

  const zhRows = [
    ["推理网格", "分布式推理计算层", "Network", "构建跨区域、跨可用区的分布式推理计算网络，支持弹性伸缩与负载均衡", "支持 GPU/TPU 异构计算资源调度，实现毫秒级推理响应"],
    ["模型网关", "统一模型接入层", "Layers3", "提供标准化模型接入、版本管理与路由分发能力，支持多模型并行推理", "内置模型性能监控与自动降级机制，保障服务稳定性"],
    ["智能体运行层", "智能体执行环境", "Bot", "提供安全隔离的智能体运行环境，支持多智能体协作与任务编排", "内置工具调用、记忆管理与上下文保持能力"],
    ["数据检索层", "数据与知识检索", "Database", "构建企业级向量数据库与知识图谱，支持多模态数据检索与语义搜索", "支持 RAG 增强生成、实时数据同步与隐私保护检索"],
    ["安全治理层", "安全与合规控制面", "Shield", "提供全链路安全监控、合规审计与访问控制能力，满足企业级安全要求", "内置数据脱敏、模型安全检测与行为审计功能"],
  ].map(([title, subtitle, icon, description, details]) => ({ title, subtitle, icon, description, details }));
  const enRows = [
    ["Inference Fabric", "Distributed Inference Compute Layer", "Network", "Builds a cross-region, cross-availability-zone inference network with elastic scaling and load balancing.", "Supports heterogeneous GPU/TPU resource scheduling for millisecond-level inference response."],
    ["Model Gateway", "Unified Model Access Layer", "Layers3", "Provides standardized model access, version management, and routing capabilities for parallel multi-model inference.", "Built-in model performance monitoring and automatic degradation mechanisms ensure service stability."],
    ["Agent Runtime", "Agent Execution Environment", "Bot", "Provides secure isolated agent runtime environments for multi-agent collaboration and task orchestration.", "Built-in tool calling, memory management, and context retention capabilities."],
    ["Data Retrieval Layer", "Data and Knowledge Retrieval", "Database", "Builds enterprise-grade vector databases and knowledge graphs for multimodal retrieval and semantic search.", "Supports RAG, real-time data synchronization, and privacy-preserving retrieval."],
    ["Security Governance Layer", "Security and Compliance Control Plane", "Shield", "Provides full-chain security monitoring, compliance auditing, and access control for enterprise requirements.", "Built-in data masking, model security detection, and behavior auditing."],
  ].map(([title, subtitle, icon, description, details]) => ({ title, subtitle, icon, description, details }));
  updateRows(db, "components_infra_layers", componentIds(db, "infrastructure_pages_cmps", zhId, "layers"), zhRows);
  updateRows(db, "components_infra_layers", componentIds(db, "infrastructure_pages_cmps", enId, "layers"), enRows);
}

function repairProducts(db) {
  const zhId = pageId(db, "products_pages", "zh-Hans");
  const enId = pageId(db, "products_pages", "en");

  updateByLocale(db, "products_pages", "zh-Hans", {
    header_label: "AI 产品",
    header_heading: "AI 产品矩阵",
    header_paragraph: "XMAX AI 提供五大企业级产品，均可通过 API、SDK 或托管控制台使用。定价采用“用量 + 结果导向”混合模式。",
  });
  updateByLocale(db, "products_pages", "en", {
    header_label: "AI Products",
    header_heading: "AI Product Matrix",
    header_paragraph: "XMAX AI provides five enterprise-grade products available through APIs, SDKs, or a managed console, with a hybrid pricing model based on usage and outcomes.",
  });

  const names = ["XMAX Inference Grid", "XMAX Model Gateway", "XMAX Agent Studio", "XMAX Knowledge Engine", "XMAX Security Mesh"];
  const icons = ["Cloud", "Layers3", "Workflow", "BrainCircuit", "Shield"];
  const zh = [
    ["面向企业与业务系统的统一 AI 推理服务入口", "企业推理服务,行业模型部署,多区域推理", "提供统一推理 API，支持多模型接入、弹性扩容与跨区域服务路由，满足企业级推理需求。"],
    ["模型接入、路由、配额、监控与治理平台", "模型管理,API 治理,配额控制", "统一管理模型版本、调用策略与配额，提供调用日志与监控，支撑模型服务的规范化运营。"],
    ["面向工作流、任务自动化和行业智能体构建", "智能体开发,工作流编排,任务自动化", "提供可视化智能体编排能力，支持工具调用、多轮对话与任务链构建，加速行业智能体落地。"],
    ["面向企业知识、检索增强和数据协同的智能引擎", "知识管理,RAG,检索增强", "整合企业知识库与行业数据，支持 RAG 与检索增强生成，为业务提供智能知识服务。"],
    ["面向安全审计、访问控制、护栏策略与运营治理", "安全审计,访问控制,合规治理", "提供全栈安全能力，覆盖 IAM、内容安全、审计日志与护栏策略，保障 AI 服务的合规运行。"],
  ].map(([description, scene, details], index) => ({ name: names[index], icon: icons[index], description, scene, details }));
  const en = [
    ["Unified AI inference service gateway for enterprises and business systems", "Enterprise inference, industry model deployment, multi-region inference", "Provides a unified inference API supporting multi-model access, elastic scaling, and cross-region service routing for enterprise-grade inference needs."],
    ["Model access, routing, quotas, monitoring, and governance platform", "Model management, API governance, quota control", "Unified management of model versions, calling policies, and quotas with logging and monitoring for standardized model service operations."],
    ["Workflow, task automation, and industry agent builder", "Agent development, workflow orchestration, task automation", "Visual agent orchestration with tool calling, multi-turn dialogue, and task chains to accelerate industry agent deployment."],
    ["Intelligent engine for enterprise knowledge, RAG, and data collaboration", "Knowledge management, RAG, retrieval augmentation", "Integrates enterprise knowledge bases and industry data, supporting RAG and retrieval-augmented generation for intelligent knowledge services."],
    ["Security auditing, access control, guardrail policies, and operational governance", "Security auditing, access control, compliance governance", "Full-stack security covering IAM, content safety, audit logging, and guardrail policies for compliant AI service operations."],
  ].map(([description, scene, details], index) => ({ name: names[index], icon: icons[index], description, scene, details }));
  updateRows(db, "components_product_items", componentIds(db, "products_pages_cmps", zhId, "products"), zh);
  updateRows(db, "components_product_items", componentIds(db, "products_pages_cmps", enId, "products"), en);
}

function repairBusiness(db) {
  const zhId = pageId(db, "business_pages", "zh-Hans");
  const enId = pageId(db, "business_pages", "en");

  updateByLocale(db, "business_pages", "zh-Hans", {
    header_label: "业务板块",
    header_heading: "九大业务板块",
    header_paragraph: "一套基础设施，九大产业场景。电商、互娱、供应链、太空计算、机器人、生命科学、金融、安全、企业服务，每个板块都是对 XMAX AI 统一推理能力的真实压测与价值验证。",
  });
  updateByLocale(db, "business_pages", "en", {
    header_label: "Business Units",
    header_heading: "Nine Business Units",
    header_paragraph: "One infrastructure foundation, nine industry scenarios. E-commerce, interactive entertainment, supply chain services, space computing, robotics, life sciences, finance, security, and enterprise services each validate XMAX AI's unified inference capabilities in real-world business contexts.",
  });

  const zhUnits = componentIds(db, "business_pages_cmps", zhId, "businessUnits");
  const enUnits = componentIds(db, "business_pages_cmps", enId, "businessUnits");
  updateRows(db, "components_business_units", zhUnits, [
    { infra_relation: "依赖推理网格与模型网关" },
    { infra_relation: "依赖智能体运行层与数据检索层" },
    { infra_relation: "依赖推理网格与安全治理层" },
    { infra_relation: "依赖推理网格与全球分发能力" },
    { infra_relation: "依赖智能体运行层与模型网关" },
    { infra_relation: "依赖数据检索层与安全治理层" },
    { infra_relation: "依赖安全治理层与推理网格" },
    { infra_relation: "依赖安全治理全栈能力" },
    { infra_relation: "依赖全栈基础设施能力" },
  ]);
  updateRows(db, "components_business_units", enUnits, [
    { infra_relation: "Depends on Inference Fabric and Model Gateway" },
    { infra_relation: "Depends on Agent Runtime and Data Retrieval Layer" },
    { infra_relation: "Depends on Inference Fabric and Security Governance Layer" },
    { infra_relation: "Depends on Inference Fabric and Global Distribution" },
    { infra_relation: "Depends on Agent Runtime and Model Gateway" },
    { infra_relation: "Depends on Data Retrieval Layer and Security Governance Layer" },
    { infra_relation: "Depends on Security Governance Layer and Inference Fabric" },
    { infra_relation: "Depends on the full-stack Security Governance Layer" },
    { infra_relation: "Depends on full-stack infrastructure capabilities" },
  ]);

  for (const unitId of zhUnits) {
    const sectionIds = componentIds(db, "components_business_units_cmps", unitId, "sections");
    if (sectionIds.length !== 3) throw new Error(`Business unit ${unitId} has ${sectionIds.length} sections, expected 3`);
    updateRows(db, "components_business_sections", [sectionIds[1], sectionIds[2]], [
      { heading: "典型应用场景" },
      { heading: "与 XMAX AI 基础设施关系" },
    ]);
  }
  for (const unitId of enUnits) {
    const sectionIds = componentIds(db, "components_business_units_cmps", unitId, "sections");
    if (sectionIds.length !== 3) throw new Error(`Business unit ${unitId} has ${sectionIds.length} sections, expected 3`);
    updateRows(db, "components_business_sections", [sectionIds[1], sectionIds[2]], [
      { heading: "Typical Application Scenarios" },
      { heading: "Relationship with XMAX AI Infrastructure" },
    ]);
  }
}

function repairAws(db) {
  const zhId = pageId(db, "aws_pages", "zh-Hans");
  const enId = pageId(db, "aws_pages", "en");

  updateByLocale(db, "aws_pages", "zh-Hans", {
    header_label: "AWS 基础设施",
    header_heading: "基于 AWS 全球基础设施构建 AI 推理服务能力",
    header_paragraph: "XMAX AI Inc 基于 AWS 全球基础设施构建可扩展的 AI 推理服务能力，支持跨区域部署、低时延响应、高可用运行及多行业场景复制。",
    quote_chinese: "XMAX AI Inc 基于 AWS 全球基础设施构建可扩展的 AI 推理服务能力，支持跨区域部署、低时延响应、高可用运行及多行业场景复制。",
  });
  updateByLocale(db, "aws_pages", "en", {
    header_label: "AWS Infrastructure",
    header_heading: "Building AI Inference Capabilities on AWS Global Infrastructure",
    header_paragraph: "XMAX AI Inc builds scalable AI inference services on AWS global infrastructure, supporting cross-region deployment, low-latency response, high availability, and multi-industry replication.",
    quote_chinese: "XMAX AI Inc builds scalable AI inference services on AWS global infrastructure, supporting cross-region deployment, low-latency response, high availability, and multi-industry replication.",
  });

  updateRows(db, "components_aws_narrative_points", componentIds(db, "aws_pages_cmps", zhId, "narrativePoints"), [
    { icon: "Cloud", title: "全球基础设施布局", description: "基于 AWS 全球 30+ 区域部署 AI 推理节点，实现就近服务与低时延响应" },
    { icon: "Cpu", title: "弹性计算与推理优化", description: "利用 AWS Graviton 与 GPU 实例实现弹性伸缩，支持高并发推理请求" },
    { icon: "Cloud", title: "安全治理与合规", description: "通过 AWS IAM、KMS、CloudTrail 构建全链路安全与合规体系" },
    { icon: "Orbit", title: "全球分发与低时延", description: "借助 AWS CloudFront 与 Global Accelerator 实现全球内容分发与边缘推理" },
  ]);
  updateRows(db, "components_aws_narrative_points", componentIds(db, "aws_pages_cmps", enId, "narrativePoints"), [
    { icon: "Cloud", title: "Global Infrastructure Deployment", description: "Deploys AI inference nodes across 30+ AWS global regions for proximity service and low-latency response" },
    { icon: "Cpu", title: "Elastic Compute and Inference Optimization", description: "Uses AWS Graviton and GPU instances for elastic scaling and high-concurrency inference requests" },
    { icon: "Cloud", title: "Security Governance and Compliance", description: "Builds full-chain security and compliance through AWS IAM, KMS, and CloudTrail" },
    { icon: "Orbit", title: "Global Distribution and Low Latency", description: "Enables global content delivery and edge inference through AWS CloudFront and Global Accelerator" },
  ]);

  updateRows(db, "components_aws_stat_items", componentIds(db, "aws_pages_cmps", zhId, "awsStats"), [
    { value: "39", label: "AWS 全球区域" },
    { value: "123", label: "可用区" },
    { value: "750+", label: "边缘节点" },
  ]);
  updateRows(db, "components_aws_stat_items", componentIds(db, "aws_pages_cmps", enId, "awsStats"), [
    { value: "39", label: "AWS Global Regions" },
    { value: "123", label: "Availability Zones" },
    { value: "750+", label: "Edge Locations" },
  ]);

  updateRows(db, "components_aws_core_messages", componentIds(db, "aws_pages_cmps", zhId, "coreMessages"), [
    { content: "基于 AWS 全球基础设施构建 AI 推理服务能力" },
    { content: "业务适配多区域部署、弹性伸缩与低时延推理" },
    { content: "在 AI 推理、模型服务、数据检索与安全治理领域形成平台能力" },
    { content: "多垂直行业场景，具备与 AWS 联合拓展机会" },
  ]);
  updateRows(db, "components_aws_core_messages", componentIds(db, "aws_pages_cmps", enId, "coreMessages"), [
    { content: "Building AI inference service capabilities on AWS global infrastructure" },
    { content: "Business-ready multi-region deployment, elastic scaling, and low-latency inference" },
    { content: "Platform capabilities spanning AI inference, model services, data retrieval, and security governance" },
    { content: "Multi-vertical industry scenarios with joint go-to-market opportunities with AWS" },
  ]);

  updateRows(db, "components_aws_capability_mappings", componentIds(db, "aws_pages_cmps", zhId, "capabilityMappings"), [
    { capability: "全球推理网关", description: "多区域部署、弹性计算、全球网络接入" },
    { capability: "模型与推理服务", description: "Amazon Bedrock、Amazon SageMaker AI、EC2 推理实例" },
    { capability: "高性能推理优化", description: "AWS Inferentia / Inferentia2、Neuron SDK" },
    { capability: "数据与检索层", description: "对象存储、数据湖、检索与向量扩展能力" },
    { capability: "安全治理层", description: "IAM、KMS、日志审计、网络隔离、策略管理" },
    { capability: "全球分发与低时延", description: "CloudFront、边缘节点、Local Zones、Wavelength" },
  ]);
  updateRows(db, "components_aws_capability_mappings", componentIds(db, "aws_pages_cmps", enId, "capabilityMappings"), [
    { capability: "Global Inference Gateway", description: "Multi-region deployment, elastic compute, and global network access" },
    { capability: "Model and Inference Services", description: "Amazon Bedrock, Amazon SageMaker AI, and EC2 inference instances" },
    { capability: "High-Performance Inference", description: "AWS Inferentia, Inferentia2, and Neuron SDK" },
    { capability: "Data and Retrieval Layer", description: "Object storage, data lakes, retrieval, and vector extension capabilities" },
    { capability: "Security Governance Layer", description: "IAM, KMS, log auditing, network isolation, and policy management" },
    { capability: "Global Distribution and Low Latency", description: "CloudFront, edge locations, Local Zones, and Wavelength" },
  ]);
}

function repairContact(db) {
  const zhId = pageId(db, "contact_pages", "zh-Hans");
  const enId = pageId(db, "contact_pages", "en");
  const registeredAddress = process.env.XMAX_REGISTERED_ADDRESS || "732 S 6TH ST, STE R Las Vegas, NV 89101";
  const phone = process.env.XMAX_CONTACT_PHONE || "+1(323)888-9999";
  const officialEmail = process.env.XMAX_OFFICIAL_EMAIL || "info@xmax.com";

  updateByLocale(db, "contact_pages", "zh-Hans", {
    header_label: "联系我们",
    header_heading: "联系我们",
    header_paragraph: "无论是商务合作、生态对接还是人才加入，我们都期待与您连接。",
    cta_heading: "与 XMAX AI 共建全球 AI 推理服务未来",
    cta_paragraph: "无论是商务合作、生态对接还是人才加入，我们都期待与您连接。",
  });
  updateByLocale(db, "contact_pages", "en", {
    header_label: "Contact",
    header_heading: "Contact Us",
    header_paragraph: "Whether for business partnerships, ecosystem collaboration, or talent opportunities, we look forward to connecting with you.",
    cta_heading: "Build the Future of Global AI Inference with XMAX AI",
    cta_paragraph: "Whether for business partnerships, ecosystem collaboration, or talent opportunities, we look forward to connecting with you.",
  });

  updateRows(db, "components_contact_points", componentIds(db, "contact_pages_cmps", zhId, "contactPoints"), [
    { icon: "Mail", title: "Official Contact", description: "General corporate and business inquiries", value: officialEmail },
    { icon: "MapPin", title: "Registered Office", description: "Nevada registered address", value: registeredAddress },
    { icon: "Phone", title: "Corporate Phone", description: "U.S. business line", value: phone },
  ]);
  updateRows(db, "components_contact_points", componentIds(db, "contact_pages_cmps", enId, "contactPoints"), [
    { icon: "Mail", title: "Official Contact", description: "General corporate and business inquiries", value: officialEmail },
    { icon: "MapPin", title: "Registered Office", description: "Nevada registered address", value: registeredAddress },
    { icon: "Phone", title: "Corporate Phone", description: "U.S. business line", value: phone },
  ]);
}

function repairSiteSettings(db) {
  const zhId = pageId(db, "site_settings", "zh-Hans");
  const enId = pageId(db, "site_settings", "en");

  updateByLocale(db, "site_settings", "zh-Hans", {
    company_name: "XMAX AI",
    tagline: "全球 AI 推理服务基础设施",
    footer_description: "XMAX AI Inc 是 XMAX 集团的 AI 能力平台与产业服务载体，统一推进平台能力、产品化输出与行业化落地。",
  });
  updateByLocale(db, "site_settings", "en", {
    company_name: "XMAX AI",
    tagline: "Global AI Inference Service Infrastructure",
    footer_description: "XMAX AI Inc is the AI platform and industry service carrier of XMAX Group, advancing platform capabilities, productized output, and industry implementation.",
  });

  const urls = ["/", "/about", "/infrastructure", "/products", "/business", "/aws", "/contact"];
  updateRows(db, "components_site_nav_items", componentIds(db, "site_settings_cmps", zhId, "navItems"), [
    "首页", "关于我们", "AI 基础设施", "AI 产品", "业务板块", "AWS 基础设施", "联系我们",
  ].map((label, index) => ({ label, url: urls[index] })));
  updateRows(db, "components_site_nav_items", componentIds(db, "site_settings_cmps", enId, "navItems"), [
    "Home", "About", "AI Infrastructure", "AI Products", "Business", "AWS Infrastructure", "Contact",
  ].map((label, index) => ({ label, url: urls[index] })));

  updateRows(db, "components_site_footer_link_groups", componentIds(db, "site_settings_cmps", zhId, "footerLinkGroups"), [
    { title: "公司" },
    { title: "业务" },
    { title: "资源" },
  ]);
  updateRows(db, "components_site_footer_link_groups", componentIds(db, "site_settings_cmps", enId, "footerLinkGroups"), [
    { title: "Company" },
    { title: "Business" },
    { title: "Resources" },
  ]);
}

function repairLegal(db) {
  const registeredAddress = process.env.XMAX_REGISTERED_ADDRESS || "732 S 6TH ST, STE R Las Vegas, NV 89101";
  const phone = process.env.XMAX_CONTACT_PHONE || "+1(323)888-9999";
  const legalEmail = process.env.XMAX_OFFICIAL_EMAIL || "info@xmax.com";
  const privacyContent = `Effective date: April 1, 2026\n\nScope\nThis Privacy Policy explains how XMax AI Inc. collects, uses, discloses, and protects information through ai.xmax.com and related enterprise services.\n\nInformation and use\nWe may collect contact, account, support, usage, diagnostic, device, log, security-review, and procurement-review information. We use it to provide and secure services, respond to inquiries, operate inference services, monitor reliability, prevent abuse, comply with law, and improve products. We do not use customer prompts or outputs to train general-purpose models unless authorized in writing.\n\nSharing and retention\nWe may share information with service providers, group companies, professional advisers, or authorities where required by law or necessary to protect rights and safety. We do not sell personal information and retain information only as needed for the stated purpose, legal obligations, dispute resolution, and security records.\n\nSecurity and international processing\nWe use access controls, logging, encryption where appropriate, and least-privilege operational practices. Services may process information in the United States and other approved locations; data residency and transfer requirements are reviewed during enterprise onboarding.\n\nRights and contact\nDepending on location, individuals may request access, correction, deletion, or restriction of processing by contacting ${legalEmail}. XMax AI Inc., ${registeredAddress}, ${phone}.`;
  const termsContent = `Effective date: April 1, 2026\n\nAgreement\nThese Terms govern access to ai.xmax.com and related services provided by XMax AI Inc. By using the services, you represent that you have authority to bind your organization.\n\nServices and acceptable use\nServices include enterprise AI inference, model access, routing, knowledge, agent, security, and related infrastructure services described in an order form. You may not violate law, infringe rights, evade sanctions or export controls, interfere with the service, bypass access controls, or submit data you are not authorized to process.\n\nExport and trade compliance\nEach party will comply with applicable export-control, sanctions, customs, and trade laws. Customers must provide accurate end-user, end-use, destination, and ownership information when requested. We may restrict a transaction or workload when required for compliance or risk management.\n\nIntellectual property and confidentiality\nEach party retains pre-existing intellectual property and will protect the other party's non-public information. XMax AI retains rights in its software, architecture, documentation, and improvements.\n\nFees, liability, and termination\nFees, usage measurements, support, and service levels are stated in the applicable service schedule. To the maximum extent permitted by law, XMax AI disclaims implied warranties and will not be liable for indirect or consequential damages. Either party may terminate for an uncured material breach.\n\nGoverning law and contact\nThese Terms are governed by Nevada law unless a signed enterprise agreement states otherwise. XMax AI Inc., ${registeredAddress}, ${legalEmail}, ${phone}.`;
  updateByLocale(db, "privacy_pages", "en", {
    title: "Privacy Policy",
    content: privacyContent,
  });
  updateByLocale(db, "terms_pages", "en", {
    title: "Terms of Service",
    content: termsContent,
  });
  updateByLocale(db, "enterprise_service_pages", "zh-Hans", {
    title: "企业服务",
    content: "XMax AI provides enterprise inference services through scoped deployment programs, governed model access, integration support, and operational review.",
  });
  updateByLocale(db, "enterprise_service_pages", "en", {
    title: "Enterprise Service",
    content: "XMax AI provides enterprise inference services through scoped deployment programs, governed model access, integration support, and operational review. Each program begins with workload discovery, data and access review, architecture validation, and a written operating plan.",
  });
  updateByLocale(db, "security_governance_pages", "zh-Hans", {
    title: "安全与治理",
    content: "XMax AI applies identity, access, logging, data handling, and export-compliance controls to enterprise AI workloads.",
  });
  updateByLocale(db, "security_governance_pages", "en", {
    title: "Security & Governance",
    content: "XMax AI applies identity, access, logging, data handling, and export-compliance controls to enterprise AI workloads. The operating model separates customer access, model policy, infrastructure operations, and deployment approvals, with audit logs, least-privilege access, security review, incident handling, and workload restrictions designed into the service layer.",
  });
}

function main() {
  const db = new Database(dbPath);
  const transaction = db.transaction(() => {
    repairHome(db);
    repairAbout(db);
    repairInfrastructure(db);
    repairProducts(db);
    repairBusiness(db);
    repairAws(db);
    repairContact(db);
    repairSiteSettings(db);
    repairLegal(db);
  });

  try {
    transaction();
    console.log("[repair:current-locales] Repaired zh-Hans/en visible content and restored business detail sections.");
  } finally {
    db.close();
  }
}

main();
