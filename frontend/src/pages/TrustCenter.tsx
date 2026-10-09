import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Cloud, FileCheck2, ShieldCheck } from "lucide-react";
import { COMPANY, DEPLOYMENT, DEPLOYMENT_PLAN, PARTNERS } from "@/content/remediation";

export default function TrustCenter() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.15),transparent_30rem)]" />
        <div className="relative mx-auto max-w-7xl px-8 lg:px-12">
          <p className="section-label text-slate-400">Trust Center</p>
          <h1 className="mt-5 max-w-4xl text-5xl text-white sm:text-6xl lg:text-7xl heading-display">Deployment, security, and service operations.</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300">The trust center describes our approach to infrastructure, access, and service operations.</p>
        </div>
      </section>

      <section className="bg-slate-900 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-8 lg:px-12">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Cloud, title: "Public contract scope", body: "The April 2026 platform agreement describes an AWS environment." },
              { icon: ShieldCheck, title: "Access controls", body: "Access controls, workload permissions, logging, and remote-access review support governed AI operations." },
              { icon: FileCheck2, title: "Deployment documentation", body: "Deployment documentation records the region, facility, hardware ownership, and operating responsibilities for each environment." },
            ].map(({ icon: Icon, title, body }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="rounded-2xl border border-slate-700 bg-slate-950 p-7"
              >
                <Icon className="h-7 w-7 text-white" />
                <h2 className="mt-7 text-xl font-semibold text-white">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="section-label text-slate-500">Deployment plan</p>
            <h2 className="mt-4 text-4xl text-white heading-display">Deployment documentation.</h2>
            {(DEPLOYMENT.regions || DEPLOYMENT.facilities) && <dl className="mt-8 space-y-3 text-sm leading-7 text-slate-400">
              {DEPLOYMENT.regions && <div><dt className="font-semibold text-white">Region and location</dt><dd>{DEPLOYMENT.regions}</dd></div>}
              {DEPLOYMENT.facilities && <div><dt className="font-semibold text-white">Facility qualifications</dt><dd>{DEPLOYMENT.facilities}</dd></div>}
            </dl>}
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {DEPLOYMENT_PLAN.map((item, index) => (
              <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7">
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">0{index + 1}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-8 lg:px-12">
          {PARTNERS.length > 0 && <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <p className="section-label text-slate-500">Documented relationships</p>
              <h2 className="mt-4 text-4xl text-white heading-display">Named providers, traceable agreements.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {PARTNERS.map((item) => (
                <div key={item.name} className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-950 p-5 text-sm leading-6 text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
                  <div><h3 className="text-base text-white">{item.name}</h3><p className="mt-2">{item.relationship}</p><p className="mt-3 text-slate-400">{item.description}</p><a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-blue-300">Read filed agreement</a></div>
                </div>
              ))}
            </div>
          </div>}
          <a href="#/sla" className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-blue-300">Review service commitments <ArrowRight className="h-4 w-4" /></a>
          <p className="mt-6 max-w-3xl text-xs leading-6 text-slate-500">For enterprise diligence requests, contact <a className="text-slate-300 hover:text-white" href={`mailto:${COMPANY.emails.security}`}>{COMPANY.emails.security}</a>.</p>
        </div>
      </section>
    </>
  );
}
