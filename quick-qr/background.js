/**
 * Quick QR — Background Service Worker
 * Manages context menu, keyboard shortcut, and cross-component messaging.
 */

/* ── Install / Update: register context menu ── */
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'quick-qr-generate',
    title: 'Generate QR for this page',
    contexts: ['page'],
  });
});

/**
 * Context menu click handler.
 * Opens the extension popup (requires Chrome 127+) or falls back
 * to injecting a QR overlay via the content script.
 */
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'quick-qr-generate' || !tab?.id) return;

  try {
    // Preferred: open the action popup directly (user gesture qualifies)
    await chrome.action.openPopup();
  } catch {
    // Fallback: show an in-page QR overlay via content script
    chrome.tabs.sendMessage(tab.id, {
      type: 'SHOW_QR_OVERLAY',
      url: tab.url,
      title: tab.title,
    }).catch(() => {
      // Content script may not be injected on restricted pages
      console.warn('Quick QR: could not show overlay on this page');
    });
  }
});

/**
 * Handle messages from popup or content scripts.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_TAB_INFO') {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      sendResponse({ tab });
    });
    return true; // keep channel open for async response
  }

  if (message.type === 'OPEN_POPUP') {
    chrome.action.openPopup().catch(() => {});
    sendResponse({ ok: true });
    return true;
  }
});

/**
 * Keyboard shortcut (Ctrl+Shift+Q / Cmd+Shift+Q) is handled automatically
 * by the manifest "commands._execute_action" entry, which opens the popup.
 */
