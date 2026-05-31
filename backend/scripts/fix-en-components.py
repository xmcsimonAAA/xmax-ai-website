#!/usr/bin/env python3
"""
恢复 en locale 的组件数据 — 修复脚本把 en 组件也改成了中文的问题

此脚本将 en (entity_id=2) 关联的所有组件更新为正确的英文内容。
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", ".tmp", "data.db")

def main():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # ═══════════════════════════════════════════════════
    # HOME PAGE — en components
    # heroSlides: id=3,4  navCards: id=4,5,6  statItems: id=5,6,7,8
    # updateItems: id=4,5,6  ctaButtons: id=3,4
    # ═══════════════════════════════════════════════════
    for hid in [3, 4]:
        c.execute("""
            UPDATE components_home_hero_slides
            SET title = 'Building Global AI Inference Service Infrastructure',
                subtitle = 'Under XMAX Group, serving society through 9 business segments',
                tags = 'Global AI Inference,AWS-based Infrastructure,9 Business Units,XMAX Group System'
            WHERE id = ?
        """, (hid,))
    print("home heroSlides fixed")

    c.execute("UPDATE components_home_nav_cards SET title = 'Infrastructure', description = 'Building AI inference, model services, and data security capabilities on AWS global cloud infrastructure' WHERE id = 4")
    c.execute("UPDATE components_home_nav_cards SET title = 'Products & Services', description = 'Covering full-stack AI product matrix including Agent OS, Model Service Platform, and Data Intelligence Platform' WHERE id = 5")
    c.execute("UPDATE components_home_nav_cards SET title = 'Business Map', description = '9 business segments covering e-commerce, entertainment, finance, life sciences, and more' WHERE id = 6")
    print("home navCards fixed")

    c.execute("UPDATE components_home_stat_items SET label = 'Business Segments', value = '9' WHERE id = 5")
    c.execute("UPDATE components_home_stat_items SET label = 'Global Deployment Regions', value = '30+' WHERE id = 6")
    c.execute("UPDATE components_home_stat_items SET label = 'Industry Solutions', value = '100+' WHERE id = 7")
    c.execute("UPDATE components_home_stat_items SET label = 'Service Availability', value = '99.9%' WHERE id = 8")
    print("home statItems fixed")

    c.execute("UPDATE components_home_update_items SET title = 'XMAX AI Agent OS Officially Released', tag = 'Product Launch' WHERE id = 4")
    c.execute("UPDATE components_home_update_items SET title = 'XMAX AI Deepens Global Partnership with AWS', tag = 'Partnership' WHERE id = 5")
    c.execute("UPDATE components_home_update_items SET title = 'XMAX AI Completes New Round of Strategic Financing', tag = 'Company News' WHERE id = 6")
    print("home updateItems fixed")

    # ═══════════════════════════════════════════════════
    # ABOUT PAGE — en components
    # valueItems: id=4,5,6  highlightItems: id=4,5,6  subsidiaries: id=11-20
    # ═══════════════════════════════════════════════════
    c.execute("UPDATE components_about_value_items SET title = 'Trustworthy', description = 'Security governance, access control, and compliance requirements across the full stack' WHERE id = 4")
    c.execute("UPDATE components_about_value_items SET title = 'Scalable', description = 'Elastic scaling, cross-region deployment, and multi-scenario reuse' WHERE id = 5")
    c.execute("UPDATE components_about_value_items SET title = 'Implementable', description = '9 business segments driving continuous AI application in commercial and social scenarios' WHERE id = 6")
    print("about valueItems fixed")

    c.execute("UPDATE components_about_highlight_items SET content = 'Builder of Global AI Inference Service Infrastructure' WHERE id = 4")
    c.execute("UPDATE components_about_highlight_items SET content = '9 business segments covering e-commerce, entertainment, finance, life sciences, and other industries' WHERE id = 5")
    c.execute("UPDATE components_about_highlight_items SET content = 'Cloud-native architecture based on AWS global infrastructure' WHERE id = 6")
    print("about highlightItems fixed")

    subs_en = [
        (11, 'Management & Operations Platform', 'XMAX AI Inc', 'XMAX AI'),
        (12, 'E-Commerce', 'XMAX E-Commerce Pte. Ltd.', 'XMAX E-Commerce'),
        (13, 'Interactive Entertainment', 'XMAX Interactive Entertainment Pte. Ltd.', 'XMAX Entertainment'),
        (14, 'Supply Chain Services', 'XMAX Supply Chain Pte. Ltd.', 'XMAX Supply Chain'),
        (15, 'Space Computing', 'XMAX Space Computing Pte. Ltd.', 'XMAX Space'),
        (16, 'Robotics', 'XMAX Robotics Pte. Ltd.', 'XMAX Robotics'),
        (17, 'Life Sciences', 'XMAX Life Sciences Pte. Ltd.', 'XMAX Life Sciences'),
        (18, 'Finance', 'XMAX Fintech Pte. Ltd.', 'XMAX Fintech'),
        (19, 'Security', 'XMAX Security Pte. Ltd.', 'XMAX Security'),
        (20, 'Enterprise Services', 'XMAX Enterprise Services Pte. Ltd.', 'XMAX Enterprise'),
    ]
    for sid, business, legal, alias in subs_en:
        c.execute("UPDATE components_about_subsidiarys SET business = ?, legal_name = ?, alias = ? WHERE id = ?",
                  (business, legal, alias, sid))
    print("about subsidiarys fixed")

    # ═══════════════════════════════════════════════════
    # INFRASTRUCTURE PAGE — en components
    # layers: id=6,7,8,9,10
    # ═══════════════════════════════════════════════════
    layers_en = [
        (6, 'Inference Fabric', 'Inference Foundation', 'Cpu',
         'Unified hosting of inference calls for large models and industry models',
         'Supports GPU/TPU heterogeneous compute resource scheduling for millisecond-level inference response'),
        (7, 'Model Gateway', 'Model Gateway', 'Network',
         'Unified access to models, versions, policies, quotas, and call logs',
         'Built-in model performance monitoring and automatic fallback mechanisms'),
        (8, 'Agent Runtime', 'Agent Runtime Layer', 'Bot',
         'Supporting workflows, tool calls, and enterprise task orchestration',
         'Built-in tool invocation, memory management, and context persistence'),
        (9, 'Data & Retrieval Layer', 'Data & Knowledge Retrieval', 'Database',
         'Building enterprise-grade vector databases and knowledge graphs with multi-modal data retrieval',
         'Supporting RAG-enhanced generation, real-time data sync, and privacy-preserving search'),
        (10, 'Security & Governance', 'Security & Compliance Control Plane', 'ShieldCheck',
         'Full-stack security monitoring, compliance auditing, and access control',
         'Built-in data masking, model security detection, and behavior auditing'),
    ]
    for lid, title, subtitle, icon, desc, details in layers_en:
        c.execute("UPDATE components_infra_layers SET title = ?, subtitle = ?, icon = ?, description = ?, details = ? WHERE id = ?",
                  (title, subtitle, icon, desc, details, lid))
    print("infra layers fixed")

    # ═══════════════════════════════════════════════════
    # BUSINESS PAGE — en components
    # businessUnits: id=10-18
    # ═══════════════════════════════════════════════════
    units_en = [
        (10, 'E-Commerce', 'XMAX E-Commerce', 'AI-Powered E-Commerce Solutions',
         'Providing AI inference services for intelligent recommendations, dynamic pricing, supply chain prediction, and customer service automation.',
         'Intelligent Recommendations,Dynamic Pricing,Supply Chain Prediction,Customer Service Automation',
         'E-commerce platform intelligence upgrade,Cross-border e-commerce multilingual services,Livestream e-commerce real-time interaction',
         'Depends on Inference Fabric & Model Gateway'),
        (11, 'Interactive Entertainment', 'XMAX Entertainment', 'Digital Entertainment & Content Generation',
         'Providing AI content generation, NPC intelligent interaction, real-time rendering, and personalized recommendation for gaming, film, and music.',
         'Content Generation,NPC Intelligence,Real-time Rendering,Personalized Recommendations',
         'Game AI NPC & storyline generation,Film content intelligent production,Music creation assistance',
         'Depends on Agent Runtime & Data Retrieval Layer'),
        (12, 'Supply Chain Services', 'XMAX Supply Chain', 'Intelligent Logistics & Supply Chain Optimization',
         'Optimizing logistics routes, inventory management, and demand prediction through AI inference capabilities.',
         'Route Optimization,Inventory Management,Demand Prediction,Intelligent Scheduling',
         'Smart logistics network optimization,Warehouse automation management,Cross-border supply chain collaboration',
         'Depends on Inference Fabric & Security Mesh'),
        (13, 'Space Computing', 'XMAX Space', 'Space Edge AI Inference Nodes',
         'Deploying edge AI inference nodes on satellites and space stations for remote sensing analysis and on-orbit intelligent decision-making.',
         'Edge Inference,Remote Sensing Analysis,Communication Optimization,On-orbit Decision',
         'Satellite remote sensing real-time analysis,Space communication intelligent optimization,On-orbit device autonomous operations',
         'Depends on Inference Fabric & Global Distribution'),
        (14, 'Robotics', 'XMAX Robotics', 'Embodied Intelligence & Robotics Systems',
         'Providing AI inference capabilities for industrial robots, service robots, and autonomous driving.',
         'Embodied Intelligence,Perception & Decision,Motion Control,Multi-robot Coordination',
         'Industrial robot intelligent operations,Service robot human-robot interaction,Autonomous driving perception fusion',
         'Depends on Agent Runtime & Model Gateway'),
        (15, 'Life Sciences', 'XMAX Life Sciences', 'AI-Assisted Drug Discovery & Diagnostics',
         'Applying AI inference to drug molecular design, clinical trial optimization, and medical imaging diagnostics.',
         'Molecular Design,Clinical Optimization,Imaging Diagnostics,Genomics',
         'AI drug discovery,Clinical trial patient matching,Medical imaging intelligent analysis',
         'Depends on Data Retrieval Layer & Security Mesh'),
        (16, 'Finance', 'XMAX Fintech', 'Intelligent Risk Control & Quantitative Trading',
         'Providing real-time risk control, intelligent advisory, anti-fraud, and quantitative trading AI inference services.',
         'Real-time Risk Control,Intelligent Advisory,Anti-fraud,Quantitative Trading',
         'Credit risk assessment,Insurance intelligent underwriting,Quantitative strategy execution',
         'Depends on Security Mesh & Inference Fabric'),
        (17, 'Security', 'XMAX Security', 'Cybersecurity & Data Protection',
         'Providing AI-driven threat detection, vulnerability analysis, and data security protection services.',
         'Threat Detection,Vulnerability Analysis,Data Protection,Active Defense',
         'Network attack real-time detection,Data breach intelligent warning,Security posture awareness',
         'Depends on Security Mesh full-stack capabilities'),
        (18, 'Enterprise Services', 'XMAX Enterprise', 'Enterprise AI Middle Platform Services',
         'Providing private AI middle platform deployment, model fine-tuning, knowledge base construction, and intelligent office automation.',
         'AI Middle Platform,Model Fine-tuning,Knowledge Base,Intelligent Office',
         'Enterprise knowledge base construction,Intelligent document processing,Process automation,Decision support',
         'Depends on full-stack infrastructure capabilities'),
    ]
    for uid, title, alias, subtitle, desc, tags, scenes, infra in units_en:
        c.execute("UPDATE components_business_units SET title = ?, alias = ?, subtitle = ?, description = ?, tags = ?, scenes = ?, infra_relation = ? WHERE id = ?",
                  (title, alias, subtitle, desc, tags, scenes, infra, uid))
    print("business units fixed")

    # ═══════════════════════════════════════════════════
    # AWS PAGE — en components
    # narrativePoints: id=5-8  coreMessages: id=5-8
    # capabilityMappings: id=19-24  statItems: id=4-6
    # ═══════════════════════════════════════════════════
    narr_en = [
        (5, 'Globe', 'Global Infrastructure Layout', 'Deploying AI inference nodes across AWS 30+ global regions for proximity service and low-latency response'),
        (6, 'Zap', 'Elastic Computing & Inference Optimization', 'Leveraging AWS Graviton and GPU instances for elastic scaling, supporting high-concurrency inference requests'),
        (7, 'Shield', 'Security Governance & Compliance', 'Building full-stack security and compliance through AWS IAM, KMS, and CloudTrail'),
        (8, 'Network', 'Global Distribution & Low Latency', 'Achieving global content delivery and edge inference via AWS CloudFront and Global Accelerator'),
    ]
    for nid, icon, title, desc in narr_en:
        c.execute("UPDATE components_aws_narrative_points SET icon = ?, title = ?, description = ? WHERE id = ?",
                  (icon, title, desc, nid))
    print("aws narrativePoints fixed")

    core_en = [
        (5, 'Building AI inference service capabilities on AWS global infrastructure'),
        (6, 'Business suited for multi-region deployment, elastic scaling, and low-latency inference'),
        (7, 'Platform capabilities formed in AI inference, model services, data retrieval, and security governance'),
        (8, 'Multiple vertical industry scenarios with joint expansion opportunities with AWS'),
    ]
    for cid, content in core_en:
        c.execute("UPDATE components_aws_core_messages SET content = ? WHERE id = ?", (content, cid))
    print("aws coreMessages fixed")

    cap_en = [
        (19, 'Global Inference Gateway', 'Amazon API Gateway + CloudFront for unified global inference access points'),
        (20, 'Model & Inference Services', 'Amazon SageMaker + EKS hosting model training and inference services'),
        (21, 'High-Performance Inference Optimization', 'AWS Inferentia + Graviton for cost-effective high-performance inference'),
        (22, 'Data & Retrieval Layer', 'Amazon OpenSearch + RDS + S3 for multi-modal data retrieval'),
        (23, 'Security Governance Layer', 'AWS IAM + KMS + CloudTrail + WAF for full-stack security'),
        (24, 'Global Distribution & Low Latency', 'CloudFront + Global Accelerator + Lambda@Edge'),
    ]
    for cid, cap, desc in cap_en:
        c.execute("UPDATE components_aws_capability_mappings SET capability = ?, description = ? WHERE id = ?",
                  (cap, desc, cid))
    print("aws capabilityMappings fixed")

    c.execute("UPDATE components_aws_stat_items SET value = '39', label = 'AWS Global Regions' WHERE id = 4")
    c.execute("UPDATE components_aws_stat_items SET value = '123', label = 'Availability Zones' WHERE id = 5")
    c.execute("UPDATE components_aws_stat_items SET value = '750+', label = 'Edge Nodes' WHERE id = 6")
    print("aws statItems fixed")

    conn.commit()

    # ═══════════════════════════════════════════════════
    # VERIFICATION
    # ═══════════════════════════════════════════════════
    print("\n=== Verification ===")
    c.execute("SELECT id, title FROM components_about_value_items WHERE id IN (4,5,6)")
    print("en valueItems:", [(r[0], r[1]) for r in c.fetchall()])
    c.execute("SELECT id, title FROM components_about_value_items WHERE id IN (7,8,9)")
    print("zh valueItems:", [(r[0], r[1]) for r in c.fetchall()])

    c.execute("SELECT id, title FROM components_aws_narrative_points WHERE id IN (5,6,7,8)")
    print("en narrativePoints:", [(r[0], r[1]) for r in c.fetchall()])
    c.execute("SELECT id, title FROM components_aws_narrative_points WHERE id IN (13,14,15,16)")
    print("zh narrativePoints:", [(r[0], r[1]) for r in c.fetchall()])

    c.execute("SELECT id, title FROM components_infra_layers WHERE id IN (6,7,8,9,10)")
    print("en infraLayers:", [(r[0], r[1]) for r in c.fetchall()])
    c.execute("SELECT id, title FROM components_infra_layers WHERE id IN (11,12,13,14,15)")
    print("zh infraLayers:", [(r[0], r[1]) for r in c.fetchall()])

    c.execute("SELECT id, title FROM components_business_units WHERE id IN (10,11,12)")
    print("en businessUnits (sample):", [(r[0], r[1]) for r in c.fetchall()])
    c.execute("SELECT id, title FROM components_business_units WHERE id IN (19,20,21)")
    print("zh businessUnits (sample):", [(r[0], r[1]) for r in c.fetchall()])

    conn.close()
    print("\nDone! en components restored to English.")

if __name__ == "__main__":
    main()
