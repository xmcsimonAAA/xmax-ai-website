"""
修复组件目录结构：从嵌套移到扁平
Strapi v5 要求: src/components/{category}/{component-name}.json
而不是: src/components/{category}/{component-name}/schema.json
"""
import os
import json
import shutil

BASE = os.path.join(os.path.dirname(__file__), '..')
COMP_DIR = os.path.join(BASE, 'src', 'components')

def fix_structure():
    # 1. 把 schema.json 的内容移到上一级作为 {component-name}.json
    for category in os.listdir(COMP_DIR):
        cat_path = os.path.join(COMP_DIR, category)
        if not os.path.isdir(cat_path):
            continue
        
        for comp_name in os.listdir(cat_path):
            comp_path = os.path.join(cat_path, comp_name)
            schema_path = os.path.join(comp_path, 'schema.json')
            
            if os.path.isdir(comp_path) and os.path.exists(schema_path):
                # 读取 schema.json
                with open(schema_path, 'r', encoding='utf-8') as f:
                    schema = json.load(f)
                
                # 写入扁平位置: category/component-name.json
                flat_path = os.path.join(cat_path, f'{comp_name}.json')
                with open(flat_path, 'w', encoding='utf-8') as f:
                    json.dump(schema, f, indent=2, ensure_ascii=False)
                
                # 删除旧目录
                shutil.rmtree(comp_path)
                print(f'  ✓ {category}/{comp_name}.json (from {category}/{comp_name}/schema.json)')

if __name__ == '__main__':
    fix_structure()
    print('\nDone! Component structure fixed.')
