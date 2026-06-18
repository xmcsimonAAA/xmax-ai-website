const EDIT_VIEW_LAYOUT_HOOK = "Admin/CM/pages/EditView/mutate-edit-view-layout";
const CONTENT_LOCALE_STORAGE_KEY = "xmax-admin-content-locale";
const I18N_LOCALE_QUERY_KEY = "plugins[i18n][locale]";
const SUPPORTED_CONTENT_LOCALES = new Set(["en", "zh-Hans"]);
const DEFAULT_CONTENT_LOCALE = "en";

let recentLocaleRepair = null;

function formatComponentDisplayName(uid) {
  return uid
    .split(".")
    .pop()
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function walkLayoutFields(node, visitor) {
  if (Array.isArray(node)) {
    node.forEach((child) => walkLayoutFields(child, visitor));
    return;
  }

  if (!node || typeof node !== "object" || !node.attribute) return;

  visitor(node);
}

function protectComponentLayouts(layout) {
  if (!layout || typeof layout !== "object") return layout;

  const components = { ...(layout.components || {}) };
  const protectedLayout = { ...layout, components };
  const scanQueue = [protectedLayout.layout];
  const queuedComponentUids = new Set(Object.keys(components));

  Object.values(components).forEach((componentLayout) => {
    scanQueue.push(componentLayout?.layout);
  });

  const ensureComponent = (uid) => {
    if (!uid || components[uid]) return;

    components[uid] = {
      layout: [],
      settings: {
        displayName: formatComponentDisplayName(uid),
      },
    };
    scanQueue.push(components[uid].layout);
  };

  for (let index = 0; index < scanQueue.length; index += 1) {
    walkLayoutFields(scanQueue[index], (field) => {
      const attribute = field.attribute || {};

      if (attribute.type === "component") {
        ensureComponent(attribute.component);
      }

      if (attribute.type === "dynamiczone" && Array.isArray(attribute.components)) {
        attribute.components.forEach(ensureComponent);
      }

      if (attribute.type === "component" && attribute.component && !queuedComponentUids.has(attribute.component)) {
        queuedComponentUids.add(attribute.component);
        scanQueue.push(components[attribute.component]?.layout);
      }
    });
  }

  return protectedLayout;
}

function getUrlFromInput(inputUrl) {
  if (!inputUrl || typeof window === "undefined") return null;

  try {
    if (typeof inputUrl === "object" && !(inputUrl instanceof URL)) {
      const pathname = inputUrl.pathname || window.location.pathname;
      const search = inputUrl.search || "";
      const hash = inputUrl.hash || "";
      return new URL(`${pathname}${search}${hash}`, window.location.href);
    }

    return new URL(inputUrl.toString(), window.location.href);
  } catch {
    return null;
  }
}

function isContentManagerUrl(url) {
  return url?.origin === window.location.origin && url.pathname.includes("/content-manager/");
}

function isLocalizedContentManagerUrl(url) {
  return (
    isContentManagerUrl(url) &&
    (url.pathname.includes("/content-manager/single-types/") ||
      url.pathname.includes("/content-manager/collection-types/"))
  );
}

function getContentManagerPathParts(url) {
  const marker = "/content-manager/";
  const markerIndex = url?.pathname.indexOf(marker) ?? -1;
  if (markerIndex === -1) return [];

  return url.pathname
    .slice(markerIndex + marker.length)
    .split("/")
    .filter(Boolean);
}

function isContentManagerTypeRootUrl(url) {
  const [kind, uid, extraSegment] = getContentManagerPathParts(url);
  return (kind === "single-types" || kind === "collection-types") && Boolean(uid) && !extraSegment;
}

function getContentLocaleFromUrl(url) {
  const locale = url?.searchParams.get(I18N_LOCALE_QUERY_KEY);
  return SUPPORTED_CONTENT_LOCALES.has(locale) ? locale : null;
}

function toRelativeUrl(url) {
  return `${url.pathname}${url.search}${url.hash}`;
}

function setRecentLocaleRepair(url, locale) {
  recentLocaleRepair = {
    locale,
    pathname: url.pathname,
    expiresAt: Date.now() + 2000,
  };
}

function shouldKeepRepairedLocale(url, localeFromUrl) {
  if (!recentLocaleRepair || Date.now() > recentLocaleRepair.expiresAt) {
    recentLocaleRepair = null;
    return false;
  }

  return recentLocaleRepair.pathname === url.pathname && recentLocaleRepair.locale !== localeFromUrl;
}

function shouldPreferStoredLocaleForNavigation(url, localeFromUrl) {
  const currentUrl = getUrlFromInput(window.location.href);
  if (!isLocalizedContentManagerUrl(currentUrl) || !isContentManagerTypeRootUrl(url)) return false;
  if (currentUrl.pathname === url.pathname) return false;

  const storedLocale = getStoredContentLocale();
  return Boolean(storedLocale && localeFromUrl && storedLocale !== localeFromUrl);
}

function getStoredContentLocale() {
  try {
    const locale = window.localStorage.getItem(CONTENT_LOCALE_STORAGE_KEY);
    return SUPPORTED_CONTENT_LOCALES.has(locale) ? locale : DEFAULT_CONTENT_LOCALE;
  } catch {
    return DEFAULT_CONTENT_LOCALE;
  }
}

function getCurrentOrStoredContentLocale() {
  const currentUrl = getUrlFromInput(window.location.href);
  const localeFromUrl = getContentLocaleFromUrl(currentUrl);
  if (localeFromUrl) {
    rememberContentLocale(localeFromUrl);
    return localeFromUrl;
  }

  return getStoredContentLocale();
}

function rememberContentLocale(locale) {
  if (!SUPPORTED_CONTENT_LOCALES.has(locale)) return;

  try {
    window.localStorage.setItem(CONTENT_LOCALE_STORAGE_KEY, locale);
  } catch {
    // Ignore storage failures; navigation should continue normally.
  }
}

function rememberContentLocaleFromUrl(inputUrl) {
  const url = getUrlFromInput(inputUrl);
  const locale = getContentLocaleFromUrl(url);
  rememberContentLocale(locale);
  return locale;
}

function withRememberedContentLocale(inputUrl) {
  const url = getUrlFromInput(inputUrl);
  if (!isLocalizedContentManagerUrl(url)) return inputUrl;

  const localeFromUrl = getContentLocaleFromUrl(url);
  if (localeFromUrl && shouldKeepRepairedLocale(url, localeFromUrl)) {
    url.searchParams.set(I18N_LOCALE_QUERY_KEY, recentLocaleRepair.locale);
    return toRelativeUrl(url);
  }

  if (shouldPreferStoredLocaleForNavigation(url, localeFromUrl)) {
    const storedLocale = getStoredContentLocale();
    url.searchParams.set(I18N_LOCALE_QUERY_KEY, storedLocale);
    setRecentLocaleRepair(url, storedLocale);
    return toRelativeUrl(url);
  }

  if (localeFromUrl) {
    rememberContentLocale(localeFromUrl);
    return inputUrl;
  }

  const locale = getCurrentOrStoredContentLocale();
  if (!locale) return inputUrl;

  url.searchParams.set(I18N_LOCALE_QUERY_KEY, locale);
  setRecentLocaleRepair(url, locale);
  return toRelativeUrl(url);
}

function syncContentLocaleFromLocation({ repairMissing = false } = {}) {
  const currentUrl = getUrlFromInput(window.location.href);
  if (!isLocalizedContentManagerUrl(currentUrl)) return;

  const localeFromUrl = getContentLocaleFromUrl(currentUrl);
  if (localeFromUrl) {
    if (shouldKeepRepairedLocale(currentUrl, localeFromUrl)) {
      currentUrl.searchParams.set(I18N_LOCALE_QUERY_KEY, recentLocaleRepair.locale);
      window.history.replaceState(window.history.state, "", toRelativeUrl(currentUrl));
      return;
    }

    rememberContentLocale(localeFromUrl);
    return;
  }

  if (!repairMissing) return;

  const locale = getCurrentOrStoredContentLocale();
  currentUrl.searchParams.set(I18N_LOCALE_QUERY_KEY, locale);
  setRecentLocaleRepair(currentUrl, locale);
  const nextUrl = toRelativeUrl(currentUrl);
  if (nextUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
    window.history.replaceState(window.history.state, "", nextUrl);
  }
}

function getContentManagerLocaleSearch() {
  const locale = getCurrentOrStoredContentLocale();
  return locale ? `?${I18N_LOCALE_QUERY_KEY}=${encodeURIComponent(locale)}` : "";
}

function scheduleContentLocaleSync() {
  window.setTimeout(() => {
    syncContentLocaleFromLocation({ repairMissing: true });
  }, 0);
}

function preserveContentManagerLocale() {
  if (typeof window === "undefined" || window.__xmaxAdminLocalePatchApplied) return;

  window.__xmaxAdminLocalePatchApplied = true;
  window.__xmaxGetContentManagerLocaleSearch = getContentManagerLocaleSearch;
  window.__xmaxAdminLocaleState = () => ({
    href: window.location.href,
    storedLocale: getStoredContentLocale(),
    currentLocale: getCurrentOrStoredContentLocale(),
    recentLocaleRepair,
  });

  syncContentLocaleFromLocation();

  const currentUrlWithLocale = withRememberedContentLocale(window.location.href);
  if (currentUrlWithLocale && currentUrlWithLocale !== window.location.href) {
    window.history.replaceState(window.history.state, "", currentUrlWithLocale);
  }
  syncContentLocaleFromLocation();

  const patchHistoryMethod = (methodName) => {
    const original = window.history[methodName];
    window.history[methodName] = function patchedHistoryMethod(state, title, inputUrl) {
      const nextUrl = inputUrl ? withRememberedContentLocale(inputUrl) : inputUrl;
      const result = original.call(this, state, title, nextUrl);
      rememberContentLocaleFromUrl(nextUrl || window.location.href);
      scheduleContentLocaleSync();
      return result;
    };
  };

  patchHistoryMethod("pushState");
  patchHistoryMethod("replaceState");

  document.addEventListener(
    "click",
    (event) => {
      const anchor = event.target?.closest?.("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const nextHref = withRememberedContentLocale(href);
      if (nextHref && nextHref !== href) {
        anchor.setAttribute("href", nextHref);
      }

      scheduleContentLocaleSync();
    },
    true
  );

  window.addEventListener("popstate", () => {
    syncContentLocaleFromLocation({ repairMissing: true });
  });

  window.setInterval(() => {
    syncContentLocaleFromLocation({ repairMissing: true });
  }, 300);
}

export default {
  config: {
    locales: ["en"],
  },
  bootstrap(app) {
    preserveContentManagerLocale();

    app.registerHook?.(EDIT_VIEW_LAYOUT_HOOK, ({ layout, query }) => ({
      layout: protectComponentLayouts(layout),
      query,
    }));
  },
};
