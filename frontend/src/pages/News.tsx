import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Newspaper } from "lucide-react";
import { NEWS_ITEMS } from "@/content/remediation";

export default function News() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-36">
        <div className="relative mx-auto max-w-7xl px-8 lg:px-12">
          <p className="section-label text-slate-400">XMAX AI</p>
          <h1 className="mt-5 max-w-4xl text-4xl text-white sm:text-5xl lg:text-6xl heading-display">News &amp; Updates</h1>
        </div>
      </section>

      <section className="bg-slate-900 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-8 lg:px-12">
          {NEWS_ITEMS.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {NEWS_ITEMS.map((item, index) => (
              <motion.a
                key={item.id}
                href={`#/news/${item.id}`}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className={`group flex min-h-[280px] flex-col rounded-2xl border border-slate-700 bg-slate-950 p-8 transition-colors hover:border-blue-400/50 ${index === 0 ? "lg:col-span-2 lg:min-h-[320px]" : ""}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-400">{item.tag}</span>
                  <span className="inline-flex items-center gap-2 text-xs text-slate-500"><CalendarDays className="h-3.5 w-3.5" />{item.date}</span>
                </div>
                <h2 className={`mt-8 max-w-3xl text-2xl text-white heading-display transition-colors group-hover:text-blue-200 ${index === 0 ? "lg:text-4xl" : ""}`}>{item.title}</h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">{item.summary}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-white transition-colors group-hover:text-blue-300">Read disclosure summary <ArrowUpRight className="h-4 w-4" /></span>
              </motion.a>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
              <Newspaper className="h-9 w-9 text-slate-500" aria-hidden="true" />
              <h2 className="mt-6 text-3xl text-white sm:text-4xl heading-display">Coming Soon</h2>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
