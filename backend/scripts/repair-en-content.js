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
      content: "Content will be available soon. Please check back later.",
    },
  },
  {
    uid: "api::terms-page.terms-page",
    data: {
      title: "Terms of Service",
      content: "Content will be available soon. Please check back later.",
    },
  },
  {
    uid: "api::enterprise-service-page.enterprise-service-page",
    data: {
      title: "Enterprise Service",
      content: "Content will be available soon. Please check back later.",
    },
  },
  {
    uid: "api::security-governance-page.security-governance-page",
    data: {
      title: "Security & Governance",
      content: "Content will be available soon. Please check back later.",
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
