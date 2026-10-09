import { COMPANY, LEGAL_PAGES } from "@/content/remediation";

type LegalPageType = keyof typeof LEGAL_PAGES;

export default function LegalPage({ type }: { type: LegalPageType }) {
  const page = LEGAL_PAGES[type];

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">
        <div className="relative mx-auto max-w-7xl px-8 lg:px-12">
          <p className="section-label text-slate-400">Legal</p>
          <h1 className="mt-4 text-4xl text-white sm:text-5xl lg:text-6xl heading-display">{page.title}</h1>
          <p className="mt-5 text-sm text-slate-500">Effective date: {COMPANY.effectiveDate}</p>
        </div>
      </section>

      <section className="bg-slate-900 py-16 lg:py-24">
        <article className="mx-auto max-w-3xl px-8 lg:px-12">
          <div className="space-y-10">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold text-white">{section.heading}</h2>
                <div className="mt-3 space-y-3 text-base leading-8 text-slate-300">
                  {section.body.split("\n").map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
            <section>
              <h2 className="text-xl font-semibold text-white">Entity contact</h2>
              <div className="mt-3 space-y-1 text-base leading-8 text-slate-300">
                <p>{COMPANY.name}</p>
                <p>{COMPANY.registeredAddress}</p>
                <p>{COMPANY.emails.legal}</p>
                {COMPANY.phone && <p>{COMPANY.phone}</p>}
              </div>
            </section>
          </div>
        </article>
      </section>
    </>
  );
}
