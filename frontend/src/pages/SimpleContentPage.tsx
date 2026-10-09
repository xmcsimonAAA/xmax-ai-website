import { useLang } from "@/components/Layout";
import { SERVICE_PAGES } from "@/content/remediation";

type SimplePageType = "enterprise-service" | "security-governance";

export default function SimpleContentPage({ type }: { type: SimplePageType }) {
  const { lang } = useLang();
  const page = SERVICE_PAGES[type];

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">
        <div className="relative mx-auto max-w-7xl px-8 lg:px-12">
          <p className="section-label text-slate-400">{lang === "zh" ? "业务内容" : "Business Content"}</p>
          <h1 className="mt-4 text-4xl text-white sm:text-5xl lg:text-6xl heading-display">
            {page.title}
          </h1>
        </div>
      </section>

      <section className="bg-slate-900 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-8 lg:px-12">
          <div className="space-y-6">
            {page.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-base leading-relaxed text-slate-300 font-light">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
