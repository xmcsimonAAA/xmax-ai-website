/*
 * About Page — 关于我们
 * 支持中英双语
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe2, Sparkles, Users, Building2, CheckCircle2 } from "lucide-react";
import { fetchAboutPage, mediaUrl, type AboutPageData, type ValueItem } from "../lib/cms";
import { toStrapiLocale } from "@/lib/cms";
import { useLang } from "@/components/Layout";
import { about as A, t } from "@/lib/i18n";
import { TypewriterText, TypewriterOnView } from "@/hooks/useTypewriter";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe2,
  Sparkles,
  Users,
  Building2,
  CheckCircle2,
};

export default function About() {
  const [data, setData] = useState<AboutPageData | null>(null);
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const { lang } = useLang();

  useEffect(() => {
    fetchAboutPage(toStrapiLocale(lang)).then((d) => {
      console.log("[About] fetched data:", d ? "OK" : "NULL", "headerImage:", d?.headerImage?.url || "none");
      setData(d);
      if (d?.headerImage) {
        const url = mediaUrl(d.headerImage);
        console.log("[About] headerImage URL:", url);
        setHeaderImage(url);
      }
    });
  }, [lang]);

  const headerLabel = data?.headerLabel || t(A, "headerLabel", lang);
  const headerHeading = data?.headerHeading || t(A, "headerHeading", lang);
  const headerParagraph = data?.headerParagraph || t(A, "headerParagraph", lang);

  const values: ValueItem[] = data?.values?.length ? data.values : [
    { id: 1, icon: "Globe2", title: "集团定位", description: "XMAX AI Inc 是 XMAX 集团 AI 能力与产业服务的重要承载主体，统一推进平台能力、产品化输出与行业化落地。" },
    { id: 2, icon: "Sparkles", title: "使命", description: "以可信、可扩展的 AI 推理服务基础设施连接产业创新与社会需求。" },
    { id: 3, icon: "Users", title: "服务对象", description: "客户、合作伙伴、AWS 生态团队、投资机构与全球化人才。" },
  ];

  const highlights: string[] = data?.highlights?.length
    ? data.highlights.map((h) => h.content)
    : [
        "强调平台、能力、治理与生态，而不是单一 AI 工具或单点产品",
        "强调 inference、orchestration、scale、latency、availability 与 security",
        "强调 9 大业务板块带来的产业化落地与集团业务协同能力",
        "基于 AWS 全球基础设施构建可扩展的 AI 推理服务能力",
        "支持跨区域部署、低时延响应与高可用运行及多行业场景复制",
      ];

  const subsidiaries: [string, string][] = data?.subsidiaries?.length
    ? data.subsidiaries.map((s) => [s.business, s.legalName])
    : [
        ["管理运营平台", "ElonX AI Holdings Pte. Ltd."],
        ["电商", "ElonX Synapse Pte. Ltd."],
        ["互娱", "ElonX IG Pte. Ltd."],
        ["供应链服务", "ElonX Flow Pte. Ltd."],
        ["太空计算", "ElonX Space Pte. Ltd."],
        ["机器人", "ElonX Kinetics Pte. Ltd."],
        ["生命科学", "ElonX Core Pte. Ltd."],
        ["金融", "ElonX Trust Pte. Ltd."],
        ["安全", "ElonX Shield Pte. Ltd."],
        ["企业服务", "ElonX Catalyst Pte. Ltd."],
      ];

  const narrativeLabel = data?.narrativeLabel || t(A, "narrativeLabel", lang);
  const narrativeHeading = data?.narrativeHeading || t(A, "narrativeHeading", lang);
  const narrativeParagraph = data?.narrativeParagraph || t(A, "narrativeParagraph", lang);

  const groupLabel = data?.groupLabel || t(A, "groupLabel", lang);
  const groupHeading = data?.groupHeading || t(A, "groupHeading", lang);
  const groupParagraph = data?.groupParagraph || t(A, "groupParagraph", lang);

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

      {/* Company Positioning */}
      <section id="positioning" className="bg-slate-900 py-24 lg:py-32 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((card, index) => {
              const Icon = ICON_MAP[card.icon] || Globe2;
              return (
                <motion.div
                  key={card.title}
                  className="group rounded-2xl border border-slate-700 bg-slate-900 p-8 transition-all hover:border-slate-600 hover:shadow-lg hover:shadow-blue-500/5"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-white transition-colors group-hover:bg-slate-800 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {card.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Official Tone */}
      <section id="vision" className="bg-slate-950 py-24 lg:py-32 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="section-label text-white">{narrativeLabel}</p>
              <h2 className="mt-4 text-3xl text-white sm:text-4xl heading-display">
                <TypewriterOnView text={narrativeHeading} speed={0.065} showCursor={false} />
              </h2>
              <p className="mt-4 text-lg text-slate-300">{narrativeParagraph}</p>
            </motion.div>
            <motion.ul
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="space-y-4"
            >
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                  <span className="text-sm leading-7 text-slate-300">{item}</span>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      {/* Group Structure */}
      <section className="bg-slate-900 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
            className="section-label text-white"
          >{groupLabel}</motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl text-white sm:text-4xl heading-display"
          >
            <TypewriterOnView text={groupHeading} speed={0.065} showCursor={false} />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 max-w-2xl text-lg text-slate-300"
          >{groupParagraph}</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-12 overflow-hidden rounded-2xl bg-slate-900 shadow-sm ring-1 ring-slate-700"
          >
            <div className="grid grid-cols-2 gap-4 border-b border-slate-700 bg-slate-800 px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
              <div>{t(A, "colBusiness", lang)}</div>
              <div>{t(A, "colLegalName", lang)}</div>
            </div>
            <div className="divide-y divide-slate-800">
              {subsidiaries.map(([business, legalName], i) => (
                <div key={business} className={`grid grid-cols-2 gap-4 px-8 py-5 ${i % 2 === 1 ? "bg-slate-800/30" : ""}`}>
                  <div className="font-semibold text-white">{business}</div>
                  <div className="text-sm text-slate-300">{legalName}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
