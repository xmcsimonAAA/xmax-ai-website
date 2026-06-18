/*
 * Home Page — SEA-inspired landing page
 * 数据从 Strapi CMS 获取，支持中英双语
 */
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Building2, Box, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchHomePage, mediaUrl, type HomePageData } from "@/lib/cms";
import { toStrapiLocale, type StrapiLocale } from "@/lib/cms";
import { useLang } from "@/components/Layout";
import { home as H, common as C, t } from "@/lib/i18n";
import { TypewriterText, TypewriterOnView } from "@/hooks/useTypewriter";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Box,
  Globe,
};

const DEFAULT_BG = "from-blue-900 via-slate-900 to-blue-950";
const BG_MAP: Record<string, string> = {
  blue: "from-blue-900 via-slate-900 to-blue-950",
  indigo: "from-indigo-900 via-slate-900 to-indigo-950",
  cyan: "from-cyan-900 via-slate-900 to-cyan-950",
  purple: "from-purple-900 via-slate-900 to-purple-950",
  emerald: "from-emerald-900 via-slate-900 to-emerald-950",
};

function getBgClass(bgGradient: string | null): string {
  if (!bgGradient) return DEFAULT_BG;
  return BG_MAP[bgGradient.toLowerCase()] || DEFAULT_BG;
}

/* ─── Animated Counter ──────────────────────────── */

function parseValue(raw: string): { num: number; suffix: string; isDecimal: boolean } {
  // Handle "99.9%", "30+", "100+", "9" etc.
  const suffixMatch = raw.match(/[*%+xX]$/);
  const suffix = suffixMatch ? suffixMatch[0] : "";
  const numeric = raw.replace(/[*%+xX]$/, "");
  const hasDecimal = numeric.includes(".");
  const num = parseFloat(numeric);
  return { num: isNaN(num) ? 0 : num, suffix, isDecimal: hasDecimal };
}

function AnimatedCounter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState("0");
  const hasRun = useRef(false);

  useEffect(() => {
    if (!inView || hasRun.current) return;
    hasRun.current = true;

    const { num, suffix, isDecimal } = parseValue(value);
    const duration = 1200; // ms
    const steps = 30;
    const stepTime = duration / steps;
    let step = 0;

    // Ease-out cubic: progress slows down towards the end
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const timer = setInterval(() => {
      step++;
      const progress = easeOutCubic(step / steps);
      const current = progress * num;

      if (step >= steps) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(
          isDecimal
            ? current.toFixed(1) + suffix
            : Math.floor(current).toString() + suffix
        );
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref} className={`text-4xl font-bold text-white lg:text-5xl heading-display ${className || ""}`}>
      {display}
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState<HomePageData | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { lang } = useLang();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setData(null);
    setHeroIndex(0);
    fetchHomePage(toStrapiLocale(lang)).then((d) => {
      if (!active) return;
      setData(d);
      setLoading(false);
    });
    return () => { active = false; };
  }, [lang]);

  const heroSlides = data?.heroSlides ?? [];
  const currentSlide = heroSlides[heroIndex];
  const navCards = data?.navCards ?? [];
  const stats = data?.stats ?? [];
  const recentUpdates = data?.recentUpdates ?? [];

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length, heroIndex]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-white" />
      </div>
    );
  }

  return (
    <>
      {/* ─── Hero Section ──────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-black">
        {/* Background: cross-fade with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${heroIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {currentSlide?.image ? (
              <>
                <img src={mediaUrl(currentSlide.image) || ""} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/30" />
              </>
            ) : (
              <div className={`h-full w-full bg-gradient-to-br ${currentSlide ? getBgClass(currentSlide.bgGradient) : DEFAULT_BG}`} />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="relative mx-auto max-w-7xl px-8 py-28 lg:px-12 lg:py-44">
          <AnimatePresence mode="wait">
            {currentSlide && (
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl"
              >
                <h1 className="text-4xl leading-tight text-white sm:text-5xl lg:text-7xl heading-display">
                  <TypewriterText
                    key={`hero-title-${heroIndex}`}
                    text={currentSlide.title}
                    speed={0.06}
                    showCursor={false}
                  />
                </h1>
                {currentSlide.subtitle && (
                  <p className="mt-8 max-w-2xl text-xl leading-snug text-slate-200 font-light">
                    {currentSlide.subtitle}
                  </p>
                )}

                {currentSlide.tags && (
                  <div className="mt-10 flex flex-wrap gap-3">
                    {currentSlide.tags.split(",").map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-white/15 bg-transparent px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-white/70 backdrop-blur-sm"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                  <Button asChild size="lg" className="rounded-none bg-white px-10 py-6 text-base font-semibold uppercase tracking-[0.15em] text-black hover:bg-slate-200 transition-colors">
                    <a href="#/business">
                      {data?.ctaPrimaryButton?.text || t(H, "viewBusiness", lang)}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-none border-white/25 bg-transparent px-10 py-6 text-base font-semibold uppercase tracking-[0.15em] text-white hover:bg-white/[0.03] hover:border-white/40 transition-colors"
                  >
                    <a href="#/contact">
                      {data?.ctaSecondaryButton?.text || t(H, "contactEco", lang)}
                    </a>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Left / Right Arrow Navigation */}
        {heroSlides.length > 1 && (
          <>
            <button
              onClick={() => setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/30 p-3 text-white/50 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-black/50 hover:text-white lg:left-8"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>
            <button
              onClick={() => setHeroIndex((prev) => (prev + 1) % heroSlides.length)}
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/30 p-3 text-white/50 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-black/50 hover:text-white lg:right-8"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>
          </>
        )}

        {/* Bottom Dot Indicators */}
        {heroSlides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === heroIndex ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ─── Mission Section ────────────────────────── */}
      <section className="bg-slate-950 py-32 lg:py-44">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-7xl px-8 lg:px-12"
        >
          <div className="mx-auto max-w-4xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="section-label text-white"
            >
              {t(H, "missionLabel", lang)}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-4xl leading-tight text-white sm:text-5xl lg:text-6xl heading-display"
            >
              <TypewriterOnView text={data?.missionHeading || t(H, "missionHeading", lang)} speed={0.065} showCursor={false} />
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 text-xl leading-snug text-slate-300 font-light"
            >
              {data?.missionParagraph || t(H, "missionParagraph", lang)}
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ─── Navigation Cards (full-bleed image style) ── */}
      {navCards.length > 0 && (
        <section className="relative overflow-hidden bg-black">
          <div className="grid grid-cols-1">
            {navCards.map((card, index) => (
              <motion.a
                key={card.id}
                href={`#${card.url || "/"}`}
                className="group relative flex h-[80vh] min-h-[36rem] w-full items-end overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Full-bleed background */}
                <div className="absolute inset-0">
                  {card.image ? (
                    <img
                      src={mediaUrl(card.image, "large") || mediaUrl(card.image) || ""}
                      alt={card.title}
                      className="motion-image h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />
                  )}
                </div>
                {/* Top gradient — blend from black above */}
                <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black via-black/65 to-transparent lg:h-72" />
                {/* Bottom gradient — blend into text area */}
                <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black via-black/75 to-transparent lg:h-96" />
                {index < navCards.length - 1 && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-black/55 to-black" />
                )}
                {/* Text content — overlaid on image */}
                <div className="relative z-10 w-full px-8 pb-16 lg:px-16 lg:pb-20">
                  <div className="mx-auto max-w-4xl">
                    {(() => {
                      const IconComp = ICON_MAP[card.icon];
                      return IconComp ? (
                        <span className="inline-block animate-[pulse-tech_2s_ease-in-out_infinite]">
                          <IconComp className="mb-6 h-8 w-8 text-blue-400/80" />
                        </span>
                      ) : null;
                    })()}
                    <h3 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl heading-display">
                      {card.title}
                    </h3>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300/90">
                      {card.description}
                    </p>
                    <div className="mt-8 inline-flex items-center text-base font-medium text-white/80 transition-colors group-hover:text-white">
                      {t(C, "learnMore", lang)} <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      )}

      {/* ─── Key Stats ──────────────────────────────── */}
      {stats.length > 0 && (
        <section className="bg-slate-900 border-y border-slate-800/50 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-7xl px-6 lg:px-8"
          >
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="text-center"
                >
                  <AnimatedCounter value={stat.value} />
                  <div className="mt-2 text-sm text-slate-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* ─── Recent Updates ────────────────────────── */}
      {recentUpdates.length > 0 && (
        <section className="bg-slate-950 py-32 lg:py-44">
          <div className="mx-auto max-w-7xl px-8 lg:px-12">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4 }}
              className="section-label text-slate-300"
            >{t(H, "recentUpdates", lang)}</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-4xl heading-display text-white sm:text-5xl"
            >{t(H, "recentUpdates", lang)}</motion.h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {recentUpdates.map((item, i) => (
                <motion.a
                  key={item.id}
                  href="#/news"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-all hover:border-slate-600 hover:shadow-md block"
                >
                  {item.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={mediaUrl(item.image, "medium") || mediaUrl(item.image) || ""}
                        alt={item.title}
                        className="motion-image h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-white">{item.tag}</span>
                    <p className="mt-3 text-xs text-slate-500">{item.date}</p>
                    <h3 className="mt-2 text-base font-bold text-white group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA Banner ─────────────────────────────── */}
      <section className="bg-slate-900 border-t border-slate-800 py-32">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-7xl px-8 lg:px-12 text-center"
        >
          <h2 className="text-4xl heading-display text-white sm:text-5xl">
            <TypewriterOnView text={t(H, "ctaHeading", lang)} speed={0.065} showCursor={false} />
          </h2>
          <p className="mt-6 text-xl text-slate-300 font-light max-w-2xl mx-auto">
            {t(H, "ctaParagraph", lang)}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="rounded-none bg-white px-10 py-6 text-base font-semibold uppercase tracking-[0.15em] text-black hover:bg-slate-200 transition-colors">
              <a href="#/contact">
                {t(C, "contactUs", lang)}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-none border-slate-600 bg-transparent px-10 py-6 text-base font-semibold uppercase tracking-[0.15em] text-slate-300 hover:bg-white/[0.03] hover:text-white hover:border-white/25 transition-colors"
            >
              <a href="#/about">{t(C, "learnMore", lang)}</a>
            </Button>
          </div>
        </motion.div>
      </section>
    </>
  );
}
