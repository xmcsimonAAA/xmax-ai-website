const TRANS_MAP: Record<string, string> = {
  "9 大业务板块": "9 Business Segments",
  "9 大业务板块覆盖电商、互娱、金融、生命科学等行业": "Nine business segments covering e-commerce, entertainment, finance, life sciences, and more",
  "9 大业务板块覆盖电商、互娱、金融、生命科学等领域": "Nine business segments covering e-commerce, entertainment, finance, life sciences, and more",
  "AI 中台": "AI Middleware",
  "AI 产品与服务": "AI Products & Services",
  "AI 基础设施": "AI Infrastructure",
  "AI 药物发现": "AI Drug Discovery",
  "AI 辅助药物研发与诊断": "AI-Assisted Drug Discovery & Diagnostics",
  "AI 驱动的企业平台与咨询": "AI-Powered Enterprise Platform & Consulting",
  "AI 驱动的电商解决方案": "AI-Driven E-Commerce Solutions",
  "AIGC 内容生成": "AIGC Content Generation",
  "AIGC 内容生成 + 数字角色智能，重塑沉浸式娱乐体验": "AIGC content generation + digital character intelligence, reshaping immersive entertainment experiences",
  "AIGC内容生成": "AIGC Content Generation",
  "API 治理": "API Governance",
  "AWS IAM + KMS + CloudTrail + WAF 构建全链路安全": "AWS IAM + KMS + CloudTrail + WAF for full-chain security",
  "AWS Inferentia + Graviton 实现低成本高性能推理": "AWS Inferentia + Graviton for cost-efficient high-performance inference",
  "AWS 全球区域": "AWS Global Regions",
  "AWS 基础架构": "AWS Infrastructure",
  "AWS 基础设施": "AWS Infrastructure",
  "Amazon API Gateway + CloudFront 构建全球统一推理接入点": "Global API Gateway + CloudFront for unified inference access points",
  "Amazon Bedrock、Amazon SageMaker AI、EC2 推理实例": "Amazon Bedrock, Amazon SageMaker AI, EC2 Inference Instances",
  "Amazon OpenSearch + RDS + S3 构建多模态数据检索": "Amazon OpenSearch + RDS + S3 for multimodal data retrieval",
  "Amazon SageMaker + EKS 承载模型训练与推理服务": "Amazon SageMaker + EKS for model training and inference services",
  "CloudFront + Global Accelerator + Lambda@Edge": "CloudFront + Global Accelerator + Lambda@Edge",
  "CloudFront、边缘节点、Local Zones、Wavelength": "CloudFront, Edge Locations, Local Zones, Wavelength",
  "IAM、KMS、日志审计、网络隔离、策略管理": "IAM, KMS, Log Auditing, Network Isolation, Policy Management",
  "NPC 智能": "NPC Intelligence",
  "RAG": "RAG",
  "XMAX AI Agent OS 正式发布": "XMAX AI Agent OS Officially Launched",
  "XMAX AI Inc 依托 XMAX 集团体系，面向全球构建可扩展、可治理、可落地的 AI 推理服务平台": "Under the XMAX Group system, XMAX AI Inc builds scalable, governable, and deployable AI inference platforms for global markets.",
  "XMAX AI Inc 依托 XMAX 集团，通过 9 大业务板块将可扩展、可治理的 AI 推理服务落地于商业与社会场景": "Leveraging the XMAX Group ecosystem, XMAX AI Inc deploys scalable and governable AI inference services across 9 business segments for commercial and societal applications.",
  "XMAX AI Inc 基于 AWS 全球基础设施构建可扩展的 AI 推理服务能力，支持跨区域部署、低时延响应、高可用运行及多行业场景复制。": "XMAX AI Inc builds scalable AI inference service capabilities on AWS global infrastructure, supporting cross-region deployment, low-latency response, high-availability operation, and multi-industry scenario replication.",
  "XMAX AI Inc 通过统一的 AI 基础设施，连接产业 AI 创新与现实世界应用": "XMAX AI Inc bridges industrial AI innovation with real-world deployment through unified infrastructure.",
  "XMAX AI 与 AWS 深化全球合作伙伴关系": "XMAX AI & AWS Deepen Global Partnership",
  "XMAX AI 完成新一轮战略融资": "XMAX AI Completes New Strategic Investment Round",
  "XMAX 互娱": "XMAX Entertainment",
  "XMAX 企业服务": "XMAX Enterprise Services",
  "XMAX 供应链": "XMAX Supply Chain",
  "XMAX 太空": "XMAX Space",
  "XMAX 安全": "XMAX Security",
  "XMAX 机器人": "XMAX Robotics",
  "XMAX 生命科学": "XMAX Life Sciences",
  "XMAX 电商": "XMAX E-Commerce",
  "XMAX 金融": "XMAX Finance",
  "XMAX 集团体系": "XMAX Group",
  "与 XMAX AI 基础设施关系": "Relationship with XMAX AI Infrastructure",
  "专业知识检索": "Professional Knowledge Retrieval",
  "业务场景": "Business Scenarios",
  "业务板块": "Business",
  "业务版图": "Business Landscape",
  "业务适配多区域部署、弹性伸缩与低时延推理": "Business-ready multi-region deployment, elastic scaling, and low-latency inference",
  "个性化推荐": "Personalized Recommendation",
  "临床优化": "Clinical Optimization",
  "临床试验患者匹配": "Clinical Trial Patient Matching",
  "为医药研发与临床诊断提供 AI 辅助分析、药物分子设计、临床试验优化与医学影像识别。": "Providing AI-assisted analysis, drug molecular design, clinical trial optimization, and medical image recognition for pharmaceutical R&D and clinical diagnostics.",
  "为大型企业提供私有化 AI 中台部署、模型微调、知识库构建与智能办公自动化服务。": "Providing private AI middleware deployment, model fine-tuning, knowledge base construction, and intelligent office automation services for large enterprises.",
  "为工业机器人、服务机器人与自动驾驶提供 AI 推理能力，实现感知、决策与控制的智能化。": "Providing AI inference capabilities for industrial robots, service robots, and autonomous driving, enabling intelligent perception, decision-making, and control.",
  "为政府与企业提供网络安全监测、数据隐私保护、威胁情报分析与安全运营自动化。": "Providing network security monitoring, data privacy protection, threat intelligence analysis, and security operations automation for governments and enterprises.",
  "为游戏、影视、音乐等互娱场景提供 AI 内容生成、NPC 智能交互、实时渲染与个性化推荐服务。": "Providing AI content generation, NPC intelligent interaction, real-time rendering, and personalized recommendation services for gaming, film, music, and other entertainment scenarios.",
  "为物流与供应链企业提供需求预测、库存优化、路径规划与履约调度等 AI 推理服务。": "Providing AI inference services for logistics and supply chain enterprises including demand forecasting, inventory optimization, route planning, and fulfillment scheduling.",
  "为航天与边缘计算场景提供低时延 AI 推理、遥测数据分析与太空任务智能支持。": "Providing low-latency AI inference, telemetry data analysis, and intelligent support for space missions in aerospace and edge computing scenarios.",
  "为金融机构提供实时风控、智能投顾、反欺诈与量化交易等 AI 推理服务。": "Providing AI inference services for financial institutions including real-time risk control, intelligent advisory, anti-fraud, and quantitative trading.",
  "主动防御": "Proactive Defense",
  "互动引擎": "Interactive Engine",
  "互娱": "Interactive Entertainment",
  "互娱板块依托 XMAX AI 的低时延推理能力与智能体运行层，支撑高互动密度场景下的稳定响应与多模态内容生成。": "The Entertainment segment leverages XMAX AI's low-latency inference capabilities and agent runtime layer to support stable responses and multimodal content generation in high-interaction-density scenarios.",
  "交易转化优化": "Transaction Conversion Optimization",
  "产品发布": "Product Launch",
  "产品矩阵": "Products",
  "人才": "Talent",
  "人才加入": "Talent Recruitment",
  "人机协同": "Human-Machine Collaboration",
  "仓储自动化管理": "Warehouse Automation Management",
  "任务自动化": "Task Automation",
  "任务规划": "Task Planning",
  "任务链": "Task Chains",
  "企业推理服务": "Enterprise Inference Service",
  "企业推理服务,行业模型部署,多区域推理": "Enterprise inference, industry model deployment, multi-region inference",
  "企业服务": "Enterprise Services",
  "企业服务板块高度复用 XMAX AI 的智能体运行层、知识引擎与模型网关能力，是平台型能力最直接的企业化输出场景之一。": "The Enterprise Services segment heavily reuses XMAX AI's agent runtime layer, knowledge engine, and model gateway capabilities, representing one of the most direct enterprise outputs of platform capabilities.",
  "企业知识库与问答系统": "Enterprise Knowledge Base & Q&A System",
  "企业知识库构建": "Enterprise Knowledge Base Construction",
  "企业知识管理": "Enterprise Knowledge Management",
  "企业级 AI 中台服务": "Enterprise AI Middleware Services",
  "供应链服务": "Supply Chain Services",
  "供应链服务板块复用 XMAX AI 的数据检索层、实时推理能力与工作流编排能力，支撑跨系统、跨角色的流程协同。": "The Supply Chain segment reuses XMAX AI's data retrieval layer, real-time inference capabilities, and workflow orchestration to support cross-system, cross-role process collaboration.",
  "供应链板块深度复用 XMAX AI 的数据检索层、推理网格与智能体运行层，支撑跨企业、跨系统的智能协同与履约。": "The Supply Chain segment deeply reuses XMAX AI's data retrieval layer, inference fabric, and agent runtime layer to support intelligent collaboration and fulfillment across enterprises and systems.",
  "供应链预测": "Supply Chain Forecasting",
  "保险智能核保": "Insurance Intelligent Underwriting",
  "信贷风险评估": "Credit Risk Assessment",
  "借助 AWS CloudFront 与 Global Accelerator 实现全球内容分发与边缘推理": "Global content distribution and edge inference through AWS CloudFront and Global Accelerator",
  "全球 AI 推理": "Global AI Inference",
  "全球 AI 推理服务基础设施构建者": "Builder of Global AI Inference Service Infrastructure",
  "全球分发": "Global Distribution",
  "全球分发与低时延": "Global Distribution & Low Latency",
  "全球办公地点": "Global Office Locations",
  "全球办公室": "Global Offices",
  "全球基础设施布局": "Global Infrastructure Deployment",
  "全球推理网关": "Global Inference Gateway",
  "全球部署区域": "Global Deployment Regions",
  "公司新闻": "Company News",
  "关于我们": "About",
  "关注我们": "Follow Us",
  "具身智能": "Embodied Intelligence",
  "具身智能与机器人系统": "Embodied Intelligence & Robotic Systems",
  "典型使用场景": "Typical Use Cases",
  "典型应用场景": "Typical Application Scenarios",
  "内容安全": "Content Safety",
  "内容生成": "Content Generation",
  "内容运营分析": "Content Operations Analysis",
  "内置工具调用、记忆管理与上下文保持能力": "Built-in tool calling, memory management, and context retention capabilities",
  "内置数据脱敏、模型安全检测与行为审计功能": "Built-in data masking, model security detection, and behavior auditing",
  "内置模型性能监控与自动降级机制，保障服务稳定性": "Built-in model performance monitoring and automatic degradation for service reliability",
  "内部审批、运营与协作流程自动化": "Internal Approval, Operations & Collaboration Process Automation",
  "内部流程自动化与运营协同": "Internal Process Automation & Operations Collaboration",
  "决策支持": "Decision Support",
  "决策规划": "Decision Planning",
  "决策辅助": "Decision Support",
  "分子设计": "Molecular Design",
  "分布式推理计算层": "Distributed Inference Computing Layer",
  "利用 AWS Graviton 与 GPU 实例实现弹性伸缩，支持高并发推理请求": "Elastic compute and inference optimization leveraging AWS Graviton and GPU instances for high-concurrency inference",
  "前沿场景探索": "Frontier Scenario Exploration",
  "办公": "Office",
  "加入": "Join",
  "加入 XMAX AI 团队": "Join the XMAX AI Team",
  "动态定价": "Dynamic Pricing",
  "医学影像智能分析": "Medical Image Intelligent Analysis",
  "卫星遥感实时分析": "Satellite Remote Sensing Real-Time Analysis",
  "反欺诈": "Anti-Fraud",
  "可信": "Trusted",
  "可扩展": "Scalable",
  "可用区": "Availability Zones",
  "可落地": "Deployable",
  "合作动态": "Partnership Updates",
  "合规治理": "Compliance Governance",
  "员工助手、管理驾驶舱与智能分析支持": "Employee Assistant, Management Dashboard & Intelligent Analysis Support",
  "商务合作": "Business Partnership",
  "商务合作与生态对接": "Business Partnership & Ecosystem Integration",
  "商品内容生成": "Product Content Generation",
  "商品标题、卖点、详情页与营销素材生成": "Product Title, Selling Points, Detail Pages & Marketing Material Generation",
  "在 AI 推理、模型服务、数据检索与安全治理领域形成平台能力": "Platform capabilities spanning AI inference, model services, data retrieval, and security governance",
  "在 XMAX 集团体系下，通过 9 大业务板块服务全社会": "Under the XMAX Group system, serving society through 9 business segments with unified AI infrastructure",
  "在卫星与太空站部署边缘 AI 推理节点，支持遥感数据分析、太空通信优化与在轨智能决策。": "Deploying edge AI inference nodes on satellites and space stations, supporting remote sensing data analysis, space communication optimization, and on-orbit intelligent decision-making.",
  "在探索 AI 推理服务落地时，建议从具体业务场景出发，明确推理需求与数据基础。": "When exploring AI inference service deployment, we recommend starting from specific business scenarios and clarifying inference needs and data foundations.",
  "在轨决策": "On-Orbit Decision-Making",
  "在轨设备自主运维": "On-Orbit Equipment Autonomous Operations",
  "地点": "Locations",
  "基于 AWS 全球 30+ 区域部署 AI 推理节点，实现就近服务与低时延响应": "Global infrastructure deployment through 30+ AWS regions enabling localized service and low-latency response",
  "基于 AWS 全球云基础设施构建 AI 推理、模型服务与数据安全能力": "Building AI inference, model service, and data security capabilities on AWS global cloud infrastructure",
  "基于 AWS 全球基础设施构建 AI 推理服务能力": "Building AI inference service capabilities on AWS global infrastructure",
  "基于 AWS 全球基础设施构建安全、合规、可审计的 AI 推理服务体系": "Relying on AWS global infrastructure to build secure, compliant, and auditable AI inference services",
  "基于 AWS 全球基础设施的云原生架构": "Cloud-Native Architecture Powered by AWS Global Infrastructure",
  "基因组学": "Genomics",
  "复杂数据理解与知识提取": "Complex Data Understanding & Knowledge Extraction",
  "多 Region 部署、弹性计算、全球网络接入": "Multi-Region Deployment, Elastic Compute, Global Network Access",
  "多区域推理": "Multi-Region Inference",
  "多垂直行业场景，具备与 AWS 联合拓展机会": "Multi-vertical industry scenarios with joint go-to-market opportunities with AWS",
  "多机协同": "Multi-Machine Collaboration",
  "多轮对话": "Multi-Turn Dialogue",
  "太空板块利用 XMAX AI 的全球基础设施与弹性推理能力，支撑航天与边缘计算场景下的低时延 AI 服务。": "The Space segment leverages XMAX AI's global infrastructure and elastic inference capabilities to support low-latency AI services in aerospace and edge computing scenarios.",
  "太空计算": "Space Computing",
  "太空计算板块承接 XMAX AI 在全球基础设施、弹性推理与分布式协同方面的能力积累，用于探索未来型 AI 基础设施场景。": "The Space Computing segment leverages XMAX AI's capabilities in global infrastructure, elastic inference, and distributed collaboration to explore future AI infrastructure scenarios.",
  "太空边缘 AI 推理节点": "Space Edge AI Inference Nodes",
  "太空通信智能优化": "Space Communication Intelligent Optimization",
  "威胁检测": "Threat Detection",
  "安全": "Security",
  "安全与合规控制面": "Security & Compliance Control Plane",
  "安全事件监测与风险识别": "Security Event Monitoring & Risk Identification",
  "安全合规": "Security Compliance",
  "安全审计": "Security Auditing",
  "安全审计,访问控制,合规治理": "Security auditing, access control, compliance governance",
  "安全态势感知": "Security Situation Awareness",
  "安全板块是 XMAX AI 安全治理层的重要延伸，直接受益于统一的访问控制、日志审计、策略管理与推理护栏能力。": "The Security segment is an important extension of XMAX AI's security governance layer, directly benefiting from unified access control, log auditing, policy management, and inference guardrail capabilities.",
  "安全治理": "Security & Governance",
  "安全治理与合规": "Security & Governance",
  "安全治理层": "Security Governance Layer",
  "安全监测": "Security Monitoring",
  "安全运营中的辅助研判与响应支持": "Assisted Analysis & Response Support in Security Operations",
  "实时响应": "Real-time Response",
  "实时渲染": "Real-time Rendering",
  "实时风控": "Real-time Risk Control",
  "审计": "Auditing",
  "审计与日志分析": "Auditing & Log Analysis",
  "审计与治理": "Auditing & Governance",
  "审计日志": "Audit Logs",
  "审计追踪": "Audit Tracking",
  "客服自动化": "Customer Service Automation",
  "对象存储、数据湖、检索与向量扩展能力": "Object Storage, Data Lakes, Retrieval & Vector Extension Capabilities",
  "将 AI 推理能力应用于药物分子设计、临床试验优化与医学影像诊断，加速生命科学创新。": "Applying AI inference capabilities to drug molecular design, clinical trial optimization, and medical image diagnosis to accelerate life science innovation.",
  "履约协同": "Fulfillment Collaboration",
  "履约调度": "Fulfillment Scheduling",
  "工业或半工业环境下的辅助自动化": "Assisted Automation in Industrial or Semi-Industrial Environments",
  "工业机器人智能作业": "Industrial Robot Intelligent Operations",
  "工作流编排": "Workflow Orchestration",
  "工具调用": "Tool Calling",
  "库存优化": "Inventory Optimization",
  "库存管理": "Inventory Management",
  "异常监测与供应链风险预警": "Anomaly Detection & Supply Chain Risk Early Warning",
  "弹性扩容": "Elastic Scaling",
  "弹性计算与推理优化": "Elastic Compute & Inference Optimization",
  "影像诊断": "Medical Image Diagnosis",
  "影视内容智能制作": "Intelligent Film & TV Content Production",
  "快速链接": "Quick Links",
  "您可以通过以下方式联系 XMAX AI，我们期待与您共创未来。": "You can contact XMAX AI through the following channels. We look forward to co-creating the future with you.",
  "感知决策": "Perception & Decision",
  "我们的团队将在 2 个工作日内回复": "Our team will respond within 2 business days",
  "我们的建议": "Our Suggestions",
  "执行控制": "Execution Control",
  "技术合作与集成方案": "Technical Partnership & Integration Solutions",
  "投资与战略咨询": "Investment & Strategic Consulting",
  "护栏策略": "Guardrail Policies",
  "探索高性能算力、边缘连接与未来计算场景": "Exploring high-performance computing, edge connectivity, and future computing scenarios",
  "推理网格": "Inference Fabric",
  "推理需求": "Inference Requirements",
  "推进感知、决策与执行一体化智能系统": "Advancing integrated intelligent systems for perception, decision-making, and execution",
  "描述您感兴趣的合作方向": "Describe your partnership interests",
  "提供 AI 驱动的威胁检测、漏洞分析与数据安全保护服务，构建主动防御体系。": "Providing AI-driven threat detection, vulnerability analysis, and data security protection services to build a proactive defense system.",
  "提供全栈安全能力，覆盖 IAM、内容安全、审计日志与护栏策略，保障 AI 服务的合规运行。": "Full-stack security covering IAM, content safety, audit logging, and guardrail policies for compliant AI service operations.",
  "提供全链路安全监控、合规审计与访问控制能力，满足企业级安全要求": "Provides full-chain security monitoring, compliance auditing, and access control meeting enterprise requirements",
  "提供可视化智能体编排能力，支持工具调用、多轮对话与任务链构建，加速行业智能体落地。": "Visual agent orchestration with tool calling, multi-turn dialogue, and task chains to accelerate industry agent deployment.",
  "提供安全隔离的智能体运行环境，支持多智能体协作与任务编排": "Provides a secure, isolated agent runtime environment supporting multi-agent collaboration and task orchestration",
  "提供标准化模型接入、版本管理与路由分发能力，支持多模型并行推理": "Provides standardized model access, version management, and routing capabilities supporting multi-model parallel inference",
  "提供统一推理 API，支持多模型接入、弹性扩容与跨区域服务路由，满足企业级推理需求。": "Provides a unified inference API supporting multi-model access, elastic scaling, and cross-region service routing for enterprise-grade inference needs.",
  "支持 GPU/TPU 异构计算资源调度，实现毫秒级推理响应": "Supports heterogeneous GPU/TPU resource scheduling for millisecond-level inference response",
  "支持 RAG 增强生成、实时数据同步与隐私保护检索": "Supports RAG augmented generation, real-time data sync, and privacy-preserving retrieval",
  "支持跨区域、跨业务板块的弹性扩展与统一调度": "Supporting cross-region, cross-business-segment elastic scaling and unified orchestration",
  "数字娱乐与内容生成": "Digital Entertainment & Content Generation",
  "数字孪生": "Digital Twin",
  "数字角色对话与陪伴式交互": "Digital Character Dialogue & Companion Interaction",
  "数字角色智能": "Digital Character Intelligence",
  "数据与检索层": "Data & Retrieval Layer",
  "数据与知识检索": "Data & Knowledge Retrieval",
  "数据保护": "Data Protection",
  "数据基础": "Data Foundation",
  "数据检索层": "Data & Retrieval Layer",
  "数据泄露智能预警": "Intelligent Data Leakage Early Warning",
  "数据理解": "Data Understanding",
  "数据脱敏": "Data Masking",
  "数据隐私保护": "Data Privacy Protection",
  "整合企业知识库与行业数据，支持 RAG 与检索增强生成，为业务提供智能知识服务。": "Integrates enterprise knowledge bases and industry data, supporting RAG and retrieval-augmented generation for intelligent knowledge services.",
  "智慧物流网络优化": "Smart Logistics Network Optimization",
  "智能体开发": "Agent Development",
  "智能体开发,工作流编排,任务自动化": "Agent development, workflow orchestration, task automation",
  "智能体执行环境": "Agent Execution Environment",
  "智能体运行": "Agent Runtime",
  "智能决策": "Intelligent Decision-Making",
  "智能决策支持": "Intelligent Decision Support",
  "智能办公": "Intelligent Office",
  "智能办公助手": "Intelligent Office Assistant",
  "智能响应辅助": "Intelligent Response Assistance",
  "智能客服": "Intelligent Customer Service",
  "智能客服、售后辅助与商家运营分析": "Intelligent Customer Service, After-Sales Assistance & Merchant Operations Analysis",
  "智能客服与售后自动化": "Intelligent Customer Service & After-Sales Automation",
  "智能巡检": "Intelligent Inspection",
  "智能投顾": "Intelligent Advisory",
  "智能推荐": "Smart Recommendation",
  "智能推荐、内容生成与客服自动化，让交易效率持续升级": "Smart recommendations, content generation, and automated customer service to continuously upgrade transaction efficiency",
  "智能文档处理": "Intelligent Document Processing",
  "智能物流": "Intelligent Logistics",
  "智能物流与供应链优化": "Intelligent Logistics & Supply Chain Optimization",
  "智能监测": "Intelligent Monitoring",
  "智能监测、预警与审计，构建主动式安全运营体系": "Intelligent monitoring, alerting, and auditing to build a proactive security operations system",
  "智能知识服务": "Intelligent Knowledge Services",
  "智能调度": "Intelligent Scheduling",
  "智能风控与量化交易": "Intelligent Risk Control & Quantitative Trading",
  "服务可用性": "Service Availability",
  "服务对象": "Service Targets",
  "服务机器人与场景任务执行": "Service Robot & Scenario Task Execution",
  "服务机器人人机交互": "Service Robot Human-Machine Interaction",
  "服务质量保障": "Service Quality Assurance",
  "未来基础设施": "Future Infrastructure",
  "机器人": "Robotics",
  "机器人板块依托 XMAX AI 的推理服务、智能体运行层与低时延响应能力，为“感知—决策—执行”闭环提供统一智能支撑。": "The Robotics segment leverages XMAX AI's inference services, agent runtime layer, and low-latency response capabilities to provide unified intelligent support for the 'perception-decision-execution' closed loop.",
  "构建 AI 驱动的交易、运营与用户增长体系": "Building AI-driven trading, operations, and user growth systems",
  "构建企业级向量数据库与知识图谱，支持多模态数据检索与语义搜索": "Builds enterprise-grade vector databases and knowledge graphs supporting multimodal data retrieval and semantic search",
  "构建全球 AI 推理服务基础设施": "Building Global AI Inference Infrastructure",
  "构建内容生成、互动体验与数字娱乐能力": "Building content generation, interactive experience, and digital entertainment capabilities",
  "构建智能调度、预测与协同网络": "Building intelligent scheduling, forecasting, and collaboration networks",
  "构建跨区域、跨可用区的分布式推理计算网络，支持弹性伸缩与负载均衡": "Builds a cross-region, cross-AZ distributed inference computing network with elastic scaling and load balancing",
  "检索增强": "Retrieval Augmentation",
  "模型": "Model",
  "模型与推理服务": "Model & Inference Services",
  "模型安全检测": "Model Security Detection",
  "模型微调": "Model Fine-Tuning",
  "模型接入、路由、配额、监控与治理平台": "Model Access, Routing, Quota, Monitoring & Governance Platform",
  "模型管理": "Model Management",
  "模型管理,API 治理,配额控制": "Model management, API governance, quota control",
  "模型网关": "Model Gateway",
  "治理策略": "Governance Strategy",
  "法律信息": "Legal",
  "流程效率优化": "Process Efficiency Optimization",
  "流程自动化": "Process Automation",
  "混合云架构": "Hybrid Cloud Architecture",
  "游戏 AI NPC 与剧情生成": "Game AI NPC & Plot Generation",
  "游戏与互动内容生成": "Gaming & Interactive Content Generation",
  "漏洞分析": "Vulnerability Analysis",
  "环境感知": "Environmental Perception",
  "环境理解": "Environmental Understanding",
  "生命科学": "Life Sciences",
  "生命科学板块主要复用 XMAX AI 的知识引擎、检索增强能力与可治理的模型服务能力，适配高知识密度、高准确性要求场景。": "The Life Sciences segment primarily reuses XMAX AI's knowledge engine, retrieval augmentation capabilities, and governable model service capabilities, adapted for high-knowledge-density, high-accuracy requirement scenarios.",
  "生命科学板块依托 XMAX AI 的数据检索层、推理网格与知识引擎能力，支撑从科研到临床的全链路智能服务。": "The Life Sciences segment leverages XMAX AI's data retrieval layer, inference fabric, and knowledge engine capabilities to support full-chain intelligent services from research to clinical applications.",
  "用户分层、个性化推荐与转化路径优化": "User Segmentation, Personalized Recommendation & Conversion Path Optimization",
  "用户增长运营": "User Growth Operations",
  "用户行为分析与内容运营优化": "User Behavior Analysis & Content Operations Optimization",
  "电商": "E-Commerce",
  "电商平台智能化升级": "E-Commerce Platform Intelligent Upgrade",
  "电商板块复用 XMAX AI 的产品矩阵与基础设施能力，实现推荐、定价、客服等核心环节的智能化升级。": "The E-Commerce segment reuses XMAX AI's product matrix and infrastructure capabilities to achieve intelligent upgrades in core areas such as recommendations, pricing, and customer service.",
  "电商板块调用 XMAX AI 的统一推理服务、模型治理与知识检索能力，形成面向高并发交易场景的实时 AI 服务能力。": "The E-Commerce segment leverages XMAX AI's unified inference services, model governance, and knowledge retrieval capabilities to form real-time AI service capabilities for high-concurrency transaction scenarios.",
  "直播电商实时互动": "Live E-Commerce Real-Time Interaction",
  "知识库": "Knowledge Base",
  "知识引擎": "Knowledge Engine",
  "知识引擎 + 流程自动化，打造下一代智能办公底座": "Knowledge engine + process automation, building the next-generation intelligent workplace foundation",
  "知识检索": "Knowledge Retrieval",
  "知识检索、辅助分析与决策支持，提升研发与流程效率": "Knowledge retrieval, assisted analysis, and decision support to enhance R&D and process efficiency",
  "知识管理": "Knowledge Management",
  "知识管理,RAG,检索增强": "Knowledge management, RAG, retrieval augmentation",
  "研发流程中的智能辅助决策": "Intelligent Assisted Decision-Making in R&D Processes",
  "研究资料与专业文献辅助分析": "Research Materials & Professional Literature Assisted Analysis",
  "私有化部署": "Private Deployment",
  "科研辅助分析": "Research Assisted Analysis",
  "端到端加密": "End-to-End Encryption",
  "管理与运营平台": "Management & Operations Platform",
  "组织协作智能化": "Organizational Collaboration Intelligence",
  "经营分析支持": "Business Analysis Support",
  "统一模型接入层": "Unified Model Access Layer",
  "统一管理模型版本、调用策略与配额，提供调用日志与监控，支撑模型服务的规范化运营。": "Unified management of model versions, calling policies, and quotas with logging and monitoring for standardized model service operations.",
  "网络安全与数据保护": "Cybersecurity & Data Protection",
  "网络攻击实时检测": "Real-Time Network Attack Detection",
  "联系我们": "Contact Us",
  "自动驾驶": "Autonomous Driving",
  "自动驾驶感知融合": "Autonomous Driving Perception Fusion",
  "航空航天": "Aerospace",
  "船舶智能运维": "Ship Intelligent Operations",
  "融合环境理解、决策规划与执行控制，让机器人真正“会用脑”": "Integrating environmental understanding, decision planning, and execution control to make robots truly 'intelligent'",
  "融合环境理解、决策规划与执行控制，让机器人真正会用脑": "Integrating environmental understanding, decision planning, and execution control to make robots truly intelligent",
  "行业数据": "Industry Data",
  "行业模型部署": "Industry Model Deployment",
  "行业解决方案": "Industry Solutions",
  "行为审计": "Behavior Auditing",
  "覆盖全栈 AI 产品矩阵，包括 Agent OS、模型服务平台与数据智能平台": "End-to-end product matrix covering full-stack AI capabilities including Agent OS, model service platform, and data intelligence platform",
  "订单与需求预测": "Order & Demand Forecasting",
  "访问控制": "Access Control",
  "语音交互": "Voice Interaction",
  "请提供您的公司名称与联系方式": "Please provide your company name and contact information",
  "调用日志": "Call Logs",
  "调用策略": "Calling Policies",
  "财务自动化": "Financial Automation",
  "跨区域服务路由": "Cross-Region Service Routing",
  "跨境供应链协同": "Cross-Border Supply Chain Collaboration",
  "跨境电商多语言服务": "Cross-Border E-Commerce Multi-Language Services",
  "跨境贸易": "Cross-Border Trade",
  "跨行业推理服务集成、私有化部署与混合云架构支持。": "Cross-industry inference service integration, private deployment, and hybrid cloud architecture support.",
  "路径优化": "Route Optimization",
  "路径规划": "Path Planning",
  "路由调度与仓配协同": "Route Scheduling & Warehouse Coordination",
  "辅助分析": "Assisted Analysis",
  "边缘 AI": "Edge AI",
  "边缘推理": "Edge Inference",
  "边缘推理、远距协同与高性能算力，探索极限场景": "Edge inference, remote collaboration, and high-performance computing to explore extreme scenarios",
  "边缘环境下的低时延 AI 响应": "Low-Latency AI Response in Edge Environments",
  "边缘节点": "Edge Locations",
  "运动控制": "Motion Control",
  "运营": "Operations",
  "运营决策支持": "Operations Decision Support",
  "运营辅助": "Operations Assistance",
  "远程协同": "Remote Collaboration",
  "远距协同": "Remote Collaboration",
  "远距离、多节点协同的数据处理与决策支持": "Long-Distance, Multi-Node Collaborative Data Processing & Decision Support",
  "远距离协同": "Long-Distance Collaboration",
  "连接产业、模型与真实世界": "Connecting Industry, Models & the Real World",
  "通信优化": "Communication Optimization",
  "通过 9 大业务板块将 AI 能力转化为可交付的产业服务": "Converting AI capabilities into deliverable industry services through 9 business segments",
  "通过 AI 推理服务为电商平台提供智能推荐、动态定价、供应链预测与客服自动化能力，提升转化效率与用户体验。": "Providing AI inference services for e-commerce platforms with smart recommendations, dynamic pricing, supply chain forecasting, and automated customer service to improve conversion efficiency and user experience.",
  "通过 AI 推理能力优化物流路径、库存管理与需求预测，构建端到端智能供应链服务体系。": "Optimizing logistics routes, inventory management, and demand forecasting through AI inference capabilities to build an end-to-end intelligent supply chain service system.",
  "通过 AWS IAM、KMS、CloudTrail 构建全链路安全与合规体系": "Full-chain security and compliance through AWS IAM, KMS, and CloudTrail",
  "遥感分析": "Remote Sensing Analysis",
  "遥感数据分析": "Remote Sensing Data Analysis",
  "配额控制": "Quota Control",
  "量化交易": "Quantitative Trading",
  "金融": "Finance",
  "金融客服与业务咨询智能化": "Financial Customer Service & Business Consultation Intelligence",
  "金融板块通过 XMAX AI 的模型网关与安全治理层，实现风控模型、客服模型与审计模型的统一接入与合规运行。": "The Finance segment leverages XMAX AI's model gateway and security governance layer to achieve unified access and compliant operation of risk control, customer service, and auditing models.",
  "集团定位": "Group Positioning",
  "集团总部": "Group Headquarters",
  "需求预测": "Demand Forecasting",
  "需求预测、库存优化与履约调度，打通全链路响应网络": "Demand forecasting, inventory optimization, and fulfillment orchestration to connect the full-chain response network",
  "面向企业与业务系统的统一 AI 推理服务入口": "Unified AI Inference Service Gateway for Enterprises",
  "面向企业知识、检索增强和数据协同的智能引擎": "Intelligent Engine for Enterprise Knowledge, RAG & Data Collaboration",
  "面向复杂环境的感知与路径规划支持": "Perception & Path Planning Support for Complex Environments",
  "面向安全审计、访问控制、护栏策略与运营治理": "Security Auditing, Access Control, Guardrail Policies & Operational Governance",
  "面向工作流、任务自动化和行业智能体构建": "Workflow, Task Automation & Industry Agent Builder",
  "预警": "Early Warning",
  "风控": "Risk Control",
  "风控、客服与审计全链路可治理，安全合规驱动效率": "End-to-end governance of risk control, customer service, and auditing, driving efficiency through security and compliance",
  "风险识别": "Risk Identification",
  "风险预警": "Risk Early Warning",
  "风险预警与辅助决策": "Risk Early Warning & Assisted Decision-Making",
  "首页": "Home",
  "高性能推理优化": "High-Performance Inference",
  "高性能算力": "High-Performance Computing",
  "高性能计算": "High-Performance Computing",
  "高性能计算任务调度": "High-Performance Computing Task Scheduling",

  // ─── Business Page Subtitles ────────────────────────
  "构建 AI 驱动的交易、运营与用户增长体系。": "Building AI-driven trading, operations, and user growth systems.",
  "构建 AI 驱动的交易, 运营与用户增长体系。": "Building AI-driven trading, operations, and user growth systems.",
  "构建 AI 驱动的交易, 运营与用户增长体系": "Building AI-driven trading, operations, and user growth systems",
  "构建内容生成、互动体验与数字娱乐能力。": "Building content generation, interactive experience, and digital entertainment capabilities.",
  "构建内容生成, 互动体验与数字娱乐能力。": "Building content generation, interactive experience, and digital entertainment capabilities.",
  "构建内容生成, 互动体验与数字娱乐能力": "Building content generation, interactive experience, and digital entertainment capabilities",
  "构建智能调度、预测与协同网络。": "Building intelligent scheduling, forecasting, and collaboration networks.",
  "构建智能调度, 预测与协同网络。": "Building intelligent scheduling, forecasting, and collaboration networks.",
  "构建智能调度, 预测与协同网络": "Building intelligent scheduling, forecasting, and collaboration networks",
  "探索高性能算力、边缘连接与未来计算场景。": "Exploring high-performance computing, edge connectivity, and future computing scenarios.",
  "探索高性能算力, 边缘连接与未来计算场景。": "Exploring high-performance computing, edge connectivity, and future computing scenarios.",
  "探索高性能算力, 边缘连接与未来计算场景": "Exploring high-performance computing, edge connectivity, and future computing scenarios",
  "推进感知、决策与执行一体化智能系统。": "Advancing integrated intelligent systems for perception, decision-making, and execution.",
  "推进感知, 决策与执行一体化智能系统。": "Advancing integrated intelligent systems for perception, decision-making, and execution.",
  "推进感知, 决策与执行一体化智能系统": "Advancing integrated intelligent systems for perception, decision-making, and execution",
  "面向研发、分析与智能辅助决策提供能力。": "Providing capabilities for R&D, analysis, and intelligent assisted decision-making.",
  "面向研发, 分析与智能辅助决策提供能力。": "Providing capabilities for R&D, analysis, and intelligent assisted decision-making.",
  "面向研发, 分析与智能辅助决策提供能力": "Providing capabilities for R&D, analysis, and intelligent assisted decision-making",
  "面向风控、运营、服务与智能金融流程提供能力。": "Providing capabilities for risk control, operations, services, and intelligent financial processes.",
  "面向风控, 运营, 服务与智能金融流程提供能力。": "Providing capabilities for risk control, operations, services, and intelligent financial processes.",
  "面向风控, 运营, 服务与智能金融流程提供能力": "Providing capabilities for risk control, operations, services, and intelligent financial processes",
  "面向风控, Operations, 服务与智能金融流程提供能力": "Providing capabilities for risk control, operations, services, and intelligent financial processes",
  "面向数字安全、监测、审计与治理提供能力。": "Providing capabilities for digital security, monitoring, auditing, and governance.",
  "面向数字安全, 监测, 审计与治理提供能力。": "Providing capabilities for digital security, monitoring, auditing, and governance.",
  "面向数字安全, 监测, 审计与治理提供能力": "Providing capabilities for digital security, monitoring, auditing, and governance",
  "面向组织数字化、知识管理与流程智能化提供能力。": "Providing capabilities for organizational digitalization, knowledge management, and process intelligence.",
  "面向组织数字化, 知识管理与流程智能化提供能力。": "Providing capabilities for organizational digitalization, knowledge management, and process intelligence.",
  "面向组织数字化, 知识管理与流程智能化提供能力": "Providing capabilities for organizational digitalization, knowledge management, and process intelligence",
  // 顿号变体（无句号）— CMS sections[0].heading 实际值
  "面向研发、分析与智能辅助决策提供能力": "Providing capabilities for R&D, analysis, and intelligent assisted decision-making",
  "面向风控、运营、服务与智能金融流程提供能力": "Providing capabilities for risk control, operations, services, and intelligent financial processes",
  "面向数字安全、监测、审计与治理提供能力": "Providing capabilities for digital security, monitoring, auditing, and governance",
  "面向组织数字化、知识管理与流程智能化提供能力": "Providing capabilities for organizational digitalization, knowledge management, and process intelligence",
  // ─── Business Page Descriptions ─────────────────────
  "XMAX AI 电商板块聚焦交易效率、用户经营与平台智能化运营，围绕商品、内容、流量、转化与服务全链路引入 AI 推理能力。通过统一模型服务、推荐策略、内容生成与智能客服能力，持续提升电商业务的运营效率、用户体验与增长质量。": "XMAX AI's E-Commerce segment focuses on transaction efficiency, user operations, and platform intelligence, integrating AI inference across the entire product, content, traffic, conversion, and service chain. Through unified model services, recommendation strategies, content generation, and intelligent customer service, it continuously improves operational efficiency, user experience, and growth quality.",
  "XMAX AI 互娱板块围绕数字内容、互动体验与新型娱乐消费场景，建设面向创作、分发、互动与运营的 AI 能力体系。通过推理服务、内容生成、角色交互与实时响应能力，支持更丰富的数字娱乐产品形态与更高频的用户参与机制。": "XMAX AI's Entertainment segment builds AI capabilities for creation, distribution, interaction, and operations around digital content, interactive experiences, and new entertainment consumption scenarios. Through inference services, content generation, character interaction, and real-time response, it supports richer digital entertainment products and higher-frequency user engagement.",
  "XMAX AI 供应链服务板块聚焦需求预测、库存协同、运输调度、履约优化与跨主体协同效率，通过 AI 推理能力连接供应链中的关键数据与决策节点。该板块强调对复杂流程的感知、预测与动态调整，帮助企业提升履约稳定性、资源利用率与响应速度。": "XMAX AI's Supply Chain segment focuses on demand forecasting, inventory coordination, transport scheduling, fulfillment optimization, and cross-party collaboration efficiency. By connecting key data and decision nodes in the supply chain through AI inference, it emphasizes perception, prediction, and dynamic adjustment of complex processes to improve fulfillment stability, resource utilization, and response speed.",
  "XMAX AI 太空计算板块聚焦未来计算基础设施、边缘连接、远距离数据协同与高性能算力场景，面向更复杂、更极端、更具前瞻性的计算需求开展布局。该板块体现集团对未来计算能力、跨域协同与新型智能基础设施的长期投入。": "XMAX AI's Space Computing segment focuses on future computing infrastructure, edge connectivity, long-distance data collaboration, and high-performance computing scenarios. It addresses more complex, extreme, and forward-looking computing needs, reflecting the group's long-term commitment to future computing capabilities, cross-domain collaboration, and new intelligent infrastructure.",
  "XMAX AI 机器人板块面向机器人系统中的感知、理解、推理、规划与执行链路，构建可持续演进的智能能力底座。通过将模型推理、环境理解、任务决策和执行控制连接起来，该板块服务于多类智能机器人与自动化设备的场景化落地。": "XMAX AI's Robotics segment builds an evolving intelligent capability foundation for the perception, understanding, reasoning, planning, and execution chain in robotic systems. By connecting model inference, environmental understanding, task decision-making, and execution control, it serves the scenario-based deployment of various intelligent robots and automation equipment.",
  "XMAX AI 生命科学板块聚焦生命科学研究、数据分析与智能辅助决策等方向，致力于将 AI 能力引入复杂知识密集型场景。通过模型推理、知识检索与专业数据协同能力，该板块支持研究、分析与流程优化类任务的效率提升。": "XMAX AI's Life Sciences segment focuses on life science research, data analysis, and intelligent assisted decision-making. It is committed to introducing AI capabilities into complex knowledge-intensive scenarios. Through model inference, knowledge retrieval, and professional data collaboration, it supports efficiency improvements in research, analysis, and process optimization tasks.",
  "XMAX AI 金融板块围绕风险控制、客户服务、运营流程、智能辅助与数字金融体验构建产品能力，重点强调可审计、可治理与高可靠的 AI 服务体系。该板块面向金融业务的严谨性要求，突出安全、合规、稳定与效率的统一。": "XMAX AI's Finance segment builds product capabilities around risk control, customer service, operational processes, intelligent assistance, and digital finance experience. It emphasizes an auditable, governable, and highly reliable AI service system. Addressing the rigorous requirements of financial business, it highlights the unity of security, compliance, stability, and efficiency.",
  "XMAX AI 安全板块聚焦数字环境中的监测、预警、响应、审计与治理能力建设，通过 AI 推理与规则控制结合，支持更高效的安全运营体系。该板块既面向企业内部数字安全治理，也面向更广泛的风险识别与运营支撑需求。": "XMAX AI's Security segment focuses on monitoring, early warning, response, auditing, and governance capabilities in digital environments. By combining AI inference with rule-based control, it supports more efficient security operations. This segment serves both internal enterprise digital security governance and broader risk identification and operational support needs.",
  "XMAX AI 企业服务板块聚焦组织内部知识、流程、协作与管理效率提升，通过智能体、知识引擎与自动化能力推动企业运营升级。该板块面向中后台系统与企业日常经营场景，强调标准化、可复制与可持续扩展。": "XMAX AI's Enterprise Services segment focuses on improving organizational knowledge, processes, collaboration, and management efficiency. Through agents, knowledge engines, and automation capabilities, it drives enterprise operational upgrades. This segment targets back-office systems and daily business scenarios, emphasizing standardization, replicability, and sustainable scalability.",
};

/**
 * Translate a Chinese string to English using the static dictionary.
 * Returns the English translation if found, otherwise the original string.
 */
export function translateStatic(zh: string): string {
  // Exact match
  if (TRANS_MAP[zh]) return TRANS_MAP[zh];
  // Trim whitespace and try
  const trimmed = zh.trim();
  if (TRANS_MAP[trimmed]) return TRANS_MAP[trimmed];
  // Remove bullet prefix · and try
  const noBullet = trimmed.replace(/^·\s*/, "");
  if (TRANS_MAP[noBullet]) return TRANS_MAP[noBullet];
  return zh;
}

const REVERSE_TRANS_MAP: Record<string, string> = Object.entries(TRANS_MAP).reduce(
  (acc, [zh, en]) => {
    if (!acc[en]) acc[en] = zh;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Translate a known English CMS string back to Chinese.
 * This is intentionally dictionary-based, not machine translation, so brand/product
 * names such as XMAX AI, AWS, Agent OS, and URL-like strings are not mangled.
 */
export function translateStaticToZh(en: string): string {
  if (REVERSE_TRANS_MAP[en]) return REVERSE_TRANS_MAP[en];
  const trimmed = en.trim();
  if (REVERSE_TRANS_MAP[trimmed]) return REVERSE_TRANS_MAP[trimmed];
  const noBullet = trimmed.replace(/^·\s*/, "");
  if (REVERSE_TRANS_MAP[noBullet]) return `${trimmed.startsWith("·") ? "·" : ""}${REVERSE_TRANS_MAP[noBullet]}`;
  return en;
}

/**
 * Recursively translate any data structure, replacing Chinese strings with English.
 */
export function deepTranslateStatic<T>(data: T): T {
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    if (/[\u4e00-\u9fff]/.test(data)) {
      // Try exact match first
      const translated = translateStatic(data);
      if (translated !== data) return translated as unknown as T;
      // For multi-line, try each line (handle bullet prefix ·)
      if (data.includes("\n")) {
        return data
          .split("\n")
          .map((line) => translateStatic(line.trim()))
          .join("\n") as unknown as T;
      }
      // For comma-separated, try each segment
      if (data.includes(",")) {
        return data
          .split(",")
          .map((s) => translateStatic(s.trim()))
          .join(", ") as unknown as T;
      }
      // For Chinese enumeration mark (、), try each segment
      if (data.includes("、")) {
        return data
          .split("、")
          .map((s) => translateStatic(s.trim()))
          .join(", ") as unknown as T;
      }
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => deepTranslateStatic(item)) as unknown as T;
  }

  if (typeof data === "object") {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(data as object)) {
      result[key] = deepTranslateStatic((data as Record<string, unknown>)[key]);
    }
    return result as T;
  }

  return data;
}

/**
 * Recursively normalize CMS data for Chinese display.
 * Only exact known English phrases are converted; unknown English/proper nouns remain intact.
 */
export function deepLocalizeStatic<T>(data: T, target: "zh-Hans" | "en"): T {
  if (target === "en") return deepTranslateStatic(data);
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    const translated = translateStaticToZh(data);
    if (translated !== data) return translated as unknown as T;
    if (data.includes("\n")) {
      return data
        .split("\n")
        .map((line) => translateStaticToZh(line.trim()))
        .join("\n") as unknown as T;
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => deepLocalizeStatic(item, target)) as unknown as T;
  }

  if (typeof data === "object") {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(data as object)) {
      result[key] = deepLocalizeStatic((data as Record<string, unknown>)[key], target);
    }
    return result as T;
  }

  return data;
}
