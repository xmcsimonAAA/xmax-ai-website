import sqlite3
import json
import os

db_path = os.path.join(os.path.dirname(__file__), '..', '.tmp', 'data.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

label_map = {
    'api::about-page.about-page': {
        'id': 'ID',
        'headerLabel': '头部标签',
        'headerHeading': '头部标题',
        'headerParagraph': '头部描述',
        'values': '价值观数据',
        'narrativeLabel': '叙事标签',
        'narrativeHeading': '叙事标题',
        'narrativeParagraph': '叙事描述',
        'highlights': '亮点数据',
        'groupLabel': '集团标签',
        'groupHeading': '集团标题',
        'groupParagraph': '集团描述',
        'subsidiaries': '子公司数据',
    },
    'api::aws-page.aws-page': {
        'id': 'ID',
        'headerLabel': '头部标签',
        'headerHeading': '头部标题',
        'headerParagraph': '头部描述',
        'narrativePoints': '叙事要点',
        'awsStats': 'AWS 统计数据',
        'coreMessages': '核心信息',
        'capabilityMappings': '能力映射',
        'quoteEnglish': '英文引用',
        'quoteChinese': '中文引用',
    },
    'api::business-page.business-page': {
        'id': 'ID',
        'headerLabel': '头部标签',
        'headerHeading': '头部标题',
        'headerParagraph': '头部描述',
        'businessUnits': '业务单元',
    },
    'api::contact-page.contact-page': {
        'id': 'ID',
        'headerLabel': '头部标签',
        'headerHeading': '头部标题',
        'headerParagraph': '头部描述',
        'contactPoints': '联系信息',
        'ctaHeading': 'CTA标题',
        'ctaParagraph': 'CTA描述',
        'useCases': '使用案例',
        'suggestions': '建议',
    },
    'api::home-page.home-page': {
        'id': 'ID',
        'heroSlides': '首页轮播',
        'missionLabel': '使命标签',
        'missionHeading': '使命标题',
        'missionParagraph': '使命描述',
        'navCards': '导航卡片',
        'stats': '统计数据',
        'recentUpdates': '最新动态',
        'ctaHeading': 'CTA标题',
        'ctaParagraph': 'CTA描述',
        'ctaPrimaryButton': '主按钮文案',
        'ctaSecondaryButton': '次按钮文案',
    },
    'api::infrastructure-page.infrastructure-page': {
        'id': 'ID',
        'headerLabel': '头部标签',
        'headerHeading': '头部标题',
        'headerParagraph': '头部描述',
        'layers': '层级数据',
        'keyPrincipleHeading': '核心原则标题',
        'keyPrincipleParagraph': '核心原则描述',
    },
    'api::products-page.products-page': {
        'id': 'ID',
        'headerLabel': '头部标签',
        'headerHeading': '头部标题',
        'headerParagraph': '头部描述',
        'products': '产品数据',
    },
    'api::site-setting.site-setting': {
        'id': 'ID',
        'companyName': '公司名称',
        'tagline': '标语',
        'logo': 'Logo',
        'footerDescription': '页脚描述',
        'navItems': '导航项',
        'footerLinkGroups': '页脚链接组',
    },
}

for uid, labels in label_map.items():
    key = f'plugin_content_manager_configuration_content_types::{uid}'
    cursor.execute('SELECT value FROM strapi_core_store_settings WHERE key = ?', (key,))
    row = cursor.fetchone()
    if not row:
        print(f'Skipping {uid}: no config found')
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

    if changed:
        cursor.execute('UPDATE strapi_core_store_settings SET value = ? WHERE key = ?', (json.dumps(config), key))
        print(f'Updated {uid}')
    else:
        print(f'No changes for {uid}')

conn.commit()
conn.close()
print('Done updating field labels.')
