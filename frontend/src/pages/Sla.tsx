import { ArrowRight, Clock3, LifeBuoy, ShieldCheck, Wrench } from "lucide-react";
import { COMPANY } from "@/content/remediation";

const COMMITMENTS = [
  { icon: Clock3, title: "Availability", body: "Availability targets, service credits, and regional redundancy are defined by the signed enterprise order form and service tier." },
  { icon: LifeBuoy, title: "Incident response", body: "Operational incidents are triaged by severity, with customer communications, mitigation ownership, and a post-incident review when appropriate." },
  { icon: Wrench, title: "Maintenance", body: "Planned maintenance is scheduled with notice whenever practical. Emergency maintenance may proceed when required to protect service integrity or security." },
  { icon: ShieldCheck, title: "Security support", body: "Security and compliance questions are handled through the security contact, with deployment-specific evidence shared during enterprise review." },
];

export default function Sla() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-36">
        <div className="relative mx-auto max-w-7xl px-8 lg:px-12">
          <p className="section-label text-slate-400">Service Level Overview</p>
          <h1 className="mt-5 max-w-4xl text-5xl text-white sm:text-6xl lg:text-7xl heading-display">Clear commitments for production AI services.</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300">This public overview explains the operating model. Contract-specific availability, response windows, support scope, and remedies are confirmed in each customer’s signed service schedule.</p>
        </div>
      </section>

      <section className="bg-slate-900 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 px-8 md:grid-cols-2 lg:px-12">
          {COMMITMENTS.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-2xl border border-slate-700 bg-slate-950 p-8">
              <Icon className="h-7 w-7 text-white" />
              <h2 className="mt-6 text-2xl text-white heading-display">{title}</h2>
              <p className="mt-4 text-base leading-7 text-slate-400">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-950 py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-8 lg:px-12">
          <p className="section-label text-slate-500">Scope and exclusions</p>
          <h2 className="mt-4 text-4xl text-white heading-display">Reliability is shared with the deployment design.</h2>
          <div className="mt-8 space-y-5 text-base leading-8 text-slate-300">
            <p>Service commitments apply to the XMax AI-controlled service layer. They do not cover customer networks, customer-managed credentials, third-party model providers, unsupported configurations, force majeure events, or workloads that violate the acceptable-use and trade-compliance requirements.</p>
            <p>For a deployment-specific SLA, contact <a className="text-white underline decoration-slate-600 underline-offset-4 hover:decoration-white" href={`mailto:${COMPANY.emails.business}`}>{COMPANY.emails.business}</a> with your expected region, workload profile, concurrency, and support requirements.</p>
          </div>
          <a href="#/terms" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-blue-300">Read the Terms of Service <ArrowRight className="h-4 w-4" /></a>
        </div>
      </section>
    </>
  );
}
