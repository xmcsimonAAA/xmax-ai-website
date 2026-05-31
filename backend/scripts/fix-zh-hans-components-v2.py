#!/usr/bin/env python3
"""
修复 zh-Hans locale 的组件数据 — 第2版

第1版搞错了组件 id，把 en 的组件改成了中文。
此版本根据 about_pages_cmps / home_pages_cmps 等关联表，
找到正确的 zh-Hans 组件 id 并更新为中文。
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", ".tmp", "data.db")

def get_zh_components(conn, table_prefix, field_name):
    """获取 zh-Hans (entity_id=1) 关联的组件 id 列表"""
    c = conn.cursor()
    table_name = f"{table_prefix}_pages_cmps" if table_prefix != "site" else "site_settings_cmps"
    c.execute(f"""
        SELECT cmp_id, field FROM {table_name}
        WHERE entity_id = 1 ORDER BY field, "order"
    """)
    result = {}
    for cmp_id, field in c.fetchall():
        if field not in result:
            result[field] = []
        result[field].append(cmp_id)
    return result

def fix_about_page(conn):
    """修复关于页组件"""
    c = conn.cursor()
    zh = get_zh_components(conn, "about", "values")

    # value-items (zh-Hans ids: 7, 8, 9)
    value_ids = zh.get("values", [7, 8, 9])
    values_zh = [
        (value_ids[0] if len(value_ids) > 0 else 7, '可信', '基于 AWS 全球基础设施构建安全、合规、可审计的 AI 推理服务体系'),
        (value_ids[1] if len(value_ids) > 1 else 8, '可扩展', '支持跨区域、跨业务板块的弹性扩展与统一调度'),
        (value_ids[2] if len(value_ids) > 2 else 9, '可落地', '通过 9 大业务板块将 AI 能力转化为可交付的产业服务'),
    ]
    for vid, title, desc in values_zh:
        c.execute("""
            UPDATE components_about_value_items
            SET title = ?, description = ?
            WHERE id = ?
        """, (title, desc, vid))
    print(f"  valueItems (ids={value_ids}) updated")

    # highlight-items (zh-Hans ids: 7, 8, 9)
    highlight_ids = zh.get("highlights", [7, 8, 9])
    highlights_zh = [
        (highlight_ids[0] if len(highlight_ids) > 0 else 7, '全球 AI 推理服务基础设施构建者'),
        (highlight_ids[1] if len(highlight_ids) > 1 else 8, '9 大业务板块覆盖电商、互娱、金融、生命科学等行业'),
        (highlight_ids[2] if len(highlight_ids) > 2 else 9, '基于 AWS 全球基础设施的云原生架构'),
    ]
    for hid, content in highlights_zh:
        c.execute("""
            UPDATE components_about_highlight_items
            SET content = ?
            WHERE id = ?
        """, (content, hid))
    print(f"  highlightItems (ids={highlight_ids}) updated")

    # subsidiaries (zh-Hans ids: 21-30)
    sub_ids = zh.get("subsidiaries", list(range(21, 31)))
    subsidiaries_zh = [
        ('管理与运营平台', 'XMAX AI Inc', '集团总部'),
        ('电商', 'XMAX E-Commerce Pte. Ltd.', 'XMAX 电商'),
        ('互娱', 'XMAX Interactive Entertainment Pte. Ltd.', 'XMAX 互娱'),
        ('供应链服务', 'XMAX Supply Chain Pte. Ltd.', 'XMAX 供应链'),
        ('太空计算', 'XMAX Space Computing Pte. Ltd.', 'XMAX 太空'),
        ('机器人', 'XMAX Robotics Pte. Ltd.', 'XMAX 机器人'),
        ('生命科学', 'XMAX Life Sciences Pte. Ltd.', 'XMAX 生命科学'),
        ('金融', 'XMAX Fintech Pte. Ltd.', 'XMAX 金融'),
        ('安全', 'XMAX Security Pte. Ltd.', 'XMAX 安全'),
        ('企业服务', 'XMAX Enterprise Services Pte. Ltd.', 'XMAX 企业服务'),
    ]
    for i, (business, legal, alias) in enumerate(subsidiaries_zh):
        sid = sub_ids[i] if i < len(sub_ids) else 21 + i
        c.execute("""
            UPDATE components_about_subsidiarys
            SET business = ?, legal_name = ?, alias = ?
            WHERE id = ?
        """, (business, legal, alias, sid))
    print(f"  subsidiarys (ids={sub_ids}) updated")

    conn.commit()

def fix_home_page(conn):
    """修复首页组件"""
    c = conn.cursor()
    zh = get_zh_components(conn, "home", "heroSlides")

    # heroSlides
    hero_ids = zh.get("heroSlides", [7, 8])
    for hid in hero_ids:
        c.execute("""
            UPDATE components_home_hero_slides
            SET title = '构建全球 AI 推理服务基础设施',
                subtitle = '在 XMAX 集团体系下，通过 9 大业务板块服务全社会',
                tags = '全球 AI 推理,AWS 基础架构,9 大业务板块,XMAX 集团体系'
            WHERE id = ?
        """, (hid,))
    print(f"  heroSlides (ids={hero_ids}) updated")

    # navCards
    nav_ids = zh.get("navCards", [10, 11, 12])
    nav_zh = [
        (nav_ids[0] if len(nav_ids) > 0 else 10, 'AI 基础设施', '基于 AWS 全球云基础设施构建 AI 推理、模型服务与数据安全能力'),
        (nav_ids[1] if len(nav_ids) > 1 else 11, 'AI 产品与服务', '覆盖全栈 AI 产品矩阵，包括 Agent OS、模型服务平台与数据智能平台'),
        (nav_ids[2] if len(nav_ids) > 2 else 12, '业务版图', '9 大业务板块覆盖电商、互娱、金融、生命科学等领域'),
    ]
    for nid, title, desc in nav_zh:
        c.execute("""
            UPDATE components_home_nav_cards
            SET title = ?, description = ?
            WHERE id = ?
        """, (title, desc, nid))
    print(f"  navCards (ids={nav_ids}) updated")

    # statItems
    stat_ids = zh.get("stats", [13, 14, 15, 16])
    stats_zh = [
        (stat_ids[0] if len(stat_ids) > 0 else 13, '业务板块', '9'),
        (stat_ids[1] if len(stat_ids) > 1 else 14, '全球部署区域', '30+'),
        (stat_ids[2] if len(stat_ids) > 2 else 15, '行业解决方案', '100+'),
        (stat_ids[3] if len(stat_ids) > 3 else 16, '服务可用性', '99.9%'),
    ]
    for sid, label, value in stats_zh:
        c.execute("""
            UPDATE components_home_stat_items
            SET label = ?, value = ?
            WHERE id = ?
        """, (label, value, sid))
    print(f"  statItems (ids={stat_ids}) updated")

    # updateItems
    update_ids = zh.get("recentUpdates", [10, 11, 12])
    updates_zh = [
        (update_ids[0] if len(update_ids) > 0 else 10, 'XMAX AI Agent OS 正式发布', '产品发布'),
        (update_ids[1] if len(update_ids) > 1 else 11, 'XMAX AI 与 AWS 深化全球合作伙伴关系', '合作动态'),
        (update_ids[2] if len(update_ids) > 2 else 12, 'XMAX AI 完成新一轮战略融资', '公司新闻'),
    ]
    for uid, title, tag in updates_zh:
        c.execute("""
            UPDATE components_home_update_items
            SET title = ?, tag = ?
            WHERE id = ?
        """, (title, tag, uid))
    print(f"  updateItems (ids={update_ids}) updated")

    conn.commit()

def fix_infra_page(conn):
    """修复基础设施页组件"""
    c = conn.cursor()
    zh = get_zh_components(conn, "infrastructure", "layers")

    layer_ids = zh.get("layers", [6, 7, 8, 9, 10])
    layers_zh = [
        ('推理网格', 'Inference Fabric', '分布式推理计算层',
         '构建跨区域、跨可用区的分布式推理计算网络，支持弹性伸缩与负载均衡',
         '支持 GPU/TPU 异构计算资源调度，实现毫秒级推理响应'),
        ('模型网关', 'Model Gateway', '统一模型接入层',
         '提供标准化模型接入、版本管理与路由分发能力，支持多模型并行推理',
         '内置模型性能监控与自动降级机制，保障服务稳定性'),
        ('智能体运行', 'Agent Runtime', '智能体执行环境',
         '提供安全隔离的智能体运行环境，支持多智能体协作与任务编排',
         '内置工具调用、记忆管理与上下文保持能力'),
        ('数据检索层', 'Data & Retrieval Layer', '数据与知识检索',
         '构建企业级向量数据库与知识图谱，支持多模态数据检索与语义搜索',
         '支持 RAG 增强生成、实时数据同步与隐私保护检索'),
        ('安全治理', 'Security & Governance', '安全与合规控制面',
         '提供全链路安全监控、合规审计与访问控制能力，满足企业级安全要求',
         '内置数据脱敏、模型安全检测与行为审计功能'),
    ]
    for i, (title, subtitle, icon, desc, details) in enumerate(layers_zh):
        lid = layer_ids[i] if i < len(layer_ids) else 6 + i
        c.execute("""
            UPDATE components_infra_layers
            SET title = ?, subtitle = ?, icon = ?, description = ?, details = ?
            WHERE id = ?
        """, (title, subtitle, icon, desc, details, lid))
    print(f"  infraLayers (ids={layer_ids}) updated")

    conn.commit()

def fix_business_page(conn):
    """修复业务页组件"""
    c = conn.cursor()
    zh = get_zh_components(conn, "business", "businessUnits")

    unit_ids = zh.get("businessUnits", [10, 11, 12, 13, 14, 15, 16, 17, 18])
    units_zh = [
        ('电商', 'XMAX 电商', 'AI 驱动的电商解决方案',
         '通过 AI 推理服务为电商平台提供智能推荐、动态定价、供应链预测与客服自动化能力，提升转化效率与用户体验。',
         '智能推荐,动态定价,供应链预测,客服自动化', '电商平台智能化升级,跨境电商多语言服务,直播电商实时互动', '依赖 Inference Fabric 与 Model Gateway'),
        ('互娱', 'XMAX 互娱', '数字娱乐与内容生成',
         '为游戏、影视、音乐等互娱场景提供 AI 内容生成、NPC 智能交互、实时渲染与个性化推荐服务。',
         '内容生成,NPC 智能,实时渲染,个性化推荐', '游戏 AI NPC 与剧情生成,影视内容智能制作,音乐创作辅助', '依赖 Agent Runtime 与 Data Retrieval Layer'),
        ('供应链服务', 'XMAX 供应链', '智能物流与供应链优化',
         '通过 AI 推理能力优化物流路径、库存管理与需求预测，构建端到端智能供应链服务体系。',
         '路径优化,库存管理,需求预测,智能调度', '智慧物流网络优化,仓储自动化管理,跨境供应链协同', '依赖 Inference Fabric 与 Security Mesh'),
        ('太空计算', 'XMAX 太空', '太空边缘 AI 推理节点',
         '在卫星与太空站部署边缘 AI 推理节点，支持遥感数据分析、太空通信优化与在轨智能决策。',
         '边缘推理,遥感分析,通信优化,在轨决策', '卫星遥感实时分析,太空通信智能优化,在轨设备自主运维', '依赖 Inference Fabric 与 Global Distribution'),
        ('机器人', 'XMAX 机器人', '具身智能与机器人系统',
         '为工业机器人、服务机器人与自动驾驶提供 AI 推理能力，实现感知、决策与控制的智能化。',
         '具身智能,感知决策,运动控制,多机协同', '工业机器人智能作业,服务机器人人机交互,自动驾驶感知融合', '依赖 Agent Runtime 与 Model Gateway'),
        ('生命科学', 'XMAX 生命科学', 'AI 辅助药物研发与诊断',
         '将 AI 推理能力应用于药物分子设计、临床试验优化与医学影像诊断，加速生命科学创新。',
         '分子设计,临床优化,影像诊断,基因组学', 'AI 药物发现,临床试验患者匹配,医学影像智能分析', '依赖 Data Retrieval Layer 与 Security Mesh'),
        ('金融', 'XMAX 金融', '智能风控与量化交易',
         '为金融机构提供实时风控、智能投顾、反欺诈与量化交易等 AI 推理服务。',
         '实时风控,智能投顾,反欺诈,量化交易', '信贷风险评估,保险智能核保,量化策略执行', '依赖 Security Mesh 与 Inference Fabric'),
        ('安全', 'XMAX 安全', '网络安全与数据保护',
         '提供 AI 驱动的威胁检测、漏洞分析与数据安全保护服务，构建主动防御体系。',
         '威胁检测,漏洞分析,数据保护,主动防御', '网络攻击实时检测,数据泄露智能预警,安全态势感知', '依赖 Security Mesh 全栈能力'),
        ('企业服务', 'XMAX 企业服务', '企业级 AI 中台服务',
         '为大型企业提供私有化 AI 中台部署、模型微调、知识库构建与智能办公自动化服务。',
         'AI 中台,模型微调,知识库,智能办公', '企业知识库构建,智能文档处理,流程自动化,决策辅助', '依赖全栈基础设施能力'),
    ]
    for i, (title, alias, subtitle, desc, tags, scenes, infra) in enumerate(units_zh):
        uid = unit_ids[i] if i < len(unit_ids) else 10 + i
        c.execute("""
            UPDATE components_business_units
            SET title = ?, alias = ?, subtitle = ?, description = ?, tags = ?, scenes = ?, infra_relation = ?
            WHERE id = ?
        """, (title, alias, subtitle, desc, tags, scenes, infra, uid))
    print(f"  businessUnits (ids={unit_ids}) updated")

    conn.commit()

def fix_aws_page(conn):
    """修复 AWS 页组件"""
    c = conn.cursor()
    zh = get_zh_components(conn, "aws", "narrativePoints")

    # narrativePoints
    narr_ids = zh.get("narrativePoints", [5, 6, 7, 8])
    narr_zh = [
        (narr_ids[0] if len(narr_ids) > 0 else 5, 'Globe', '全球基础设施布局', '基于 AWS 全球 30+ 区域部署 AI 推理节点，实现就近服务与低时延响应'),
        (narr_ids[1] if len(narr_ids) > 1 else 6, 'Zap', '弹性计算与推理优化', '利用 AWS Graviton 与 GPU 实例实现弹性伸缩，支持高并发推理请求'),
        (narr_ids[2] if len(narr_ids) > 2 else 7, 'Shield', '安全治理与合规', '通过 AWS IAM、KMS、CloudTrail 构建全链路安全与合规体系'),
        (narr_ids[3] if len(narr_ids) > 3 else 8, 'Network', '全球分发与低时延', '借助 AWS CloudFront 与 Global Accelerator 实现全球内容分发与边缘推理'),
    ]
    for nid, icon, title, desc in narr_zh:
        c.execute("""
            UPDATE components_aws_narrative_points
            SET icon = ?, title = ?, description = ?
            WHERE id = ?
        """, (icon, title, desc, nid))
    print(f"  narrativePoints (ids={narr_ids}) updated")

    # coreMessages
    core_ids = zh.get("coreMessages", [5, 6, 7, 8])
    core_zh = [
        (core_ids[0] if len(core_ids) > 0 else 5, '基于 AWS 全球基础设施构建 AI 推理服务能力'),
        (core_ids[1] if len(core_ids) > 1 else 6, '业务适配多区域部署、弹性伸缩与低时延推理'),
        (core_ids[2] if len(core_ids) > 2 else 7, '在 AI 推理、模型服务、数据检索与安全治理领域形成平台能力'),
        (core_ids[3] if len(core_ids) > 3 else 8, '多垂直行业场景，具备与 AWS 联合拓展机会'),
    ]
    for cid, content in core_zh:
        c.execute("""
            UPDATE components_aws_core_messages
            SET content = ?
            WHERE id = ?
        """, (content, cid))
    print(f"  coreMessages (ids={core_ids}) updated")

    # capabilityMappings
    cap_ids = zh.get("capabilityMappings", [19, 20, 21, 22, 23, 24])
    cap_zh = [
        (cap_ids[0] if len(cap_ids) > 0 else 19, '全球推理网关', 'Amazon API Gateway + CloudFront 构建全球统一推理接入点'),
        (cap_ids[1] if len(cap_ids) > 1 else 20, '模型与推理服务', 'Amazon SageMaker + EKS 承载模型训练与推理服务'),
        (cap_ids[2] if len(cap_ids) > 2 else 21, '高性能推理优化', 'AWS Inferentia + Graviton 实现低成本高性能推理'),
        (cap_ids[3] if len(cap_ids) > 3 else 22, '数据与检索层', 'Amazon OpenSearch + RDS + S3 构建多模态数据检索'),
        (cap_ids[4] if len(cap_ids) > 4 else 23, '安全治理层', 'AWS IAM + KMS + CloudTrail + WAF 构建全链路安全'),
        (cap_ids[5] if len(cap_ids) > 5 else 24, '全球分发与低时延', 'CloudFront + Global Accelerator + Lambda@Edge'),
    ]
    for cid, cap, desc in cap_zh:
        c.execute("""
            UPDATE components_aws_capability_mappings
            SET capability = ?, description = ?
            WHERE id = ?
        """, (cap, desc, cid))
    print(f"  capabilityMappings (ids={cap_ids}) updated")

    # awsStats
    stat_ids = zh.get("awsStats", [4, 5, 6])
    stats_zh = [
        (stat_ids[0] if len(stat_ids) > 0 else 4, '39', 'AWS 全球区域'),
        (stat_ids[1] if len(stat_ids) > 1 else 5, '123', '可用区'),
        (stat_ids[2] if len(stat_ids) > 2 else 6, '750+', '边缘节点'),
    ]
    for sid, value, label in stats_zh:
        c.execute("""
            UPDATE components_aws_stat_items
            SET value = ?, label = ?
            WHERE id = ?
        """, (value, label, sid))
    print(f"  awsStatItems (ids={stat_ids}) updated")

    conn.commit()

def main():
    print(f"Connecting to database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)

    print("\n=== Fixing Home Page Components (zh-Hans) ===")
    fix_home_page(conn)

    print("\n=== Fixing About Page Components (zh-Hans) ===")
    fix_about_page(conn)

    print("\n=== Fixing Infrastructure Page Components (zh-Hans) ===")
    fix_infra_page(conn)

    print("\n=== Fixing Business Page Components (zh-Hans) ===")
    fix_business_page(conn)

    print("\n=== Fixing AWS Page Components (zh-Hans) ===")
    fix_aws_page(conn)

    print("\n=== Verification ===")
    c = conn.cursor()

    # Verify about value items
    c.execute("SELECT id, title FROM components_about_value_items WHERE id IN (7,8,9)")
    print("  zh-Hans valueItems:")
    for row in c.fetchall():
        print(f"    id={row[0]}: {row[1]}")

    # Verify en value items still English
    c.execute("SELECT id, title FROM components_about_value_items WHERE id IN (4,5,6)")
    print("  en valueItems:")
    for row in c.fetchall():
        print(f"    id={row[0]}: {row[1]}")

    conn.close()
    print("\nDone! zh-Hans components restored to Chinese (correct ids this time).")

if __name__ == "__main__":
    main()
