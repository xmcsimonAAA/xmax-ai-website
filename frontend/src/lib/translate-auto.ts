/**
 * translate.js (i18n-jsautotranslate) 自动翻译封装
 *
 * 架构说明：
 * - 中文(zh) / 英文(en)：走现有 CMS 专业翻译体系，不走 translate.js
 * - 日语(ja) / 韩语(ko) / 繁体中文(zh-Hant)：由 translate.js 自动翻译
 *   以 CMS 中文数据为源，前端 DOM 渲染完成后自动翻译为目标语言
 */

// v4.0.0 路径在 staticfile.net 返回 404，使用 v3.18.66
const CDN_URL = "https://cdn.staticfile.net/translate.js/3.18.66/translate.js";

/** translate.js 语言标识映射 */
const TJS_LOCALE_MAP: Record<string, string> = {
  ja: "japanese",
  ko: "korean",
  "zh-Hant": "chinese_traditional",
};

let loadAttempted = false;
let loadFailed = false;

/** 获取全局 translate 对象（由 CDN 脚本注入） */
function getTranslate(): any {
  return (window as any).translate;
}

/** 动态加载 translate.js CDN，加载失败不抛异常 */
export async function ensureLoaded(): Promise<boolean> {
  if (getTranslate()) return true;
  if (loadFailed) return false;
  if (loadAttempted) return getTranslate();

  loadAttempted = true;
  try {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = CDN_URL;
      script.async = true;
      script.onload = () => {
        console.log("[translate.js] Loaded from CDN");
        resolve();
      };
      script.onerror = () => {
        loadFailed = true;
        reject(new Error("[translate.js] CDN load failed"));
      };
      document.head.appendChild(script);
    });
    return !!getTranslate();
  } catch (e) {
    console.warn("[translate.js] Skipped — CDN unreachable:", e);
    return false;
  }
}

/** 初始化 translate.js（只需调用一次） */
export async function initAutoTranslate() {
  try {
    const ok = await ensureLoaded();
    if (!ok) return;
    const t = getTranslate();
    if (!t) return;

    // 设置源语言为简体中文
    t.language.setLocal("chinese_simplified");

    // 启用 DOM 变化监听（React 动态渲染的新内容也会被自动翻译）
    t.listener.start();

    console.log("[translate.js] Initialized and listener started");
  } catch (e) {
    console.warn("[translate.js] Init failed:", e);
  }
}

/**
 * 执行自动翻译到指定语言
 * 注意：不调用 changeLanguage() 避免页面刷新（SPA 场景）
 */
export async function executeAutoTranslate(lang: string) {
  try {
    const ok = await ensureLoaded();
    if (!ok) return;
    const t = getTranslate();
    if (!t) return;

    const tjsLang = TJS_LOCALE_MAP[lang];
    if (!tjsLang) {
      console.warn(`[translate.js] Unsupported auto-translate language: ${lang}`);
      return;
    }

    // 设置目标语言并执行翻译
    t.to = tjsLang;
    t.storage.set("to", tjsLang);
    t.execute();

    console.log(`[translate.js] Translated to ${tjsLang}`);
  } catch (e) {
    console.warn("[translate.js] Execute failed:", e);
  }
}

/** 清除自动翻译状态 */
export async function clearAutoTranslate() {
  try {
    const ok = await ensureLoaded();
    if (!ok) return;
    const t = getTranslate();
    if (!t) return;

    t.to = "";
    t.storage.set("to", "");
  } catch (e) {
    // 静默忽略
  }
}
