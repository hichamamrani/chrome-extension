"use strict";

let currentSettings = {};

async function loadSettings() {
  currentSettings = await getSettings();
  applyTheme(currentSettings.theme);
  renderUI();
}

function renderUI() {
  document.querySelectorAll("#themeGroup .option-row").forEach((row) => {
    const selected = row.dataset.value === currentSettings.theme;
    row.classList.toggle("selected", selected);
    row.querySelector("input").checked = selected;
  });

  document.querySelectorAll("#maxRecentGroup .option-row").forEach((row) => {
    const val = parseInt(row.dataset.value, 10);
    const selected = val === currentSettings.maxRecentApps;
    row.classList.toggle("selected", selected);
    row.querySelector("input").checked = selected;
  });

  document.getElementById("recentEnabled").checked = currentSettings.recentAppsEnabled;
  document.getElementById("notifications").checked = currentSettings.notifications;
  document.getElementById("clipboardHistory").checked = currentSettings.clipboardHistoryEnabled;
  document.getElementById("qrEnabled").checked = currentSettings.qrGenerationEnabled;

  renderDefaultApps();
}

function renderDefaultApps() {
  const grid = document.getElementById("defaultAppsGrid");
  grid.innerHTML = "";
  getAllShareTargets().forEach((target) => {
    const chip = document.createElement("label");
    chip.className = `app-chip${currentSettings.defaultShareApps.includes(target.id) ? " selected" : ""}`;
    chip.innerHTML = `
      <input type="checkbox" value="${target.id}" ${currentSettings.defaultShareApps.includes(target.id) ? "checked" : ""}>
      <span>${target.name}</span>
    `;
    chip.querySelector("input").addEventListener("change", () => {
      const checked = chip.querySelector("input").checked;
      chip.classList.toggle("selected", checked);
      if (checked) {
        if (!currentSettings.defaultShareApps.includes(target.id)) {
          currentSettings.defaultShareApps.push(target.id);
        }
      } else {
        currentSettings.defaultShareApps = currentSettings.defaultShareApps.filter(
          (id) => id !== target.id
        );
      }
      saveSettingsDebounced();
    });
    grid.appendChild(chip);
  });
}

let saveTimer;
function saveSettingsDebounced() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    await saveSettings(currentSettings);
    await savePinnedApps([...currentSettings.defaultShareApps]);
    chrome.runtime.sendMessage({
      type: "UPDATE_SETTINGS",
      settings: currentSettings,
    });
    const status = document.getElementById("saveStatus");
    status.classList.add("show");
    setTimeout(() => status.classList.remove("show"), 2000);
  }, 300);
}

document.querySelectorAll("#themeGroup .option-row").forEach((row) => {
  row.addEventListener("click", () => {
    currentSettings.theme = row.dataset.value;
    applyTheme(currentSettings.theme);
    renderUI();
    saveSettingsDebounced();
  });
});

document.querySelectorAll("#maxRecentGroup .option-row").forEach((row) => {
  row.addEventListener("click", () => {
    currentSettings.maxRecentApps = parseInt(row.dataset.value, 10);
    renderUI();
    saveSettingsDebounced();
  });
});

["recentEnabled", "notifications", "clipboardHistory", "qrEnabled"].forEach((id) => {
  document.getElementById(id).addEventListener("change", (e) => {
    const map = {
      recentEnabled: "recentAppsEnabled",
      notifications: "notifications",
      clipboardHistory: "clipboardHistoryEnabled",
      qrEnabled: "qrGenerationEnabled",
    };
    currentSettings[map[id]] = e.target.checked;
    saveSettingsDebounced();
  });
});

loadSettings();
