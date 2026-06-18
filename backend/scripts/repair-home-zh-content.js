"use strict";

const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.resolve(__dirname, "../.tmp/data.db");

const heroSlides = [
  {
    id: 79,
    title: "构建全球 AI 推理服务基础设施",
    subtitle: "XMAX AI Inc 依托 XMAX 集团，通过 9 大业务板块将可扩展、可治理的 AI 推理服务落地于商业与社会场景",
    tags: "全球 AI 推理,AWS 基础架构,9 大业务板块,XMAX 集团体系",
  },
  {
    id: 80,
    title: "电商",
    subtitle: "智能推荐、内容生成与客服自动化，让交易效率持续升级",
    tags: "智能推荐,商品内容生成,用户增长运营,智能客服",
  },
  {
    id: 81,
    title: "互娱",
    subtitle: "AIGC 内容生成 + 数字角色智能，重塑沉浸式娱乐体验",
    tags: "AIGC 内容生成,互动引擎,数字角色智能,实时响应",
  },
  {
    id: 82,
    title: "供应链服务",
    subtitle: "需求预测、库存优化与履约调度，打通全链路响应网络",
    tags: "需求预测,智能调度,库存优化,履约协同",
  },
  {
    id: 83,
    title: "太空计算",
    subtitle: "边缘推理、远距协同与高性能算力，探索极限场景",
    tags: "高性能计算,边缘推理,远程协同,未来基础设施",
  },
  {
    id: 84,
    title: "机器人",
    subtitle: "融合环境理解、决策规划与执行控制，让机器人真正会用脑",
    tags: "环境感知,智能决策,任务规划,执行控制",
  },
  {
    id: 85,
    title: "生命科学",
    subtitle: "知识检索、辅助分析与决策支持，提升研发与流程效率",
    tags: "科研辅助分析,专业知识检索,数据理解,智能决策支持",
  },
  {
    id: 86,
    title: "金融",
    subtitle: "风控、客服与审计全链路可治理，安全合规驱动效率",
    tags: "风险识别,智能客服,流程自动化,审计与治理",
  },
  {
    id: 87,
    title: "安全",
    subtitle: "智能监测、预警与审计，构建主动式安全运营体系",
    tags: "安全监测,风险预警,审计追踪,治理策略",
  },
  {
    id: 88,
    title: "企业服务",
    subtitle: "知识引擎 + 流程自动化，打造下一代智能办公底座",
    tags: "企业知识管理,流程自动化,组织协作智能化,智能办公助手",
  },
];

const navCards = [
  {
    id: 43,
    title: "AI 基础设施",
    description: "基于 AWS 全球云基础设施构建 AI 推理、模型服务与数据安全能力",
    url: "/infrastructure",
  },
  {
    id: 44,
    title: "AI 产品与服务",
    description: "覆盖全栈 AI 产品矩阵，包括 Agent OS、模型服务平台与数据智能平台",
    url: "/products",
  },
  {
    id: 45,
    title: "业务版图",
    description: "九大业务板块覆盖电商、互娱、金融、生命科学等领域",
    url: "/business",
  },
];

const stats = [
  { id: 57, value: "9", label: "业务板块" },
  { id: 58, value: "30+", label: "全球部署区域" },
  { id: 59, value: "100+", label: "行业解决方案" },
  { id: 60, value: "99.9%", label: "服务可用性" },
];

const updates = [
  { id: 43, date: "2025-05", title: "XMAX AI Agent OS 正式发布", tag: "产品发布" },
  { id: 44, date: "2025-03", title: "XMAX AI 与 AWS 深化全球合作伙伴关系", tag: "合作动态" },
  { id: 45, date: "2025-01", title: "XMAX AI 完成新一轮战略融资", tag: "公司新闻" },
];

function main() {
  const db = new Database(dbPath);
  const transaction = db.transaction(() => {
    db.prepare(`
      UPDATE home_pages
      SET mission_label = 'Our Mission',
          mission_heading = '以可信、可扩展的 AI 推理服务基础设施，连接产业创新与社会需求',
          mission_paragraph = 'XMAX AI Inc 是 XMAX 集团的 AI 能力平台与产业服务载体，统一推进平台能力、产品化输出与行业化落地。'
      WHERE id = 1
    `).run();

    const updateHero = db.prepare("UPDATE components_home_hero_slides SET title = ?, subtitle = ?, tags = ? WHERE id = ?");
    for (const slide of heroSlides) updateHero.run(slide.title, slide.subtitle, slide.tags, slide.id);

    const updateNav = db.prepare("UPDATE components_home_nav_cards SET title = ?, description = ?, url = ? WHERE id = ?");
    for (const card of navCards) updateNav.run(card.title, card.description, card.url, card.id);

    const updateStat = db.prepare("UPDATE components_home_stat_items SET value = ?, label = ? WHERE id = ?");
    for (const stat of stats) updateStat.run(stat.value, stat.label, stat.id);

    const updateItem = db.prepare("UPDATE components_home_update_items SET date = ?, title = ?, tag = ? WHERE id = ?");
    for (const item of updates) updateItem.run(item.date, item.title, item.tag, item.id);

    db.prepare("UPDATE components_home_cta_buttons SET text = '查看业务版图', url = '/business' WHERE id = 29").run();
    db.prepare("UPDATE components_home_cta_buttons SET text = '联系合作', url = '/contact' WHERE id = 30").run();
  });

  try {
    transaction();
    console.log("[repair:home-zh] Restored Chinese home page visible content");
  } finally {
    db.close();
  }
}

main();
