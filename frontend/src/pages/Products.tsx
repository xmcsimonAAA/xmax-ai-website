/*
 * Products Page — AI 产品矩阵
 * 支持中英双语
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Cloud, Layers3, Shield, Workflow } from "lucide-react";
import { fetchProductsPage, mediaUrl, toStrapiLocale, type ProductsPageData, type ProductItem } from "../lib/cms";
import { useLang } from "@/components/Layout";
import { products as P, t } from "@/lib/i18n";
import { PRICING_MODELS, PRODUCTS } from "@/content/remediation";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Cloud,
  Layers3,
  Workflow,
  BrainCircuit,
  Shield,
};

export default function Products() {
  const [data, setData] = useState<ProductsPageData | null>(null);
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { lang } = useLang();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setData(null);
    setHeaderImage(null);
    fetchProductsPage(toStrapiLocale(lang)).then((d) => {
      if (!active) return;
      setData(d);
      if (d?.headerImage) setHeaderImage(mediaUrl(d.headerImage));
      setLoading(false);
    });
    return () => { active = false; };
  }, [lang]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-white" />
      </div>
    );
  }

  const headerLabel = data?.headerLabel || t(P, "headerLabel", lang);
  const headerHeading = data?.headerHeading || t(P, "headerHeading", lang);
  const headerParagraph = data?.headerParagraph || t(P, "headerParagraph", lang);

  const products: ProductItem[] = PRODUCTS.map((product, index) => ({
    id: index + 1,
    name: product.name,
    icon: product.icon,
    description: product.description,
    scene: product.scene,
    details: product.details,
    image: null,
  }));

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
            className="mt-4 text-4xl text-white sm:text-5xl lg:text-6xl heading-display"
          >{headerHeading}</motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 max-w-2xl text-lg text-slate-300"
          >{headerParagraph}</motion.p>
        </motion.div>
      </section>

      {/* Products Grid */}
      <section className="bg-slate-900 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="space-y-8">
            {products.map((product, index) => {
              const Icon = ICON_MAP[product.icon] || Cloud;
              const detailLines = product.details ? product.details.split("\n") : [];
              return (
                <motion.div
                  key={product.name}
                  id={`product-${index + 1}`}
                  className="group overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 transition-all transition-all hover:border-slate-600 hover:shadow-lg scroll-mt-24"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  {product.image && (
                    <div className="h-56 overflow-hidden">
                      <img
                        src={mediaUrl(product.image, "large") || mediaUrl(product.image) || ""}
                        alt={product.name}
                        className="motion-image h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8 lg:p-12">
                  <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-start">
                    <div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-white transition-colors group-hover:bg-slate-800 group-hover:text-white">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                          {lang === "zh" ? "产品" : "Product"} 0{index + 1}
                        </span>
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold text-white">{product.name}</h3>
                      <p className="mt-3 text-base text-slate-300">{product.description}</p>
                      <div className="mt-4 text-xs uppercase tracking-wider text-slate-500">{product.scene}</div>
                    </div>
                    <ul className="space-y-3">
                      {detailLines.map((detail) => (
                        <li key={detail} className="flex items-start gap-2 text-sm text-slate-300">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-950 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="section-label text-slate-500">Commercial model</p>
            <h2 className="mt-4 text-4xl text-white heading-display">A clear path from pilot to production.</h2>
            <p className="mt-5 text-base leading-7 text-slate-400">Pricing is scoped to workload shape, capacity commitment, and support requirements. Final commercial terms are confirmed during enterprise review.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PRICING_MODELS.map((model) => (
              <div key={model.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
                <h3 className="text-lg font-semibold text-white">{model.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{model.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
