"use strict";

const SHARE_ICONS = {
  whatsapp: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.08-1.33A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="#25D366"/><path d="M16.5 14.2c-.25-.12-1.47-.73-1.7-.81-.23-.08-.4-.12-.57.12-.17.25-.66.81-.81.97-.15.17-.3.19-.55.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.57-1.37-.78-1.87-.2-.5-.41-.43-.57-.44h-.49c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z" fill="#fff"/></svg>`,
  telegram: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#229ED9"/><path d="M16.5 7.5l-2.2 10.3c-.17.75-.62.94-1.25.58l-3.45-2.54-1.67 1.6c-.18.18-.34.34-.69.34l.24-3.5 6.4-5.78c.28-.25-.06-.39-.43-.14L8.1 13.8 4.75 12.7c-.73-.23-.74-.73.15-1.08l11.6-4.47c.61-.22 1.14.14.95.35z" fill="#fff"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#1877F2"/><path d="M15.5 8h-2c-.55 0-1 .45-1 1v1.5H14l-.3 2h-1.8V18h-2v-5.5H8v-2h2V9c0-1.66 1.34-3 3-3h2.5v2z" fill="#fff"/></svg>`,
  messenger: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="url(#msgGrad)"/><defs><linearGradient id="msgGrad" x1="12" y1="2" x2="12" y2="22"><stop stop-color="#0099FF"/><stop offset="1" stop-color="#A033FF"/></linearGradient></defs><path d="M12 6.5c-3.04 0-5.5 2.24-5.5 5 0 1.56.76 2.96 1.96 3.87l-.65 2.13 2.24-1.18c.6.17 1.24.26 1.95.26 3.04 0 5.5-2.24 5.5-5s-2.46-5-5.5-5z" fill="#fff"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#000"/><path d="M13.2 11.1L18.5 5h-1.3l-4.6 5.3L9.2 5H5l5.6 8.1L5 19h1.3l4.9-5.6 3.7 5.6H19l-5.8-8.5z" fill="#fff"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#0A66C2"/><path d="M7.5 10v7H5v-7h2.5zM6.25 8.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zM19 17h-2.5v-3.75c0-.97-.02-2.22-1.35-2.22-1.35 0-1.56 1.05-1.56 2.14V17H11v-7h2.4v1h.03c.33-.63 1.15-1.3 2.37-1.3 2.53 0 3 1.66 3 3.83V17z" fill="#fff"/></svg>`,
  reddit: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#FF4500"/><circle cx="8.5" cy="12.5" r="1.2" fill="#fff"/><circle cx="15.5" cy="12.5" r="1.2" fill="#fff"/><path d="M9 15c.8.6 1.8.9 3 .9s2.2-.3 3-.9" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/><circle cx="17" cy="7" r="1.5" fill="#fff"/><path d="M7 9.5c1.5-1 3.2-1.5 5-1.5" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  pinterest: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#E60023"/><path d="M12 6.5c-2.5 0-4 1.8-4 3.8 0 1 .4 1.9 1.2 2.2.1 0 .2-.1.2-.2l.15-.6c0-.1.01-.2-.06-.3-.2-.3-.35-.7-.35-1.2 0-1.5 1.1-2.9 3-2.9 1.6 0 2.5 1 2.5 2.3 0 1.7-.7 3.1-1.8 3.1-.6 0-1-.5-1-1.1 0-.9.3-1.8.3-2.7 0-.6-.3-1.2-1-1.2-.8 0-1.4.8-1.4 1.9 0 .7.2 1.1.2 1.1s-.8 3.2-.9 3.8c-.3 1.1-.04 2.5-.02 2.6.01.1.1.1.14.04.5-.7 1.1-2 1.3-2.6.1-.2.5-1.2.5-1.2.25.5 1 1 1.8 1 2.4 0 4-2.2 4-5.1 0-2.7-2-4.6-4.8-4.6z" fill="#fff"/></svg>`,
  email: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#2563eb"/><path d="M5 8l7 5 7-5M5 8v8h14V8" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  sms: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#22c55e"/><path d="M7 8h10M7 12h7M7 16h5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><path d="M6 6h12a2 2 0 012 2v8l-3-2H6a2 2 0 01-2-2V8a2 2 0 012-2z" stroke="#fff" stroke-width="1.5"/></svg>`,
  "copy-link": `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#64748b"/><rect x="9" y="9" width="10" height="10" rx="2" stroke="#fff" stroke-width="1.5"/><path d="M7 15V7a2 2 0 012-2h8" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  "copy-selection": `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#64748b"/><path d="M8 8h8M8 12h6M8 16h4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  qr: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#2563eb"/><rect x="6" y="6" width="4" height="4" fill="#fff"/><rect x="14" y="6" width="4" height="4" fill="#fff"/><rect x="6" y="14" width="4" height="4" fill="#fff"/><rect x="12" y="12" width="2" height="2" fill="#fff"/><rect x="16" y="14" width="2" height="2" fill="#fff"/><rect x="14" y="16" width="4" height="2" fill="#fff"/></svg>`,
  browser: `<svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#2563eb"/><circle cx="12" cy="12" r="6" stroke="#fff" stroke-width="1.5"/><path d="M12 8v4l3 2" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

const SHARE_TARGETS = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    category: "social",
    protocol: (d) => `whatsapp://send?text=${encode(buildShareText(d))}`,
    web: (d) => `https://web.whatsapp.com/send?text=${encode(buildShareText(d))}`,
    useProtocol: true,
  },
  {
    id: "telegram",
    name: "Telegram",
    category: "social",
    protocol: (d) => `tg://msg?text=${encode(buildShareText(d))}`,
    web: (d) =>
      `https://t.me/share/url?url=${encode(d.url)}&text=${encode(d.title)}`,
    useProtocol: true,
  },
  {
    id: "facebook",
    name: "Facebook",
    category: "social",
    web: (d) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encode(d.url)}`,
  },
  {
    id: "messenger",
    name: "Messenger",
    category: "social",
    web: (d) =>
      `https://www.facebook.com/dialog/send?link=${encode(d.url)}&app_id=87741124305&redirect_uri=${encode(d.url)}`,
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    category: "social",
    web: (d) => {
      const text = d.selection || d.title || "";
      return `https://twitter.com/intent/tweet?url=${encode(d.url)}&text=${encode(text)}`;
    },
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "social",
    web: (d) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encode(d.url)}`,
  },
  {
    id: "reddit",
    name: "Reddit",
    category: "social",
    web: (d) =>
      `https://www.reddit.com/submit?url=${encode(d.url)}&title=${encode(d.title)}`,
  },
  {
    id: "pinterest",
    name: "Pinterest",
    category: "social",
    web: (d) =>
      `https://pinterest.com/pin/create/button/?url=${encode(d.url)}&description=${encode(d.title)}`,
  },
  {
    id: "email",
    name: "Email",
    category: "communication",
    web: (d) => {
      const body = buildShareText(d);
      return `mailto:?subject=${encode(d.title)}&body=${encode(body)}`;
    },
  },
  {
    id: "sms",
    name: "SMS",
    category: "communication",
    web: (d) => `sms:?body=${encode(buildShareText(d))}`,
  },
  {
    id: "copy-link",
    name: "Copy Link",
    category: "clipboard",
    action: "copy-url",
  },
  {
    id: "copy-selection",
    name: "Copy Selection",
    category: "clipboard",
    action: "copy-selection",
    requiresSelection: true,
  },
  {
    id: "qr",
    name: "QR Code",
    category: "tools",
    action: "qr",
  },
  {
    id: "browser",
    name: "Open in Browser",
    category: "tools",
    action: "open-browser",
  },
];

function encode(text) {
  return encodeURIComponent(text || "");
}

function buildShareText(data) {
  const parts = [];
  if (data.title) parts.push(data.title);
  if (data.url) parts.push(data.url);
  if (data.selection) parts.push(data.selection);
  return parts.join("\n");
}

function getShareTarget(id) {
  return SHARE_TARGETS.find((t) => t.id === id);
}

function getAllShareTargets() {
  return SHARE_TARGETS;
}

function openUrl(url) {
  return chrome.tabs.create({ url, active: true });
}

function openProtocolWithFallback(protocolUrl, webUrl) {
  chrome.tabs.create({ url: protocolUrl, active: false }, (tab) => {
    if (chrome.runtime.lastError || !tab?.id) {
      openUrl(webUrl);
      return;
    }

    const tabId = tab.id;
    let fallbackTriggered = false;

    const triggerFallback = () => {
      if (fallbackTriggered) return;
      fallbackTriggered = true;
      chrome.tabs.remove(tabId, () => {
        openUrl(webUrl);
      });
    };

    const onUpdated = (updatedTabId, changeInfo) => {
      if (updatedTabId !== tabId) return;
      if (changeInfo.url && changeInfo.url.startsWith("chrome-error://")) {
        chrome.tabs.onUpdated.removeListener(onUpdated);
        triggerFallback();
      }
    };

    chrome.tabs.onUpdated.addListener(onUpdated);

    setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(onUpdated);
      chrome.tabs.get(tabId, (currentTab) => {
        if (chrome.runtime.lastError || !currentTab) {
          triggerFallback();
          return;
        }
        if (
          currentTab.url === "about:blank" ||
          currentTab.url?.startsWith("chrome-error://")
        ) {
          triggerFallback();
        }
      });
    }, 2000);
  });
}

async function executeShare(targetId, data, settings) {
  const target = getShareTarget(targetId);
  if (!target) return { success: false, message: "Unknown share target" };

  if (target.requiresSelection && !data.selection) {
    return { success: false, message: "No text selected on page" };
  }

  if (target.action === "copy-url") {
    const ok = await clipboardWrite(data.url);
    return { success: ok, message: ok ? "Link copied!" : "Copy failed" };
  }

  if (target.action === "copy-selection") {
    const ok = await clipboardWrite(data.selection);
    return { success: ok, message: ok ? "Selection copied!" : "Copy failed" };
  }

  if (target.action === "qr") {
    if (!settings.qrGenerationEnabled) {
      return { success: false, message: "QR generation is disabled in settings" };
    }
    openQRInNewTab(data.url || buildShareText(data));
    return { success: true, message: "QR code opened" };
  }

  if (target.action === "open-browser") {
    await openUrl(data.url);
    return { success: true, message: "Opened in browser" };
  }

  const webUrl = target.web(data);

  if (target.useProtocol && target.protocol) {
    const protocolUrl = target.protocol(data);
    openProtocolWithFallback(protocolUrl, webUrl);
    return { success: true, message: `Sharing via ${target.name}` };
  }

  if (webUrl.startsWith("mailto:") || webUrl.startsWith("sms:")) {
    chrome.tabs.create({ url: webUrl, active: true });
    return { success: true, message: `Sharing via ${target.name}` };
  }

  await openUrl(webUrl);
  return { success: true, message: `Sharing via ${target.name}` };
}

async function clipboardWrite(text) {
  if (!text) return false;
  if (typeof copyToClipboard === "function") {
    return copyToClipboard(text);
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function openQRInNewTab(text) {
  const url = chrome.runtime.getURL(
    `qr-viewer.html?text=${encodeURIComponent(text)}`
  );
  chrome.tabs.create({ url, active: true });
}

function generateQRToCanvas(canvas, text, size) {
  const qrSize = size || 200;
  if (typeof QRCodeLib !== "undefined") {
    QRCodeLib.toCanvas(canvas, text, {
      width: qrSize,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#000000", light: "#ffffff" },
    });
  }
}

if (typeof window !== "undefined") {
  window.SHARE_ICONS = SHARE_ICONS;
  window.SHARE_TARGETS = SHARE_TARGETS;
  window.getShareTarget = getShareTarget;
  window.getAllShareTargets = getAllShareTargets;
  window.executeShare = executeShare;
  window.openQRInNewTab = openQRInNewTab;
  window.generateQRToCanvas = generateQRToCanvas;
}
