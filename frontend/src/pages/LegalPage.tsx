/*
 * LegalPage — 通用法律文本页（隐私政策 / 服务条款）
 */
import { useEffect, useState } from "react";
import { fetchPrivacyPage, fetchTermsPage, toStrapiLocale, type LegalPageData } from "@/lib/cms";
import { useLang } from "@/components/Layout";

type PageType = "privacy" | "terms";

interface Props {
  type: PageType;
}

const FALLBACK_TITLE: Record<PageType, Record<string, string>> = {
  privacy: { en: "Privacy Policy", zh: "隐私政策" },
  terms: { en: "Terms of Service", zh: "服务条款" },
};

const FALLBACK_CONTENT: Record<PageType, Record<string, string>> = {
  privacy: {
    en: "Content will be available soon. Please check back later.",
    zh: "内容即将上线，敬请期待。",
  },
  terms: {
    en: "Content will be available soon. Please check back later.",
    zh: "内容即将上线，敬请期待。",
  },
};

export default function LegalPage({ type }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { lang } = useLang();
  const isEn = lang === "en";

  useEffect(() => {
    const locale = toStrapiLocale(lang);
    const fetcher = type === "privacy" ? fetchPrivacyPage : fetchTermsPage;
    fetcher(locale).then((data: LegalPageData | null) => {
      if (data) {
        setTitle(data.title || FALLBACK_TITLE[type][isEn ? "en" : "zh"]);
        setContent(data.content || FALLBACK_CONTENT[type][isEn ? "en" : "zh"]);
      } else {
        setTitle(FALLBACK_TITLE[type][isEn ? "en" : "zh"]);
        setContent(FALLBACK_CONTENT[type][isEn ? "en" : "zh"]);
      }
      setLoading(false);
    });
  }, [lang, type, isEn]);

  const paragraphs = content.split("\n\n").filter(Boolean);

  return (
    <>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">
        <div className="relative mx-auto max-w-7xl px-8 lg:px-12">
          <p className="section-label text-slate-400">
            {type === "privacy" ? "Legal" : "Legal"}
          </p>
          <h1 className="mt-4 text-4xl text-white sm:text-5xl lg:text-6xl heading-display">
            {loading ? "..." : title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-slate-900 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-8 lg:px-12">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-white" />
            </div>
          ) : paragraphs.length > 0 ? (
            <div className="space-y-6">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-slate-300 font-light">
                  {p.trim()}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-base leading-relaxed text-slate-300 font-light">
              {content}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
