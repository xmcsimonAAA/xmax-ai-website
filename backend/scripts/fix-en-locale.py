#!/usr/bin/env python3
"""
补充 en locale 中遗漏的中文翻译。
直接获取 en locale 数据，对含中文字段应用翻译，然后 PUT 回去。
"""

import json
import requests
import re

BASE_URL = "http://localhost:1337"
ADMIN_EMAIL = "xmc@163.com"
ADMIN_PASSWORD = "Xmax2026!"

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

# 补充翻译映射表
EXTRA_TRANSLATIONS = {
    # Home page
    "全球部署区域": "Global Deployment Regions",
    "XMAX AI Agent OS 正式发布": "XMAX AI Agent OS Officially Released",
    "产品发布": "Product Release",
    "XMAX AI 与 AWS 深化全球合作": "XMAX AI Deepens Global Partnership with AWS",
    "生态合作": "Ecosystem Partnership",
    "XMAX AI 完成新一轮战略融资": "XMAX AI Completes New Round of Strategic Financing",
    "公司动态": "Company News",
    "查看业务版图": "View Business Map",
    "联系生态合作": "Contact for Partnership",
    "在 XMAX 集团体系下，通过 9 大业务板块服务全社会": "Under XMAX Group, serving society through 9 business segments",
    "基于 AWS 全球云基础设施，构建 AI 推理、模型服务与数据安全能力": "Building AI inference, model services, and data security capabilities on AWS global cloud infrastructure",
    "覆盖 Agent OS、模型服务平台、数据智能平台等全栈 AI 产品矩阵": "Covering full-stack AI product matrix including Agent OS, Model Service Platform, and Data Intelligence Platform",
    "业务版图": "Business Map",
    "9 大业务板块，覆盖电商、互娱、金融、生命科学等产业领域": "9 business segments covering e-commerce, entertainment, finance, life sciences, and more",
    "全球节点": "Global Nodes",

    # About page
    "XMAX AI Inc 作为集团 AI 体系的重要运营与能力承载主体，统一推进平台能力、产品化输出与行业化落地。": "XMAX AI Inc, as the key operational and capability entity of the Group's AI system, uniformly advances platform capabilities, productized output, and industry implementation.",
    "以可信、可扩展的 AI 推理服务基础设施连接产业创新与社会需求": "Connecting industrial innovation with social needs through trusted, scalable AI inference service infrastructure",
    "XMAX AI Inc 处于 XMAX 集团体系之下，核心定位不是单点 AI 应用公司，而是围绕全球 AI 推理服务基础设施，构建面向全社会的产业级 AI 能力...": "XMAX AI Inc is part of the XMAX Group system. Its core positioning is not a single-point AI application company, but rather building industry-grade AI capabilities for society around global AI inference service infrastructure...",
    "XMAX 集团体系下的 AI 能力承载": "AI Capability Vehicle Under XMAX Group System",
    "XMAX AI Inc 是 XMAX 集团的 AI 能力平台与产业服务载体，在集团体系内统一推进平台能力、产品化输出与行业化落地。": "XMAX AI Inc is the AI capability platform and industry service vehicle of XMAX Group, uniformly advancing platform capabilities, productized output, and industry implementation within the Group system.",
    "可信": "Trustworthy",
    "安全治理、访问控制与合规要求贯穿全栈": "Security governance, access control, and compliance requirements贯穿full stack",
    "可扩展": "Scalable",
    "弹性扩容、跨区域部署与多场景复用": "Elastic scaling, cross-region deployment, and multi-scenario reuse",
    "可落地": "Implementable",
    "9 大业务板块推动 AI 在商业与社会场景中的持续应用": "9 business segments driving continuous AI application in commercial and social scenarios",
    "全球 AI 推理服务基础设施构建者": "Builder of Global AI Inference Service Infrastructure",
    "9 大业务板块覆盖电商、互娱、金融、生命科学等产业": "9 business segments covering e-commerce, entertainment, finance, life sciences, and other industries",
    "基于 AWS 全球基础设施的云原生架构": "Cloud-native architecture based on AWS global infrastructure",
    "管理运营平台": "Management & Operations Platform",
    "电商": "E-Commerce",
    "互娱": "Interactive Entertainment",
    "供应链服务": "Supply Chain Services",
    "太空计算": "Space Computing",
    "机器人": "Robotics",
    "生命科学": "Life Sciences",
    "金融": "Finance",
    "安全": "Security",
    "企业服务": "Enterprise Services",
    "安全治理、访问控制与合规要求贯穿全栈": "Security governance, access control, and compliance requirements across the full stack",

    # AWS page
    "XMAX AI Inc 基于 AWS 全球基础设施构建可扩展的 AI 推理服务能力，支持跨区域部署、低时延响应、高可用运行及多行业场景复制。": "XMAX AI Inc builds scalable AI inference service capabilities on AWS global infrastructure, supporting cross-region deployment, low-latency response, high-availability operations, and multi-industry scenario replication.",
    "全球基础设施布局": "Global Infrastructure Layout",
    "基于 AWS 全球基础设施布局全球服务能力，面向跨区域访问、低时延响应和高可用部署进行架构设计": "Deploying global service capabilities based on AWS global infrastructure, with architecture designed for cross-region access, low-latency response, and high-availability deployment",
    "弹性计算与推理优化": "Elastic Computing & Inference Optimization",
    "通过云原生能力支持业务弹性增长和行业场景快速复制，利用 Inferentia/Inferentia2 实例优化推理性能": "Supporting elastic business growth and rapid industry scenario replication through cloud-native capabilities, leveraging Inferentia/Inferentia2 instances for inference performance optimization",
    "安全治理与合规": "Security Governance & Compliance",
    "基于 AWS IAM、KMS、日志审计与网络隔离构建全栈安全治理能力": "Building full-stack security governance capabilities based on AWS IAM, KMS, log auditing, and network isolation",
    "全球分发与低时延": "Global Distribution & Low Latency",
    "通过 CloudFront 边缘节点、Local Zones 和 Wavelength 实现全球低时延分发": "Achieving global low-latency distribution through CloudFront edge nodes, Local Zones, and Wavelength",
    "CloudFront POP 节点": "CloudFront POP Nodes",
    "公司在 AWS 全球基础设施上建设 AI 服务能力": "Building AI service capabilities on AWS global infrastructure",
    "公司业务适合多区域部署、弹性扩容与低时延推理": "Business is suited for multi-region deployment, elastic scaling, and low-latency inference",
    "公司在 AI 推理、模型服务、数据检索、安全治理方面形成平台能力": "Platform capabilities formed in AI inference, model services, data retrieval, and security governance",
    "公司有多个垂直行业场景，具备与 AWS 联合拓展空间": "Multiple vertical industry scenarios with joint expansion opportunities with AWS",
    "全球推理入口": "Global Inference Gateway",
    "多 Region 部署、弹性计算、全球网络接入": "Multi-Region deployment, elastic computing, global network access",
    "模型与推理服务": "Model & Inference Services",
    "Amazon Bedrock、Amazon SageMaker AI、EC2 推理实例": "Amazon Bedrock, Amazon SageMaker AI, EC2 Inference Instances",
    "高性能推理优化": "High-Performance Inference Optimization",
    "数据与检索层": "Data & Retrieval Layer",
    "对象存储、数据湖、检索与向量扩展能力": "Object storage, data lakes, retrieval and vector extension capabilities",
    "安全治理层": "Security Governance Layer",
    "IAM、KMS、日志审计、网络隔离、策略管理": "IAM, KMS, log auditing, network isolation, policy management",
    "推理底座": "Inference Foundation",
    "模型网关": "Model Gateway",
    "智能体运行层": "Agent Runtime Layer",
    "数据检索层": "Data Retrieval Layer",
    "公司核心能力": "Core Capabilities",
    "公司业务场景": "Business Scenarios",

    # Business page
    "将平台能力与行业场景结合，形成平台能力 × 行业落地的结构感。": "Combining platform capabilities with industry scenarios to create a structured sense of platform capabilities × industry implementation.",
    "AI 驱动的交易、运营与用户增长体系": "AI-driven transaction, operations, and user growth system",
    "电商运营,用户增长,智能推荐": "E-Commerce Operations, User Growth, Intelligent Recommendations",
    "推理底座,模型网关": "Inference Foundation, Model Gateway",
    "内容生成、互动体验与数字娱乐能力": "Content generation, interactive experiences, and digital entertainment capabilities",
    "内容生成,互动体验,数字娱乐": "Content Generation, Interactive Experiences, Digital Entertainment",
    "推理底座,智能体运行层": "Inference Foundation, Agent Runtime Layer",
    "智能调度、预测与协同网络": "Intelligent scheduling, prediction, and collaborative networks",
    "智能调度,供应链预测,协同网络": "Intelligent Scheduling, Supply Chain Prediction, Collaborative Networks",
    "推理底座,数据检索层": "Inference Foundation, Data Retrieval Layer",
    "探索高性能算力、边缘连接与未来计算场景": "Exploring high-performance computing, edge connectivity, and future computing scenarios",
    "高性能算力,边缘计算,太空数据": "High-Performance Computing, Edge Computing, Space Data",
    "推理底座,安全治理层": "Inference Foundation, Security Governance Layer",
    "推进感知、决策与执行一体化智能系统": "Advancing integrated intelligent systems for perception, decision-making, and execution",
    "智能感知,自主决策,执行控制": "Intelligent Perception, Autonomous Decision-Making, Execution Control",
    "面向研发、分析与智能辅助决策提供能力": "Providing capabilities for R&D, analysis, and intelligent assisted decision-making",
    "药物研发,临床分析,辅助决策": "Drug Discovery, Clinical Analysis, Assisted Decision-Making",
    "面向风控、运营、服务与智能金融流程提供能力": "Providing capabilities for risk control, operations, services, and intelligent financial processes",
    "智能风控,金融运营,智能客服": "Intelligent Risk Control, Financial Operations, Smart Customer Service",
    "面向数字安全、监测、审计与治理提供能力": "Providing capabilities for digital security, monitoring, auditing, and governance",
    "安全监测,威胁检测,合规审计": "Security Monitoring, Threat Detection, Compliance Auditing",
    "面向组织数字化、知识管理与流程智能化提供能力": "Providing capabilities for organizational digitalization, knowledge management, and process intelligence",
    "企业数字化,知识管理,流程智能": "Enterprise Digitalization, Knowledge Management, Process Intelligence",

    # Contact page
    "无论是商务合作、生态对接还是人才加入，我们都期待与您连接。": "Whether it's business collaboration, ecosystem partnership, or joining our team, we look forward to connecting with you.",
    "与 XMAX AI 共建全球 AI 推理服务未来": "Building the Future of Global AI Inference Services with XMAX AI",

    # Infrastructure page
    "XMAX AI Inc 基于 AWS 全球基础设施构建统一推理服务能力，支持跨区域部署、低时延响应和高可用运行。": "XMAX AI Inc builds unified inference service capabilities on AWS global infrastructure, supporting cross-region deployment, low-latency response, and high-availability operations.",
    "核心设计原则": "Core Design Principles",
    "不强调单模型，强调统一推理服务能力；强调跨场景、跨区域、跨业务板块复用。": "Emphasizing unified inference service capabilities over single models; focusing on cross-scenario, cross-region, and cross-business-segment reuse.",
    "统一承载大模型与行业模型的推理调用": "Unified hosting of inference calls for large models and industry models",
    "面向多业务场景提供弹性扩容与服务路由，支撑高并发推理需求": "Providing elastic scaling and service routing for multiple business scenarios, supporting high-concurrency inference needs",
    "统一接入模型、版本、策略、配额与调用日志": "Unified access to models, versions, policies, quotas, and call logs",
    "为业务系统提供标准化模型服务入口，统一治理模型版本与路由策略": "Providing standardized model service entry for business systems, unified governance of model versions and routing policies",
    "支撑工作流、工具调用、企业任务编排": "Supporting workflows, tool calls, and enterprise task orchestration",
    "面向行业智能体构建，支持任务链编排与多轮工具调用": "Building for industry agents, supporting task chain orchestration and multi-turn tool calls",
    "支撑企业知识库、行业数据、RAG 与检索增强": "Supporting enterprise knowledge bases, industry data, RAG, and retrieval augmentation",
    "整合结构化与非结构化数据，支撑知识管理与检索增强生成": "Integrating structured and unstructured data, supporting knowledge management and retrieval-augmented generation",
    "支撑访问控制、审计、内容安全与合规要求": "Supporting access control, auditing, content security, and compliance requirements",
    "全栈安全能力覆盖 IAM、KMS、日志审计、网络隔离与策略管理": "Full-stack security capabilities covering IAM, KMS, log auditing, network isolation, and policy management",

    # Site setting nav items
    "关于": "About",
    "产品": "Products",
    "业务": "Business",
    "联系": "Contact",
}

SKIP_FIELDS = {"id", "documentId", "createdAt", "updatedAt", "publishedAt", "locale",
               "localizations", "createdBy", "updatedBy", "__component",
               "formats", "url", "previewUrl", "provider", "width", "height",
               "hash", "ext", "mime", "size", "name", "alternativeText",
               "caption", "folder", "folderPath", "provider_metadata",
               "icon", "bgGradient", "alias"}

def translate_chinese_strings(data, translations):
    """递归翻译数据中的中文字符串"""
    if isinstance(data, dict):
        result = {}
        for key, value in data.items():
            if key in SKIP_FIELDS:
                result[key] = value
                continue
            if isinstance(value, str):
                if CHINESE_PATTERN.search(value) and value in translations:
                    result[key] = translations[value]
                else:
                    result[key] = value
            elif isinstance(value, list):
                result[key] = [translate_chinese_strings(item, translations) if isinstance(item, (dict, list)) else item for item in value]
            elif isinstance(value, dict):
                result[key] = translate_chinese_strings(value, translations)
            else:
                result[key] = value
        return result
    elif isinstance(data, list):
        return [translate_chinese_strings(item, translations) for item in data]
    return data

def main():
    login_resp = requests.post(f"{BASE_URL}/admin/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    token = login_resp.json()["data"]["token"]
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    print("✅ Admin login successful\n")

    for slug, api_uid in CONTENT_TYPES.items():
        # 获取当前 en locale 数据
        get_url = f"{BASE_URL}/content-manager/single-types/{api_uid}?locale=en"
        resp = requests.get(get_url, headers=headers)
        if resp.status_code != 200:
            print(f"❌ {slug}: Failed to fetch en data (status: {resp.status_code})")
            continue

        data = resp.json().get("data", {})
        
        # 翻译
        translated = translate_chinese_strings(data, EXTRA_TRANSLATIONS)
        
        # 清理
        for f in ["id", "documentId", "createdAt", "updatedAt", "publishedAt", "locale",
                   "localizations", "createdBy", "updatedBy"]:
            translated.pop(f, None)
        
        # 更新
        put_url = f"{BASE_URL}/content-manager/single-types/{api_uid}?locale=en"
        put_resp = requests.put(put_url, headers=headers, json=translated)
        
        if put_resp.status_code in (200, 201):
            print(f"✅ {slug}: Updated")
        else:
            print(f"❌ {slug}: Failed to update (status: {put_resp.status_code})")
            print(f"   {put_resp.text[:200]}")

    print("\nDone! Verifying...")

    # 验证
    remaining = 0
    for slug, api_uid in CONTENT_TYPES.items():
        resp = requests.get(f"{BASE_URL}/content-manager/single-types/{api_uid}?locale=en", headers=headers)
        data = resp.json().get("data", {})
        
        def count_chinese(d, path=""):
            count = 0
            if isinstance(d, dict):
                for k, v in d.items():
                    if k in SKIP_FIELDS:
                        continue
                    if isinstance(v, str) and CHINESE_PATTERN.search(v):
                        count += 1
                    elif isinstance(v, (dict, list)):
                        count += count_chinese(v, f"{path}.{k}")
            elif isinstance(d, list):
                for item in d:
                    count += count_chinese(item, path)
            return count
        
        c = count_chinese(data)
        remaining += c
        if c > 0:
            print(f"🔍 {slug}: {c} fields still contain Chinese")
        else:
            print(f"✅ {slug}: All English!")
    
    print(f"\n总计: {remaining} 个字段仍含中文")

if __name__ == "__main__":
    main()
