"use strict";

let tabData = { title: "", url: "", favicon: "", selection: "" };
let settings = {};
let pinnedApps = [];
let recentApps = [];
let searchQuery = "";

const pinnedGrid = document.getElementById("pinnedGrid");
const recentGrid = document.getElementById("recentGrid");
const allGrid = document.getElementById("allGrid");
const pinnedSection = document.getElementById("pinnedSection");
const recentSection = document.getElementById("recentSection");
const noResults = document.getElementById("noResults");

async function init() {
  settings = await getSettings();
  applyTheme(settings.theme);
  pinnedApps = await getPinnedApps();
  recentApps = await getRecentApps();
  tabData = await getActiveTabData();

  renderPagePreview();
  renderGrids();

  document.getElementById("shareSheet").style.animationDelay = "0s";
}

function renderPagePreview() {
  document.getElementById("favicon").src = tabData.favicon;
  document.getElementById("pageTitle").textContent =
    tabData.title || "Untitled Page";
  document.getElementById("pageUrl").textContent = tabData.url || "";

  const selectionEl = document.getElementById("selectionPreview");
  if (tabData.selection) {
    selectionEl.classList.remove("hidden");
    document.getElementById("selectionText").textContent = truncate(
      tabData.selection,
      150
    );
  } else {
    selectionEl.classList.add("hidden");
  }
}

function filterTargets(ids) {
  const query = searchQuery.toLowerCase().trim();
  return ids
    .map((id) => getShareTarget(id))
    .filter((t) => {
      if (!t) return false;
      if (t.requiresSelection && !tabData.selection) return false;
      if (!query) return true;
      return t.name.toLowerCase().includes(query);
    });
}

function createShareCard(target, index, showPin = true) {
  const wrap = document.createElement("div");
  wrap.className = "share-card-wrap";
  wrap.style.animationDelay = `${index * 0.03}s`;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "share-card";
  btn.dataset.id = target.id;
  btn.innerHTML = `
    <div class="share-card-icon">${SHARE_ICONS[target.id] || SHARE_ICONS["copy-link"]}</div>
    <span class="share-card-name">${target.name}</span>
  `;
  btn.addEventListener("click", (e) => {
    createRipple(e, btn);
    handleShare(target.id);
  });

  if (showPin) {
    const pinBtn = document.createElement("button");
    pinBtn.type = "button";
    pinBtn.className = `pin-toggle${pinnedApps.includes(target.id) ? " pinned" : ""}`;
    pinBtn.textContent = pinnedApps.includes(target.id) ? "★" : "☆";
    pinBtn.title = pinnedApps.includes(target.id) ? "Unpin" : "Pin";
    pinBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePin(target.id);
    });
    wrap.appendChild(btn);
    wrap.appendChild(pinBtn);
  } else {
    wrap.appendChild(btn);
  }

  return wrap;
}

function renderGrid(container, targets) {
  container.innerHTML = "";
  targets.forEach((target, i) => {
    container.appendChild(createShareCard(target, i));
  });
}

function renderGrids() {
  const allTargets = getAllShareTargets().filter((t) => {
    if (t.requiresSelection && !tabData.selection) return false;
    if (!searchQuery.trim()) return true;
    return t.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const pinnedTargets = filterTargets(pinnedApps);
  const recentTargets = filterTargets(
    recentApps.filter((id) => !pinnedApps.includes(id))
  );

  const pinnedIds = new Set([
    ...pinnedApps,
    ...recentApps,
  ]);
  const otherTargets = allTargets.filter((t) => !pinnedIds.has(t.id));

  pinnedSection.classList.toggle("hidden", pinnedTargets.length === 0);
  renderGrid(pinnedGrid, pinnedTargets);

  if (settings.recentAppsEnabled && recentTargets.length > 0) {
    recentSection.classList.remove("hidden");
    renderGrid(recentGrid, recentTargets);
  } else {
    recentSection.classList.add("hidden");
  }

  renderGrid(allGrid, otherTargets);

  const totalVisible =
    pinnedTargets.length + recentTargets.length + otherTargets.length;
  noResults.classList.toggle("hidden", totalVisible > 0);
}

function createRipple(event, element) {
  const ripple = document.createElement("span");
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.cssText = `
    position:absolute;border-radius:50%;background:rgba(37,99,235,0.25);
    width:${size}px;height:${size}px;
    left:${event.clientX - rect.left - size / 2}px;
    top:${event.clientY - rect.top - size / 2}px;
    transform:scale(0);animation:ripple 0.5s ease-out;pointer-events:none;
  `;
  element.style.position = "relative";
  element.style.overflow = "hidden";
  element.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
}

async function handleShare(targetId) {
  const result = await executeShare(targetId, tabData, settings);

  if (result.success) {
    await addRecentApp(targetId);
    recentApps = await getRecentApps();
    renderGrids();
    showToast(result.message);

    if (settings.notifications) {
      chrome.runtime.sendMessage({
        type: "NOTIFY",
        text: result.message,
        settings,
      });
    }
  } else {
    showToast(result.message, "error");
  }
}

async function togglePin(appId) {
  if (pinnedApps.includes(appId)) {
    pinnedApps = pinnedApps.filter((id) => id !== appId);
  } else {
    pinnedApps.push(appId);
  }
  await savePinnedApps(pinnedApps);
  renderGrids();
  showToast(pinnedApps.includes(appId) ? "App pinned" : "App unpinned");
}

async function handleQuickAction(action) {
  let text = "";
  let message = "";

  switch (action) {
    case "copy-url":
      text = tabData.url;
      message = "URL copied!";
      break;
    case "copy-title":
      text = tabData.title;
      message = "Title copied!";
      break;
    case "copy-markdown":
      text = formatMarkdownLink(tabData);
      message = "Markdown link copied!";
      break;
    case "copy-html":
      text = formatHtmlLink(tabData);
      message = "HTML link copied!";
      break;
    case "copy-selection":
      if (!tabData.selection) {
        showToast("No text selected", "error");
        return;
      }
      text = tabData.selection;
      message = "Selection copied!";
      break;
    case "copy-citation":
      text = formatCitation(tabData);
      message = "Citation copied!";
      break;
    case "shorten-url":
      text = tabData.url;
      message = "URL copied (shortener: use your preferred service)";
      showToast(message);
      await copyToClipboard(text);
      return;
    case "qr":
      if (!settings.qrGenerationEnabled) {
        showToast("QR disabled in settings", "error");
        return;
      }
      showQRModal(tabData.url);
      return;
    default:
      return;
  }

  const ok = await copyToClipboard(text);
  showToast(ok ? message : "Copy failed", ok ? "info" : "error");

  if (ok && settings.notifications) {
    chrome.runtime.sendMessage({ type: "NOTIFY", text: message, settings });
  }
}

function showQRModal(text) {
  const modal = document.getElementById("qrModal");
  document.getElementById("qrUrl").textContent = text;
  generateQRToCanvas(document.getElementById("qrCanvas"), text, 200);
  modal.classList.remove("hidden");
}

function hideQRModal() {
  document.getElementById("qrModal").classList.add("hidden");
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderGrids();
});

document.querySelectorAll(".quick-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    createRipple(e, btn);
    handleQuickAction(btn.dataset.action);
  });
});

document.getElementById("settingsBtn").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

document.getElementById("qrClose").addEventListener("click", hideQRModal);
document.getElementById("qrModal").addEventListener("click", (e) => {
  if (e.target.id === "qrModal") hideQRModal();
});

document.getElementById("qrOpenTab").addEventListener("click", () => {
  openQRInNewTab(tabData.url);
  hideQRModal();
});

const style = document.createElement("style");
style.textContent = `@keyframes ripple { to { transform: scale(2.5); opacity: 0; } }`;
document.head.appendChild(style);

init();
