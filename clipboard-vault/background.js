"use strict";

const DEFAULT_SETTINGS = {
  maxHistory: 50,
  theme: "system",
  notifications: true,
};

const STORAGE_KEYS = {
  ITEMS: "clipboardItems",
  SETTINGS: "clipboardSettings",
  LAST_COPIED: "lastCopiedText",
};

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function getSettings() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
  return { ...DEFAULT_SETTINGS, ...result[STORAGE_KEYS.SETTINGS] };
}

async function getItems() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.ITEMS);
  return result[STORAGE_KEYS.ITEMS] || [];
}

async function saveItems(items) {
  await chrome.storage.local.set({ [STORAGE_KEYS.ITEMS]: items });
}

async function saveClipboardText(text, options = {}) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const settings = await getSettings();
  const items = await getItems();
  const lastResult = await chrome.storage.local.get(STORAGE_KEYS.LAST_COPIED);
  const lastCopied = lastResult[STORAGE_KEYS.LAST_COPIED] || "";

  if (!options.force && trimmed === lastCopied) {
    return null;
  }

  const existingIndex = items.findIndex((item) => item.text === trimmed);
  let newItem;

  if (existingIndex !== -1) {
    const existing = items[existingIndex];
    newItem = {
      ...existing,
      timestamp: Date.now(),
    };
    items.splice(existingIndex, 1);
  } else {
    newItem = {
      id: generateId(),
      text: trimmed,
      pinned: false,
      timestamp: Date.now(),
    };
  }

  items.unshift(newItem);

  const pinned = items.filter((item) => item.pinned);
  const unpinned = items.filter((item) => !item.pinned);

  while (unpinned.length > settings.maxHistory) {
    unpinned.pop();
  }

  const finalItems = [...pinned, ...unpinned];
  await saveItems(finalItems);
  await chrome.storage.local.set({ [STORAGE_KEYS.LAST_COPIED]: trimmed });

  if (settings.notifications && options.showNotification) {
    const preview =
      trimmed.length > 60 ? `${trimmed.slice(0, 60)}…` : trimmed;
    chrome.notifications.create(`clip-${Date.now()}`, {
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "Clipboard Vault",
      message: `Saved: ${preview}`,
    });
  }

  return newItem;
}

function createContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "save-selected-text",
      title: "Save selected text",
      contexts: ["selection"],
    });
  });
}

async function injectContentScriptsIntoOpenTabs() {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.id || !tab.url) continue;
    if (
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("chrome-extension://") ||
      tab.url.startsWith("edge://") ||
      tab.url.startsWith("about:")
    ) {
      continue;
    }

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        files: ["content.js"],
      });
    } catch {
      // Tab may not allow injection (Web Store, restricted pages, etc.)
    }
  }
}

async function initializeExtension() {
  createContextMenu();

  const result = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
  if (!result[STORAGE_KEYS.SETTINGS]) {
    await chrome.storage.local.set({
      [STORAGE_KEYS.SETTINGS]: DEFAULT_SETTINGS,
    });
  }

  await injectContentScriptsIntoOpenTabs();
}

chrome.runtime.onInstalled.addListener(() => {
  initializeExtension();
});

chrome.runtime.onStartup.addListener(() => {
  createContextMenu();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-selected-text" && info.selectionText) {
    saveClipboardText(info.selectionText, {
      force: true,
      showNotification: true,
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_CLIPBOARD") {
    saveClipboardText(message.text)
      .then((item) => sendResponse({ success: true, item }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === "GET_ALL") {
    Promise.all([getItems(), getSettings()])
      .then(([items, settings]) => sendResponse({ items, settings }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === "DELETE_ITEM") {
    getItems()
      .then((items) => {
        const filtered = items.filter((item) => item.id !== message.id);
        return saveItems(filtered);
      })
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === "TOGGLE_PIN") {
    getItems()
      .then((items) => {
        const updated = items.map((item) =>
          item.id === message.id ? { ...item, pinned: !item.pinned } : item
        );
        const pinned = updated.filter((item) => item.pinned);
        const unpinned = updated.filter((item) => !item.pinned);
        return saveItems([...pinned, ...unpinned]);
      })
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === "CLEAR_ALL") {
    saveItems([])
      .then(() =>
        chrome.storage.local.set({ [STORAGE_KEYS.LAST_COPIED]: "" })
      )
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === "IMPORT_ITEMS") {
    getSettings()
      .then((settings) => {
        const imported = (message.items || [])
          .filter((item) => item && typeof item.text === "string" && item.text.trim())
          .map((item) => ({
            id: item.id || generateId(),
            text: item.text.trim(),
            pinned: Boolean(item.pinned),
            timestamp: item.timestamp || Date.now(),
          }));

        const pinned = imported.filter((item) => item.pinned);
        const unpinned = imported.filter((item) => !item.pinned);
        const trimmedUnpinned = unpinned.slice(0, settings.maxHistory);
        return saveItems([...pinned, ...trimmedUnpinned]);
      })
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (message.type === "UPDATE_SETTINGS") {
    chrome.storage.local
      .set({ [STORAGE_KEYS.SETTINGS]: message.settings })
      .then(() => getSettings())
      .then((settings) => getItems())
      .then(async (items) => {
        const pinned = items.filter((item) => item.pinned);
        const unpinned = items.filter((item) => !item.pinned);
        while (unpinned.length > (await getSettings()).maxHistory) {
          unpinned.pop();
        }
        await saveItems([...pinned, ...unpinned]);
        sendResponse({ success: true });
      })
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  return false;
});
