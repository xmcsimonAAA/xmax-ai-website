#!/usr/bin/env python3
"""
为所有 Strapi 内容类型创建 en locale 版本。
使用 Admin Content-Manager API。
"""

import json
import requests
import sys

BASE_URL = "http://localhost:1337"
ADMIN_EMAIL = "xmc@163.com"
ADMIN_PASSWORD = "Xmax2026!"

# 内容类型到 admin API 路径的映射
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

# 翻译映射表 - 覆盖所有 CMS 中的中文内容
TRANSLATIONS = {
    # ========== 首页 ==========
    "Our Mission": "Our Mission",
    "以可信、可扩展的 AI 推理服务基础设施，连接产业创新与社会需求": "Building trusted, scalable AI inference service infrastructure to connect industrial innovation with social needs",
    "XMAX AI Inc 是 XMAX 集团的 AI 能力平台与产业服务载体，统一推进平台能力、产品化输出与行业化落地。": "XMAX AI Inc is the AI capability platform and industry service vehicle of XMAX Group, advancing platform capabilities, productized output, and industry implementation.",
    "构建全球 AI 推理服务基础设施": "Building Global AI Inference Service Infrastructure",
    "连接算力、算法与产业场景": "Connecting Computing Power, Algorithms and Industry Scenarios",
    "AI 推理,算力基础设施,产业服务": "AI Inference, Computing Infrastructure, Industry Services",
    "AI 基础设施,全球部署,产业赋能": "AI Infrastructure, Global Deployment, Industry Empowerment",
    "基础设施": "Infrastructure",
    "构建高性能、全球分布的 AI 推理基础设施，支撑大规模模型部署与实时推理需求": "Building high-performance, globally distributed AI inference infrastructure supporting large-scale model deployment and real-time inference needs",
    "产品与服务": "Products & Services",
    "面向企业客户提供 AI 推理服务、模型优化与行业解决方案": "Providing AI inference services, model optimization, and industry solutions for enterprise customers",
    "AWS 合作": "AWS Partnership",
    "作为 AWS 高级合作伙伴，携手打造云端 AI 推理服务": "As an AWS Advanced Partner, building cloud AI inference services together",
    "合作咨询": "Consultation",
    "与我们探讨合作机会与业务对接": "Discuss partnership opportunities and business collaboration with us",
    "1000+": "1000+",
    "GPU 集群": "GPU Clusters",
    "50+": "50+",
    "全球节点": "Global Nodes",
    "99.9%": "99.9%",
    "服务可用性": "Service Availability",
    "10ms": "10ms",
    "推理延迟": "Inference Latency",
    "2025.01": "2025.01",
    "XMAX AI 与 AWS 签署战略合作协议": "XMAX AI and AWS Sign Strategic Partnership Agreement",
    "合作": "Partnership",
    "2025.02": "2025.02",
    "全球推理节点部署完成": "Global Inference Node Deployment Completed",
    "部署": "Deployment",
    "联系我们": "Contact Us",
    "了解合作详情": "Learn More",

    # ========== 关于页 ==========
    "关于我们": "About XMAX AI",
    "XMAX 集团 AI 能力与产业服务平台": "XMAX Group AI Capability & Industry Service Platform",
    "XMAX AI Inc 是 XMAX 集团旗下专注于人工智能能力建设与产业服务的公司，致力于将先进的 AI 技术转化为可落地的产业解决方案。": "XMAX AI Inc is a company under XMAX Group dedicated to AI capability building and industry services, committed to transforming advanced AI technology into implementable industry solutions.",
    "集团概述": "Group Overview",
    "XMAX 集团：多元产业协同的 AI 生态": "XMAX Group: AI Ecosystem with Diversified Industry Synergy",
    "XMAX 集团是一家多元化产业集团，旗下涵盖 AI 推理服务、云计算、数字娱乐、教育科技、健康医疗等多个领域，通过 AI 技术连接各产业板块，形成协同效应。": "XMAX Group is a diversified industrial group covering AI inference services, cloud computing, digital entertainment, education technology, healthcare, and more, connecting various industry sectors through AI technology to create synergies.",
    "核心价值": "Core Values",
    "集团实力": "Group Strength",
    "品牌亮点": "Brand Highlights",
    "子公司业务": "Subsidiary Businesses",
    "技术创新": "Technical Innovation",
    "持续投入 AI 推理核心技术，构建自主可控的基础设施能力": "Continuously investing in core AI inference technology to build self-controllable infrastructure capabilities",
    "产业深耕": "Industry Expertise",
    "深入理解行业需求，将 AI 能力转化为可落地的产业解决方案": "Deeply understanding industry needs and transforming AI capabilities into implementable industry solutions",
    "全球视野": "Global Vision",
    "以国际化视角布局 AI 基础设施，服务全球客户与合作伙伴": "Deploying AI infrastructure with an international perspective, serving global customers and partners",
    "全球领先 AI 推理服务商": "Global Leading AI Inference Service Provider",
    "覆盖亚太、北美、欧洲的推理节点网络": "Inference node network covering Asia-Pacific, North America, and Europe",
    "AWS 高级合作伙伴": "AWS Advanced Partner",
    "与全球最大云服务商深度合作，共建 AI 推理生态": "Deep collaboration with the world's largest cloud provider to build AI inference ecosystem",
    "自主可控技术体系": "Self-Controllable Technology System",
    "从芯片适配到推理引擎的全栈技术能力": "Full-stack technology capabilities from chip adaptation to inference engine",
    "多元化产业布局": "Diversified Industry Portfolio",
    "AI + 多产业的协同效应，创造独特竞争优势": "Synergistic effects of AI + multiple industries, creating unique competitive advantages",
    "AI 推理服务": "AI Inference Services",
    "云计算": "Cloud Computing",
    "数字娱乐": "Digital Entertainment",
    "教育科技": "Education Technology",
    "健康医疗": "Healthcare",
    "金融科技": "FinTech",
    "智慧城市": "Smart City",
    "新能源": "New Energy",
    "电子商务": "E-Commerce",
    "智能制造": "Smart Manufacturing",
    "法律实体": "Legal Entity",

    # ========== AWS 页 ==========
    "XMAX AI × AWS：携手推动 AI 推理服务创新": "XMAX AI × AWS: Driving AI Inference Service Innovation Together",
    "作为 AWS 高级合作伙伴，XMAX AI 将自身在 AI 推理领域的深厚积累与 AWS 全球基础设施相结合，为企业客户提供高性能、可扩展的 AI 推理云服务。": "As an AWS Advanced Partner, XMAX AI combines deep expertise in AI inference with AWS global infrastructure to provide enterprise customers with high-performance, scalable AI inference cloud services.",
    "合作叙事": "Partnership Narrative",
    "核心信息": "Core Messages",
    "数据亮点": "Key Metrics",
    "能力映射": "Capability Mapping",
    "XMAX AI 是 AWS 在 AI 推理领域的深度合作伙伴，双方在技术、市场和生态层面展开全方位合作。": "XMAX AI is an in-depth AWS partner in AI inference, with comprehensive collaboration across technology, market, and ecosystem levels.",
    "依托 AWS 全球基础设施，XMAX AI 实现推理服务的低延迟、高可用部署。": "Leveraging AWS global infrastructure, XMAX AI achieves low-latency, high-availability deployment of inference services.",
    "双方联合推出针对企业客户的 AI 推理一体化解决方案。": "Jointly launching integrated AI inference solutions for enterprise customers.",
    "XMAX AI 在 AWS Marketplace 上提供标准化的推理服务产品。": "XMAX AI offers standardized inference service products on AWS Marketplace.",
    "AWS Partner Network 高级咨询合作伙伴": "AWS Partner Network Advanced Consulting Partner",
    "AWS 基础设施覆盖 32 个区域": "AWS Infrastructure Covers 32 Regions",
    "联合解决方案已服务 100+ 企业客户": "Joint Solutions Serving 100+ Enterprise Customers",
    "推理服务平均延迟 <10ms": "Average Inference Latency <10ms",
    "通过 AWS 全球网络实现就近推理部署": "Proximity inference deployment through AWS global network",
    "推理服务": "Inference Services",
    "基于 AWS GPU 实例的大规模推理服务部署": "Large-scale inference service deployment based on AWS GPU instances",
    "模型优化": "Model Optimization",
    "针对 AWS 硬件特性的模型量化与加速": "Model quantization and acceleration for AWS hardware characteristics",
    "安全合规": "Security & Compliance",
    "满足全球各地区数据安全与隐私合规要求": "Meeting data security and privacy compliance requirements across global regions",
    "弹性扩展": "Elastic Scaling",
    "按需扩展推理资源，应对流量波动": "On-demand scaling of inference resources to handle traffic fluctuations",

    # ========== 业务页 ==========
    "业务板块": "Business Segments",
    "九大业务板块": "Nine Business Segments",
    "XMAX AI 的业务布局覆盖 AI 推理服务全链条及多个产业领域，形成技术驱动、产业协同的商业模式。": "XMAX AI's business covers the full AI inference service chain and multiple industry sectors, forming a technology-driven, industry-synergistic business model.",
    "构建高性能、低延迟的 AI 推理服务基础设施，提供模型部署、推理加速、弹性扩缩容等核心能力": "Building high-performance, low-latency AI inference service infrastructure with core capabilities including model deployment, inference acceleration, and elastic scaling",
    "推理部署,模型加速,弹性扩缩容": "Inference Deployment, Model Acceleration, Elastic Scaling",
    "智能客服,内容审核,实时翻译": "Smart Customer Service, Content Moderation, Real-time Translation",
    "为 AWS 等云服务商提供推理能力支撑": "Providing inference capability support for cloud service providers like AWS",
    "云计算服务": "Cloud Computing Services",
    "提供 GPU 云服务器、容器化推理环境、云原生部署方案等云端基础设施服务": "Providing cloud infrastructure services including GPU cloud servers, containerized inference environments, and cloud-native deployment solutions",
    "GPU 云服务器,容器化部署,云原生方案": "GPU Cloud Servers, Containerized Deployment, Cloud-Native Solutions",
    "云上推理,混合云部署,边缘计算": "Cloud Inference, Hybrid Cloud Deployment, Edge Computing",
    "支撑 AWS 云端 AI 推理服务运行": "Supporting AWS cloud AI inference service operations",
    "利用 AI 技术赋能游戏、影视、音乐等数字内容产业，提供内容生成、智能推荐等能力": "Empowering digital content industries such as gaming, film, and music with AI technology, providing content generation and intelligent recommendation capabilities",
    "AI 内容生成,智能推荐,数字人": "AI Content Generation, Intelligent Recommendation, Digital Humans",
    "游戏 NPC,短视频生成,音乐创作": "Game NPCs, Short Video Generation, Music Creation",
    "AI 驱动的数字内容创新": "AI-driven digital content innovation",
    "打造 AI 驱动的个性化教育平台，提供智能辅导、自适应学习、知识图谱等教育科技产品": "Building AI-driven personalized education platforms with intelligent tutoring, adaptive learning, and knowledge graph products",
    "个性化学习,智能辅导,知识图谱": "Personalized Learning, Intelligent Tutoring, Knowledge Graphs",
    "在线教育,企业培训,职业教育": "Online Education, Enterprise Training, Vocational Education",
    "AI 赋能教育数字化转型": "AI empowering digital transformation in education",
    "将 AI 技术应用于医疗影像分析、药物研发、健康管理等领域，提升医疗服务效率与质量": "Applying AI technology to medical imaging analysis, drug discovery, and health management to improve healthcare efficiency and quality",
    "医疗影像分析,药物研发,健康管理": "Medical Imaging Analysis, Drug Discovery, Health Management",
    "辅助诊断,新药筛选,健康监测": "Assisted Diagnosis, Drug Screening, Health Monitoring",
    "AI + 医疗健康产业融合": "AI + Healthcare Industry Integration",
    "运用 AI 技术赋能金融行业，提供风控模型、智能投研、反欺诈等金融科技解决方案": "Empowering the financial industry with AI technology, providing risk control models, intelligent investment research, and anti-fraud solutions",
    "风控模型,智能投研,反欺诈": "Risk Control Models, Intelligent Investment Research, Anti-Fraud",
    "信用评估,量化交易,合规监控": "Credit Assessment, Quantitative Trading, Compliance Monitoring",
    "AI 驱动金融智能化": "AI-driven Financial Intelligence",
    "为城市治理提供 AI 技术支撑，覆盖交通优化、环境监测、公共安全等智慧城市应用场景": "Providing AI technology support for urban governance, covering traffic optimization, environmental monitoring, and public safety applications",
    "交通优化,环境监测,公共安全": "Traffic Optimization, Environmental Monitoring, Public Safety",
    "城市大脑,智慧交通,应急响应": "City Brain, Smart Traffic, Emergency Response",
    "AI 赋能城市智能化治理": "AI empowering intelligent urban governance",
    "利用 AI 技术优化能源管理与调度，支持光伏预测、储能优化、电网调度等新能源应用": "Using AI technology to optimize energy management and dispatch, supporting photovoltaic forecasting, energy storage optimization, and grid dispatch",
    "光伏预测,储能优化,电网调度": "Photovoltaic Forecasting, Energy Storage Optimization, Grid Dispatch",
    "智能微网,碳排监测,虚拟电厂": "Smart Microgrids, Carbon Monitoring, Virtual Power Plants",
    "AI + 绿色能源产业创新": "AI + Green Energy Industry Innovation",
    "将 AI 推理能力应用于电商场景，提供智能搜索、个性化推荐、视觉搜索等电商 AI 解决方案": "Applying AI inference capabilities to e-commerce scenarios, providing intelligent search, personalized recommendations, and visual search solutions",
    "智能搜索,个性化推荐,视觉搜索": "Intelligent Search, Personalized Recommendations, Visual Search",
    "商品推荐,图像识别,智能客服": "Product Recommendations, Image Recognition, Smart Customer Service",
    "AI 赋能电商智能化运营": "AI Empowering Intelligent E-Commerce Operations",
    "为制造业提供 AI 视觉检测、预测性维护、生产优化等智能制造解决方案": "Providing AI visual inspection, predictive maintenance, and production optimization solutions for manufacturing",
    "视觉检测,预测性维护,生产优化": "Visual Inspection, Predictive Maintenance, Production Optimization",
    "质量检测,设备运维,工艺优化": "Quality Inspection, Equipment Maintenance, Process Optimization",
    "AI + 制造业数字化转型": "AI + Manufacturing Digital Transformation",

    # ========== 联系页 ==========
    "联系我们": "Contact Us",
    "期待与您合作": "Looking Forward to Collaborating with You",
    "无论是业务合作、技术咨询还是投资对接，我们都期待与您交流。": "Whether it's business collaboration, technical consultation, or investment matchmaking, we look forward to connecting with you.",
    "我们期待与各行业的合作伙伴共同探索 AI 推理服务的创新应用": "We look forward to exploring innovative applications of AI inference services with partners across industries",
    "技术咨询": "Technical Consultation",
    "了解 XMAX AI 的技术能力与解决方案": "Learn about XMAX AI's technical capabilities and solutions",
    "投资对接": "Investment",
    "探讨 AI 推理服务赛道的投资机会": "Discuss investment opportunities in the AI inference service sector",
    "媒体采访": "Media Inquiries",
    "获取 XMAX AI 最新动态与行业观点": "Get the latest updates and industry insights from XMAX AI",
    "人才招聘": "Careers",
    "加入 XMAX AI，共建 AI 推理服务基础设施": "Join XMAX AI to build AI inference service infrastructure together",
    "合作伙伴计划": "Partner Program",
    "加入 XMAX AI 合作伙伴生态，共享 AI 推理服务红利": "Join the XMAX AI partner ecosystem to share the benefits of AI inference services",
    "技术集成": "Technical Integration",
    "将 XMAX AI 推理能力集成到您的产品与服务中": "Integrate XMAX AI inference capabilities into your products and services",
    "定制开发": "Custom Development",
    "针对您的业务场景定制 AI 推理解决方案": "Customize AI inference solutions for your business scenarios",
    "培训支持": "Training & Support",
    "获取 XMAX AI 技术培训与专业支持": "Get XMAX AI technical training and professional support",
    "咨询行业解决方案": "Consult Industry Solutions",
    "推荐使用场景": "Recommended Use Cases",
    "智能客服与对话系统": "Intelligent Customer Service & Dialogue Systems",
    "内容生成与审核": "Content Generation & Moderation",
    "实时翻译与多语言处理": "Real-time Translation & Multilingual Processing",
    "视觉识别与分析": "Visual Recognition & Analysis",
    "推荐系统与个性化": "Recommendation Systems & Personalization",
    "预测分析与决策支持": "Predictive Analytics & Decision Support",
    "文档处理与知识提取": "Document Processing & Knowledge Extraction",
    "代码生成与辅助开发": "Code Generation & Assisted Development",
    "建议与提示": "Tips & Suggestions",
    "明确您的 AI 推理需求与性能指标": "Clarify your AI inference requirements and performance metrics",
    "了解不同部署模式的成本与性能差异": "Understand cost and performance differences across deployment models",
    "考虑数据安全与合规要求": "Consider data security and compliance requirements",
    "评估弹性扩缩容需求": "Assess elastic scaling requirements",
    "选择合适的模型优化策略": "Choose appropriate model optimization strategies",
    "规划灰度发布与 A/B 测试方案": "Plan canary releases and A/B testing strategies",
    "建立监控与告警机制": "Establish monitoring and alerting mechanisms",
    "准备回滚与应急预案": "Prepare rollback and contingency plans",
    "与 XMAX AI 团队沟通技术细节": "Discuss technical details with the XMAX AI team",
    "利用免费试用验证服务效果": "Utilize free trials to validate service effectiveness",
    "合作洽谈": "Business Discussion",
    "了解详情": "Learn More",
    "获取方案": "Get Solutions",
    "加入生态": "Join Ecosystem",

    # ========== 基础设施页 ==========
    "全球 AI 推理服务基础设施": "Global AI Inference Service Infrastructure",
    "XMAX AI 构建了覆盖全球的高性能 AI 推理基础设施，为企业和开发者提供低延迟、高可用的推理服务支撑。": "XMAX AI has built a global high-performance AI inference infrastructure, providing low-latency, high-availability inference service support for enterprises and developers.",
    "核心原则": "Core Principles",
    "高性能与低延迟": "High Performance & Low Latency",
    "全球分布式部署": "Global Distributed Deployment",
    "弹性可扩展": "Elastic & Scalable",
    "基础设施层": "Infrastructure Layer",
    "GPU 集群、高速网络、存储系统": "GPU Clusters, High-Speed Networks, Storage Systems",
    "平台层": "Platform Layer",
    "推理引擎、调度系统、监控系统": "Inference Engine, Scheduling System, Monitoring System",
    "服务层": "Service Layer",
    "API 网关、负载均衡、弹性扩展": "API Gateway, Load Balancing, Elastic Scaling",
    "应用层": "Application Layer",
    "行业解决方案、定制化服务": "Industry Solutions, Customized Services",
    "生态系统层": "Ecosystem Layer",
    "合作伙伴、开发者社区、市场": "Partners, Developer Community, Marketplace",
    "基于自研推理引擎，实现亚毫秒级推理延迟，支撑高并发实时推理场景": "Based on self-developed inference engine, achieving sub-millisecond inference latency, supporting high-concurrency real-time inference scenarios",
    "全球 50+ 节点分布，就近推理部署，确保全球用户低延迟访问": "50+ global nodes distributed for proximity inference deployment, ensuring low-latency access for global users",
    "按需弹性扩缩容，支持突发流量，自动负载均衡": "On-demand elastic scaling, supporting burst traffic with automatic load balancing",
    "多层安全防护，满足全球各地区数据安全与隐私合规要求": "Multi-layer security protection, meeting data security and privacy compliance requirements across global regions",
    "核心原则说明": "Core Principles Description",
    "XMAX AI 基础设施的设计遵循以下核心原则，确保服务的高性能、高可用与高安全性。": "XMAX AI infrastructure design follows these core principles to ensure high performance, high availability, and high security of services.",

    # ========== 产品页 ==========
    "AI 推理服务全栈产品": "Full-Stack AI Inference Service Products",
    "XMAX AI 提供从推理引擎到行业解决方案的全栈产品体系，满足不同场景的 AI 推理需求。": "XMAX AI provides a full-stack product system from inference engine to industry solutions, meeting AI inference needs across different scenarios.",
    "AI 推理引擎": "AI Inference Engine",
    "高性能推理引擎，支持主流大模型部署与实时推理": "High-performance inference engine supporting mainstream large model deployment and real-time inference",
    "模型部署,实时推理,多模型支持": "Model Deployment, Real-time Inference, Multi-Model Support",
    "自研推理引擎，支持 LLaMA、GPT、GLM 等主流大模型架构，提供亚毫秒级推理延迟与高并发处理能力。": "Self-developed inference engine supporting mainstream large model architectures like LLaMA, GPT, and GLM, providing sub-millisecond inference latency and high-concurrency processing capabilities.",
    "推理云服务": "Inference Cloud Service",
    "一站式云端 AI 推理服务，按需使用、弹性扩展": "One-stop cloud AI inference service, on-demand usage with elastic scaling",
    "云端部署,弹性扩展,按需付费": "Cloud Deployment, Elastic Scaling, Pay-as-you-go",
    "提供 GPU 云服务器、容器化推理环境、自动扩缩容等云端推理服务，支持 AWS、阿里云等主流云平台。": "Providing GPU cloud servers, containerized inference environments, and auto-scaling cloud inference services, supporting mainstream cloud platforms like AWS and Alibaba Cloud.",
    "行业解决方案": "Industry Solutions",
    "面向特定行业的 AI 推理解决方案，深度定制": "AI inference solutions for specific industries, deeply customized",
    "行业定制,场景优化,端到端方案": "Industry Customization, Scenario Optimization, End-to-End Solutions",
    "针对金融、医疗、教育、制造等行业，提供深度定制的 AI 推理解决方案，包括模型优化、部署架构、运维支持等端到端服务。": "Providing deeply customized AI inference solutions for industries such as finance, healthcare, education, and manufacturing, including end-to-end services like model optimization, deployment architecture, and operations support.",
    "开发者工具": "Developer Tools",
    "面向开发者的 AI 推理服务 SDK 与工具集": "AI inference service SDK and toolset for developers",
    "SDK,API,调试工具": "SDK, API, Debugging Tools",
    "提供多语言 SDK、RESTful API、在线调试工具等开发者资源，帮助开发者快速集成 AI 推理能力到自有应用中。": "Providing multi-language SDK, RESTful API, online debugging tools, and other developer resources to help developers quickly integrate AI inference capabilities into their own applications.",
    "模型优化服务": "Model Optimization Service",
    "模型量化、蒸馏、压缩等专业优化服务": "Professional optimization services including model quantization, distillation, and compression",
    "量化,蒸馏,压缩": "Quantization, Distillation, Compression",
    "提供模型量化（INT8/INT4）、知识蒸馏、模型压缩等优化服务，在保持精度的前提下大幅提升推理速度和降低资源消耗。": "Providing optimization services including model quantization (INT8/INT4), knowledge distillation, and model compression, significantly improving inference speed and reducing resource consumption while maintaining accuracy.",

    # ========== 站点设置 ==========
    "XMAX AI — 构建全球 AI 推理服务基础设施": "XMAX AI — Building Global AI Inference Service Infrastructure",
    "XMAX AI Inc 是 XMAX 集团旗下专注于 AI 推理服务基础设施建设的公司，致力于为企业提供高性能、低延迟、可扩展的 AI 推理云服务。": "XMAX AI Inc is a company under XMAX Group dedicated to AI inference service infrastructure, providing enterprises with high-performance, low-latency, scalable AI inference cloud services.",
    "© 2025 XMAX AI Inc. 保留所有权利。": "© 2025 XMAX AI Inc. All rights reserved.",
    "首页": "Home",
    "联系方式": "Contact",
    "公司": "Company",
    "服务": "Services",
    "资源": "Resources",
    "关注我们": "Follow Us",
    "法律信息": "Legal",
    "隐私政策": "Privacy Policy",
    "服务条款": "Terms of Service",
    "了解 XMAX AI": "About XMAX AI",
    "业务总览": "Business Overview",
    "合作叙事": "Partnership Story",
    "推理引擎": "Inference Engine",
    "云服务": "Cloud Services",
    "解决方案": "Solutions",
    "开发者": "Developers",
    "架构概览": "Architecture Overview",
    "技术栈": "Tech Stack",
    "新闻动态": "News & Updates",
    "技术博客": "Tech Blog",
    "文档中心": "Documentation",
    "API 参考": "API Reference",
    "社区": "Community",
}

# 不需要翻译的字段（技术标识符、URL、图标名等）
SKIP_TRANSLATE_FIELDS = {"id", "documentId", "createdAt", "updatedAt", "publishedAt", "locale",
                         "localizations", "createdBy", "updatedBy", "__component",
                         "icon", "url", "bgGradient", "alias", "image",
                         # media 相关
                         "formats", "url", "previewUrl", "provider", "width", "height",
                         "hash", "ext", "mime", "size", "name", "alternativeText",
                         "caption", "folder", "folderPath", "provider_metadata"}

def translate_value(val):
    """翻译一个字符串值"""
    if val is None:
        return None
    if isinstance(val, str):
        return TRANSLATIONS.get(val, val)
    return val

def translate_data(data):
    """递归翻译数据中的可本地化字段"""
    if isinstance(data, dict):
        result = {}
        for key, value in data.items():
            if key in SKIP_TRANSLATE_FIELDS:
                result[key] = value
                continue
            if isinstance(value, str):
                result[key] = translate_value(value)
            elif isinstance(value, list):
                result[key] = [translate_data(item) if isinstance(item, (dict, list)) else translate_value(item) for item in value]
            elif isinstance(value, dict):
                result[key] = translate_data(value)
            else:
                result[key] = value
        return result
    elif isinstance(data, list):
        return [translate_data(item) for item in data]
    else:
        return data

def main():
    # 登录
    login_resp = requests.post(f"{BASE_URL}/admin/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    token = login_resp.json()["data"]["token"]
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    print("✅ Admin login successful")

    for slug, api_uid in CONTENT_TYPES.items():
        print(f"\n{'='*60}")
        print(f"Processing: {slug}")

        # 1. 获取 zh-Hans 完整数据
        get_url = f"{BASE_URL}/content-manager/single-types/{api_uid}?locale=zh-Hans"
        resp = requests.get(get_url, headers=headers)

        if resp.status_code != 200:
            print(f"  ❌ Failed to fetch zh-Hans data: {resp.status_code}")
            print(f"     {resp.text[:200]}")
            continue

        zh_data = resp.json().get("data")
        if not zh_data:
            print(f"  ⚠️ No zh-Hans data found")
            continue

        print(f"  Got zh-Hans data, keys: {list(zh_data.keys())[:15]}...")

        # 2. 翻译数据
        en_data = translate_data(zh_data)

        # 清理不需要的字段
        for f in ["id", "documentId", "createdAt", "updatedAt", "publishedAt", "locale",
                   "localizations", "createdBy", "updatedBy"]:
            en_data.pop(f, None)

        # 3. 创建 en locale 版本
        put_url = f"{BASE_URL}/content-manager/single-types/{api_uid}?locale=en"
        put_resp = requests.put(put_url, headers=headers, json=en_data)

        if put_resp.status_code in (200, 201):
            result = put_resp.json()
            result_locale = result.get("data", {}).get("locale", "unknown")
            print(f"  ✅ Created en locale version (status: {put_resp.status_code}, locale: {result_locale})")
        else:
            print(f"  ❌ Failed to create en locale: {put_resp.status_code}")
            print(f"     {put_resp.text[:500]}")

    print(f"\n{'='*60}")
    print("Done!")

if __name__ == "__main__":
    main()
