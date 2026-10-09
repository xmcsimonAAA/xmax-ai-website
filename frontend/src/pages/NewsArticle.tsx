import { ArrowLeft, ExternalLink } from "lucide-react";
import { NEWS_ITEMS, PREPARED_DATE } from "@/content/remediation";

export default function NewsArticle({ params }: { params: { id: string } }) {
  const article = NEWS_ITEMS.find((item) => String(item.id) === params.id);
  if (!article) {
    return <section className="mx-auto max-w-4xl px-8 py-24"><h1 className="text-4xl text-white">Coming Soon</h1><p className="mt-6 text-slate-400">News &amp; Updates will be published here.</p><a className="mt-8 inline-flex items-center gap-2 text-blue-300" href="#/news"><ArrowLeft className="h-4 w-4" />Back to News</a></section>;
  }

  return (
    <article className="mx-auto max-w-4xl px-8 py-20 lg:py-28">
      <a href="#/news" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" />News and disclosures</a>
      <p className="mt-10 section-label text-blue-300">{article.tag}</p>
      <h1 className="mt-5 text-4xl text-white sm:text-5xl heading-display">{article.title}</h1>
      <p className="mt-6 text-sm text-slate-500">{article.dateLabel}: {article.date} · Summary prepared {PREPARED_DATE}</p>
      <p className="mt-10 text-xl leading-8 text-slate-300">{article.summary}</p>
      <div className="mt-10 space-y-6 text-base leading-8 text-slate-400">{article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <a className="mt-12 inline-flex items-center gap-2 text-sm text-blue-300 hover:text-white" href={article.sourceUrl} target="_blank" rel="noopener noreferrer">{article.sourceLabel}<ExternalLink className="h-4 w-4" /></a>
    </article>
  );
}
