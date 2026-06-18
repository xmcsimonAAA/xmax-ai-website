/*
 * Infrastructure Page — AI 基础设施
 * 支持中英双语
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Database, Layers3, Network, Shield, CheckCircle2 } from "lucide-react";
import { fetchInfrastructurePage, mediaUrl, toStrapiLocale, type InfrastructurePageData, type InfraLayer } from "../lib/cms";
import { useLang } from "@/components/Layout";
import { infra as I, t } from "@/lib/i18n";
import { TypewriterText, TypewriterOnView } from "@/hooks/useTypewriter";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Network,
  Layers3,
  Bot,
  Database,
  Shield,
};

export default function Infrastructure() {
  const [data, setData] = useState<InfrastructurePageData | null>(null);
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { lang } = useLang();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setData(null);
    setHeaderImage(null);
    fetchInfrastructurePage(toStrapiLocale(lang)).then((d) => {
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

  const headerLabel = data?.headerLabel || t(I, "headerLabel", lang);
  const headerHeading = data?.headerHeading || t(I, "headerHeading", lang);
  const headerParagraph = data?.headerParagraph || t(I, "headerParagraph", lang);

  const layers: InfraLayer[] = data?.layers?.length
    ? data.layers
    : lang === "zh"
      ? [
          { id: 1, title: "Inference Fabric", subtitle: "推理底座", icon: "Network", description: "统一承载大模型与行业模型推理调用，面向多业务场景提供弹性扩容与服务路由。", details: "面向多业务场景提供弹性扩容与服务路由\n统一承载大模型与行业模型的推理调用\n支持跨场景、跨区域、跨业务板块复用" },
          { id: 2, title: "Model Gateway", subtitle: "模型网关", icon: "Layers3", description: "统一管理模型接入、版本、配额、策略与调用观测，形成模型治理中心。", details: "统一接入模型、版本、策略、配额与调用日志\n模型治理与版本控制\n策略编排与调用观测" },
          { id: 3, title: "Agent Runtime", subtitle: "智能体运行层", icon: "Bot", description: "支撑工作流、工具调用、企业任务编排与行业智能体运行。", details: "支撑工作流、工具调用与企业任务编排\n行业智能体运行环境\n工具调用与任务编排能力" },
          { id: 4, title: "Data & Retrieval", subtitle: "数据检索层", icon: "Database", description: "支撑知识库、行业数据与检索增强能力，连接企业知识与业务上下文。", details: "支撑企业知识库、行业数据、RAG 与检索增强\n连接企业知识与业务上下文\n检索增强与数据协同" },
          { id: 5, title: "Security & Governance", subtitle: "安全治理层", icon: "Shield", description: "覆盖访问控制、审计、护栏策略与平台运营治理要求。", details: "访问控制、审计、内容安全与合规要求\n护栏策略与运营治理\n日志审计与策略管理" },
        ]
      : [
          { id: 1, title: "Inference Fabric", subtitle: "Inference Layer", icon: "Network", description: "A unified layer for large-model and industry-model inference, with elastic scaling and routing across business scenarios.", details: "Elastic scaling and service routing for multi-business scenarios\nUnified inference calls for large models and industry models\nReusable across scenarios, regions, and business units" },
          { id: 2, title: "Model Gateway", subtitle: "Model Gateway", icon: "Layers3", description: "Centralized model access, versioning, quotas, policy control, and observability.", details: "Unified access for models, versions, policies, quotas, and logs\nModel governance and version control\nPolicy orchestration and call observability" },
          { id: 3, title: "Agent Runtime", subtitle: "Agent Runtime", icon: "Bot", description: "Runtime support for workflows, tool calls, enterprise task orchestration, and industry agents.", details: "Workflow, tool-calling, and enterprise task orchestration\nRuntime environment for industry agents\nTool invocation and task orchestration capabilities" },
          { id: 4, title: "Data & Retrieval", subtitle: "Data Retrieval Layer", icon: "Database", description: "Knowledge-base, industry-data, and retrieval-augmented capabilities connected to business context.", details: "Enterprise knowledge bases, industry data, RAG, and retrieval augmentation\nConnection between enterprise knowledge and business context\nRetrieval-augmented data collaboration" },
          { id: 5, title: "Security & Governance", subtitle: "Security Governance Layer", icon: "Shield", description: "Access control, audit trails, guardrail policies, and platform governance.", details: "Access control, audit, content safety, and compliance requirements\nGuardrail policies and operational governance\nLog audit and policy management" },
        ];

  const keyPrincipleHeading = data?.keyPrincipleHeading || t(I, "keyPrincipleHeading", lang);
  const keyPrincipleParagraph = data?.keyPrincipleParagraph || t(I, "keyPrincipleParagraph", lang);

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
          >
            <TypewriterText text={headerHeading} speed={0.06} showCursor={false} />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 max-w-2xl text-lg text-slate-300"
          >{headerParagraph}</motion.p>
        </motion.div>
      </section>

      {/* Infrastructure Layers */}
      <section className="bg-slate-900 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="space-y-12">
            {layers.map((item, index) => {
              const Icon = ICON_MAP[item.icon] || Network;
              const detailLines = item.details ? item.details.split("\n") : [];
              return (
                <motion.div
                  key={item.title}
                  className="grid gap-8 rounded-2xl border border-slate-700 bg-slate-900 p-8 lg:grid-cols-[auto_1fr_1fr] lg:items-start lg:p-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  {/* Icon + Title */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-white">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-white font-medium">{item.subtitle}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-base leading-8 text-slate-300">{item.description}</p>
                  </div>

                  {/* Details */}
                  <ul className="space-y-3">
                    {detailLines.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Principle */}
      <section className="bg-slate-900 border-y border-slate-800/50 py-24">
        <div className="mx-auto max-w-7xl px-8 lg:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl heading-display text-white sm:text-5xl"
          >
            <TypewriterOnView text={keyPrincipleHeading} speed={0.065} showCursor={false} />
          </motion.h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {keyPrincipleParagraph.split("\n").filter(Boolean).map((line, i) => {
              const clean = line.replace(/^\d+[\.\、\s]+/, "").trim();
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-slate-700"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-white/60">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="text-base leading-relaxed text-slate-300 font-light">{clean}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
