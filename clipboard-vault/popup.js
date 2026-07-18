"use strict";

let allItems = [];
let settings = {};
let searchQuery = "";

const favouritesSection = document.getElementById("favourites-section");
const favouritesList = document.getElementById("favourites-list");
const historySection = document.getElementById("history-section");
const historyList = document.getElementById("history-list");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const itemCount = document.getElementById("item-count");
const toast = document.getElementById("toast");

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(response);
    });
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return "Just now";
  if (diff < 3600000) {
    const mins = Math.floor(diff / 60000);
    return `${mins} min${mins > 1 ? "s" : ""} ago`;
  }
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncatePreview(text, maxLength = 200) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
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

function filterItems(items) {
  if (!searchQuery.trim()) return items;
  const query = searchQuery.toLowerCase();
  return items.filter((item) => item.text.toLowerCase().includes(query));
}

function createCard(item, index) {
  const card = document.createElement("article");
  card.className = `clip-card${item.pinned ? " pinned" : ""}`;
  card.style.animationDelay = `${index * 0.04}s`;
  card.dataset.id = item.id;

  card.innerHTML = `
    <p class="clip-preview">${escapeHtml(truncatePreview(item.text))}</p>
    <div class="clip-meta">
      <span class="char-count">${item.text.length} chars</span>
      <span>${formatTime(item.timestamp)}</span>
    </div>
    <div class="clip-actions">
      <button type="button" class="action-btn copy-btn" title="Copy again">
        <svg viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/></svg>
        Copy
      </button>
      <button type="button" class="action-btn pin-btn${item.pinned ? " active" : ""}" title="${item.pinned ? "Unpin" : "Pin"}">
        <svg viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
        ${item.pinned ? "Unpin" : "Pin"}
      </button>
      <button type="button" class="action-btn delete delete-btn" title="Delete">
        <svg viewBox="0 0 24 24" fill="none"><path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Delete
      </button>
    </div>
  `;

  card.querySelector(".copy-btn").addEventListener("click", () => copyItem(item));
  card.querySelector(".pin-btn").addEventListener("click", () => togglePin(item.id));
  card.querySelector(".delete-btn").addEventListener("click", () => deleteItem(item.id));

  return card;
}

function renderList(container, items) {
  container.innerHTML = "";
  items.forEach((item, index) => {
    container.appendChild(createCard(item, index));
  });
}

function render() {
  const pinned = filterItems(allItems.filter((item) => item.pinned));
  const unpinned = filterItems(allItems.filter((item) => !item.pinned));
  const totalVisible = pinned.length + unpinned.length;
  const hasItems = allItems.length > 0;

  emptyState.classList.toggle("hidden", hasItems);
  historySection.classList.toggle("hidden", !hasItems);

  if (!hasItems) {
    favouritesSection.classList.add("hidden");
    favouritesList.innerHTML = "";
    historyList.innerHTML = "";
    itemCount.textContent = "0 items";
    return;
  }

  if (pinned.length > 0) {
    favouritesSection.classList.remove("hidden");
    renderList(favouritesList, pinned);
  } else {
    favouritesSection.classList.add("hidden");
    favouritesList.innerHTML = "";
  }

  if (unpinned.length > 0) {
    historyList.innerHTML = "";
    renderList(historyList, unpinned);
  } else if (searchQuery.trim() && pinned.length > 0) {
    historyList.innerHTML = '<p class="no-results">No matching history items</p>';
  } else if (searchQuery.trim() && pinned.length === 0) {
    historyList.innerHTML = '<p class="no-results">No results found</p>';
    favouritesSection.classList.add("hidden");
  } else {
    historyList.innerHTML = "";
  }

  if (totalVisible === 0 && searchQuery.trim()) {
    emptyState.classList.remove("hidden");
    emptyState.querySelector("p").textContent = "No results found";
    emptyState.querySelector("span").textContent = "Try a different search term.";
    historySection.classList.add("hidden");
    favouritesSection.classList.add("hidden");
  } else if (hasItems) {
    emptyState.classList.add("hidden");
    emptyState.querySelector("p").textContent = "No clipboard items yet";
    emptyState.querySelector("span").textContent =
      "Copy some text and it will appear here automatically.";
  }

  const unpinnedCount = allItems.filter((item) => !item.pinned).length;
  const pinnedCount = allItems.filter((item) => item.pinned).length;
  const parts = [];
  if (pinnedCount) parts.push(`${pinnedCount} pinned`);
  parts.push(`${unpinnedCount} in history`);
  itemCount.textContent = parts.join(" · ");
}

async function loadDataFromStorage() {
  const result = await chrome.storage.local.get([
    "clipboardItems",
    "clipboardSettings",
  ]);
  allItems = result.clipboardItems || [];
  settings = result.clipboardSettings || {};
  applyTheme(settings.theme || "system");
  render();
}

async function loadData() {
  try {
    const response = await sendMessage({ type: "GET_ALL" });
    if (response && Array.isArray(response.items)) {
      allItems = response.items;
      settings = response.settings || {};
      applyTheme(settings.theme || "system");
      render();
      return;
    }
  } catch {
    // Fall back to reading storage directly if the service worker is asleep.
  }

  await loadDataFromStorage();
}

async function copyItem(item) {
  try {
    await navigator.clipboard.writeText(item.text);
    showToast("Copied to clipboard!");
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = item.text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    showToast("Copied to clipboard!");
  }
}

async function togglePin(id) {
  await sendMessage({ type: "TOGGLE_PIN", id });
  await loadData();
  showToast("Item updated");
}

async function deleteItem(id) {
  await sendMessage({ type: "DELETE_ITEM", id });
  await loadData();
  showToast("Item deleted");
}

async function clearAll() {
  if (!allItems.length) return;
  if (!confirm("Clear all clipboard history? Pinned items will also be removed.")) return;
  await sendMessage({ type: "CLEAR_ALL" });
  await loadData();
  showToast("History cleared");
}

function exportJson() {
  const data = {
    exportedAt: new Date().toISOString(),
    version: "1.0.0",
    items: allItems,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `clipboard-vault-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Exported successfully");
}

async function importJson(file) {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    const items = Array.isArray(data) ? data : data.items;

    if (!Array.isArray(items)) {
      throw new Error("Invalid format");
    }

    await sendMessage({ type: "IMPORT_ITEMS", items });
    await loadData();
    showToast(`Imported ${items.length} items`);
  } catch {
    showToast("Import failed — invalid JSON");
  }
}

searchInput.addEventListener("input", (event) => {
  searchQuery = event.target.value;
  render();
});

document.getElementById("clear-all-btn").addEventListener("click", clearAll);

document.getElementById("export-btn").addEventListener("click", exportJson);

document.getElementById("import-btn").addEventListener("click", () => {
  document.getElementById("import-file").click();
});

document.getElementById("import-file").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    importJson(file);
    event.target.value = "";
  }
});

document.getElementById("settings-btn").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    if (changes.clipboardItems || changes.clipboardSettings) {
      loadData();
    }
  }
});

loadData();
