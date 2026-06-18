/*
 * Products Page — AI 产品矩阵
 * 支持中英双语
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Cloud, Layers3, Shield, Workflow } from "lucide-react";
import { fetchProductsPage, mediaUrl, toStrapiLocale, type ProductsPageData, type ProductItem } from "../lib/cms";
import { useLang } from "@/components/Layout";
import { products as P, t } from "@/lib/i18n";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Cloud,
  Layers3,
  Workflow,
  BrainCircuit,
  Shield,
};

export default function Products() {
  const [data, setData] = useState<ProductsPageData | null>(null);
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { lang } = useLang();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setData(null);
    setHeaderImage(null);
    fetchProductsPage(toStrapiLocale(lang)).then((d) => {
      if (!active) return;
      setData(d);
      if (d?.headerImage) setHeaderImage(mediaUrl(d.headerImage));
      setLoading(false);
    });
    return () => { active = false; };
  }, [lang]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-white" />
      </div>
    );
  }

  const headerLabel = data?.headerLabel || t(P, "headerLabel", lang);
  const headerHeading = data?.headerHeading || t(P, "headerHeading", lang);
  const headerParagraph = data?.headerParagraph || t(P, "headerParagraph", lang);

  const products: ProductItem[] = data?.products?.length
    ? data.products
    : lang === "zh"
      ? [
          { id: 1, name: "XMAX Inference Grid", icon: "Cloud", description: "面向企业与业务系统的统一 AI 推理服务入口。", scene: "统一推理 / 多业务承载 / 弹性扩缩容", details: "统一承载大模型与行业模型推理调用\n面向多业务场景提供弹性扩容与服务路由\n面向企业与业务系统的统一 AI 推理服务入口", image: null },
          { id: 2, name: "XMAX Model Gateway", icon: "Layers3", description: "模型接入、路由、配额、监控与治理平台。", scene: "模型治理 / 版本控制 / 策略编排", details: "统一接入模型、版本、策略、配额与调用日志\n模型接入、路由、配额、监控与治理\n版本控制与策略编排能力", image: null },
          { id: 3, name: "XMAX Agent Studio", icon: "Workflow", description: "面向工作流、任务自动化和行业智能体构建。", scene: "智能体运行层 / 工具调用 / 任务编排", details: "支撑工作流、工具调用、企业任务编排\n行业智能体构建与运行\n任务自动化与工具调用能力", image: null },
          { id: 4, name: "XMAX Knowledge Engine", icon: "BrainCircuit", description: "面向企业知识、检索增强和数据协同的智能引擎。", scene: "知识检索 / RAG / 数据协同", details: "支撑企业知识库、行业数据与检索增强\n面向企业知识与数据协同的智能引擎\n检索增强（RAG）与知识管理能力", image: null },
          { id: 5, name: "XMAX Security Mesh", icon: "Shield", description: "面向安全审计、访问控制、护栏策略与运营治理。", scene: "安全治理 / 审计追踪 / 控制面", details: "覆盖访问控制、审计、护栏策略\n安全审计与访问控制平台\n护栏策略与运营治理能力", image: null },
        ]
      : [
          { id: 1, name: "XMAX Inference Grid", icon: "Cloud", description: "A unified AI inference entry point for enterprise and business systems.", scene: "Unified inference / Multi-business workloads / Elastic scaling", details: "Unified inference calls for large models and industry models\nElastic scaling and routing for multi-business scenarios\nA unified AI inference service entry point for enterprise systems", image: null },
          { id: 2, name: "XMAX Model Gateway", icon: "Layers3", description: "A platform for model access, routing, quotas, monitoring, and governance.", scene: "Model governance / Version control / Policy orchestration", details: "Unified access for models, versions, policies, quotas, and logs\nModel access, routing, quotas, monitoring, and governance\nVersion control and policy orchestration capabilities", image: null },
          { id: 3, name: "XMAX Agent Studio", icon: "Workflow", description: "Build workflows, task automation, and industry agents.", scene: "Agent runtime / Tool calls / Task orchestration", details: "Workflow, tool-calling, and enterprise task orchestration\nIndustry agent construction and runtime\nTask automation and tool-calling capabilities", image: null },
          { id: 4, name: "XMAX Knowledge Engine", icon: "BrainCircuit", description: "An intelligent engine for enterprise knowledge, retrieval augmentation, and data collaboration.", scene: "Knowledge retrieval / RAG / Data collaboration", details: "Enterprise knowledge bases, industry data, and retrieval augmentation\nAn intelligent engine for knowledge and data collaboration\nRetrieval-augmented generation and knowledge management", image: null },
          { id: 5, name: "XMAX Security Mesh", icon: "Shield", description: "Security audit, access control, guardrail policies, and operational governance.", scene: "Security governance / Audit trail / Control plane", details: "Access control, audit, and guardrail policies\nSecurity audit and access-control platform\nGuardrail policies and operational governance", image: null },
        ];

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
            className="mt-4 text-4xl text-white sm:text-5xl lg:text-6xl heading-display"
          >{headerHeading}</motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 max-w-2xl text-lg text-slate-300"
          >{headerParagraph}</motion.p>
        </motion.div>
      </section>

      {/* Products Grid */}
      <section className="bg-slate-900 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="space-y-8">
            {products.map((product, index) => {
              const Icon = ICON_MAP[product.icon] || Cloud;
              const detailLines = product.details ? product.details.split("\n") : [];
              return (
                <motion.div
                  key={product.name}
                  id={`product-${index + 1}`}
                  className="group overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 transition-all transition-all hover:border-slate-600 hover:shadow-lg scroll-mt-24"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  {product.image && (
                    <div className="h-56 overflow-hidden">
                      <img
                        src={mediaUrl(product.image, "large") || mediaUrl(product.image) || ""}
                        alt={product.name}
                        className="motion-image h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8 lg:p-12">
                  <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-start">
                    <div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-white transition-colors group-hover:bg-slate-800 group-hover:text-white">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                          {lang === "zh" ? "产品" : "Product"} 0{index + 1}
                        </span>
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold text-white">{product.name}</h3>
                      <p className="mt-3 text-base text-slate-300">{product.description}</p>
                      <div className="mt-4 text-xs uppercase tracking-wider text-slate-500">{product.scene}</div>
                    </div>
                    <ul className="space-y-3">
                      {detailLines.map((detail) => (
                        <li key={detail} className="flex items-start gap-2 text-sm text-slate-300">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
