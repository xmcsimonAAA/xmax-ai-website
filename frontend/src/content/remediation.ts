import content from "../../../shared/website-content.json";

const environment = import.meta.env;

function linkedinUrl(value: string | undefined, category: "in" | "company") {
  try {
    const parsed = new URL(value?.trim() || "");
    return parsed.protocol === "https:" && /^(www\.)?linkedin\.com$/.test(parsed.hostname)
      && parsed.pathname.startsWith(`/${category}/`) ? parsed.href : "";
  } catch {
    return "";
  }
}

export const COMPANY = {
  ...content.company,
  registeredAddress: environment.VITE_REGISTERED_ADDRESS?.trim() || content.company.registeredAddress || "732 S 6TH ST, STE R Las Vegas, NV 89101",
  officeAddress: environment.VITE_OFFICE_ADDRESS?.trim() || content.company.officeAddress || "",
  apecAddress: environment.VITE_APEC_ADDRESS?.trim() || content.company.apecAddress || "",
  phone: environment.VITE_CONTACT_PHONE?.trim() || content.company.phone || "",
  phoneHref: (environment.VITE_CONTACT_PHONE?.trim() || content.company.phone) ? `tel:${(environment.VITE_CONTACT_PHONE?.trim() || content.company.phone).replace(/[^+\d]/g, "")}` : "",
  emails: {
    official: environment.VITE_OFFICIAL_EMAIL?.trim() || content.company.emails?.official || "info@xmax.com",
    business: environment.VITE_OFFICIAL_EMAIL?.trim() || content.company.emails?.official || "info@xmax.com",
    legal: environment.VITE_OFFICIAL_EMAIL?.trim() || content.company.emails?.official || "info@xmax.com",
    security: environment.VITE_OFFICIAL_EMAIL?.trim() || content.company.emails?.official || "info@xmax.com",
  },
  effectiveDate: environment.VITE_LEGAL_EFFECTIVE_DATE?.trim() || content.company.legalEffectiveDate || "",
  governanceNote: content.company.governanceNote || "",
  officialEmailVerified: environment.VITE_OFFICIAL_EMAIL_VERIFIED !== "false",
  mailboxesVerified: environment.VITE_MAILBOXES_VERIFIED === "true",
  linkedin: linkedinUrl(environment.VITE_LINKEDIN_COMPANY_URL, "company"),
};

export const PUBLICATION_READY = environment.VITE_CONTACT_DETAILS_VERIFIED === "true"
  && Boolean(COMPANY.phone) && environment.VITE_MAILBOXES_VERIFIED === "true"
  && environment.VITE_LEGAL_REVIEWED === "true" && Boolean(COMPANY.effectiveDate)
  && environment.VITE_DEPLOYMENT_VERIFIED === "true" && Boolean(COMPANY.linkedin)
  && environment.VITE_TEAM_PROFILES_VERIFIED === "true";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  nationality?: string;
  linkedin?: string;
}

export interface NewsItem {
  id: string | number;
  date: string;
  dateLabel: string;
  tag: string;
  title: string;
  summary: string;
  body: string[];
  sourceLabel: string;
  sourceUrl: string;
}

export interface PartnerReference {
  name: string;
  relationship: string;
  description: string;
  sourceUrl: string;
}

export const TEAM: TeamMember[] = content.team.map((member) => ({
  ...member,
  linkedin: linkedinUrl(member.linkedin, "in"),
}));
export const NEWS_ITEMS: NewsItem[] = [];
export const PRODUCTS = content.products;
export const BUSINESS_SCENARIOS = content.businessScenarios;
export const DEPLOYMENT_PLAN = content.deploymentPlan;
export const DEPLOYMENT = {
  regions: environment.VITE_DEPLOYMENT_REGIONS?.trim() || "",
  facilities: environment.VITE_DEPLOYMENT_FACILITIES?.trim() || "",
  status: environment.VITE_DEPLOYMENT_STATUS?.trim() || "planned",
};
export const PARTNERS: PartnerReference[] = [];
export const PRICING_MODELS = content.pricingModels;
export const SERVICE_PAGES = content.servicePages;
export const PREPARED_DATE = content.preparedDate;
export const LEGAL_PAGES = content.legalPages;
