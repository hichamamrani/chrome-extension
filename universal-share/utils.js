"use strict";

const STORAGE_KEYS = {
  SETTINGS: "universalShareSettings",
  PINNED_APPS: "universalSharePinnedApps",
  RECENT_APPS: "universalShareRecentApps",
  CLIPBOARD_HISTORY: "universalShareClipboardHistory",
};

const DEFAULT_SETTINGS = {
  theme: "system",
  defaultShareApps: ["whatsapp", "telegram", "twitter", "linkedin", "email", "copy-link"],
  notifications: true,
  recentAppsEnabled: true,
  maxRecentApps: 10,
  clipboardHistoryEnabled: false,
  qrGenerationEnabled: true,
};

const DEFAULT_PINNED = [
  "whatsapp",
  "telegram",
  "twitter",
  "linkedin",
  "email",
  "copy-link",
];

async function getStorage(key, fallback) {
  const result = await chrome.storage.local.get(key);
  return result[key] !== undefined ? result[key] : fallback;
}

async function setStorage(key, value) {
  await chrome.storage.local.set({ [key]: value });
}

async function getSettings() {
  const settings = await getStorage(STORAGE_KEYS.SETTINGS, {});
  return { ...DEFAULT_SETTINGS, ...settings };
}

async function saveSettings(settings) {
  await setStorage(STORAGE_KEYS.SETTINGS, settings);
}

async function getPinnedApps() {
  const pinned = await getStorage(STORAGE_KEYS.PINNED_APPS, null);
  return pinned || [...DEFAULT_PINNED];
}

async function savePinnedApps(apps) {
  await setStorage(STORAGE_KEYS.PINNED_APPS, apps);
}

async function getRecentApps() {
  return await getStorage(STORAGE_KEYS.RECENT_APPS, []);
}

async function addRecentApp(appId) {
  const settings = await getSettings();
  if (!settings.recentAppsEnabled) return;

  let recent = await getRecentApps();
  recent = recent.filter((id) => id !== appId);
  recent.unshift(appId);
  recent = recent.slice(0, settings.maxRecentApps);
  await setStorage(STORAGE_KEYS.RECENT_APPS, recent);
}

async function getClipboardHistory() {
  return await getStorage(STORAGE_KEYS.CLIPBOARD_HISTORY, []);
}

async function addToClipboardHistory(text) {
  const settings = await getSettings();
  if (!settings.clipboardHistoryEnabled || !text.trim()) return;

  let history = await getClipboardHistory();
  history = history.filter((item) => item !== text);
  history.unshift(text);
  history = history.slice(0, 20);
  await setStorage(STORAGE_KEYS.CLIPBOARD_HISTORY, history);
}

function encode(text) {
  return encodeURIComponent(text || "");
}

function truncate(text, max = 120) {
  if (!text || text.length <= max) return text || "";
  return `${text.slice(0, max)}…`;
}

function buildShareText(data, includeSelection = true) {
  const parts = [];
  if (data.title) parts.push(data.title);
  if (data.url) parts.push(data.url);
  if (includeSelection && data.selection) parts.push(data.selection);
  return parts.join("\n");
}

function formatMarkdownLink(data) {
  const title = data.title || data.url || "Link";
  return `[${title}](${data.url || ""})`;
}

function formatHtmlLink(data) {
  const title = escapeHtml(data.title || data.url || "Link");
  return `<a href="${data.url || ""}">${title}</a>`;
}

function formatCitation(data) {
  const title = data.title || "Untitled";
  const url = data.url || "";
  const date = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `"${title}" (${url}). Retrieved ${date}.`;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function copyToClipboard(text) {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    await addToClipboardHistory(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (ok) await addToClipboardHistory(text);
    return ok;
  }
}

function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

function getFaviconUrl(tab) {
  if (tab.favIconUrl && !tab.favIconUrl.startsWith("chrome://")) {
    return tab.favIconUrl;
  }
  try {
    const url = new URL(tab.url || "https://example.com");
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
  } catch {
    return "icons/icon48.png";
  }
}

async function getActiveTabData() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) {
    return { title: "", url: "", favicon: "icons/icon48.png", selection: "" };
  }

  let selection = "";
  if (tab.id && tab.url && !tab.url.startsWith("chrome://")) {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const sel = window.getSelection();
          return sel ? sel.toString().trim() : "";
        },
      });
      selection = results?.[0]?.result || "";
    } catch {
      selection = "";
    }
  }

  return {
    title: tab.title || "",
    url: tab.url || "",
    favicon: getFaviconUrl(tab),
    selection,
    tabId: tab.id,
  };
}

function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show${type === "error" ? " error" : ""}`;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    STORAGE_KEYS,
    DEFAULT_SETTINGS,
    DEFAULT_PINNED,
    getSettings,
    saveSettings,
    getPinnedApps,
    savePinnedApps,
    getRecentApps,
    addRecentApp,
    getClipboardHistory,
    addToClipboardHistory,
    encode,
    truncate,
    buildShareText,
    formatMarkdownLink,
    formatHtmlLink,
    formatCitation,
    copyToClipboard,
    applyTheme,
    getFaviconUrl,
    getActiveTabData,
    showToast,
    debounce,
  };
}
