"use strict";

const DEFAULT_SETTINGS = {
  theme: "system",
  defaultShareApps: [
    "whatsapp",
    "telegram",
    "twitter",
    "linkedin",
    "email",
    "copy-link",
  ],
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

function createContextMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "share-page",
      title: "Share Page",
      contexts: ["page"],
    });
    chrome.contextMenus.create({
      id: "share-selection",
      title: "Share Selection",
      contexts: ["selection"],
    });
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  createContextMenus();

  const stored = await chrome.storage.local.get([
    "universalShareSettings",
    "universalSharePinnedApps",
  ]);

  if (!stored.universalShareSettings) {
    await chrome.storage.local.set({
      universalShareSettings: DEFAULT_SETTINGS,
    });
  }
  if (!stored.universalSharePinnedApps) {
    await chrome.storage.local.set({
      universalSharePinnedApps: DEFAULT_PINNED,
    });
  }
});

chrome.runtime.onStartup.addListener(() => {
  createContextMenus();
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "share-page" || info.menuItemId === "share-selection") {
    chrome.action.openPopup();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_TAB_DATA") {
    getTabData(message.tabId)
      .then((data) => sendResponse({ success: true, data }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === "NOTIFY") {
    const settings = message.settings;
    if (settings?.notifications) {
      chrome.notifications.create(`share-${Date.now()}`, {
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "Universal Share",
        message: message.text || "Action completed",
      });
    }
    sendResponse({ success: true });
    return true;
  }

  if (message.type === "UPDATE_SETTINGS") {
    chrome.storage.local
      .set({ universalShareSettings: message.settings })
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  return false;
});

async function getTabData(tabId) {
  let tab;
  if (tabId) {
    tab = await chrome.tabs.get(tabId);
  } else {
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    tab = activeTab;
  }

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

  let favicon = tab.favIconUrl;
  if (!favicon || favicon.startsWith("chrome://")) {
    try {
      const url = new URL(tab.url || "https://example.com");
      favicon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
    } catch {
      favicon = "icons/icon48.png";
    }
  }

  return {
    title: tab.title || "",
    url: tab.url || "",
    favicon,
    selection,
  };
}
