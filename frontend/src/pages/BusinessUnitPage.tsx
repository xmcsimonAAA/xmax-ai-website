/*
 * Business Unit Detail Page — 业务板块详情
 * Sticky nav bar + header image + alternating image-text sections
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { fetchBusinessPage, mediaUrl, toStrapiLocale, type BusinessPageData, type BusinessUnit } from "@/lib/cms";
import { useLang } from "@/components/Layout";
import { business as B, t } from "@/lib/i18n";

export default function BusinessUnitPage() {
  const [allUnits, setAllUnits] = useState<BusinessUnit[]>([]);
  const [currentUnit, setCurrentUnit] = useState<BusinessUnit | null>(null);
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const backLabel = lang === "zh" ? "返回" : "Back";
  const notFoundLabel = lang === "zh" ? "未找到应用方向" : "Application area not found";

  // Extract unit id from URL hash: #/business/01 → 01
  const rawId = typeof window !== "undefined"
    ? window.location.hash.replace("#/business/", "").split("?")[0]
    : "";
  const unitIndex = parseInt(rawId, 10) - 1; // 01 → 0

  useEffect(() => {
    let active = true;
    setLoading(true);
    setAllUnits([]);
    setCurrentUnit(null);
    setHeaderImage(null);
    fetchBusinessPage(toStrapiLocale(lang)).then((data: BusinessPageData | null) => {
      if (!active) return;
      if (!data) { setLoading(false); return; }
      const units = data.businessUnits || [];
      setAllUnits(units);
      if (data.headerImage) setHeaderImage(mediaUrl(data.headerImage));

      const current = units[unitIndex] || null;
      setCurrentUnit(current);
      setLoading(false);
    });
    return () => { active = false; };
  }, [lang, unitIndex]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-white" />
      </div>
    );
  }

  if (!currentUnit) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-950">
        <h1 className="text-6xl font-bold text-slate-200">404</h1>
        <p className="mt-4 text-slate-500">{notFoundLabel}</p>
        <button onClick={() => navigate("/business")}
          className="mt-6 border border-slate-700 px-6 py-2 text-sm text-slate-300 hover:text-white">
          ← {backLabel}
        </button>
      </div>
    );
  }

  const heroUrl = mediaUrl(currentUnit.image);
  const sections = currentUnit.sections || [];

  return (
    <>
      {/* ─── Full‑bleed Hero ──────────────────────── */}
      <section className="relative flex min-h-[60vh] items-end overflow-hidden bg-slate-950">
        {heroUrl ? (
          <>
            <div className="absolute inset-0">
              <img src={heroUrl} alt={currentUnit.title} className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950" />
        )}

        <button onClick={() => navigate("/business")}
          className="absolute left-6 top-6 z-20 flex items-center gap-2 border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/80 backdrop-blur-md transition-all hover:bg-black/50 hover:text-white lg:left-12 lg:top-8">
          <ArrowLeft className="h-4 w-4" /> {backLabel}
        </button>

        <div className="relative z-10 w-full">
          <div className="mx-auto max-w-7xl px-8 pb-16 lg:px-12 lg:pb-24">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/60">{currentUnit.alias}</p>
              <h1 className="mt-4 text-4xl leading-tight text-white sm:text-5xl lg:text-6xl heading-display">
                {currentUnit.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-white/70 font-light">{currentUnit.subtitle}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Sticky Business Unit Nav ─────────────── */}
      <section
        className="sticky z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-md"
        style={{ top: "73px" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 lg:px-12">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {allUnits.map((unit, i) => {
              const active = i === unitIndex;
              return (
                <a
                  key={unit.id}
                  href={`#/business/${String(i + 1).padStart(2, "0")}`}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "border-white/40 bg-white/15 text-white"
                      : "border-white/15 bg-white/8 text-white/70 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {unit.title}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Description lead ─────────────────────── */}
      <section className="border-b border-white/5 bg-slate-950 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-8 lg:px-12">
          <p className="text-lg leading-relaxed text-white/70 font-light">{currentUnit.description}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {currentUnit.tags.split(",").map((tag) => (
              <span key={tag.trim()} className="border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/70">
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Alternating Image‑Text Sections ──────── */}
      {sections.length > 0 ? (
        sections.map((section, i) => {
          const isEven = i % 2 === 0;
          const sectionImage = mediaUrl(section.image) || mediaUrl(currentUnit.image);

          return (
            <section key={section.id} className="bg-black">
              <div className="grid lg:grid-cols-2">
                {/* Image side — left on even, right on odd */}
                <div className={`relative h-72 overflow-hidden lg:h-[32rem] ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  {sectionImage ? (
                    <>
                      <img src={sectionImage} alt={section.heading || ""}
                        className="motion-image h-full w-full object-cover" />
                      {/* Gradient overlay — fade image edge into black towards text side */}
                      <div className={`absolute inset-y-0 w-48 pointer-events-none ${
                        isEven ? "right-0 bg-gradient-to-l from-black via-black/60 to-transparent" 
                               : "left-0 bg-gradient-to-r from-black via-black/60 to-transparent"
                      }`} />
                    </>
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-700 to-slate-900" />
                  )}
                </div>
                {/* Text side — right on even, left on odd */}
                <div className={`relative flex items-center px-8 py-12 lg:px-20 lg:py-24 ${
                  isEven ? "lg:order-2 lg:justify-start" 
                         : "lg:order-1 lg:justify-end"
                }`}>
                  <motion.div
                    className="max-w-lg"
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    {section.heading && (
                      <h3 className="text-2xl font-bold text-white sm:text-3xl heading-display">
                        {section.heading}
                      </h3>
                    )}
                    {section.body && (
                      <p className="mt-6 text-base leading-relaxed text-white/65 font-normal">
                        {section.body.split("\n").map((line, j) => (
                          <span key={j}>{line}{j < section.body!.split("\n").length - 1 && <br />}</span>
                        ))}
                      </p>
                    )}
                  </motion.div>
                </div>
              </div>
            </section>
          );
        })
      ) : (
        <section className="flex items-center justify-center bg-black py-24">
          <p className="text-sm text-white/20">
            {lang === "zh" ? "暂无更多内容" : "No additional content yet"}
          </p>
        </section>
      )}
    </>
  );
}
