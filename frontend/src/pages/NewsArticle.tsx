/*
 * News Article Page — 单篇新闻详情
 * Magazine-style layout with full-bleed hero, sidebar metadata, and elegant typography
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag, Clock, ChevronRight } from "lucide-react";
import { fetchHomePage, mediaUrl, type HomePageData, type UpdateItem } from "../lib/cms";
import { toStrapiLocale } from "@/lib/cms";
import { useLang } from "@/components/Layout";
import { useLocation } from "wouter";

export default function NewsArticle() {
  const [article, setArticle] = useState<UpdateItem | null>(null);
  const [allUpdates, setAllUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const backToNewsLabel = lang === "zh" ? "返回新闻" : "Back to News";
  const notFoundLabel = lang === "zh" ? "未找到文章" : "Article not found";
  const corporateNewsLabel = lang === "zh" ? "公司新闻" : "Corporate News";
  const minuteReadLabel = lang === "zh" ? "分钟阅读" : "min read";
  const relatedLabel = lang === "zh" ? "相关" : "Related";

  // Extract article id from URL hash: #/news/123 → 123
  const rawId = typeof window !== "undefined"
    ? window.location.hash.replace("#/news/", "").split("?")[0]
    : "";
  const articleId = parseInt(rawId, 10);

  useEffect(() => {
    fetchHomePage(toStrapiLocale(lang)).then((data: HomePageData | null) => {
      if (!data) { setLoading(false); return; }
      const items = data.recentUpdates || [];
      setAllUpdates(items);

      const found = items.find((u) => u.id === articleId) || items[Number(rawId)] || null;
      setArticle(found);
      setLoading(false);
    });
  }, [lang, articleId, rawId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-white" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-950 text-white">
        <h1 className="text-6xl font-bold text-slate-200">404</h1>
        <p className="mt-4 text-slate-500">{notFoundLabel}</p>
        <button onClick={() => navigate("/news")}
          className="mt-6 rounded border border-slate-700 px-6 py-2 text-sm text-slate-300 hover:text-white">
          ← {backToNewsLabel}
        </button>
      </div>
    );
  }

  const imageUrl = article.image
    ? mediaUrl(article.image)
    : null;

  // Find related articles (exclude current)
  const related = allUpdates.filter((u) => u.id !== article.id).slice(0, 3);

  return (
    <>
      {/* ─── Full‑bleed Hero ──────────────────────── */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-slate-950">
        {imageUrl ? (
          <>
            <div className="absolute inset-0">
              <img
                src={imageUrl}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Subtle vignette for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
        )}

        {/* Back button — fixed position */}
        <button
          onClick={() => navigate("/news")}
          className="absolute left-6 top-6 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/80 backdrop-blur-md transition-all hover:bg-black/50 hover:text-white lg:left-12 lg:top-8"
        >
          <ArrowLeft className="h-4 w-4" /> {backToNewsLabel}
        </button>

        {/* Title & metadata overlaid */}
        <div className="relative z-10 w-full">
          <div className="mx-auto max-w-4xl px-8 pb-16 lg:px-12 lg:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
                  <Tag className="h-3 w-3" /> {article.tag}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                  <Calendar className="h-3 w-3" /> {article.date}
                </span>
              </div>
              <h1 className="text-4xl leading-tight text-white sm:text-5xl lg:text-6xl heading-display">
                {article.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Article Body ─────────────────────────── */}
      <section className="bg-slate-950 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Publisher / reading metadata bar */}
            <div className="mb-12 flex items-center gap-6 border-b border-slate-800 pb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                  X
                </div>
                <div>
                  <p className="text-sm font-medium text-white">XMAX AI</p>
                  <p className="text-xs text-slate-500">{corporateNewsLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                <span>{Math.ceil(article.title.length / 50)} {minuteReadLabel}</span>
              </div>
            </div>

            {/* Lead paragraph */}
            <p className="text-xl leading-relaxed text-slate-300">
              XMAX AI Inc is pleased to announce a significant milestone in our ongoing commitment to building
              trusted, scalable AI inference infrastructure across global markets. {article.title}.
            </p>

            {/* Body placeholder — structure for future CMS content */}
            <div className="mt-12 space-y-8 text-base leading-relaxed text-slate-300">
              <p>
                This update marks an important step forward for XMAX AI Inc as we continue to expand
                our presence across the {lang === "zh" ? "9 大业务板块" : "nine business segments"},
                including e-commerce, interactive entertainment, supply chain services, space computing,
                robotics, life sciences, finance, security, and enterprise services.
              </p>
              <p>
                Built on AWS global infrastructure, our AI inference platform leverages distributed
                computing, model gateway, agent runtime, data retrieval, and security governance layers
                to deliver enterprise-grade capabilities to partners and customers worldwide.
              </p>
              <p>
                We remain committed to our mission of connecting industrial innovation with societal
                needs through accessible, scalable AI infrastructure. Stay tuned for more updates
                as we continue to build the future of AI inference services.
              </p>
            </div>

            {/* Footer divider */}
            <div className="mt-16 border-t border-slate-800 pt-8">
              <p className="text-xs text-slate-600">
                {lang === "zh"
                  ? "© 2026 XMAX AI Inc. 保留所有权利。未经许可不得转载本文。"
                  : "© 2026 XMAX AI Inc. All rights reserved. This article may not be reproduced without permission."}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Related Articles ─────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-slate-800 bg-slate-900 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-8 lg:px-12">
            <p className="section-label text-slate-300">{relatedLabel}</p>
            <h2 className="mt-6 text-3xl heading-display text-white sm:text-4xl">
              {lang === "zh" ? "更多新闻" : "More News"}
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {related.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#/news/${item.id}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                  className="group overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 transition-all hover:border-slate-600 hover:shadow-xl"
                >
                  {item.image && (
                    <div className="h-44 overflow-hidden">
                      <img
                        src={mediaUrl(item.image, "medium") || mediaUrl(item.image) || ""}
                        alt={item.title}
                        className="motion-image h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <span className="rounded border border-white/10 px-2 py-0.5 text-xs text-slate-300">{item.tag}</span>
                      <span className="text-xs text-slate-500">{item.date}</span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-white group-hover:text-white line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
