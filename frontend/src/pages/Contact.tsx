/*
 * Contact Page — 联系我们
 * 支持中英双语
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchContactPage, type ContactPageData, mediaUrl, toStrapiLocale } from "@/lib/cms";
import { useLang, type Lang } from "@/components/Layout";
import { contact as CT, common as C, t } from "@/lib/i18n";
import { TypewriterText, TypewriterOnView } from "@/hooks/useTypewriter";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail,
  Phone,
  MapPin,
  Building2,
};

export default function Contact() {
  const [data, setData] = useState<ContactPageData | null>(null);
  const { lang } = useLang();
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isEn = lang === "en";

  useEffect(() => {
    let active = true;
    setLoading(true);
    setData(null);
    setHeaderImage(null);
    fetchContactPage(toStrapiLocale(lang)).then((data) => {
      if (!active) return;
      if (data) {
        setData(data);
        if (data.headerImage) setHeaderImage(mediaUrl(data.headerImage));
      }
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

  const contactPoints = data?.contactPoints?.length
    ? data.contactPoints
    : (lang === "zh"
      ? [
          { id: 1, icon: "Mail", title: "商务合作", description: "合作伙伴、生态对接、商务咨询", value: "business@xmax.ai" },
          { id: 2, icon: "Phone", title: "AWS 生态合作", description: "AWS 技术对接、联合方案探讨", value: "aws@xmax.ai" },
          { id: 3, icon: "MapPin", title: "总部地址", description: "新加坡", value: "Singapore" },
        ]
      : [
          { id: 1, icon: "Mail", title: "Business Partnerships", description: "Partners, ecosystem collaboration, and business inquiries", value: "business@xmax.ai" },
          { id: 2, icon: "Phone", title: "AWS Ecosystem", description: "AWS technical alignment and joint solution discussions", value: "aws@xmax.ai" },
          { id: 3, icon: "MapPin", title: "Headquarters", description: "Singapore", value: "Singapore" },
        ]).map((p) => ({ ...p })) as ContactPageData["contactPoints"];

  return (
    <>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-36">
        {headerImage && (
          <div className="absolute inset-0">
            <img src={headerImage} alt={data?.headerHeading || "Contact"} className="h-full w-full object-cover" />
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
          >{data?.headerLabel || t(CT, "headerLabel", lang)}</motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`mt-4 text-4xl text-white sm:text-5xl lg:text-6xl heading-display ${headerImage ? 'relative' : ''}`}
          >
            <TypewriterText text={data?.headerHeading || t(CT, "headerHeading", lang)} speed={0.06} showCursor={false} />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 max-w-2xl text-lg text-slate-300"
          >{data?.headerParagraph || t(CT, "headerParagraph", lang)}</motion.p>
        </motion.div>
      </section>

      {/* Contact Cards */}
      <section className="bg-slate-900 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {contactPoints.map((point, index) => {
              const Icon = ICON_MAP[point.icon] || Mail;
              return (
                <motion.div
                  key={point.id ?? index}
                  className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center transition-all hover:border-slate-600 hover:shadow-lg"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-white">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {point.description}
                  </p>
                  <p className="mt-3 text-base font-medium text-white">{point.value}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Form */}
      <section className="bg-slate-950 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-3xl heading-display text-white sm:text-4xl">
                <TypewriterOnView text={data?.ctaHeading || t(CT, "ctaHeading", lang)} speed={0.065} showCursor={false} />
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                {data?.ctaParagraph || t(CT, "ctaParagraph", lang)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="rounded-2xl bg-slate-900 p-8 shadow-sm ring-1 ring-slate-700"
            >
              <h3 className="text-lg font-semibold text-white">{t(CT, "sendInquiry", lang)}</h3>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300">{t(C, "name", lang)}</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/40 focus:ring-white/20"
                    placeholder={isEn ? "Your name & company" : "您的姓名与公司名称"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300">{t(C, "email", lang)}</label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/40 focus:ring-white/20"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300">{t(C, "inquiry", lang)}</label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/40 focus:ring-white/20"
                    placeholder={isEn ? "Tell us about your inquiry..." : "请描述您感兴趣的合作方向..."}
                  />
                </div>
                <Button className="w-full rounded-none bg-white py-4 text-base font-semibold uppercase tracking-[0.15em] text-black hover:bg-slate-200 transition-colors">
                  {t(C, "submit", lang)}
                </Button>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  {isEn
                    ? "Please provide your company name and contact details, describe the collaboration areas you are interested in. Our team will respond within 2 business days."
                    : "请提供您的公司名称与联系方式，描述您感兴趣的合作方向，我们的团队将在 2 个工作日内回复。"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
