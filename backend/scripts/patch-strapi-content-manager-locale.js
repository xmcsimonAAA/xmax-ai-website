const fs = require("fs");
const path = require("path");

const localeSearchMarker = "__xmaxGetContentManagerLocaleSearch";
const packageLeftMenuFiles = [
  path.join(__dirname, "../node_modules/@strapi/content-manager/dist/admin/components/LeftMenu.mjs"),
  path.join(__dirname, "../node_modules/@strapi/content-manager/dist/admin/components/LeftMenu.js"),
];
const packageLayoutFiles = [
  path.join(__dirname, "../node_modules/@strapi/content-manager/dist/admin/layout.mjs"),
  path.join(__dirname, "../node_modules/@strapi/content-manager/dist/admin/layout.js"),
];

const packageLocaleSearchOriginal = `to: {
                                            pathname: link.to
                                        },
                                        label: link.title`;

const packageLocaleSearchPatched = `to: {
                                            pathname: link.to,
                                            search: globalThis.${localeSearchMarker}?.() || ""
                                        },
                                        label: link.title`;

const packageCollectionLinksOriginal = `const collectionTypeLinks = useTypedSelector((state)=>state['content-manager'].app.collectionTypeLinks);`;
const packageCollectionLinksPatched = `const collectionTypeLinks = useTypedSelector((state)=>state['content-manager'].app.collectionTypeLinks) || [];`;

const packageCjsCollectionLinksOriginal = `const collectionTypeLinks = hooks.useTypedSelector((state)=>state['content-manager'].app.collectionTypeLinks);`;
const packageCjsCollectionLinksPatched = `const collectionTypeLinks = hooks.useTypedSelector((state)=>state['content-manager'].app.collectionTypeLinks) || [];`;

const packageSingleLinksOriginal = `const singleTypeLinks = useTypedSelector((state)=>state['content-manager'].app.singleTypeLinks);`;
const packageSingleLinksPatched = `const singleTypeLinks = useTypedSelector((state)=>state['content-manager'].app.singleTypeLinks) || [];`;

const packageCjsSingleLinksOriginal = `const singleTypeLinks = hooks.useTypedSelector((state)=>state['content-manager'].app.singleTypeLinks);`;
const packageCjsSingleLinksPatched = `const singleTypeLinks = hooks.useTypedSelector((state)=>state['content-manager'].app.singleTypeLinks) || [];`;

const packageSectionLinksOriginal = `links: section.links/**
           * Filter by the search value
           */ .filter`;
const packageSectionLinksPatched = `links: (section.links || [])/**
           * Filter by the search value
           */ .filter`;

const viteLocaleSearchOriginal = `to: {
                      pathname: link.to
                    },
                    label: link.title`;

const viteLocaleSearchPatched = `to: {
                      pathname: link.to,
                      search: globalThis.${localeSearchMarker}?.() || ""
                    },
                    label: link.title`;

const viteCollectionLinksOriginal = `const collectionTypeLinks = useTypedSelector((state) => state["content-manager"].app.collectionTypeLinks);`;
const viteCollectionLinksPatched = `const collectionTypeLinks = useTypedSelector((state) => state["content-manager"].app.collectionTypeLinks) || [];`;

const viteSingleLinksOriginal = `const singleTypeLinks = useTypedSelector((state) => state["content-manager"].app.singleTypeLinks);`;
const viteSingleLinksPatched = `const singleTypeLinks = useTypedSelector((state) => state["content-manager"].app.singleTypeLinks) || [];`;

const viteSectionLinksOriginal = `links: section.links.filter`;
const viteSectionLinksPatched = `links: (section.links || []).filter`;

const packageLayoutInitOriginal = `const { isLoading, collectionTypeLinks, models, singleTypeLinks } = useContentManagerInitData();`;
const packageLayoutInitPatched = `const { isLoading, collectionTypeLinks = [], models = [], singleTypeLinks = [] } = useContentManagerInitData();`;

const packageCjsLayoutInitOriginal = `const { isLoading, collectionTypeLinks, models, singleTypeLinks } = useContentManagerInitData.useContentManagerInitData();`;
const packageCjsLayoutInitPatched = `const { isLoading, collectionTypeLinks = [], models = [], singleTypeLinks = [] } = useContentManagerInitData.useContentManagerInitData();`;

const layoutSupportedModelsOriginal = `const supportedModelsToDisplay = models.filter`;
const layoutSupportedModelsPatched = `const supportedModelsToDisplay = (models || []).filter`;

function getViteLeftMenuFiles() {
  const depsDir = path.join(__dirname, "../node_modules/.strapi/vite/deps");
  if (!fs.existsSync(depsDir)) return [];

  return fs
    .readdirSync(depsDir)
    .filter((fileName) => /^layout-.*\.js$/.test(fileName))
    .map((fileName) => path.join(depsDir, fileName));
}

const leftMenuPatches = [
  {
    name: "content locale search",
    marker: localeSearchMarker,
    replacements: [
      { original: packageLocaleSearchOriginal, patched: packageLocaleSearchPatched },
      { original: viteLocaleSearchOriginal, patched: viteLocaleSearchPatched },
    ],
  },
  {
    name: "collection links default",
    marker: "collectionTypeLinks) || []",
    replacements: [
      { original: packageCollectionLinksOriginal, patched: packageCollectionLinksPatched },
      { original: packageCjsCollectionLinksOriginal, patched: packageCjsCollectionLinksPatched },
      { original: viteCollectionLinksOriginal, patched: viteCollectionLinksPatched },
    ],
  },
  {
    name: "single links default",
    marker: "singleTypeLinks) || []",
    replacements: [
      { original: packageSingleLinksOriginal, patched: packageSingleLinksPatched },
      { original: packageCjsSingleLinksOriginal, patched: packageCjsSingleLinksPatched },
      { original: viteSingleLinksOriginal, patched: viteSingleLinksPatched },
    ],
  },
  {
    name: "section links default",
    marker: "links: (section.links || [])",
    replacements: [
      { original: packageSectionLinksOriginal, patched: packageSectionLinksPatched },
      { original: viteSectionLinksOriginal, patched: viteSectionLinksPatched },
    ],
  },
];

const layoutPatches = [
  {
    name: "layout init defaults",
    marker: "collectionTypeLinks = [], models = [], singleTypeLinks = []",
    replacements: [
      { original: packageLayoutInitOriginal, patched: packageLayoutInitPatched },
      { original: packageCjsLayoutInitOriginal, patched: packageCjsLayoutInitPatched },
    ],
  },
  {
    name: "layout models default",
    marker: "const supportedModelsToDisplay = (models || []).filter",
    replacements: [
      { original: layoutSupportedModelsOriginal, patched: layoutSupportedModelsPatched },
    ],
  },
];

let patchedCount = 0;
let skippedCount = 0;

function patchFile(filePath, patches, { required = true } = {}) {
  if (!fs.existsSync(filePath)) {
    if (!required) return;
    throw new Error(`Strapi Content Manager file not found: ${filePath}`);
  }

  let source = fs.readFileSync(filePath, "utf8");
  let changed = false;

  for (const patch of patches) {
    if (source.includes(patch.marker)) {
      skippedCount += 1;
      continue;
    }

    const replacement = patch.replacements.find(({ original }) => source.includes(original));
    if (!replacement) {
      throw new Error(`Could not find Content Manager ${patch.name} snippet in: ${filePath}`);
    }

    source = source.replace(replacement.original, replacement.patched);
    patchedCount += 1;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, source);
  }
}

for (const filePath of packageLeftMenuFiles) {
  patchFile(filePath, leftMenuPatches);
}

for (const filePath of packageLayoutFiles) {
  patchFile(filePath, layoutPatches);
}

for (const filePath of getViteLeftMenuFiles()) {
  patchFile(filePath, [...leftMenuPatches, ...layoutPatches], { required: false });
}

console.log(
  `[strapi-locale-patch] patched ${patchedCount} file(s), skipped ${skippedCount} already patched file(s)`
);
