#!/usr/bin/env python3
"""
修复 Products 和 Contact 页面的 en locale 组件数据
为 en locale 创建英文版本的组件记录
"""
import sqlite3
import os

DB_PATH = "/Users/simon/Desktop/xmax-ai-studio/.tmp/data.db"

def main():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # ========== Products Page ==========
    # en products_page id = 2
    # 需要创建 5 个英文 product items

    # 先删除可能已存在的 en 组件关联（虽然 _cmps 表为空，但以防万一）
    c.execute("DELETE FROM products_pages_cmps WHERE entity_id = 2")

    # 创建英文 product items
    product_items_en = [
        ("XMAX Inference Grid", "Cloud", "Unified AI inference service entry point for enterprises and business systems.", "Enterprise Inference / Multi-tenant / Elastic Scaling", "Unified large model and industry model inference calls\nElastic scaling and service routing for multi-business scenarios\nUnified AI inference service entry point for enterprises and business systems"),
        ("XMAX Model Gateway", "Layers3", "Model access, routing, quota, monitoring and governance platform.", "Model Governance / Version Control / Policy Orchestration", "Unified model, version, policy, quota and call log access\nModel access, routing, quota, monitoring and governance\nVersion control and policy orchestration capabilities"),
        ("XMAX Agent Studio", "Workflow", "For workflows, task automation and industry agent construction.", "Agent Runtime / Tool Calling / Task Orchestration", "Supporting workflows, tool calling, enterprise task orchestration\nIndustry agent construction and operation\nTask automation and tool calling capabilities"),
        ("XMAX Knowledge Engine", "BrainCircuit", "Intelligent engine for enterprise knowledge, retrieval augmentation and data collaboration.", "Knowledge Retrieval / RAG / Data Collaboration", "Supporting enterprise knowledge base, industry data and retrieval augmentation\nIntelligent engine for enterprise knowledge and data collaboration\nRetrieval Augmented Generation (RAG) and knowledge management capabilities"),
        ("XMAX Security Mesh", "Shield", "For security auditing, access control, guardrail policies and operational governance.", "Security Governance / Audit Trail / Control Plane", "Covering access control, auditing, guardrail policies\nSecurity audit and access control platform\nGuardrail policy and operational governance capabilities"),
    ]

    en_product_ids = []
    for name, icon, desc, scene, details in product_items_en:
        c.execute("""
            INSERT INTO components_product_items (name, icon, description, scene, details)
            VALUES (?, ?, ?, ?, ?)
        """, (name, icon, desc, scene, details))
        en_product_ids.append(c.lastrowid)

    # 关联到 en products_page (entity_id=2)
    for i, cmp_id in enumerate(en_product_ids):
        c.execute("""
            INSERT INTO products_pages_cmps (entity_id, cmp_id, component_type, field, "order")
            VALUES (2, ?, 'product.item', 'products', ?)
        """, (cmp_id, i))

    print(f"Created {len(en_product_ids)} en product items: {en_product_ids}")

    # ========== Contact Page ==========
    # en contact_page id = 2

    c.execute("DELETE FROM contact_pages_cmps WHERE entity_id = 2")

    # 创建英文 contact points
    contact_points_en = [
        ("Mail", "Official Contact", "General corporate and business inquiries", "info@xmax.com"),
        ("MapPin", "Registered Office", "Nevada registered address", "732 S 6TH ST, STE R Las Vegas, NV 89101"),
        ("Phone", "Corporate Phone", "U.S. business line", "+1(323)888-9999"),
    ]

    en_contact_ids = []
    for icon, title, desc, value in contact_points_en:
        c.execute("""
            INSERT INTO components_contact_points (icon, title, description, value)
            VALUES (?, ?, ?, ?)
        """, (icon, title, desc, value))
        en_contact_ids.append(c.lastrowid)

    for i, cmp_id in enumerate(en_contact_ids):
        c.execute("""
            INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
            VALUES (2, ?, 'contact.point', 'contactPoints', ?)
        """, (cmp_id, i))

    print(f"Created {len(en_contact_ids)} en contact points: {en_contact_ids}")

    # 创建英文 use cases
    use_cases_en = [
        "Business collaboration and ecosystem integration",
        "Technical cooperation and integration solutions",
        "Investment and strategic consulting",
    ]

    en_usecase_ids = []
    for content in use_cases_en:
        c.execute("INSERT INTO components_contact_use_cases (content) VALUES (?)", (content,))
        en_usecase_ids.append(c.lastrowid)

    for i, cmp_id in enumerate(en_usecase_ids):
        c.execute("""
            INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
            VALUES (2, ?, 'contact.use-case', 'useCases', ?)
        """, (cmp_id, i))

    print(f"Created {len(en_usecase_ids)} en use cases: {en_usecase_ids}")

    # 创建英文 suggestions
    suggestions_en = [
        "Please provide your company name and contact information",
        "Describe the cooperation direction you are interested in",
        "Our team will respond within 2 business days",
    ]

    en_suggestion_ids = []
    for content in suggestions_en:
        c.execute("INSERT INTO components_contact_suggestions (content) VALUES (?)", (content,))
        en_suggestion_ids.append(c.lastrowid)

    for i, cmp_id in enumerate(en_suggestion_ids):
        c.execute("""
            INSERT INTO contact_pages_cmps (entity_id, cmp_id, component_type, field, "order")
            VALUES (2, ?, 'contact.suggestion', 'suggestions', ?)
        """, (cmp_id, i))

    print(f"Created {len(en_suggestion_ids)} en suggestions: {en_suggestion_ids}")

    conn.commit()
    conn.close()
    print("Done! En locale components created successfully.")

if __name__ == "__main__":
    main()
