import { motion } from "framer-motion";
import { ExternalLink, Users } from "lucide-react";
import { COMPANY, TEAM } from "@/content/remediation";

export default function Team() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(59,130,246,0.16),transparent_32rem)]" />
        <div className="relative mx-auto max-w-7xl px-8 lg:px-12">
          <p className="section-label text-slate-400">Team</p>
          <h1 className="mt-5 max-w-4xl text-5xl text-white sm:text-6xl lg:text-7xl heading-display">The people behind XMax AI.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">Meet the board, executive leadership, and functional leaders of XMax AI Inc.</p>
        </div>
      </section>

      <section className="bg-slate-900 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-8 lg:px-12">
          {TEAM.length > 0 ? <div className="grid gap-6 lg:grid-cols-3">
            {TEAM.map((member, index) => (
              <motion.article
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="flex min-h-[300px] flex-col rounded-2xl border border-slate-700 bg-slate-950 p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <h2 className="mt-8 text-2xl text-white heading-display">{member.name}</h2>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-blue-300">{member.role}</p>
                {member.nationality && <p className="mt-3 text-xs text-slate-500">{member.nationality}</p>}
                {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-2 pt-8 text-sm text-blue-300">LinkedIn profile <ExternalLink className="h-4 w-4" /></a>}
              </motion.article>
            ))}
          </div> : null}
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-950 py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-8 lg:grid-cols-[1fr_1.2fr] lg:px-12">
          <div>
            <p className="section-label text-slate-500">Operating model</p>
            <h2 className="mt-4 text-4xl text-white heading-display">Entity roles remain distinct.</h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-slate-300">
            <p>{COMPANY.governanceNote}</p>
            <p>For legal, security, or procurement questions, contact <a className="text-white underline decoration-slate-600 underline-offset-4 hover:decoration-white" href={`mailto:${COMPANY.emails.legal}`}>{COMPANY.emails.legal}</a>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
