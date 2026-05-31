/*
 * AWS Page — AWS 基础设施
 * 支持中英双语
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cloud, Cpu, Orbit, CheckCircle2 } from "lucide-react";
import { fetchAwsPage, mediaUrl, type AwsPageData, toStrapiLocale } from "@/lib/cms";
import { useLang, type Lang } from "@/components/Layout";
import { aws as AW, t } from "@/lib/i18n";
import { CountUp } from "@/hooks/useCountUp";
import { TypewriterText, TypewriterOnView } from "@/hooks/useTypewriter";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Cloud,
  Orbit,
  Cpu,
};

export default function AWSPage() {
  const [headerLabel, setHeaderLabel] = useState("AWS Infrastructure");
  const [headerHeading, setHeaderHeading] = useState("AWS 基础设施");
  const [headerParagraph, setHeaderParagraph] = useState(
    "XMAX AI Inc 基于 AWS 全球基础设施构建可扩展的 AI 推理服务能力，支持跨区域部署、低时延响应、高可用运行及多行业场景复制。"
  );
  const [narrativePoints, setNarrativePoints] = useState([
    { icon: "Cloud", title: "基于 AWS 全球基础设施布局全球服务能力", description: "" },
    { icon: "Orbit", title: "面向跨区域访问、低时延响应和高可用部署进行架构设计", description: "" },
    { icon: "Cpu", title: "通过云原生能力支持业务弹性增长和行业场景快速复制", description: "" },
  ]);
  const [awsStats, setAwsStats] = useState([
    { value: "39", label: "Geographic Regions" },
    { value: "123", label: "Availability Zones" },
    { value: "750+", label: "CloudFront POPs" },
  ]);
  const [coreMessages, setCoreMessages] = useState([
    "公司在 AWS 全球基础设施上建设 AI 服务能力",
    "公司业务适合多区域部署、弹性扩容与低时延推理",
    "公司在 AI 推理、模型服务、数据检索、安全治理方面形成平台能力",
    "公司有多个垂直行业场景，具备与 AWS 联合拓展空间",
  ]);
  const [capabilityMappings, setCapabilityMappings] = useState([
    { capability: "全球推理入口", description: "多 Region 部署、弹性计算、全球网络接入" },
    { capability: "模型与推理服务", description: "Amazon Bedrock、Amazon SageMaker AI、EC2 推理实例" },
    { capability: "高性能推理优化", description: "AWS Inferentia / Inferentia2、Neuron SDK" },
    { capability: "数据与检索层", description: "对象存储、数据湖、检索与向量扩展能力" },
    { capability: "安全治理层", description: "IAM、KMS、日志审计、网络隔离、策略管理" },
    { capability: "全球分发与低时延", description: "CloudFront、边缘节点、Local Zones、Wavelength" },
  ]);
  const { lang } = useLang();
  const [quoteChinese, setQuoteChinese] = useState(
    lang === "en"
      ? "XMAX AI Inc builds scalable AI inference capabilities on AWS global infrastructure, supporting cross-region deployment, low-latency response, high-availability operation, and multi-industry scenario replication."
      : "XMAX AI Inc 基于 AWS 全球基础设施构建可扩展的 AI 推理服务能力，支持跨区域部署、低时延响应、高可用运行及多行业场景复制。"
  );
  const [headerImage, setHeaderImage] = useState<string | null>(null);

  useEffect(() => {
    fetchAwsPage(toStrapiLocale(lang)).then((data: AwsPageData | null) => {
      if (!data) return;
      if (data.headerLabel) setHeaderLabel(data.headerLabel);
      if (data.headerHeading) setHeaderHeading(data.headerHeading);
      if (data.headerParagraph) setHeaderParagraph(data.headerParagraph);
      if (data.narrativePoints && data.narrativePoints.length > 0) {
        setNarrativePoints(data.narrativePoints.map((p) => ({ icon: p.icon, title: p.title, description: p.description })));
      }
      if (data.awsStats && data.awsStats.length > 0) {
        setAwsStats(data.awsStats.map((s) => ({ value: s.value, label: s.label })));
      }
      if (data.coreMessages && data.coreMessages.length > 0) {
        setCoreMessages(data.coreMessages.map((m) => m.content));
      }
      if (data.capabilityMappings && data.capabilityMappings.length > 0) {
        setCapabilityMappings(data.capabilityMappings.map((m) => ({ capability: m.capability, description: m.description })));
      }
      if (data.quoteChinese) setQuoteChinese(data.quoteChinese);
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
            className="mt-4 text-4xl text-white sm:text-5xl lg:text-6xl heading-display"
          >
            <TypewriterText text={headerHeading} speed={0.025} showCursor={false} />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 max-w-2xl text-lg text-slate-300"
          >{headerParagraph}</motion.p>
        </motion.div>
      </section>

      {/* Infrastructure Narrative */}
      <section className="bg-slate-900 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="section-label text-white">Infrastructure Narrative</p>
              <h2 className="mt-4 text-3xl heading-display text-white sm:text-4xl">
                <TypewriterOnView text={t(AW, "narrativeSection", lang)} speed={0.03} showCursor={false} />
              </h2>

              <div className="mt-8 space-y-4">
                {narrativePoints.map((point, i) => {
                  const Icon = ICON_MAP[point.icon] || Cloud;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                      className="flex gap-3"
                    >
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                      <p className="text-base text-slate-300">{point.title}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4">
                {awsStats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    className="rounded-xl bg-slate-950 p-5 text-center"
                  >
                    <div className="text-3xl font-bold text-white heading-display">
                      <CountUp value={stat.value} duration={1.8} />
                    </div>
                    <div className="mt-1 text-[11px] uppercase tracking-wider text-slate-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">Core Messages</p>
              <ul className="space-y-4">
                {coreMessages.map((msg, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                    <span className="text-sm leading-7 text-slate-300">{msg}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Capability Mapping */}
      <section className="bg-slate-950 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
            className="section-label text-white"
          >Capability Mapping</motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl heading-display text-white sm:text-4xl"
          >
            <TypewriterOnView text={t(AW, "capabilityMapping", lang)} speed={0.03} showCursor={false} />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 max-w-2xl text-lg text-slate-300"
          >{t(AW, "capabilityDesc", lang)}</motion.p>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {capabilityMappings.map((mapping, i) => (
              <motion.div
                key={mapping.capability}
                className="rounded-2xl border border-slate-700 bg-slate-900 p-6 transition-all hover:border-slate-600 hover:shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: "easeOut" }}
              >
                <h3 className="text-base font-semibold text-white">{mapping.capability}</h3>
                <p className="mt-2 text-sm text-slate-500">{mapping.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-slate-900 border-y border-slate-800/50 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-4xl px-8 lg:px-12 text-center"
        >
          <p className="text-xl font-light italic text-slate-300 leading-relaxed">
            &ldquo;{quoteChinese}&rdquo;
          </p>
        </motion.div>
      </section>
    </>
  );
}
