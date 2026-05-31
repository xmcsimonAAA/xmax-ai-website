"""
更新 Strapi CMS 所有字段标签为中文
包括 content type 字段和 component 子字段
"""
import sqlite3
import json
import os

db_path = os.path.join(os.path.dirname(__file__), '..', '.tmp', 'data.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 字段标签映射 - 格式: content_type_uid -> field_path -> chinese_label
# 组件子字段格式: componentName.subFieldName
label_map = {
    'api::home-page.home-page': {
        'missionLabel': '使命标签',
        'missionHeading': '使命标题',
        'missionParagraph': '使命描述',
        'heroSlides': '首页轮播',
        'navCards': '导航卡片',
        'stats': '统计数据',
        'recentUpdates': '最新动态',
        'ctaPrimaryButton': '主按钮',
        'ctaSecondaryButton': '次按钮',
    },
    'api::about-page.about-page': {
        'headerLabel': '头部标签',
        'headerHeading': '头部标题',
        'headerParagraph': '头部描述',
        'narrativeLabel': '叙事标签',
        'narrativeHeading': '叙事标题',
        'narrativeParagraph': '叙事描述',
        'groupLabel': '集团标签',
        'groupHeading': '集团标题',
        'groupParagraph': '集团描述',
        'values': '价值主张',
        'highlights': '品牌亮点',
        'subsidiaries': '子公司',
    },
    'api::aws-page.aws-page': {
        'headerLabel': '头部标签',
        'headerHeading': '头部标题',
        'headerParagraph': '头部描述',
        'quoteEnglish': '英文引用',
        'quoteChinese': '中文引用',
        'narrativePoints': '叙事要点',
        'awsStats': 'AWS 统计',
        'coreMessages': '核心信息',
        'capabilityMappings': '能力映射',
    },
    'api::business-page.business-page': {
        'headerLabel': '头部标签',
        'headerHeading': '头部标题',
        'headerParagraph': '头部描述',
        'businessUnits': '业务单元',
    },
    'api::contact-page.contact-page': {
        'headerLabel': '头部标签',
        'headerHeading': '头部标题',
        'headerParagraph': '头部描述',
        'ctaHeading': 'CTA标题',
        'ctaParagraph': 'CTA描述',
        'contactPoints': '联系信息',
        'useCases': '使用场景',
        'suggestions': '建议',
    },
    'api::infrastructure-page.infrastructure-page': {
        'headerLabel': '头部标签',
        'headerHeading': '头部标题',
        'headerParagraph': '头部描述',
        'keyPrincipleHeading': '核心原则标题',
        'keyPrincipleParagraph': '核心原则描述',
        'layers': '基础设施层',
    },
    'api::products-page.products-page': {
        'headerLabel': '头部标签',
        'headerHeading': '头部标题',
        'headerParagraph': '头部描述',
        'products': '产品',
    },
    'api::site-setting.site-setting': {
        'companyName': '公司名称',
        'tagline': '标语',
        'logo': 'Logo',
        'footerDescription': '页脚描述',
        'navItems': '导航项',
        'footerLinkGroups': '页脚链接组',
    },
}

# 组件子字段标签映射
# 当 content type 的 metadatas 中包含 component 子字段时，也要更新
component_subfield_labels = {
    'home.hero-slide': {
        'image': '背景图片',
        'title': '标题',
        'subtitle': '副标题',
        'tags': '标签（逗号分隔）',
        'bgGradient': '背景渐变',
    },
    'home.nav-card': {
        'image': '卡片图片',
        'icon': '图标名称',
        'title': '标题',
        'description': '描述',
        'url': '链接',
    },
    'home.stat-item': {
        'value': '数值',
        'label': '标签',
    },
    'home.update-item': {
        'date': '日期',
        'title': '标题',
        'tag': '分类标签',
    },
    'home.cta-button': {
        'text': '按钮文案',
        'url': '链接',
    },
    'about.value-item': {
        'icon': '图标名称',
        'title': '标题',
        'description': '描述',
    },
    'about.highlight-item': {
        'content': '亮点内容',
    },
    'about.subsidiary': {
        'business': '业务',
        'legalName': '法定公司名',
        'alias': '别名',
    },
    'aws.narrative-point': {
        'icon': '图标名称',
        'title': '标题',
        'description': '描述',
    },
    'aws.stat-item': {
        'value': '数值',
        'label': '标签',
    },
    'aws.core-message': {
        'content': '信息内容',
    },
    'aws.capability-mapping': {
        'capability': '能力名称',
        'description': '描述',
    },
    'business.unit': {
        'title': '板块名称',
        'alias': '公司别名',
        'enTitle': '英文名称',
        'subtitle': '副标题',
        'description': '详细描述',
        'tags': '核心能力（逗号分隔）',
        'scenes': '典型场景（逗号分隔）',
        'infraRelation': '与基础设施关系',
        'enDesc': '英文描述',
        'image': '板块图片',
    },
    'contact.point': {
        'icon': '图标名称',
        'title': '标题',
        'description': '描述',
        'value': '联系方式',
    },
    'contact.use-case': {
        'content': '场景描述',
    },
    'contact.suggestion': {
        'content': '建议内容',
    },
    'infra.layer': {
        'title': '英文标题',
        'subtitle': '中文标题',
        'icon': '图标名称',
        'description': '描述',
        'details': '详情（逗号分隔）',
    },
    'product.item': {
        'name': '产品名称',
        'icon': '图标名称',
        'description': '描述',
        'scene': '应用场景',
        'details': '产品详情（逗号分隔）',
        'image': '产品图片',
    },
    'site.nav-item': {
        'label': '菜单名称',
        'url': '链接',
    },
    'site.footer-link-group': {
        'title': '分组标题',
    },
}


def update_labels():
    for uid, labels in label_map.items():
        key = f'plugin_content_manager_configuration_content_types::{uid}'
        cursor.execute('SELECT value FROM strapi_core_store_settings WHERE key = ?', (key,))
        row = cursor.fetchone()
        if not row:
            print(f'  Skipping {uid}: no config found')
            continue

        config = json.loads(row[0])
        changed = False

        for field_name, label in labels.items():
            if 'metadatas' in config and field_name in config['metadatas']:
                if 'edit' in config['metadatas'][field_name]:
                    config['metadatas'][field_name]['edit']['label'] = label
                    changed = True
                if 'list' in config['metadatas'][field_name]:
                    config['metadatas'][field_name]['list']['label'] = label
                    changed = True

        # 更新组件子字段标签
        if 'metadatas' in config:
            for meta_key in list(config['metadatas'].keys()):
                # 组件子字段格式: componentName.subFieldName
                if '.' in meta_key:
                    parts = meta_key.split('.')
                    if len(parts) == 2:
                        comp_field, sub_field = parts
                        # 查找该字段对应的 component UID
                        # 从 content type schema 中找
                        for comp_uid, sub_labels in component_subfield_labels.items():
                            if sub_field in sub_labels:
                                config['metadatas'][meta_key]['edit']['label'] = sub_labels[sub_field]
                                changed = True
                                break

        if changed:
            cursor.execute('UPDATE strapi_core_store_settings SET value = ? WHERE key = ?',
                         (json.dumps(config), key))
            print(f'  ✓ {uid}')
        else:
            print(f'  - {uid} (no changes)')

    conn.commit()
    conn.close()
    print('\nDone! All field labels updated to Chinese.')


if __name__ == '__main__':
    update_labels()
