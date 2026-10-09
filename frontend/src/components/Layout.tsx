import { useState, useEffect, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  ChevronDown,
  Menu,
  X,
  Landmark,
  Target,
  Cpu,
  GitBranch,
  Bot,
  Database,
  ShieldCheck,
  ShoppingCart,
  Gamepad2,
  Truck,
  Rocket,
  Dna,
  Wallet,
  Shield,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import { fetchSiteSetting, toStrapiLocale, type SiteSettingData } from "@/lib/cms";
import { COMPANY } from "@/content/remediation";
import { APPLICATION_AREAS } from "@/content/business";

/* ─── Language Context ───────────────────────────────── */

export type Lang = "zh" | "en";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
});

export function useLang() {
  return useContext(LangContext);
}

/* ─── Translations ───────────────────────────────────── */

const T: Record<Lang, Record<string, string>> = {
  zh: {
    home: "首页",
    about: "关于我们",
    infrastructure: "AI 基础设施",
    products: "AI 产品",
    business: "应用场景",
    aws: "AWS 基础设施",
    contact: "联系我们",
    news: "新闻与更新",
    tagline: "全球 AI 推理服务基础设施",
    footerDesc:
      "XMAX AI Inc 正在 XMAX 集团体系下构建全球 AI 推理服务基础设施，探索面向产业需求的 AI 应用流程。",
    company: "公司",
    platform: "平台",
    businessFooter: "应用",
    copyright: "© {year} XMAX AI Inc. 保留所有权利。",
    privacy: "隐私政策",
    terms: "服务条款",
    groupSubsidiary: "集团与子公司",
    applicationAreas: "AI 应用方向",
    enterpriseService: "企业服务",
    securityGovernance: "安全与治理",
  },
  en: {
    home: "Home",
    about: "About",
    infrastructure: "AI Infrastructure",
    products: "AI Products",
    business: "Applications",
    aws: "AWS Infrastructure",
    contact: "Contact",
    news: "News",
    tagline: "Global AI Inference Infrastructure",
    footerDesc:
      "XMAX AI Inc is building global AI inference service infrastructure under the XMAX Group, connecting governed products with documented enterprise industry programs.",
    company: "Company",
    platform: "Platform",
    businessFooter: "Applications",
    copyright: "© {year} XMAX AI Inc. All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    groupSubsidiary: "Group & Subsidiaries",
    applicationAreas: "AI Application Areas",
    enterpriseService: "Enterprise Services",
    securityGovernance: "Security & Governance",
  },
};

/* ─── Nav Config (labels come from CMS, order is fixed) ─ */

interface NavChild {
  label: string;
  enLabel?: string;
  href: string;
  icon: LucideIcon;
  description: string;
  enDescription?: string;
}

interface NavItem {
  labelKey: string; // key in T[lang]
  href: string;
  children: NavChild[];
}

const navConfig: NavItem[] = [
  {
    labelKey: "home",
    href: "/",
    children: [],
  },
  {
    labelKey: "about",
    href: "/about",
    children: [
      { label: "公司定位", enLabel: "Company Positioning", href: "/about?scrollTo=positioning", icon: Landmark, description: "XMAX AI Inc 的企业定位与战略方向", enDescription: "XMAX AI Inc's positioning and strategic direction" },
      { label: "使命与愿景", enLabel: "Mission & Vision", href: "/about?scrollTo=vision", icon: Target, description: "构建全球 AI 推理服务基础设施", enDescription: "Building global AI inference infrastructure" },
      { label: "团队", enLabel: "Team", href: "/team", icon: Building2, description: "核心团队与公开履历", enDescription: "Leadership and public profiles" },
      { label: "信任中心", enLabel: "Trust Center", href: "/trust", icon: ShieldCheck, description: "部署、合规与服务承诺", enDescription: "Deployment, compliance, and service commitments" },
    ],
  },
  {
    labelKey: "infrastructure",
    href: "/infrastructure",
    children: [],
  },
  {
    labelKey: "products",
    href: "/products",
    children: [
      { label: "Inference Grid", enLabel: "Inference Grid", href: "/products?scrollTo=inference-grid", icon: Cpu, description: "分布式推理计算网络", enDescription: "Distributed inference compute network" },
      { label: "Model Gateway", enLabel: "Model Gateway", href: "/products?scrollTo=model-gateway", icon: GitBranch, description: "统一模型接入与路由网关", enDescription: "Unified model access and routing gateway" },
      { label: "Agent Studio", enLabel: "Agent Studio", href: "/products?scrollTo=agent-studio", icon: Bot, description: "智能体开发与编排平台", enDescription: "Agent development and orchestration platform" },
      { label: "Knowledge Engine", enLabel: "Knowledge Engine", href: "/products?scrollTo=knowledge-engine", icon: Database, description: "企业知识库与向量检索", enDescription: "Enterprise knowledge base and vector retrieval" },
      { label: "Security Mesh", enLabel: "Security Mesh", href: "/products?scrollTo=security-mesh", icon: ShieldCheck, description: "AI 安全与合规防护网", enDescription: "AI security and compliance mesh" },
    ],
  },
  {
    labelKey: "business",
    href: "/business",
    children: APPLICATION_AREAS.map((area, index) => ({
      label: area.zh.title,
      enLabel: area.en.title,
      href: `/business/${area.id}`,
      icon: [ShoppingCart, Gamepad2, Truck, Rocket, Bot, Dna, Wallet, Shield, Briefcase][index],
      description: area.zh.subtitle,
      enDescription: area.en.subtitle,
    })),
  },
  {
    labelKey: "aws",
    href: "/aws",
    children: [],
  },
  {
    labelKey: "news",
    href: "/news",
    children: [],
  },
  {
    labelKey: "contact",
    href: "/contact",
    children: [],
  },
];

/* ─── Navigation ─────────────────────────────────────── */

function Navigation({ lang }: { lang: Lang }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [siteData, setSiteData] = useState<SiteSettingData | null>(null);
  const t = T[lang] || T["zh"];

  useEffect(() => {
    let active = true;
    setSiteData(null);
    fetchSiteSetting(toStrapiLocale(lang)).then((data) => {
      if (active) setSiteData(data);
    });
    return () => { active = false; };
  }, [lang]);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = original; };
    }
  }, [mobileOpen]);

  const companyName = siteData?.companyName || "XMAX AI";
  const tagline = siteData?.tagline || t.tagline;

  return (
    <header
      className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/60"
      onMouseLeave={() => setOpenDropdown(null)}
    >
      <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-5 px-6 py-3.5 lg:px-8">
        {/* Brand: logo links to xmax.com, text returns to this site home */}
        <div className="flex min-w-0 items-center gap-3">
          <a
            href="https://xmax.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="XMAX official website"
            className="flex h-10 w-24 shrink-0 items-center overflow-hidden bg-black sm:w-28"
          >
            <img
              src="/assets/xmax-logo.jpg"
              alt="XMAX"
              className="h-full w-full object-contain"
            />
          </a>
          <a href="#/" className="min-w-0">
            <div className="text-[15px] font-bold tracking-[0.15em] text-white">{companyName}</div>
            <div className="text-[10px] tracking-wider text-slate-400">{tagline}</div>
          </a>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden min-w-0 items-center gap-3 xl:flex">
          <div className="flex min-w-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 shadow-[0_0_0_1px_rgba(15,23,42,0.45)] backdrop-blur-md">
          {navConfig.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setOpenDropdown(item.children.length > 0 ? item.href : null)}
            >
              <a
                href={`#${item.href}`}
                className="flex h-9 items-center justify-center gap-1 rounded-full px-3.5 text-center text-[13px] font-medium leading-tight text-slate-300 transition-all hover:bg-white/[0.08] hover:text-white"
              >
                <span className="whitespace-nowrap">{t[item.labelKey] || item.labelKey}</span>
                {item.children.length > 0 && (
                  <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform duration-200 ${
                      openDropdown === item.href ? "rotate-180" : ""
                    }`}
                  />
                )}
              </a>
            </div>
          ))}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="p-2 text-slate-300 xl:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mega Dropdown */}
      <AnimatePresence>
        {openDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-40 border-b border-slate-700 bg-slate-900 shadow-2xl"
            onMouseEnter={() => {}}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
              <div className={`grid gap-3 ${
                (navConfig.find((item) => item.href === openDropdown)?.children.length ?? 0) <= 5
                  ? "grid-cols-5"
                  : "grid-cols-9"
              }`}>
                {navConfig
                  .find((item) => item.href === openDropdown)
                  ?.children.map((child) => {
                    const Icon = child.icon;
                    return (
                      <a
                        key={child.label}
                        href={`#${child.href}`}
                        onClick={() => setOpenDropdown(null)}
                        className="group flex flex-col items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-4 text-center transition-all duration-200 hover:border-slate-600 hover:shadow-md hover:shadow-blue-500/10"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-white transition-colors group-hover:bg-slate-600 group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-semibold text-slate-100 transition-colors group-hover:text-white">
                          {lang === "en" && child.enLabel ? child.enLabel : child.label}
                        </span>
                        <span className="text-[11px] text-slate-500 leading-snug">
                          {lang === "en" && child.enDescription ? child.enDescription : child.description}
                        </span>
                      </a>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu — Portal to body, avoids position:fixed inside position:sticky bugs */}
      {mobileOpen && createPortal(
        <div
          className="xl:hidden"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
          }}
        >
          {/* Backdrop */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
            }}
            onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
          />
          {/* Drawer */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "85vw",
              maxWidth: 320,
              background: "#020617",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid #1e293b",
                background: "#020617",
                flexShrink: 0,
              }}
            >
              <span className="text-sm font-semibold tracking-wider text-white uppercase">
                {lang === "zh" ? "菜单" : "Menu"}
              </span>
              <button
                type="button"
                onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                style={{ touchAction: "manipulation" }}
                className="rounded-full border border-slate-700 p-2 text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav Items */}
            <div role="navigation" style={{ flex: 1 }}>
              {navConfig.map((item) => {
                const isExpanded = mobileExpanded === item.href;
                const hasChildren = item.children && item.children.length > 0;
                const label = t[item.labelKey] || item.labelKey;
                return (
                  <div key={item.href} style={{ borderBottom: "1px solid rgba(30,41,59,0.6)" }}>
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "14px 20px",
                        textAlign: "left",
                        background: "transparent",
                        color: "#fff",
                      }}
                    >
                      <a
                        href={`#${item.href}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          setMobileOpen(false);
                          setMobileExpanded(null);
                        }}
                        className="flex-1 text-[15px] font-semibold text-white"
                        style={{ textDecoration: "none" }}
                      >
                        {label}
                      </a>
                      {hasChildren && (
                        <button
                          type="button"
                          aria-label={`${label} submenu`}
                          onClick={(event) => {
                            event.stopPropagation();
                            setMobileExpanded(isExpanded ? null : item.href);
                          }}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-400"
                          style={{ touchAction: "manipulation" }}
                        >
                          <ChevronDown
                            className="h-4 w-4"
                            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                          />
                        </button>
                      )}
                    </div>
                    {isExpanded && hasChildren && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          padding: "4px 20px 16px",
                          borderTop: "1px solid rgba(30,41,59,0.4)",
                        }}
                      >
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={`#${child.href}`}
                            onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                            style={{
                              touchAction: "manipulation",
                              display: "block",
                              width: "calc(50% - 4px)",
                              padding: "12px",
                              borderRadius: 8,
                              border: "1px solid #1e293b",
                              background: "#0f172a",
                              color: "#cbd5e1",
                              fontSize: 12,
                              fontWeight: 500,
                              lineHeight: 1.25,
                              textDecoration: "none",
                            }}
                          >
                            {lang === "en" && child.enLabel ? child.enLabel : child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>,
        document.body
      )}
    </header>
  );
}

/* ─── Footer ─────────────────────────────────────────── */

function Footer({ lang }: { lang: Lang }) {
  const t = T[lang] || T["en"];
  return (
    <footer className="bg-slate-950 border-t border-slate-800/50 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold tracking-[0.2em] text-white">XMAX AI</div>
                <div className="text-[10px] tracking-wider text-slate-400">{t.tagline}</div>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">{t.footerDesc}</p>
            <div className="mt-6 space-y-1 text-xs leading-5 text-slate-500">
              <p>{COMPANY.registeredAddress}</p>
              <a className="block transition-colors hover:text-slate-300" href={`mailto:${COMPANY.emails.business}`}>{COMPANY.emails.business}</a>
              {COMPANY.phone && <a className="block transition-colors hover:text-slate-300" href={COMPANY.phoneHref}>{COMPANY.phone}</a>}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-300">{t.company}</h4>
              <ul className="mt-4 space-y-3">
                {[
                  { label: t.about, href: "#/about" },
                  { label: "Team", href: "#/team" },
                  { label: t.news, href: "#/news" },
                  { label: t.groupSubsidiary, href: "#/about" },
                  { label: t.contact, href: "#/contact" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-300">{t.platform}</h4>
              <ul className="mt-4 space-y-3">
                {[
                  { label: t.infrastructure, href: "#/infrastructure" },
                  { label: t.products, href: "#/products" },
                  { label: t.aws, href: "#/aws" },
                  { label: "Trust Center", href: "#/trust" },
                  { label: "SLA", href: "#/sla" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-300">{t.businessFooter}</h4>
              <ul className="mt-4 space-y-3">
                {[
                  { label: t.applicationAreas, href: "#/business" },
                  { label: t.enterpriseService, href: "#/enterprise-service" },
                  { label: t.securityGovernance, href: "#/security-governance" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">{t.copyright.replace("{year}", String(new Date().getFullYear()))}</p>
          <div className="flex gap-6">
            <a href="#/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{t.privacy}</a>
            <a href="#/terms" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{t.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** 每次路由切换自动滚动 */
function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const rawHash = window.location.hash;
      const queryPart = rawHash.includes("?") ? rawHash.split("?")[1] : "";
      const params = new URLSearchParams(queryPart);
      const scrollToId = params.get("scrollTo");
      if (scrollToId) {
        const timer = setTimeout(() => {
          const el = document.getElementById(scrollToId);
          if (el) {
            el.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
          } else {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
          }
        }, 100);
        return timer;
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      }
      return undefined;
    };

    const timer = handleScroll();
    const onHashChange = () => { handleScroll(); };
    window.addEventListener("hashchange", onHashChange);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [location]);

  return null;
}

/* ─── Layout ─────────────────────────────────────────── */

export default function Layout({ children }: { children: React.ReactNode }) {
  const lang: Lang = "en";
  const setLang = (_nextLang: Lang) => {};

  useEffect(() => {
    document.documentElement.lang = "en";
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <ScrollToTop />
        <Navigation lang={lang} />
        <main>{children}</main>
        <Footer lang={lang} />
      </div>
    </LangContext.Provider>
  );
}
