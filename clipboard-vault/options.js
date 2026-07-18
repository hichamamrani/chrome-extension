"use strict";

const DEFAULT_SETTINGS = {
  maxHistory: 50,
  theme: "system",
  notifications: true,
};

const STORAGE_KEY = "clipboardSettings";

let currentSettings = { ...DEFAULT_SETTINGS };
let saveTimer = null;

function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

function updateSelectedStates() {
  document.querySelectorAll("#history-size-group .option-row").forEach((row) => {
    const value = parseInt(row.dataset.value, 10);
    const isSelected = value === currentSettings.maxHistory;
    row.classList.toggle("selected", isSelected);
    row.querySelector("input").checked = isSelected;
  });

  document.querySelectorAll("#theme-group .option-row").forEach((row) => {
    const isSelected = row.dataset.value === currentSettings.theme;
    row.classList.toggle("selected", isSelected);
    row.querySelector("input").checked = isSelected;
  });

  document.getElementById("notifications-toggle").checked =
    currentSettings.notifications;
}

function showSaveStatus() {
  const status = document.getElementById("save-status");
  status.classList.add("show");
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    status.classList.remove("show");
  }, 2000);
}

async function saveSettings() {
  await chrome.storage.local.set({ [STORAGE_KEY]: currentSettings });

  chrome.runtime.sendMessage({
    type: "UPDATE_SETTINGS",
    settings: currentSettings,
  });

  showSaveStatus();
}

async function loadSettings() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  currentSettings = { ...DEFAULT_SETTINGS, ...result[STORAGE_KEY] };
  applyTheme(currentSettings.theme);
  updateSelectedStates();
}

document.querySelectorAll("#history-size-group .option-row").forEach((row) => {
  row.addEventListener("click", () => {
    currentSettings.maxHistory = parseInt(row.dataset.value, 10);
    updateSelectedStates();
    saveSettings();
  });
});

document.querySelectorAll("#theme-group .option-row").forEach((row) => {
  row.addEventListener("click", () => {
    currentSettings.theme = row.dataset.value;
    applyTheme(currentSettings.theme);
    updateSelectedStates();
    saveSettings();
  });
});

document
  .getElementById("notifications-toggle")
  .addEventListener("change", (event) => {
    currentSettings.notifications = event.target.checked;
    saveSettings();
  });

loadSettings();
