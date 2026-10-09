"use strict";

const { createStrapi } = require("@strapi/strapi");

const REPAIRS = [
  {
    uid: "api::home-page.home-page",
    data: {
      missionHeading: "Connecting industrial innovation with societal needs through trusted, scalable AI infrastructure.",
      missionParagraph: "XMAX AI Inc is the AI platform and industrial service carrier of XMAX Group, advancing platform capabilities, productized output, and industry implementation.",
    },
  },
  {
    uid: "api::business-page.business-page",
    data: {
      headerLabel: "BUSINESS UNITS",
      headerHeading: "Nine Business Units",
      headerParagraph: "One infrastructure foundation, nine industry scenarios. E-commerce, interactive entertainment, supply chain services, space computing, robotics, life sciences, finance, security, and enterprise services each validate XMAX AI's unified inference capabilities in real-world business contexts.",
    },
  },
  {
    uid: "api::site-setting.site-setting",
    data: {
      tagline: "Global AI Inference Service Infrastructure",
      footerDescription: "XMAX AI Inc is the AI platform and industrial service carrier of XMAX Group, advancing platform capabilities, productized output, and industry implementation.",
      footerLinkGroups: [
        { title: "Company" },
        { title: "Business" },
        { title: "Resources" },
      ],
    },
  },
  {
    uid: "api::privacy-page.privacy-page",
    data: {
      title: "Privacy Policy",
      content: "Effective date: April 1, 2026\n\nXMax AI Inc. collects and uses contact, account, support, usage, diagnostic, security-review, and procurement-review information to provide and secure its services, respond to inquiries, operate inference services, monitor reliability, prevent abuse, comply with law, and improve products. We do not sell personal information. We use access controls, logging, encryption where appropriate, and least-privilege operational practices. Privacy requests may be sent to info@xmax.com.",
    },
  },
  {
    uid: "api::terms-page.terms-page",
    data: {
      title: "Terms of Service",
      content: "Effective date: April 1, 2026\n\nThese Terms govern access to ai.xmax.com and related services provided by XMax AI Inc. Customers may not violate law, infringe rights, evade sanctions or export controls, interfere with the service, bypass access controls, or submit data they are not authorized to process. Each party will comply with applicable export-control, sanctions, customs, and trade laws. Fees, support, and service levels are stated in the applicable service schedule. These Terms are governed by Nevada law unless a signed enterprise agreement states otherwise.",
    },
  },
  {
    uid: "api::enterprise-service-page.enterprise-service-page",
    data: {
      title: "Enterprise Service",
      content: "XMax AI provides enterprise inference services through scoped deployment programs, governed model access, integration support, and operational review. Each program begins with workload discovery, data and access review, architecture validation, and a written operating plan.",
    },
  },
  {
    uid: "api::security-governance-page.security-governance-page",
    data: {
      title: "Security & Governance",
      content: "XMax AI applies identity, access, logging, data handling, and export-compliance controls to enterprise AI workloads. The operating model separates customer access, model policy, infrastructure operations, and deployment approvals, with audit logs, least-privilege access, security review, incident handling, and workload restrictions designed into the service layer.",
    },
  },
];

async function repairEntry(strapi, repair) {
  const entry = await strapi.documents(repair.uid).findFirst({ locale: "en", populate: "*" });
  if (!entry?.documentId) {
    console.log(`[repair:en] ${repair.uid}: no en entry`);
    return;
  }

  const data = { ...repair.data };
  if (repair.uid === "api::site-setting.site-setting" && Array.isArray(entry.footerLinkGroups)) {
    data.footerLinkGroups = repair.data.footerLinkGroups.map((group, index) => ({
      ...(entry.footerLinkGroups[index]?.id ? { id: entry.footerLinkGroups[index].id } : {}),
      ...group,
    }));
  }

  await strapi.documents(repair.uid).update({
    documentId: entry.documentId,
    locale: "en",
    data,
    status: "published",
  });
  console.log(`[repair:en] ${repair.uid}: updated`);
}

async function main() {
  const app = await createStrapi();
  await app.load();
  try {
    for (const repair of REPAIRS) {
      await repairEntry(app, repair);
    }
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error(`[repair:en] ${err.stack || err.message}`);
  process.exit(1);
});
