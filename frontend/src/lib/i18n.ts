/**
 * i18n — 全站国际化翻译表
 * 所有页面的硬编码中文和对应的英文翻译
 * CMS 数据中的英文字段（如 enTitle/enDesc）在各自页面组件中处理
 * 日语(ja)、韩语(ko)、繁体中文(zh-Hant) 由 translate.js 自动翻译，不在此维护字典
 */

export type Lang = "zh" | "en";

type TranslationMap = Record<string, Record<Lang, string>>;

// ─── 通用 ──────────────────────────────────────────────
export const common: TranslationMap = {
  learnMore:    { zh: "了解更多", en: "Learn More" },
  contactUs:    { zh: "联系我们", en: "Contact Us" },
  viewDetails:  { zh: "查看详情", en: "View Details" },
  submit:       { zh: "提交咨询", en: "Submit Inquiry" },
  name:         { zh: "姓名", en: "Name" },
  email:        { zh: "邮箱", en: "Email" },
  inquiry:      { zh: "咨询内容", en: "Inquiry" },
};

// ─── 首页 ──────────────────────────────────────────────
export const home: TranslationMap = {
  heroTag:          { zh: "XMAX GROUP SYSTEM", en: "XMAX GROUP SYSTEM" },
  missionLabel:     { zh: "Our Mission", en: "Our Mission" },
  missionHeading:   { zh: "以可信、可扩展的 AI 推理服务基础设施，连接产业创新与社会需求", en: "Connecting industrial innovation and social needs through trusted, scalable AI inference infrastructure" },
  missionParagraph: { zh: "XMAX AI Inc 是 XMAX 集团的 AI 能力平台与产业服务载体，统一推进平台能力、产品化输出与行业化落地。", en: "XMAX AI Inc is the AI capability platform and industry service carrier of XMAX Group, unifying platform capabilities, product output, and industry-specific deployment." },
  viewBusiness:     { zh: "查看业务版图", en: "Explore Business" },
  contactEco:       { zh: "联系生态合作", en: "Partner With Us" },
  recentUpdates:    { zh: "最新动态", en: "Recent Updates" },
  ctaHeading:       { zh: "与 XMAX AI 共建全球 AI 推理服务未来", en: "Building the Future of Global AI Inference with XMAX AI" },
  ctaParagraph:     { zh: "无论是商务合作、生态对接还是人才加入，我们都期待与您连接。", en: "Whether it's business collaboration, ecosystem integration, or talent joining, we look forward to connecting with you." },
};

// ─── 关于页 ────────────────────────────────────────────
export const about: TranslationMap = {
  headerLabel:       { zh: "About Us", en: "About Us" },
  headerHeading:     { zh: "关于我们", en: "About XMAX AI" },
  headerParagraph:   { zh: "XMAX AI Inc 是 XMAX 集团的 AI 能力平台与产业服务载体，围绕全球 AI 推理服务基础设施，构建面向全社会的产业级 AI 能力平台，并通过 9 大业务板块进行行业化落地。", en: "XMAX AI Inc is the AI capability platform and industry service carrier of XMAX Group, building industry-grade AI capabilities for society through global AI inference infrastructure and 9 business units." },
  narrativeLabel:    { zh: "Our Narrative", en: "Our Narrative" },
  narrativeHeading:  { zh: "品牌叙事原则", en: "Brand Narrative Principles" },
  narrativeParagraph:{ zh: "官网整体叙事参考集团型科技公司的表达方式：先讲使命与定位，再讲核心能力平台，再讲业务板块与产品矩阵，最后讲技术底座、合作生态与联系入口。", en: "Our narrative follows a group-level tech company structure: mission & positioning first, then core platform capabilities, business units & product matrix, and finally technology infrastructure, partnerships, and contact." },
  groupLabel:        { zh: "Group Structure", en: "Group Structure" },
  groupHeading:      { zh: "集团与子公司网络", en: "Group & Subsidiary Network" },
  groupParagraph:    { zh: "XMAX AI Inc 在官网中展示组织结构与业务版图，以体现集团化经营与长期扩展能力。", en: "XMAX AI Inc presents its organizational structure and business landscape to reflect group-level operations and long-term expansion capabilities." },
  colBusiness:       { zh: "业务", en: "Business" },
  colLegalName:      { zh: "拟定公司名", en: "Legal Entity" },
  colAlias:          { zh: "别名", en: "Alias" },
  // Fallback values
  fbPositioningTitle:{ zh: "集团定位", en: "Group Positioning" },
  fbPositioningDesc: { zh: "XMAX AI Inc 是 XMAX 集团 AI 能力与产业服务的重要承载主体，统一推进平台能力、产品化输出与行业化落地。", en: "XMAX AI Inc is the key carrier of XMAX Group's AI capabilities and industry services, unifying platform capabilities, productization, and industry deployment." },
  fbMissionTitle:    { zh: "使命", en: "Mission" },
  fbMissionDesc:     { zh: "以可信、可扩展的 AI 推理服务基础设施连接产业创新与社会需求。", en: "Connecting industrial innovation and social needs through trusted, scalable AI inference infrastructure." },
  fbAudienceTitle:   { zh: "服务对象", en: "Who We Serve" },
  fbAudienceDesc:    { zh: "客户、合作伙伴、AWS 生态团队、投资机构与全球化人才。", en: "Customers, partners, AWS ecosystem teams, investors, and global talent." },
};

// ─── 基础设施页 ────────────────────────────────────────
export const infra: TranslationMap = {
  headerLabel:       { zh: "AI Infrastructure", en: "AI Infrastructure" },
  headerHeading:     { zh: "全球 AI 推理服务基础设施", en: "Global AI Inference Service Infrastructure" },
  headerParagraph:   { zh: "XMAX AI Inc 的核心不是单一模型或单一应用，而是统一推理服务、模型治理、智能体运行、数据检索与安全控制面构成的平台化基础设施。", en: "XMAX AI Inc's core is not a single model or application, but a platform infrastructure composed of unified inference services, model governance, agent runtime, data retrieval, and security control plane." },
  keyPrincipleHeading:   { zh: "不强调「单模型」—— 强调「统一推理服务能力」", en: "Not a Single Model — Unified Inference Service Capability" },
  keyPrincipleParagraph: { zh: "强调跨场景、跨区域、跨业务板块复用，形成平台化基础设施。", en: "Emphasizing cross-scenario, cross-region, cross-business-unit reuse to form a platform infrastructure." },
};

// ─── 产品页 ────────────────────────────────────────────
export const products: TranslationMap = {
  headerLabel:       { zh: "AI Products", en: "AI Products" },
  headerHeading:     { zh: "AI 产品矩阵", en: "AI Product Matrix" },
  headerParagraph:   { zh: "向外部展示可被采购、集成、合作的产品化能力。以下产品名称为展示性命名，正式上线时可替换为真实产品名称。", en: "Showcasing product capabilities available for procurement, integration, and partnership. Product names are illustrative and may be updated upon official launch." },
};

// ─── 业务页 ────────────────────────────────────────────
export const business: TranslationMap = {
  headerLabel:       { zh: "Business Units", en: "Business Units" },
  headerHeading:     { zh: "9 大业务板块", en: "9 Business Units" },
  headerParagraph:   { zh: "平台能力通过 9 个明确业务板块形成行业化落地网络。每个板块都与统一 AI 基础设施连接，并承担不同产业场景中的服务角色。", en: "Platform capabilities are deployed through 9 distinct business units. Each unit connects to unified AI infrastructure and serves a different industry scenario." },
  coreCapabilities:  { zh: "核心能力", en: "Core Capabilities" },
  typicalScenarios:  { zh: "典型场景", en: "Typical Scenarios" },
  infraRelation:     { zh: "基础设施关系", en: "Infrastructure" },
  scenes:            { zh: "应用场景", en: "Application Scenarios" },
  collapseDetails:   { zh: "收起详情", en: "Less Details" },
};

// ─── AWS 页 ────────────────────────────────────────────
export const aws: TranslationMap = {
  headerLabel:         { zh: "AWS Infrastructure", en: "AWS Infrastructure" },
  headerHeading:       { zh: "AWS 基础设施", en: "AWS Infrastructure" },
  headerParagraph:     { zh: "XMAX AI Inc 基于 AWS 全球基础设施构建可扩展的 AI 推理服务能力，支持跨区域部署、低时延响应、高可用运行及多行业场景复制。", en: "XMAX AI Inc builds scalable AI inference capabilities on AWS global infrastructure, supporting cross-region deployment, low-latency response, high availability, and multi-industry scenario replication." },
  narrativeSection:    { zh: "全球基础设施叙事", en: "Global Infrastructure Narrative" },
  capabilityMapping:   { zh: "平台能力映射", en: "Capability Mapping" },
  capabilityDesc:      { zh: "XMAX AI 的平台能力与 AWS 服务的对应关系。", en: "How XMAX AI platform capabilities map to AWS services." },
  quoteChinese:        { zh: "XMAX AI Inc 基于 AWS 全球基础设施构建可扩展的 AI 推理服务能力，支持跨区域部署、低时延响应、高可用运行及多行业场景复制。", en: "" },
};

// ─── 联系页 ────────────────────────────────────────────
export const contact: TranslationMap = {
  headerLabel:       { zh: "Contact Us", en: "Contact Us" },
  headerHeading:     { zh: "联系我们", en: "Get in Touch" },
  headerParagraph:   { zh: "无论是商务合作、AWS 生态对接、投资咨询还是人才合作，我们都期待与您连接。", en: "Whether it's business collaboration, AWS ecosystem integration, investment inquiries, or talent opportunities, we look forward to connecting with you." },
  ctaHeading:        { zh: "让官网成为商务合作与集团介绍的统一入口", en: "Your Gateway to Business Collaboration & Corporate Overview" },
  ctaParagraph:      { zh: "当前版本已具备正式企业官网首页的核心结构，适合多种对外场景。", en: "The current version features the core structure of a professional corporate website, suitable for various external-facing scenarios." },
  sendInquiry:       { zh: "发送咨询", en: "Send Inquiry" },
  suggestionsLabel:  { zh: "建议正式上线前补充", en: "Suggested additions before official launch" },
};

export const news: TranslationMap = {
  label:        { zh: "企业新闻", en: "Company News" },
  heading:      { zh: "最新动态", en: "Latest Updates" },
  empty:        { zh: "暂无新闻", en: "No news yet" },
};

// ─── 导航下拉菜单 ──────────────────────────────────────
export const navDropdown: Record<string, TranslationMap> = {
  about: {
    positioning:  { zh: "公司定位", en: "Company Positioning" },
    vision:       { zh: "使命与愿景", en: "Mission & Vision" },
    positioningDesc: { zh: "XMAX AI Inc 的企业定位与战略方向", en: "XMAX AI Inc's positioning and strategic direction" },
    visionDesc:      { zh: "构建全球 AI 推理服务基础设施", en: "Building global AI inference infrastructure" },
  },
  products: {
    inferenceGrid:    { zh: "分布式推理计算网络", en: "Distributed inference compute network" },
    modelGateway:     { zh: "统一模型接入与路由网关", en: "Unified model access and routing gateway" },
    agentStudio:      { zh: "智能体开发与编排平台", en: "Agent development and orchestration platform" },
    knowledgeEngine:  { zh: "企业知识库与向量检索", en: "Enterprise knowledge base and vector retrieval" },
    securityMesh:     { zh: "AI 安全与合规防护网", en: "AI security and compliance mesh" },
  },
  business: {
    ecommerce:   { zh: "AI 驱动的电商解决方案", en: "AI-powered e-commerce solutions" },
    entertainment:{ zh: "数字娱乐与内容生成", en: "Digital entertainment & content generation" },
    supplyChain:  { zh: "智能物流与供应链优化", en: "Intelligent logistics & supply chain optimization" },
    space:        { zh: "太空边缘 AI 推理节点", en: "Space edge AI inference nodes" },
    robotics:     { zh: "具身智能与机器人系统", en: "Embodied intelligence & robotics systems" },
    lifeSciences: { zh: "AI 辅助药物研发与诊断", en: "AI-assisted drug discovery & diagnostics" },
    fintech:      { zh: "智能风控与量化交易", en: "Intelligent risk control & quantitative trading" },
    security:     { zh: "网络安全与数据保护", en: "Cybersecurity & data protection" },
    enterprise:   { zh: "企业级 AI 中台服务", en: "Enterprise AI middle platform services" },
  },
};

// ─── Footer ────────────────────────────────────────────
export const footer: TranslationMap = {
  groupSubsidiary:  { zh: "集团与子公司", en: "Group & Subsidiaries" },
  nineUnits:        { zh: "9 大业务板块", en: "9 Business Units" },
  enterpriseService:{ zh: "企业服务", en: "Enterprise Services" },
  securityGovernance:{ zh: "安全与治理", en: "Security & Governance" },
};

// ─── Helper ────────────────────────────────────────────
export function t(map: TranslationMap, key: string, lang: Lang): string {
  return map[key]?.[lang] ?? map[key]?.zh ?? map[key]?.en ?? key;
}
