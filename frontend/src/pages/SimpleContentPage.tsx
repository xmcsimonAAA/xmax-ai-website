import { useEffect, useState } from "react";
import {
  fetchEnterpriseServicePage,
  fetchSecurityGovernancePage,
  toStrapiLocale,
  type LegalPageData,
} from "@/lib/cms";
import { useLang } from "@/components/Layout";

type SimplePageType = "enterprise-service" | "security-governance";

const FALLBACK: Record<SimplePageType, Record<string, { title: string; content: string }>> = {
  "enterprise-service": {
    zh: { title: "企业服务", content: "内容即将上线，敬请期待。" },
    en: { title: "Enterprise Service", content: "Content will be available soon. Please check back later." },
  },
  "security-governance": {
    zh: { title: "安全与治理", content: "内容即将上线，敬请期待。" },
    en: { title: "Security & Governance", content: "Content will be available soon. Please check back later." },
  },
};

export default function SimpleContentPage({ type }: { type: SimplePageType }) {
  const { lang } = useLang();
  const [data, setData] = useState<LegalPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const fallback = FALLBACK[type][lang];

  useEffect(() => {
    setLoading(true);
    const fetcher = type === "enterprise-service" ? fetchEnterpriseServicePage : fetchSecurityGovernancePage;
    fetcher(toStrapiLocale(lang)).then((value) => {
      setData(value);
      setLoading(false);
    });
  }, [lang, type]);

  const title = data?.title || fallback.title;
  const content = data?.content || fallback.content;
  const paragraphs = content.split("\n\n").filter(Boolean);

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">
        <div className="relative mx-auto max-w-7xl px-8 lg:px-12">
          <p className="section-label text-slate-400">{lang === "zh" ? "业务内容" : "Business Content"}</p>
          <h1 className="mt-4 text-4xl text-white sm:text-5xl lg:text-6xl heading-display">
            {loading ? "..." : title}
          </h1>
        </div>
      </section>

      <section className="bg-slate-900 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-8 lg:px-12">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-white" />
            </div>
          ) : (
            <div className="space-y-6">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-base leading-relaxed text-slate-300 font-light">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
