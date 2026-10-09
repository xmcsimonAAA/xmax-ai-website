import type { AboutPageData, BusinessPageData, BusinessUnit, HomePageData, StrapiLocale } from "@/lib/cms";

interface ApplicationCopy {
  title: string;
  subtitle: string;
  workflow: string;
  output: string;
  review: string;
  tags: string[];
}

interface ApplicationArea {
  id: string;
  fallbackAlias: string;
  en: ApplicationCopy;
  zh: ApplicationCopy;
}

export const APPLICATION_PAGE_COPY = {
  en: {
    label: "Applications",
    heading: "AI Application Areas",
    paragraph: "These application areas describe proposed AI workflows, their inputs, outputs, and human review boundaries. They are illustrative use cases, not a statement that XMAX AI operates separate business units or has deployed these workflows for customers.",
    overview: "Illustrative workflows for commerce, research, and enterprise operations, with defined inputs, outputs, and human review.",
    narrative: "XMAX AI Inc is the AI capability and industry service platform under XMAX Group. The application areas describe potential uses of AI inference, knowledge retrieval, and workflow orchestration; they do not establish a count of operating business units or completed deployments.",
    value: "Exploring industry workflows with defined data inputs, proposed AI outputs, and human review boundaries.",
    highlight: "Illustrative AI application areas, with workflow descriptions and human review boundaries",
    sectionHeadings: ["Workflow and data inputs", "Proposed AI outputs", "Human review and boundaries"],
  },
  zh: {
    label: "应用场景",
    heading: "AI 应用方向",
    paragraph: "以下应用方向说明拟议 AI 流程的输入、输出及人工审核边界。这些内容属于示例性应用场景，不代表 XMAX AI 已独立运营相应业务单元，也不代表已为客户完成相关部署。",
    overview: "面向商业、研究与企业运营的示例性流程，明确数据输入、AI 输出和人工审核边界。",
    narrative: "XMAX AI Inc 是 XMAX 集团的 AI 能力与产业服务平台。应用方向展示 AI 推理、知识检索和流程编排的潜在用途，不构成对已运营业务单元数量或已完成部署的声明。",
    value: "探索行业应用流程，明确数据输入、拟议 AI 输出和人工审核边界。",
    highlight: "示例性 AI 应用方向，逐项说明流程与人工审核边界",
    sectionHeadings: ["流程与数据输入", "拟议 AI 输出", "人工审核与应用边界"],
  },
};

export const APPLICATION_AREAS: ApplicationArea[] = [
  {
    id: "01", fallbackAlias: "XMax AI EC Pte. Ltd.",
    en: {
      title: "E-Commerce", subtitle: "Product content and customer-service assistance.",
      workflow: "A proposed workflow for retail and marketplace teams would use merchant-approved product catalogs, store policies, and customer questions as inputs, with personal customer information excluded or minimized.",
      output: "AI could draft product descriptions, retrieve relevant policy passages, and prepare suggested customer-service replies linked to their source material.",
      review: "Merchants would check product accuracy, prices, and promotional claims before publication. Customer-service staff would approve replies and retain responsibility for refunds, disputes, and other transaction decisions.",
      tags: ["Product content", "Policy retrieval", "Customer support"],
    },
    zh: {
      title: "电商", subtitle: "商品内容与客户服务辅助。",
      workflow: "面向零售与电商平台团队的拟议流程，以商家授权的商品目录、店铺政策和客户问题为输入，排除或尽量减少客户个人信息。",
      output: "AI 可起草商品描述、检索相关政策条款，并形成附带来源的客服答复建议。",
      review: "商家在发布前核对商品信息、价格和营销表述；客服人员审核答复，并继续负责退款、争议处理及其他交易决定。",
      tags: ["商品内容", "政策检索", "客服辅助"],
    },
  },
  {
    id: "02", fallbackAlias: "XMax AI IG Pte. Ltd.",
    en: {
      title: "Interactive Entertainment", subtitle: "Creative drafting and supervised character dialogue.",
      workflow: "A proposed workflow for game and digital-content teams would use licensed story material, character profiles, age-rating requirements, and creator-defined interaction rules as inputs.",
      output: "AI could draft dialogue, suggest narrative variations, and produce character responses within an approved fictional setting for editorial review or controlled testing.",
      review: "Creators would review originality, intellectual-property permissions, age suitability, and moderation behavior before release. Content approvals and user-safety decisions would remain with the responsible editorial and operations teams.",
      tags: ["Dialogue drafting", "Narrative variations", "Content review"],
    },
    zh: {
      title: "互娱", subtitle: "创作草稿与受监督的角色对话。",
      workflow: "面向游戏与数字内容团队的拟议流程，以已获授权的故事素材、角色设定、年龄分级要求和创作者指定的互动规则为输入。",
      output: "AI 可起草对话、提出叙事变体，并在批准的虚构设定内生成角色答复，供编辑审核或受控测试。",
      review: "创作者在发布前审查原创性、知识产权许可、年龄适宜性和内容审核行为；内容批准与用户安全决定仍由编辑和运营团队负责。",
      tags: ["对话草稿", "叙事变体", "内容审核"],
    },
  },
  {
    id: "03", fallbackAlias: "XMax AI SCM Pte. Ltd.",
    en: {
      title: "Supply Chain Services", subtitle: "Inventory analysis and exception-review support.",
      workflow: "A proposed workflow for inventory planners and logistics coordinators would combine authorized order histories, stock records, shipment milestones, and supplier lead-time data.",
      output: "AI could summarize demand patterns, flag inconsistent or delayed records, and draft replenishment or routing options with the assumptions used in each suggestion.",
      review: "Planners would validate data quality and operational constraints before acting. Purchase orders, dispatch instructions, and supplier commitments would require human approval rather than automatic execution by the model.",
      tags: ["Inventory analysis", "Exception review", "Planning support"],
    },
    zh: {
      title: "供应链服务", subtitle: "库存分析与异常研判辅助。",
      workflow: "面向库存规划与物流协调人员的拟议流程，结合经授权的历史订单、库存记录、运输节点和供应商交付周期数据。",
      output: "AI 可总结需求变化、标记记录不一致或延误情况，并提出注明假设条件的补货或路线方案草稿。",
      review: "规划人员采取行动前核对数据质量与运营约束；采购订单、调度指令和供应商承诺须经人工批准，不由模型自动执行。",
      tags: ["库存分析", "异常研判", "规划辅助"],
    },
  },
  {
    id: "04", fallbackAlias: "XMax AI SEIC Pte. Ltd.",
    en: {
      title: "Space Computing", subtitle: "Ground-based analysis of authorized remote-sensing data.",
      workflow: "An illustrative research workflow would use licensed satellite imagery, observation metadata, and simulation results supplied by authorized research teams, with processing performed in a ground-based environment.",
      output: "AI could identify candidate changes in imagery, organize observation records, and prepare annotated summaries for analysts to compare against source data.",
      review: "Researchers would validate findings and data-use permissions. This scenario does not claim deployed satellites, in-orbit computing nodes, spacecraft control, or an operational space network; any such project would need separate technical and authorization review.",
      tags: ["Remote-sensing data", "Ground analysis", "Research review"],
    },
    zh: {
      title: "太空计算", subtitle: "经授权遥感数据的地面分析。",
      workflow: "示例性研究流程以已获许可的卫星图像、观测元数据及授权研究团队提供的仿真结果为输入，在地面环境进行处理。",
      output: "AI 可标记图像中的候选变化、整理观测记录，并生成带注释的摘要，供分析人员对照原始数据核验。",
      review: "研究人员验证分析结论与数据使用许可。本场景不宣称已部署卫星、在轨计算节点、航天器控制系统或运营中的太空网络；此类项目须另行开展技术与授权审查。",
      tags: ["遥感数据", "地面分析", "研究审核"],
    },
  },
  {
    id: "05", fallbackAlias: "XMax AI Robotics Pte. Ltd.",
    en: {
      title: "Robotics", subtitle: "Simulation analysis and operator-reviewed task planning.",
      workflow: "A proposed workflow for robotics developers would use recorded sensor data, equipment manuals, and simulated task environments to examine perception results and planning options.",
      output: "AI could annotate observations, summarize test failures, and draft task sequences for evaluation in simulation or a controlled test setting.",
      review: "Qualified engineers would verify plans, enforce physical safety limits, and approve tests. Model suggestions would not directly authorize real-world motion or replace certified controllers, emergency stops, or operator supervision.",
      tags: ["Simulation", "Task planning", "Operator review"],
    },
    zh: {
      title: "机器人", subtitle: "仿真分析与操作人员审核的任务规划。",
      workflow: "面向机器人开发人员的拟议流程，以录制的传感器数据、设备手册和仿真任务环境为输入，分析感知结果与规划方案。",
      output: "AI 可标注观测结果、总结测试失败原因，并起草任务步骤，供仿真或受控测试环境评估。",
      review: "具备资质的工程人员验证方案、落实物理安全限制并批准测试。模型建议不直接授权现实中的机器人运动，也不替代经认证的控制器、急停装置和操作人员监督。",
      tags: ["仿真分析", "任务规划", "操作审核"],
    },
  },
  {
    id: "06", fallbackAlias: "XMax AI Novalife Pte. Ltd.",
    en: {
      title: "Life Sciences", subtitle: "Literature retrieval and research-document analysis.",
      workflow: "A proposed workflow for life-science researchers would use licensed scientific literature, approved research protocols, and non-identifiable research records, with access restricted to authorized users.",
      output: "AI could retrieve relevant passages, extract study methods and limitations, and draft source-linked comparisons or research summaries.",
      review: "Researchers would verify citations, interpretations, and scientific conclusions. This scenario is for research assistance, not clinical diagnosis, treatment selection, medical-device operation, or a claim of validated drug-discovery results.",
      tags: ["Literature retrieval", "Research summaries", "Source verification"],
    },
    zh: {
      title: "生命科学", subtitle: "文献检索与研究文档分析。",
      workflow: "面向生命科学研究人员的拟议流程，以已获许可的科学文献、批准的研究方案和不含可识别个人信息的研究记录为输入，仅向授权用户开放。",
      output: "AI 可检索相关段落、提取研究方法与局限，并起草附带来源的研究比较或摘要。",
      review: "研究人员核验引用、解释与科学结论。本场景仅用于研究辅助，不用于临床诊断、治疗选择或医疗器械操作，也不宣称已取得经验证的药物研发成果。",
      tags: ["文献检索", "研究摘要", "来源核验"],
    },
  },
  {
    id: "07", fallbackAlias: "XMax AI Fintech Pte. Ltd.",
    en: {
      title: "Finance", subtitle: "Internal document analysis and analyst-reviewed exceptions.",
      workflow: "A proposed workflow for finance operations and compliance analysts would use authorized internal policies, redacted account records, and transaction exception reports within role-based access controls.",
      output: "AI could summarize documents, retrieve relevant policy provisions, and prepare explanations of flagged records with references for analyst review.",
      review: "Authorized staff would verify results and make all consequential decisions. The scenario does not provide investment advice or authorize trading, lending, payments, or automated account restrictions, and does not claim regulated financial-service permissions.",
      tags: ["Document analysis", "Policy retrieval", "Analyst review"],
    },
    zh: {
      title: "金融", subtitle: "内部文档分析与分析人员审核的异常研判。",
      workflow: "面向金融运营与合规分析人员的拟议流程，在基于角色的访问控制下，使用经授权的内部政策、脱敏账户记录及交易异常报告。",
      output: "AI 可总结文档、检索相关政策条款，并形成带有来源的异常记录说明，供分析人员审核。",
      review: "授权人员核验结果并作出所有重要决定。本场景不提供投资建议，不授权交易、授信、支付或自动限制账户，也不宣称具备受监管金融服务许可。",
      tags: ["文档分析", "政策检索", "分析审核"],
    },
  },
  {
    id: "08", fallbackAlias: "XMax AI Security Pte. Ltd.",
    en: {
      title: "Security", subtitle: "Defensive log analysis and incident-triage assistance.",
      workflow: "A proposed workflow for authorized security operations teams would use logs from systems they manage, asset inventories, alert records, and approved incident-response procedures.",
      output: "AI could correlate related events, draft incident timelines, and suggest triage questions or response steps tied to documented procedures.",
      review: "Security analysts would validate alerts and authorize remediation. The model would not autonomously run offensive testing, disable accounts, or modify production systems; investigation and response actions would remain within the owner's authorization.",
      tags: ["Defensive monitoring", "Incident timelines", "Analyst approval"],
    },
    zh: {
      title: "安全", subtitle: "防御性日志分析与事件分诊辅助。",
      workflow: "面向经授权安全运营团队的拟议流程，以其管理系统的日志、资产清单、告警记录和已批准的事件响应流程为输入。",
      output: "AI 可关联相关事件、起草事件时间线，并根据已有流程提出分诊问题或响应步骤建议。",
      review: "安全分析人员验证告警并授权处置。模型不自主执行攻击性测试、停用账户或修改生产系统；调查与响应动作须在系统所有者授权范围内进行。",
      tags: ["防御监测", "事件时间线", "分析批准"],
    },
  },
  {
    id: "09", fallbackAlias: "XMax AI Enterprise Services Pte. Ltd.",
    en: {
      title: "Enterprise Services", subtitle: "Permission-aware knowledge retrieval and workflow drafting.",
      workflow: "A proposed workflow for employees and operations teams would use approved internal manuals, process documents, and knowledge-base records, with retrieval limited by each user's existing permissions.",
      output: "AI could answer internal questions with source references, summarize documents, and draft requests or workflow steps for the responsible team to review.",
      review: "Document owners would check accuracy and freshness. Approvals, employment decisions, financial commitments, and changes to enterprise systems would remain with authorized staff rather than being executed automatically by the assistant.",
      tags: ["Knowledge retrieval", "Workflow drafts", "Access permissions"],
    },
    zh: {
      title: "企业服务", subtitle: "遵循权限的知识检索与流程草稿。",
      workflow: "面向员工与运营团队的拟议流程，以已批准的内部手册、流程文档和知识库记录为输入，检索范围受每位用户已有权限限制。",
      output: "AI 可附带来源回答内部问题、总结文档，并起草申请或流程步骤，交由责任团队审核。",
      review: "文档负责人核对准确性与时效性。审批、人事决定、财务承诺和企业系统变更仍由授权人员负责，不由助手自动执行。",
      tags: ["知识检索", "流程草稿", "访问权限"],
    },
  },
];

function language(locale?: StrapiLocale) {
  return locale === "zh-Hans" ? "zh" : "en";
}

function hasUnitCount(value: string | null | undefined) {
  return /\b(?:9|nine)\s+(?:distinct\s+)?(?:business|operating)\s+(?:units?|segments?)\b|(?:9|九)\s*(?:大|个)?\s*(?:业务(?:板块|单元)|经营单元)/i.test(value || "");
}

function matchesArea(area: ApplicationArea, title: string) {
  return [area.en.title, area.zh.title].some((candidate) => candidate.toLowerCase() === title.trim().toLowerCase());
}

export function businessApplicationPage(data: BusinessPageData | null, locale?: StrapiLocale): BusinessPageData {
  const lang = language(locale);
  const page = APPLICATION_PAGE_COPY[lang];
  const businessUnits: BusinessUnit[] = APPLICATION_AREAS.map((area, index) => {
    const source = data?.businessUnits.find((unit) => matchesArea(area, unit.title));
    const copy = area[lang];
    const bodies = [copy.workflow, copy.output, copy.review];
    return {
      id: source?.id ?? -(index + 1),
      title: source?.title || copy.title,
      alias: source?.alias ?? area.fallbackAlias,
      subtitle: copy.subtitle,
      description: bodies.join(" "),
      tags: copy.tags.join(","),
      scenes: copy.output,
      infraRelation: copy.review,
      image: source?.image ?? null,
      sections: bodies.map((body, sectionIndex) => ({
        id: source?.sections[sectionIndex]?.id ?? -(index * 3 + sectionIndex + 1),
        image: source?.sections[sectionIndex]?.image ?? null,
        heading: page.sectionHeadings[sectionIndex],
        body,
      })),
    };
  });
  return {
    ...data,
    id: data?.id ?? 0,
    documentId: data?.documentId ?? "",
    headerImage: data?.headerImage ?? null,
    headerLabel: page.label,
    headerHeading: page.heading,
    headerParagraph: page.paragraph,
    businessUnits,
  };
}

export function homeApplicationCopy(data: HomePageData | null, locale?: StrapiLocale): HomePageData | null {
  if (!data) return null;
  const lang = language(locale);
  const page = APPLICATION_PAGE_COPY[lang];
  return {
    ...data,
    missionParagraph: hasUnitCount(data.missionParagraph) ? page.narrative : data.missionParagraph,
    heroSlides: data.heroSlides.map((slide) => {
      const area = APPLICATION_AREAS.find((candidate) => matchesArea(candidate, slide.title));
      return {
        ...slide,
        subtitle: area ? area[lang].workflow : hasUnitCount(slide.subtitle) ? page.overview : slide.subtitle,
        tags: area ? area[lang].tags.join(",") : slide.tags?.split(",").map((tag) => hasUnitCount(tag) ? page.heading : tag).join(",") ?? null,
      };
    }),
    navCards: data.navCards.map((card) => card.url === "/business" ? {
      ...card, title: page.heading, description: page.overview,
    } : card),
    stats: data.stats.filter((stat) => !(stat.value.trim() === "9" && /business\s+(?:units?|segments?)|业务(?:板块|单元)/i.test(stat.label))),
    ctaPrimaryButton: data.ctaPrimaryButton?.url === "/business" ? {
      ...data.ctaPrimaryButton, text: lang === "en" ? "Explore Applications" : "查看应用场景",
    } : data.ctaPrimaryButton,
  };
}

export function aboutApplicationCopy(data: AboutPageData | null, locale?: StrapiLocale): AboutPageData | null {
  if (!data) return null;
  const page = APPLICATION_PAGE_COPY[language(locale)];
  return {
    ...data,
    headerParagraph: hasUnitCount(data.headerParagraph) ? page.narrative : data.headerParagraph,
    narrativeParagraph: hasUnitCount(data.narrativeParagraph) ? page.narrative : data.narrativeParagraph,
    values: data.values.map((value) => hasUnitCount(value.description) ? { ...value, description: page.value } : value),
    highlights: data.highlights.map((highlight) => hasUnitCount(highlight.content) ? { ...highlight, content: page.highlight } : highlight),
  };
}
