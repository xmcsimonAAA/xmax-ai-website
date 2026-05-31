import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { fetchBusinessPage, mediaUrl, toStrapiLocale, type BusinessPageData, type BusinessUnit } from "@/lib/cms";
import { useLang, type Lang } from "@/components/Layout";
import { business as B, common as C, t } from "@/lib/i18n";
import { TypewriterText, TypewriterOnView } from "@/hooks/useTypewriter";

type BusinessItem = {
  id: string;
  title: string;
  alias: string;
  subtitle: string;
  description: string;
  tags: string[];
  scenes: string[];
  infraRelation: string;
  imageUrl: string | null;
};

const fallbackItems: BusinessItem[] = [
  { id: "01", title: "电商", alias: "XMax AI EC Pte. Ltd.", subtitle: "构建 AI 驱动的交易、运营与用户增长体系。", description: "XMAX AI 电商板块聚焦交易效率、用户经营与平台智能化运营，围绕商品、内容、流量、转化与服务全链路引入 AI 推理能力。通过统一模型服务、推荐策略、内容生成与智能客服能力，持续提升电商业务的运营效率、用户体验与增长质量。", tags: ["智能推荐", "商品内容生成", "用户增长运营", "智能客服", "交易转化优化"], scenes: ["商品标题、卖点、详情页与营销素材生成", "用户分层、个性化推荐与转化路径优化", "智能客服、售后辅助与商家运营分析"], infraRelation: "电商板块调用 XMAX AI 的统一推理服务、模型治理与知识检索能力，形成面向高并发交易场景的实时 AI 服务能力。", imageUrl: null },
  { id: "02", title: "互娱", alias: "XMax AI IG Pte. Ltd.", subtitle: "构建内容生成、互动体验与数字娱乐能力。", description: "XMAX AI 互娱板块围绕数字内容、互动体验与新型娱乐消费场景，建设面向创作、分发、互动与运营的 AI 能力体系。通过推理服务、内容生成、角色交互与实时响应能力，支持更丰富的数字娱乐产品形态与更高频的用户参与机制。", tags: ["AIGC 内容生成", "互动引擎", "数字角色智能", "实时响应", "内容运营分析"], scenes: ["游戏与互动内容生成", "数字角色对话与陪伴式交互", "用户行为分析与内容运营优化"], infraRelation: "互娱板块依托 XMAX AI 的低时延推理能力与智能体运行层，支撑高互动密度场景下的稳定响应与多模态内容生成。", imageUrl: null },
  { id: "03", title: "供应链服务", alias: "XMax AI SCM Pte. Ltd.", subtitle: "构建智能调度、预测与协同网络。", description: "XMAX AI 供应链服务板块聚焦需求预测、库存协同、运输调度、履约优化与跨主体协同效率，通过 AI 推理能力连接供应链中的关键数据与决策节点。该板块强调对复杂流程的感知、预测与动态调整，帮助企业提升履约稳定性、资源利用率与响应速度。", tags: ["需求预测", "智能调度", "库存优化", "履约协同", "运营决策支持"], scenes: ["订单与需求预测", "路由调度与仓配协同", "异常监测与供应链风险预警"], infraRelation: "供应链服务板块复用 XMAX AI 的数据检索层、实时推理能力与工作流编排能力，支撑跨系统、跨角色的流程协同。", imageUrl: null },
  { id: "04", title: "太空计算", alias: "XMax AI SEIC Pte. Ltd.", subtitle: "探索高性能算力、边缘连接与未来计算场景。", description: "XMAX AI 太空计算板块聚焦未来计算基础设施、边缘连接、远距离数据协同与高性能算力场景，面向更复杂、更极端、更具前瞻性的计算需求开展布局。该板块体现集团对未来计算能力、跨域协同与新型智能基础设施的长期投入。", tags: ["高性能计算", "边缘推理", "远程协同", "未来基础设施", "前沿场景探索"], scenes: ["高性能计算任务调度", "边缘环境下的低时延 AI 响应", "远距离、多节点协同的数据处理与决策支持"], infraRelation: "太空计算板块承接 XMAX AI 在全球基础设施、弹性推理与分布式协同方面的能力积累，用于探索未来型 AI 基础设施场景。", imageUrl: null },
  { id: "05", title: "机器人", alias: "XMax AI Robotics Pte. Ltd.", subtitle: "推进感知、决策与执行一体化智能系统。", description: "XMAX AI 机器人板块面向机器人系统中的感知、理解、推理、规划与执行链路，构建可持续演进的智能能力底座。通过将模型推理、环境理解、任务决策和执行控制连接起来，该板块服务于多类智能机器人与自动化设备的场景化落地。", tags: ["环境感知", "智能决策", "任务规划", "执行控制", "人机协同"], scenes: ["服务机器人与场景任务执行", "工业或半工业环境下的辅助自动化", "面向复杂环境的感知与路径规划支持"], infraRelation: "机器人板块依托 XMAX AI 的推理服务、智能体运行层与低时延响应能力，为「感知—决策—执行」闭环提供统一智能支撑。", imageUrl: null },
  { id: "06", title: "生命科学", alias: "XMax AI Novalife Pte. Ltd.", subtitle: "面向研发、分析与智能辅助决策提供能力。", description: "XMAX AI 生命科学板块聚焦生命科学研究、数据分析与智能辅助决策等方向，致力于将 AI 能力引入复杂知识密集型场景。通过模型推理、知识检索与专业数据协同能力，该板块支持研究、分析与流程优化类任务的效率提升。", tags: ["科研辅助分析", "专业知识检索", "数据理解", "智能决策支持", "流程效率优化"], scenes: ["研究资料与专业文献辅助分析", "复杂数据理解与知识提取", "研发流程中的智能辅助决策"], infraRelation: "生命科学板块主要复用 XMAX AI 的知识引擎、检索增强能力与可治理的模型服务能力，适配高知识密度、高准确性要求场景。", imageUrl: null },
  { id: "07", title: "金融", alias: "XMax AI Fintech Pte. Ltd.", subtitle: "面向风控、运营、服务与智能金融流程提供能力。", description: "XMAX AI 金融板块围绕风险控制、客户服务、运营流程、智能辅助与数字金融体验构建产品能力，重点强调可审计、可治理与高可靠的 AI 服务体系。该板块面向金融业务的严谨性要求，突出安全、合规、稳定与效率的统一。", tags: ["风险识别", "智能客服", "流程自动化", "运营辅助", "审计与治理"], scenes: ["风险预警与辅助决策", "金融客服与业务咨询智能化", "内部流程自动化与运营协同"], infraRelation: "金融板块建立在 XMAX AI 的安全治理层、统一推理层与审计能力之上，强调可靠性、可追踪性与服务连续性。", imageUrl: null },
  { id: "08", title: "安全", alias: "XMax AI Security Pte. Ltd.", subtitle: "面向数字安全、监测、审计与治理提供能力。", description: "XMAX AI 安全板块聚焦数字环境中的监测、预警、响应、审计与治理能力建设，通过 AI 推理与规则控制结合，支持更高效的安全运营体系。该板块既面向企业内部数字安全治理，也面向更广泛的风险识别与运营支撑需求。", tags: ["安全监测", "风险预警", "审计追踪", "治理策略", "智能响应辅助"], scenes: ["安全事件监测与风险识别", "审计与日志分析", "安全运营中的辅助研判与响应支持"], infraRelation: "安全板块是 XMAX AI 安全治理层的重要延伸，直接受益于统一的访问控制、日志审计、策略管理与推理护栏能力。", imageUrl: null },
  { id: "09", title: "企业服务", alias: "XMax AI Enterprise Services Pte. Ltd.", subtitle: "面向组织数字化、知识管理与流程智能化提供能力。", description: "XMAX AI 企业服务板块聚焦组织内部知识、流程、协作与管理效率提升，通过智能体、知识引擎与自动化能力推动企业运营升级。该板块面向中后台系统与企业日常经营场景，强调标准化、可复制与可持续扩展。", tags: ["企业知识管理", "流程自动化", "组织协作智能化", "智能办公助手", "经营分析支持"], scenes: ["企业知识库与问答系统", "内部审批、运营与协作流程自动化", "员工助手、管理驾驶舱与智能分析支持"], infraRelation: "企业服务板块高度复用 XMAX AI 的智能体运行层、知识引擎与模型网关能力，是平台型能力最直接的企业化输出场景之一。", imageUrl: null },
];

function mapBusinessUnit(unit: BusinessUnit, index: number): BusinessItem {
  return {
    id: String(index + 1).padStart(2, "0"),
    title: unit.title,
    alias: unit.alias,
    subtitle: unit.subtitle,
    description: unit.description,
    tags: unit.tags ? unit.tags.split(",").map((t) => t.trim()) : [],
    scenes: unit.scenes ? unit.scenes.split(",").map((s) => s.trim()) : [],
    infraRelation: unit.infraRelation,
    imageUrl: mediaUrl(unit.image),
  };
}

export default function Business() {
  const [headerLabel, setHeaderLabel] = useState("Business Units");
  const [headerHeading, setHeaderHeading] = useState("9 大业务板块");
  const [headerParagraph, setHeaderParagraph] = useState(
    "平台能力通过 9 个明确业务板块形成行业化落地网络。每个板块都与统一 AI 基础设施连接，并承担不同产业场景中的服务角色。"
  );
  const [items, setItems] = useState<BusinessItem[]>(fallbackItems);
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const { lang } = useLang();

  useEffect(() => {
    fetchBusinessPage(toStrapiLocale(lang)).then((data: BusinessPageData | null) => {
      if (!data) return;
      if (data.headerLabel) setHeaderLabel(data.headerLabel);
      if (data.headerHeading) setHeaderHeading(data.headerHeading);
      if (data.headerParagraph) setHeaderParagraph(data.headerParagraph);
      if (data.businessUnits && data.businessUnits.length > 0) {
        setItems(data.businessUnits.map(mapBusinessUnit));
      }
      if (data.headerImage) setHeaderImage(mediaUrl(data.headerImage));
    });
  }, [lang]);

  return (
    <>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-36">
        {headerImage && (
          <div className="absolute inset-0">
            <img src={headerImage} alt={headerHeading} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mx-auto max-w-7xl px-8 lg:px-12"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="section-label text-slate-300"
          >{headerLabel}</motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-4xl text-white sm:text-5xl lg:text-6xl heading-display"
          >
            <TypewriterText text={headerHeading} speed={0.025} showCursor={false} />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 max-w-2xl text-lg text-slate-300/80"
          >{headerParagraph}</motion.p>
        </motion.div>
      </section>

      {/* Business Cards — SpaceX-style full-bleed immersive layout */}
      <section className="bg-black">
        {items.map((item, index) => {
          const isEven = index % 2 === 1;
          const textOnLeft = !isEven;
          return (
            <motion.a
              id={`business-${item.id}`}
              key={item.id}
              href={`#/business/${item.id}`}
              className="group relative block cursor-pointer scroll-mt-28 overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8 }}
            >
              {/* Background Image — full bleed, bright & vivid */}
              <div className="absolute inset-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-slate-500 via-slate-600 to-slate-800" />
                )}
              </div>

              {/* Text-side gradient — very light, just enough for text readability */}
              <div className={`absolute inset-0 ${textOnLeft ? "bg-gradient-to-r" : "bg-gradient-to-l"} from-black/30 via-black/12 to-transparent`} />

              {/* Top fade-in — image emerges from pure black */}
              <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-black via-black/70 to-transparent" />

              {/* Bottom fade-out — image melts into pure black for next card transition */}
              <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black via-black/70 to-transparent" />

              {/* Content */}
              <div className="relative mx-auto max-w-7xl px-8 lg:px-12 py-40 lg:py-52">
                <div className={`grid gap-16 lg:gap-24 items-center ${isEven ? "lg:grid-cols-[1fr_1.2fr]" : "lg:grid-cols-[1.2fr_1fr]"}`}>
                  {/* Text Side */}
                  <div className={`${isEven ? "lg:order-2" : "lg:order-1"}`}>
                    <div className="space-y-6">
                      {/* Alias — small caps, spaced */}
                      <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">
                        {item.alias}
                      </p>

                      {/* Title — SpaceX style: massive, bold, tight tracking */}
                      <h3 className="heading-display text-3xl lg:text-6xl text-white">
                        <TypewriterOnView text={item.title} speed={0.03} showCursor={false} />
                      </h3>

                      {/* Subtitle — medium weight, clear */}
                      <p className="text-xl font-medium text-white/85 leading-snug max-w-lg">
                        {item.subtitle}
                      </p>

                      {/* Description — lighter */}
                      <p className="text-base leading-relaxed text-white/60 max-w-xl font-light">
                        {item.description}
                      </p>

                      {/* Tags — minimal uppercase pills */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {item.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded border border-white/15 bg-transparent px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-white/50 transition-colors group-hover:border-white/30 group-hover:text-white/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* CTA — click to enter detail page */}
                      <div className="pt-6">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/60 transition-all group-hover:text-white group-hover:gap-3">
                          {t(C, "viewDetails", lang)} <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Side — empty when image fills background */}
                  <div className={`${isEven ? "lg:order-1" : "lg:order-2"}`} />
                </div>
              </div>
            </motion.a>
          );
        })}
      </section>
    </>
  );
}
