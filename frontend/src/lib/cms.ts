/**
 * CMS API Service — Strapi v5 REST API client
 * 统一封装 Strapi API 调用，处理 locale、populate、图片 URL 拼接和数据转换
 *
 * i18n 架构：前端静态字典作为终极兜底。
 * 当英文 CMS 数据被意外覆盖为中文时，自动用静态英文字典翻译，
 * 确保英文用户始终看到英文，不再依赖 CMS 数据完整性。
 */

// 开发模式走 Vite 代理，生产模式用环境变量
const CMS_BASE = import.meta.env.VITE_CMS_URL || "";
import { deepTranslateStatic } from "./translations-static";

/** Strapi i18n locale 代码 */
export type StrapiLocale = "zh-Hans" | "en";

/** 前端 Lang 到 Strapi locale 的映射 */
export function toStrapiLocale(lang: string): StrapiLocale {
  return lang === "en" ? "en" : "zh-Hans";
}

function alternateLocale(locale?: StrapiLocale): StrapiLocale | null {
  if (!locale) return null;
  return locale === "en" ? "zh-Hans" : "en";
}

function prepareFallbackData<T>(fallback: T | null, locale?: StrapiLocale): T | null {
  if (!fallback) return null;
  return locale === "en" ? (deepTranslateStatic(fallback) as T) : fallback;
}

// ─── Types ──────────────────────────────────────────

interface StrapiMediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  url: string;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
}

interface StrapiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

// ─── Helper: resolve media URL ──────────────────────

export function mediaUrl(media: StrapiMedia | null | undefined, size?: "thumbnail" | "small" | "medium" | "large"): string | null {
  if (!media) return null;
  if (size && media.formats?.[size]) {
    return `${CMS_BASE}${media.formats[size].url}`;
  }
  return `${CMS_BASE}${media.url}`;
}

function isMissingMedia(media: StrapiMedia | null | undefined): boolean {
  return !media?.url;
}

function sharedMedia(
  media: StrapiMedia | null | undefined,
  fallback: StrapiMedia | null | undefined
): StrapiMedia | null {
  if (isMissingMedia(media)) return fallback ?? null;
  if (isMissingMedia(fallback)) return media ?? null;
  return (fallback!.id > media!.id) ? fallback! : media!;
}

function fillIndexedImages<T extends { image: StrapiMedia | null }>(
  items: T[] | undefined,
  fallbackItems: T[] | undefined
): T[] {
  const length = Math.max(items?.length ?? 0, fallbackItems?.length ?? 0);
  return Array.from({ length }, (_, index) => {
    const item = items?.[index];
    const fallbackItem = fallbackItems?.[index];
    if (!item) return fallbackItem;
    return {
      ...item,
      image: sharedMedia(item.image, fallbackItem?.image),
    };
  }).filter((item): item is T => Boolean(item));
}

function fillHeaderImage<T extends { headerImage: StrapiMedia | null }>(
  data: T,
  fallback: T | null
): T {
  if (!fallback) return data;
  return { ...data, headerImage: sharedMedia(data.headerImage, fallback.headerImage) };
}

function mergeHomeMedia(data: HomePageData, fallback: HomePageData | null): HomePageData {
  if (!fallback) return data;
  return {
    ...data,
    heroSlides: fillIndexedImages(data.heroSlides, fallback.heroSlides),
    navCards: fillIndexedImages(data.navCards, fallback.navCards),
    recentUpdates: fillIndexedImages(data.recentUpdates, fallback.recentUpdates),
  };
}

function mergeProductsMedia(data: ProductsPageData, fallback: ProductsPageData | null): ProductsPageData {
  const withHeader = fillHeaderImage(data, fallback);
  return {
    ...withHeader,
    products: fillIndexedImages(withHeader.products, fallback?.products),
  };
}

function mergeBusinessMedia(data: BusinessPageData, fallback: BusinessPageData | null): BusinessPageData {
  const withHeader = fillHeaderImage(data, fallback);
  const length = Math.max(withHeader.businessUnits?.length ?? 0, fallback?.businessUnits?.length ?? 0);
  return {
    ...withHeader,
    businessUnits: Array.from({ length }, (_, index) => {
      const unit = withHeader.businessUnits?.[index];
      const fallbackUnit = fallback?.businessUnits?.[index];
      if (!unit) return fallbackUnit;
      const sectionLength = Math.max(unit.sections?.length ?? 0, fallbackUnit?.sections?.length ?? 0);
      return {
        ...unit,
        image: sharedMedia(unit.image, fallbackUnit?.image),
        sections: Array.from({ length: sectionLength }, (_, sectionIndex) => {
          const section = unit.sections?.[sectionIndex];
          const fallbackSection = fallbackUnit?.sections?.[sectionIndex];
          if (!section) return fallbackSection;
          return {
            ...section,
            image: sharedMedia(section.image, fallbackSection?.image),
          };
        }).filter((section): section is BusinessSection => Boolean(section)),
      };
    }).filter((unit): unit is BusinessUnit => Boolean(unit)),
  };
}

// ─── Helper: Chinese text detection ──────────────────

function hasChineseText(data: unknown, depth: number = 0): boolean {
  if (depth > 10 || !data) return false;
  if (typeof data === "string") return /[\u4e00-\u9fff]/.test(data);
  if (Array.isArray(data)) return data.some((item) => hasChineseText(item, depth + 1));
  if (typeof data === "object") {
    return Object.values(data as Record<string, unknown>).some(
      (v) => hasChineseText(v, depth + 1)
    );
  }
  return false;
}

// ─── Generic fetch ──────────────────────────────────

interface DeepComponentConfig {
  /** Sub-component field names to populate deeply */
  subComponents: string[];
  /** First-level media fields to populate explicitly (skipped when using wildcard *) */
  mediaFields?: string[];
  /** Media fields inside sub-components */
  subComponentMediaFields?: Record<string, string[]>;
}

async function fetchSingleType<T>(
  apiPath: string,
  componentFields?: string[],
  locale?: StrapiLocale,
  mediaFields?: string[],
  /** Deep component nesting: { parentField: { subComponents, mediaFields } } */
  deepComponents?: Record<string, DeepComponentConfig>
): Promise<T | null> {
  const params = new URLSearchParams();
  if (locale) {
    params.set("locale", locale);
  }
  if (componentFields && componentFields.length > 0) {
    for (const field of componentFields) {
      const deep = deepComponents?.[field];
      if (deep) {
        // Explicit population: list each media field and each sub-component
        for (const mf of (deep.mediaFields || [])) {
          params.append(`populate[${field}][populate][${mf}]`, "true");
        }
        for (const subField of deep.subComponents) {
          const subMediaFields = deep.subComponentMediaFields?.[subField];
          if (subMediaFields && subMediaFields.length > 0) {
            for (const mediaField of subMediaFields) {
              params.append(`populate[${field}][populate][${subField}][populate][${mediaField}]`, "true");
            }
          } else {
            params.append(`populate[${field}][populate][${subField}][populate]`, "*");
          }
        }
      } else {
        params.append(`populate[${field}][populate]`, "*");
      }
    }
  }
  if (mediaFields && mediaFields.length > 0) {
    for (const field of mediaFields) {
      params.append(`populate[${field}]`, "true");
    }
  }

  const url = `${CMS_BASE}/api${apiPath}?${params}`;
  console.log(`[CMS] Fetching: ${url}`);
  const res = await fetch(url);

  // Parse JSON regardless of status — Strapi v5 returns valid JSON even on 404
  let data: T | null = null;
  try {
    const json: StrapiResponse<T> = await res.json();
    data = json.data;
  } catch {
    // Not JSON at all — bail
    console.error(`[CMS] Invalid JSON on ${apiPath}`, res.status);
    return null;
  }

  // i18n locale fallback: en returns 404 when no data exists, retry with zh-Hans
  if (locale && locale !== "zh-Hans" && !data) {
    console.log(`[CMS] No data for ${locale} on ${apiPath} (HTTP ${res.status}), falling back to zh-Hans`);
    const fallbackData = await fetchSingleType(apiPath, componentFields, "zh-Hans", mediaFields, deepComponents);
    if (fallbackData) {
      console.warn(`[CMS.i18n] Translating fallback zh-Hans data for ${apiPath} (requested: ${locale})`);
      return deepTranslateStatic(fallbackData) as T;
    }
    return null;
  }

  // For errors on non-en, non-fallbackable requests, bail out
  if (!res.ok && data === null && !(locale && locale !== "zh-Hans")) {
    console.error(`[CMS] Fetch error: ${apiPath}`, res.status);
    return null;
  }

  // i18n: if non-zh-Hans data contains Chinese, translate using static dictionary
  if (locale && locale !== "zh-Hans" && data && hasChineseText(data)) {
    console.warn(
      `[CMS.i18n] %c${apiPath} (${locale})%c contains untranslated Chinese → applying static translations`,
      "color:#f59e0b", "color:inherit"
    );
    const translated = deepTranslateStatic(data);
    console.log(`[CMS.i18n] Static translation applied`);
    return translated;
  }

  console.log(`[CMS] Success: ${apiPath}, locale=${locale || "default"}, data keys=${Object.keys(data || {}).slice(0, 5).join(",")}`);
  return data;
}

// ─── Page data types ────────────────────────────────

// Home page
export interface HeroSlide {
  id: number;
  image: StrapiMedia | null;
  title: string;
  subtitle: string | null;
  tags: string | null;
  bgGradient: string | null;
}

export interface NavCard {
  id: number;
  image: StrapiMedia | null;
  icon: string;
  title: string;
  description: string;
  url: string;
}

export interface StatItem {
  id: number;
  value: string;
  label: string;
}

export interface UpdateItem {
  id: number;
  date: string;
  title: string;
  tag: string;
  image: StrapiMedia | null;
}

export interface CtaButton {
  id: number;
  text: string;
  url: string;
}

export interface HomePageData {
  id: number;
  documentId: string;
  missionLabel: string;
  missionHeading: string | null;
  missionParagraph: string | null;
  heroSlides: HeroSlide[];
  navCards: NavCard[];
  stats: StatItem[];
  recentUpdates: UpdateItem[];
  ctaPrimaryButton: CtaButton | null;
  ctaSecondaryButton: CtaButton | null;
}

// About page
export interface ValueItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface HighlightItem {
  id: number;
  content: string;
}

export interface Subsidiary {
  id: number;
  business: string;
  legalName: string;
}

export interface AboutPageData {
  id: number;
  documentId: string;
  headerImage: StrapiMedia | null;
  headerLabel: string;
  headerHeading: string | null;
  headerParagraph: string | null;
  narrativeLabel: string;
  narrativeHeading: string | null;
  narrativeParagraph: string | null;
  groupLabel: string;
  groupHeading: string | null;
  groupParagraph: string | null;
  values: ValueItem[];
  highlights: HighlightItem[];
  subsidiaries: Subsidiary[];
}

// Infrastructure page
export interface InfraLayer {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  details: string;
}

export interface InfrastructurePageData {
  id: number;
  documentId: string;
  headerImage: StrapiMedia | null;
  headerLabel: string;
  headerHeading: string | null;
  headerParagraph: string | null;
  keyPrincipleHeading: string | null;
  keyPrincipleParagraph: string | null;
  layers: InfraLayer[];
}

// Products page
export interface ProductItem {
  id: number;
  name: string;
  icon: string;
  description: string;
  scene: string;
  details: string;
  image: StrapiMedia | null;
}

export interface ProductsPageData {
  id: number;
  documentId: string;
  headerImage: StrapiMedia | null;
  headerLabel: string;
  headerHeading: string | null;
  headerParagraph: string | null;
  products: ProductItem[];
}

// Business page
export interface BusinessSection {
  id: number;
  heading: string | null;
  body: string | null;
  image: StrapiMedia | null;
}

export interface BusinessUnit {
  id: number;
  title: string;
  alias: string;
  subtitle: string;
  description: string;
  tags: string;
  scenes: string;
  infraRelation: string;
  image: StrapiMedia | null;
  sections: BusinessSection[];
}

export interface BusinessPageData {
  id: number;
  documentId: string;
  headerImage: StrapiMedia | null;
  headerLabel: string;
  headerHeading: string | null;
  headerParagraph: string | null;
  businessUnits: BusinessUnit[];
}

// AWS page
export interface AwsNarrativePoint {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface AwsStatItem {
  id: number;
  value: string;
  label: string;
}

export interface AwsCoreMessage {
  id: number;
  content: string;
}

export interface AwsCapabilityMapping {
  id: number;
  capability: string;
  description: string;
}

export interface AwsPageData {
  id: number;
  documentId: string;
  headerImage: StrapiMedia | null;
  headerLabel: string;
  headerHeading: string | null;
  headerParagraph: string | null;
  quoteChinese: string | null;
  narrativePoints: AwsNarrativePoint[];
  awsStats: AwsStatItem[];
  coreMessages: AwsCoreMessage[];
  capabilityMappings: AwsCapabilityMapping[];
}

// Contact page
export interface ContactPoint {
  id: number;
  icon: string;
  title: string;
  description: string;
  value: string;
}

export interface ContactPageData {
  id: number;
  documentId: string;
  headerImage: StrapiMedia | null;
  headerLabel: string;
  headerHeading: string | null;
  headerParagraph: string | null;
  ctaHeading: string | null;
  ctaParagraph: string | null;
  contactPoints: ContactPoint[];
}

// Site settings
export interface NavItemData {
  id: number;
  label: string;
  url: string;
}

export interface FooterLinkGroup {
  id: number;
  title: string;
}

export interface SiteSettingData {
  id: number;
  documentId: string;
  companyName: string;
  tagline: string;
  footerDescription: string | null;
  logo: StrapiMedia | null;
  navItems: NavItemData[];
  footerLinkGroups: FooterLinkGroup[];
}

// ─── Privacy & Terms pages ──────────────────────────

export interface LegalPageData {
  id: number;
  documentId: string;
  title: string;
  content: string | null;
}

// ─── API fetch functions ────────────────────────────

export async function fetchHomePage(locale?: StrapiLocale): Promise<HomePageData | null> {
  const data = await fetchSingleType<HomePageData>("/home-page", [
    "heroSlides", "navCards", "stats", "recentUpdates", "ctaPrimaryButton", "ctaSecondaryButton",
  ], locale, undefined, {
    heroSlides: { subComponents: [], mediaFields: ["image"] },
    navCards: { subComponents: [], mediaFields: ["image"] },
    recentUpdates: { subComponents: [], mediaFields: ["image"] },
  });
  const fallbackLocale = alternateLocale(locale);
  if (!data || !fallbackLocale) return data;
  const fallback = await fetchSingleType<HomePageData>("/home-page", [
    "heroSlides", "navCards", "stats", "recentUpdates", "ctaPrimaryButton", "ctaSecondaryButton",
  ], fallbackLocale, undefined, {
    heroSlides: { subComponents: [], mediaFields: ["image"] },
    navCards: { subComponents: [], mediaFields: ["image"] },
    recentUpdates: { subComponents: [], mediaFields: ["image"] },
  });
  return mergeHomeMedia(data, prepareFallbackData(fallback, locale));
}

export async function fetchAboutPage(locale?: StrapiLocale): Promise<AboutPageData | null> {
  const data = await fetchSingleType<AboutPageData>("/about-page", [
    "values", "highlights", "subsidiaries",
  ], locale, ["headerImage"]);
  const fallbackLocale = alternateLocale(locale);
  if (!data || !fallbackLocale) return data;
  const fallback = await fetchSingleType<AboutPageData>("/about-page", [
    "values", "highlights", "subsidiaries",
  ], fallbackLocale, ["headerImage"]);
  return fillHeaderImage(data, prepareFallbackData(fallback, locale));
}

export async function fetchInfrastructurePage(locale?: StrapiLocale): Promise<InfrastructurePageData | null> {
  const data = await fetchSingleType<InfrastructurePageData>("/infrastructure-page", ["layers"], locale, ["headerImage"]);
  const fallbackLocale = alternateLocale(locale);
  if (!data || !fallbackLocale) return data;
  const fallback = await fetchSingleType<InfrastructurePageData>("/infrastructure-page", ["layers"], fallbackLocale, ["headerImage"]);
  return fillHeaderImage(data, prepareFallbackData(fallback, locale));
}

export async function fetchProductsPage(locale?: StrapiLocale): Promise<ProductsPageData | null> {
  const data = await fetchSingleType<ProductsPageData>("/products-page", ["products"], locale, ["headerImage"], {
    products: { subComponents: [], mediaFields: ["image"] },
  });
  const fallbackLocale = alternateLocale(locale);
  if (!data || !fallbackLocale) return data;
  const fallback = await fetchSingleType<ProductsPageData>("/products-page", ["products"], fallbackLocale, ["headerImage"], {
    products: { subComponents: [], mediaFields: ["image"] },
  });
  return mergeProductsMedia(data, prepareFallbackData(fallback, locale));
}

export async function fetchBusinessPage(locale?: StrapiLocale): Promise<BusinessPageData | null> {
  const data = await fetchSingleType<BusinessPageData>("/business-page", ["businessUnits"], locale, ["headerImage"], {
    businessUnits: {
      subComponents: ["sections"],
      mediaFields: ["image"],
      subComponentMediaFields: { sections: ["image"] },
    },
  });
  const fallbackLocale = alternateLocale(locale);
  if (!data || !fallbackLocale) return data;
  const fallback = await fetchSingleType<BusinessPageData>("/business-page", ["businessUnits"], fallbackLocale, ["headerImage"], {
    businessUnits: {
      subComponents: ["sections"],
      mediaFields: ["image"],
      subComponentMediaFields: { sections: ["image"] },
    },
  });
  return mergeBusinessMedia(data, prepareFallbackData(fallback, locale));
}

export async function fetchAwsPage(locale?: StrapiLocale): Promise<AwsPageData | null> {
  const data = await fetchSingleType<AwsPageData>("/aws-page", [
    "narrativePoints", "awsStats", "coreMessages", "capabilityMappings",
  ], locale, ["headerImage"]);
  const fallbackLocale = alternateLocale(locale);
  if (!data || !fallbackLocale) return data;
  const fallback = await fetchSingleType<AwsPageData>("/aws-page", [
    "narrativePoints", "awsStats", "coreMessages", "capabilityMappings",
  ], fallbackLocale, ["headerImage"]);
  return fillHeaderImage(data, prepareFallbackData(fallback, locale));
}

export async function fetchContactPage(locale?: StrapiLocale): Promise<ContactPageData | null> {
  const data = await fetchSingleType<ContactPageData>("/contact-page", [
    "contactPoints",
  ], locale, ["headerImage"]);
  const fallbackLocale = alternateLocale(locale);
  if (!data || !fallbackLocale) return data;
  const fallback = await fetchSingleType<ContactPageData>("/contact-page", [
    "contactPoints",
  ], fallbackLocale, ["headerImage"]);
  return fillHeaderImage(data, prepareFallbackData(fallback, locale));
}

export async function fetchPrivacyPage(locale?: StrapiLocale): Promise<LegalPageData | null> {
  return fetchSingleType<LegalPageData>("/privacy-page", [], locale);
}

export async function fetchTermsPage(locale?: StrapiLocale): Promise<LegalPageData | null> {
  return fetchSingleType<LegalPageData>("/terms-page", [], locale);
}

export async function fetchSiteSetting(locale?: StrapiLocale): Promise<SiteSettingData | null> {
  return fetchSingleType<SiteSettingData>("/site-setting", [
    "navItems", "footerLinkGroups",
  ], locale, ["logo"]);
}
