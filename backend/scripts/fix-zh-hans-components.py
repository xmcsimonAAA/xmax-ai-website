#!/usr/bin/env python3
"""
修复 zh-Hans locale 的组件数据 — 将所有被错误覆盖为英文的组件恢复为中文

问题：之前创建 en locale 时，zh-Hans 的组件数据也被改成了英文。
此脚本直接操作 SQLite 数据库，将 zh-Hans 关联的组件 id 更新为正确的中文内容。
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", ".tmp", "data.db")

def fix_home_page_components(conn):
    """修复首页组件"""
    c = conn.cursor()

    # heroSlides (zh-Hans ids: 7, 8)
    c.execute("""
        UPDATE components_home_hero_slides
        SET title = '构建全球 AI 推理服务基础设施',
            subtitle = '在 XMAX 集团体系下，通过 9 大业务板块服务全社会',
            tags = '全球 AI 推理,AWS 基础架构,9 大业务板块,XMAX 集团体系'
        WHERE id IN (7, 8)
    """)
    print(f"  heroSlides updated: {c.rowcount}")

    # navCards (zh-Hans ids: 10, 11, 12)
    c.execute("""
        UPDATE components_home_nav_cards
        SET title = 'AI 基础设施',
            description = '基于 AWS 全球云基础设施构建 AI 推理、模型服务与数据安全能力'
        WHERE id = 10
    """)
    c.execute("""
        UPDATE components_home_nav_cards
        SET title = 'AI 产品与服务',
            description = '覆盖全栈 AI 产品矩阵，包括 Agent OS、模型服务平台与数据智能平台'
        WHERE id = 11
    """)
    c.execute("""
        UPDATE components_home_nav_cards
        SET title = '业务版图',
            description = '9 大业务板块覆盖电商、互娱、金融、生命科学等领域'
        WHERE id = 12
    """)
    print(f"  navCards updated: 3")

    # statItems (zh-Hans ids: 13, 14, 15, 16)
    c.execute("""
        UPDATE components_home_stat_items
        SET label = '业务板块', value = '9'
        WHERE id = 13
    """)
    c.execute("""
        UPDATE components_home_stat_items
        SET label = '全球部署区域', value = '30+'
        WHERE id = 14
    """)
    c.execute("""
        UPDATE components_home_stat_items
        SET label = '行业解决方案', value = '100+'
        WHERE id = 15
    """)
    c.execute("""
        UPDATE components_home_stat_items
        SET label = '服务可用性', value = '99.9%'
        WHERE id = 16
    """)
    print(f"  statItems updated: 4")

    # updateItems (zh-Hans ids: 10, 11, 12)
    c.execute("""
        UPDATE components_home_update_items
        SET title = 'XMAX AI Agent OS 正式发布',
            tag = '产品发布'
        WHERE id = 10
    """)
    c.execute("""
        UPDATE components_home_update_items
        SET title = 'XMAX AI 与 AWS 深化全球合作伙伴关系',
            tag = '合作动态'
        WHERE id = 11
    """)
    c.execute("""
        UPDATE components_home_update_items
        SET title = 'XMAX AI 完成新一轮战略融资',
            tag = '公司新闻'
        WHERE id = 12
    """)
    print(f"  updateItems updated: 3")

    conn.commit()

def fix_about_page_components(conn):
    """修复关于页组件"""
    c = conn.cursor()

    # valueItems (zh-Hans ids: 4, 5, 6)
    c.execute("""
        UPDATE components_about_value_items
        SET title = '可信', description = '基于 AWS 全球基础设施构建安全、合规、可审计的 AI 推理服务体系'
        WHERE id = 4
    """)
    c.execute("""
        UPDATE components_about_value_items
        SET title = '可扩展', description = '支持跨区域、跨业务板块的弹性扩展与统一调度'
        WHERE id = 5
    """)
    c.execute("""
        UPDATE components_about_value_items
        SET title = '可落地', description = '通过 9 大业务板块将 AI 能力转化为可交付的产业服务'
        WHERE id = 6
    """)
    print(f"  valueItems updated: 3")

    # highlightItems (zh-Hans ids: 4, 5, 6)
    c.execute("""
        UPDATE components_about_highlight_items
        SET content = '全球 AI 推理服务基础设施构建者'
        WHERE id = 4
    """)
    c.execute("""
        UPDATE components_about_highlight_items
        SET content = '9 大业务板块覆盖电商、互娱、金融、生命科学等行业'
        WHERE id = 5
    """)
    c.execute("""
        UPDATE components_about_highlight_items
        SET content = '基于 AWS 全球基础设施的云原生架构'
        WHERE id = 6
    """)
    print(f"  highlightItems updated: 3")

    # subsidiarys (zh-Hans ids: 11-20)
    subsidiaries_zh = [
        (11, '管理与运营平台', 'XMAX AI Inc', '集团总部'),
        (12, '电商', 'XMAX E-Commerce Inc', 'XMAX 电商'),
        (13, '互娱', 'XMAX Interactive Entertainment Inc', 'XMAX 互娱'),
        (14, '供应链服务', 'XMAX Supply Chain Services Inc', 'XMAX 供应链'),
        (15, '太空计算', 'XMAX Space Computing Inc', 'XMAX 太空'),
        (16, '机器人', 'XMAX Robotics Inc', 'XMAX 机器人'),
        (17, '生命科学', 'XMAX Life Sciences Inc', 'XMAX 生命科学'),
        (18, '金融', 'XMAX Fintech Inc', 'XMAX 金融'),
        (19, '安全', 'XMAX Security Inc', 'XMAX 安全'),
        (20, '企业服务', 'XMAX Enterprise Services Inc', 'XMAX 企业服务'),
    ]
    for sid, business, legal, alias in subsidiaries_zh:
        c.execute("""
            UPDATE components_about_subsidiarys
            SET business = ?, legal_name = ?, alias = ?
            WHERE id = ?
        """, (business, legal, alias, sid))
    print(f"  subsidiarys updated: 10")

    conn.commit()

def fix_infra_page_components(conn):
    """修复基础设施页组件"""
    c = conn.cursor()

    # infraLayers (zh-Hans ids: 6-10)
    layers_zh = [
        (6, '推理网格', 'Inference Fabric', '分布式推理计算层',
         '构建跨区域、跨可用区的分布式推理计算网络，支持弹性伸缩与负载均衡',
         '支持 GPU/TPU 异构计算资源调度，实现毫秒级推理响应'),
        (7, '模型网关', 'Model Gateway', '统一模型接入层',
         '提供标准化模型接入、版本管理与路由分发能力，支持多模型并行推理',
         '内置模型性能监控与自动降级机制，保障服务稳定性'),
        (8, '智能体运行', 'Agent Runtime', '智能体执行环境',
         '提供安全隔离的智能体运行环境，支持多智能体协作与任务编排',
         '内置工具调用、记忆管理与上下文保持能力'),
        (9, '数据检索层', 'Data & Retrieval Layer', '数据与知识检索',
         '构建企业级向量数据库与知识图谱，支持多模态数据检索与语义搜索',
         '支持 RAG 增强生成、实时数据同步与隐私保护检索'),
        (10, '安全治理', 'Security & Governance', '安全与合规控制面',
         '提供全链路安全监控、合规审计与访问控制能力，满足企业级安全要求',
         '内置数据脱敏、模型安全检测与行为审计功能'),
    ]
    for lid, title, subtitle, icon, desc, details in layers_zh:
        c.execute("""
            UPDATE components_infra_layers
            SET title = ?, subtitle = ?, icon = ?, description = ?, details = ?
            WHERE id = ?
        """, (title, subtitle, icon, desc, details, lid))
    print(f"  infraLayers updated: 5")

    conn.commit()

def fix_business_page_components(conn):
    """修复业务页组件"""
    c = conn.cursor()

    # businessUnits (zh-Hans ids: 10-18)
    units_zh = [
        (10, '电商', 'XMAX 电商', 'AI 驱动的电商解决方案',
         '通过 AI 推理服务为电商平台提供智能推荐、动态定价、供应链预测与客服自动化能力，提升转化效率与用户体验。',
         '智能推荐,动态定价,供应链预测,客服自动化', '电商平台智能化升级,跨境电商多语言服务,直播电商实时互动', '依赖 Inference Fabric 与 Model Gateway'),
        (11, '互娱', 'XMAX 互娱', '数字娱乐与内容生成',
         '为游戏、影视、音乐等互娱场景提供 AI 内容生成、NPC 智能交互、实时渲染与个性化推荐服务。',
         '内容生成,NPC 智能,实时渲染,个性化推荐', '游戏 AI NPC 与剧情生成,影视内容智能制作,音乐创作辅助', '依赖 Agent Runtime 与 Data Retrieval Layer'),
        (12, '供应链服务', 'XMAX 供应链', '智能物流与供应链优化',
         '通过 AI 推理能力优化物流路径、库存管理与需求预测，构建端到端智能供应链服务体系。',
         '路径优化,库存管理,需求预测,智能调度', '智慧物流网络优化,仓储自动化管理,跨境供应链协同', '依赖 Inference Fabric 与 Security Mesh'),
        (13, '太空计算', 'XMAX 太空', '太空边缘 AI 推理节点',
         '在卫星与太空站部署边缘 AI 推理节点，支持遥感数据分析、太空通信优化与在轨智能决策。',
         '边缘推理,遥感分析,通信优化,在轨决策', '卫星遥感实时分析,太空通信智能优化,在轨设备自主运维', '依赖 Inference Fabric 与 Global Distribution'),
        (14, '机器人', 'XMAX 机器人', '具身智能与机器人系统',
         '为工业机器人、服务机器人与自动驾驶提供 AI 推理能力，实现感知、决策与控制的智能化。',
         '具身智能,感知决策,运动控制,多机协同', '工业机器人智能作业,服务机器人人机交互,自动驾驶感知融合', '依赖 Agent Runtime 与 Model Gateway'),
        (15, '生命科学', 'XMAX 生命科学', 'AI 辅助药物研发与诊断',
         '将 AI 推理能力应用于药物分子设计、临床试验优化与医学影像诊断，加速生命科学创新。',
         '分子设计,临床优化,影像诊断,基因组学', 'AI 药物发现,临床试验患者匹配,医学影像智能分析', '依赖 Data Retrieval Layer 与 Security Mesh'),
        (16, '金融', 'XMAX 金融', '智能风控与量化交易',
         '为金融机构提供实时风控、智能投顾、反欺诈与量化交易等 AI 推理服务。',
         '实时风控,智能投顾,反欺诈,量化交易', '信贷风险评估,保险智能核保,量化策略执行', '依赖 Security Mesh 与 Inference Fabric'),
        (17, '安全', 'XMAX 安全', '网络安全与数据保护',
         '提供 AI 驱动的威胁检测、漏洞分析与数据安全保护服务，构建主动防御体系。',
         '威胁检测,漏洞分析,数据保护,主动防御', '网络攻击实时检测,数据泄露智能预警,安全态势感知', '依赖 Security Mesh 全栈能力'),
        (18, '企业服务', 'XMAX 企业服务', '企业级 AI 中台服务',
         '为大型企业提供私有化 AI 中台部署、模型微调、知识库构建与智能办公自动化服务。',
         'AI 中台,模型微调,知识库,智能办公', '企业知识库构建,智能文档处理,流程自动化,决策辅助', '依赖全栈基础设施能力'),
    ]
    for uid, title, alias, subtitle, desc, tags, scenes, infra in units_zh:
        c.execute("""
            UPDATE components_business_units
            SET title = ?, alias = ?, subtitle = ?, description = ?, tags = ?, scenes = ?, infra_relation = ?
            WHERE id = ?
        """, (title, alias, subtitle, desc, tags, scenes, infra, uid))
    print(f"  businessUnits updated: 9")

    conn.commit()

def fix_aws_page_components(conn):
    """修复 AWS 页组件"""
    c = conn.cursor()

    # narrativePoints (zh-Hans ids: 5-8)
    narr_zh = [
        (5, 'Globe', '全球基础设施布局', '基于 AWS 全球 30+ 区域部署 AI 推理节点，实现就近服务与低时延响应'),
        (6, 'Zap', '弹性计算与推理优化', '利用 AWS Graviton 与 GPU 实例实现弹性伸缩，支持高并发推理请求'),
        (7, 'Shield', '安全治理与合规', '通过 AWS IAM、KMS、CloudTrail 构建全链路安全与合规体系'),
        (8, 'Network', '全球分发与低时延', '借助 AWS CloudFront 与 Global Accelerator 实现全球内容分发与边缘推理'),
    ]
    for nid, icon, title, desc in narr_zh:
        c.execute("""
            UPDATE components_aws_narrative_points
            SET icon = ?, title = ?, description = ?
            WHERE id = ?
        """, (icon, title, desc, nid))
    print(f"  narrativePoints updated: 4")

    # coreMessages (zh-Hans ids: 5-8)
    core_zh = [
        (5, '基于 AWS 全球基础设施构建 AI 推理服务能力'),
        (6, '业务适配多区域部署、弹性伸缩与低时延推理'),
        (7, '在 AI 推理、模型服务、数据检索与安全治理领域形成平台能力'),
        (8, '多垂直行业场景，具备与 AWS 联合拓展机会'),
    ]
    for cid, content in core_zh:
        c.execute("""
            UPDATE components_aws_core_messages
            SET content = ?
            WHERE id = ?
        """, (content, cid))
    print(f"  coreMessages updated: 4")

    # capabilityMappings (zh-Hans ids: 19-24)
    cap_zh = [
        (19, '全球推理网关', 'Amazon API Gateway + CloudFront 构建全球统一推理接入点'),
        (20, '模型与推理服务', 'Amazon SageMaker + EKS 承载模型训练与推理服务'),
        (21, '高性能推理优化', 'AWS Inferentia + Graviton 实现低成本高性能推理'),
        (22, '数据与检索层', 'Amazon OpenSearch + RDS + S3 构建多模态数据检索'),
        (23, '安全治理层', 'AWS IAM + KMS + CloudTrail + WAF 构建全链路安全'),
        (24, '全球分发与低时延', 'CloudFront + Global Accelerator + Lambda@Edge'),
    ]
    for cid, cap, desc in cap_zh:
        c.execute("""
            UPDATE components_aws_capability_mappings
            SET capability = ?, description = ?
            WHERE id = ?
        """, (cap, desc, cid))
    print(f"  capabilityMappings updated: 6")

    # statItems (zh-Hans ids: 4-6) — value 保持数字，label 改为中文
    stats_zh = [
        (4, '39', 'AWS 全球区域'),
        (5, '123', '可用区'),
        (6, '750+', '边缘节点'),
    ]
    for sid, value, label in stats_zh:
        c.execute("""
            UPDATE components_aws_stat_items
            SET value = ?, label = ?
            WHERE id = ?
        """, (value, label, sid))
    print(f"  awsStatItems updated: 3")

    conn.commit()

def main():
    print(f"Connecting to database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)

    print("\n=== Fixing Home Page Components (zh-Hans) ===")
    fix_home_page_components(conn)

    print("\n=== Fixing About Page Components (zh-Hans) ===")
    fix_about_page_components(conn)

    print("\n=== Fixing Infrastructure Page Components (zh-Hans) ===")
    fix_infra_page_components(conn)

    print("\n=== Fixing Business Page Components (zh-Hans) ===")
    fix_business_page_components(conn)

    print("\n=== Fixing AWS Page Components (zh-Hans) ===")
    fix_aws_page_components(conn)

    print("\n=== Verification ===")
    c = conn.cursor()

    # Verify heroSlides
    c.execute("SELECT id, title FROM components_home_hero_slides WHERE id IN (7,8)")
    print("  zh-Hans heroSlides:")
    for row in c.fetchall():
        print(f"    id={row[0]}: {row[1]}")

    # Verify en heroSlides still English
    c.execute("SELECT id, title FROM components_home_hero_slides WHERE id IN (3,4)")
    print("  en heroSlides:")
    for row in c.fetchall():
        print(f"    id={row[0]}: {row[1]}")

    conn.close()
    print("\nDone! zh-Hans components restored to Chinese.")

if __name__ == "__main__":
    main()
