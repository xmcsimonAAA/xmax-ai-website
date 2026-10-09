import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { fetchBusinessPage, mediaUrl, toStrapiLocale, type BusinessPageData, type BusinessUnit } from "@/lib/cms";
import { useLang } from "@/components/Layout";
import { businessApplicationPage } from "@/content/business";
import { business as B, common as C, t } from "@/lib/i18n";
import { TypewriterText, TypewriterOnView } from "@/hooks/useTypewriter";

type BusinessItem = {
  id: string;
  title: string;
  alias: string;
  subtitle: string;
  description: string;
  tags: string[];
  scenes: string[];
  infraRelation: string;
  imageUrl: string | null;
};


function mapBusinessUnit(unit: BusinessUnit, index: number): BusinessItem {
  return {
    id: String(index + 1).padStart(2, "0"),
    title: unit.title,
    alias: unit.alias,
    subtitle: unit.subtitle,
    description: unit.description,
    tags: unit.tags ? unit.tags.split(",").map((t) => t.trim()) : [],
    scenes: unit.scenes ? unit.scenes.split(",").map((s) => s.trim()) : [],
    infraRelation: unit.infraRelation,
    imageUrl: mediaUrl(unit.image),
  };
}

export default function Business() {
  const [headerLabel, setHeaderLabel] = useState<string | null>(null);
  const [headerHeading, setHeaderHeading] = useState<string | null>(null);
  const [headerParagraph, setHeaderParagraph] = useState<string | null>(null);
  const [items, setItems] = useState<BusinessItem[]>([]);
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { lang } = useLang();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setHeaderLabel(null);
    setHeaderHeading(null);
    setHeaderParagraph(null);
    setItems([]);
    setHeaderImage(null);
    fetchBusinessPage(toStrapiLocale(lang)).then((data: BusinessPageData | null) => {
      if (!active) return;
      if (!data) {
        setHeaderLabel(t(B, "headerLabel", lang));
        setHeaderHeading(t(B, "headerHeading", lang));
        setHeaderParagraph(t(B, "headerParagraph", lang));
        setItems(businessApplicationPage(null, toStrapiLocale(lang)).businessUnits.map(mapBusinessUnit));
        setLoading(false);
        return;
      }
      setHeaderLabel(data.headerLabel || t(B, "headerLabel", lang));
      setHeaderHeading(data.headerHeading || t(B, "headerHeading", lang));
      setHeaderParagraph(data.headerParagraph || t(B, "headerParagraph", lang));
      if (data.businessUnits && data.businessUnits.length > 0) {
        setItems(data.businessUnits.map(mapBusinessUnit));
      }
      if (data.headerImage) setHeaderImage(mediaUrl(data.headerImage));
      setLoading(false);
    });
    return () => { active = false; };
  }, [lang]);

  if (loading || !headerLabel || !headerHeading || !headerParagraph) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-white" />
      </div>
    );
  }

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
            className="mt-6 text-4xl text-white sm:text-5xl lg:text-6xl heading-display"
          >
            <TypewriterText text={headerHeading} speed={0.06} showCursor={false} />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 max-w-2xl text-lg text-slate-300/80"
          >{headerParagraph}</motion.p>
        </motion.div>
      </section>

      <section className="border-t border-slate-800 bg-slate-950 py-14 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-5 px-8 sm:grid-cols-2 lg:grid-cols-3 lg:px-12">
        {items.map((item, index) => {
          return (
            <motion.a
              id={`business-${item.id}`}
              key={item.id}
              href={`#/business/${item.id}`}
              className="group flex cursor-pointer scroll-mt-28 flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-colors duration-300 hover:border-slate-600"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="motion-image h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-800" />
                )}
                <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/0" />
                <div className="absolute left-4 top-4 flex items-center gap-3">
                  <span className="rounded bg-black/70 px-2 py-1 font-mono text-[10px] tracking-[0.16em] text-white">{item.id}</span>
                  <span className="max-w-[15rem] truncate text-[10px] font-medium uppercase tracking-[0.18em] text-white/70">{item.alias}</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 lg:p-7">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="heading-display text-2xl text-white lg:text-3xl">
                    <TypewriterOnView text={item.title} speed={0.065} showCursor={false} />
                  </h3>
                  <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-slate-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
                </div>
                <p className="mt-3 text-base font-medium leading-6 text-slate-200">{item.subtitle}</p>
                <p className="mt-4 text-sm leading-6 text-slate-400">{item.description}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded border border-slate-700 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500 transition-colors group-hover:border-slate-500 group-hover:text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="mt-6 inline-flex items-center gap-2 border-t border-slate-800 pt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition-colors group-hover:text-white">
                  {t(C, "viewDetails", lang)}
                </span>
              </div>
            </motion.a>
          );
        })}
        </div>
      </section>
    </>
  );
}
