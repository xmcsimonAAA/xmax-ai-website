/*
 * News List Page — 新闻杂志式列表
 * Premium magazine-style layout with staggered grid, hover effects, and article links
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fetchHomePage, mediaUrl, type HomePageData, type UpdateItem } from "../lib/cms";
import { toStrapiLocale } from "@/lib/cms";
import { useLang } from "@/components/Layout";
import { news as N, t } from "@/lib/i18n";

export default function News() {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const { lang } = useLang();

  useEffect(() => {
    fetchHomePage(toStrapiLocale(lang)).then((data: HomePageData | null) => {
      if (!data) return;
      if (data.recentUpdates?.length) setUpdates(data.recentUpdates);
      if (data.heroSlides?.[0]?.image) {
        setHeaderImage(mediaUrl(data.heroSlides[0].image, "large") || mediaUrl(data.heroSlides[0].image));
      }
    });
  }, [lang]);

  return (
    <>
      {/* ─── Header ───────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-36">
        {headerImage && (
          <div className="absolute inset-0">
            <img src={headerImage} alt="News" className="h-full w-full object-cover" />
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
          >{t(N, "label", lang)}</motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-5xl text-white sm:text-6xl lg:text-7xl heading-display"
          >{t(N, "heading", lang)}</motion.h1>
        </motion.div>
      </section>

      {/* ─── Featured Article (first item, magazine style) ── */}
      {updates.length > 0 && (
        <section className="bg-slate-950 pb-16 pt-0 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto max-w-7xl px-8 lg:px-12"
          >
            <a
              href={`#/news/${updates[0].id}`}
              className="group relative block overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 transition-all transition-all hover:border-slate-600 hover:shadow-xl"
            >
              <div className="grid lg:grid-cols-2">
                {/* Image side */}
                <div className="relative h-72 overflow-hidden lg:h-auto">
                  {updates[0].image ? (
                    <img
                      src={mediaUrl(updates[0].image) || ""}
                      alt={updates[0].title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-700 to-slate-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/80 lg:bg-none lg:from-transparent" />
                </div>
                {/* Text side */}
                <div className="relative flex flex-col justify-center p-8 lg:p-16">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="rounded border border-white/15 px-3 py-1 text-xs text-slate-300">{updates[0].tag}</span>
                    <span className="text-xs text-slate-500">{updates[0].date}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl heading-display">
                    {updates[0].title}
                  </h2>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors group-hover:text-white">
                    Read Article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        </section>
      )}

      {/* ─── Remaining Articles Grid ──────────────── */}
      {updates.length > 1 && (
        <section className="bg-slate-950 pb-24 lg:pb-32">
          <div className="mx-auto max-w-7xl px-8 lg:px-12">
            <div className="mb-12 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-800" />
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
                {lang === "zh" ? "更多新闻" : "More Articles"}
              </p>
              <div className="h-px flex-1 bg-slate-800" />
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {updates.slice(1).map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#/news/${item.id}`}
                  className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-all transition-all hover:border-slate-600 hover:shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  {item.image && (
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={mediaUrl(item.image, "medium") || mediaUrl(item.image) || ""}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <span className="rounded border border-white/10 px-3 py-1 text-xs text-slate-300">{item.tag}</span>
                      <span className="text-xs text-slate-500">{item.date}</span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white transition-colors group-hover:text-white line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="mt-4 flex items-center gap-1.5 text-sm text-white/40 transition-colors group-hover:text-white/70">
                      Read more <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {updates.length === 0 && (
        <section className="flex min-h-[40vh] items-center justify-center bg-slate-950">
          <p className="text-slate-500">{t(N, "empty", lang)}</p>
        </section>
      )}
    </>
  );
}
