/**
 * Quick QR — Popup Script
 * Handles tab detection, QR generation, settings persistence, and user actions.
 */

/* ── Default settings stored in chrome.storage ── */
const DEFAULT_SETTINGS = {
  theme: 'light',
  qrSize: 256,
  margin: 2,
  fgColor: '#000000',
  bgColor: '#ffffff',
};

/* ── State ── */
let currentTab = null;
let currentUrl = '';
let settings = { ...DEFAULT_SETTINGS };
let saveTimeout = null;

/* ── DOM References ── */
const $ = (sel) => document.querySelector(sel);

const els = {
  app:          $('#app'),
  favicon:      $('#favicon'),
  pageTitle:    $('#pageTitle'),
  pageUrl:      $('#pageUrl'),
  qrCanvas:     $('#qrCanvas'),
  qrLoading:    $('#qrLoading'),
  themeToggle:  $('#themeToggle'),
  copyUrlBtn:   $('#copyUrlBtn'),
  downloadBtn:  $('#downloadBtn'),
  openSiteBtn:  $('#openSiteBtn'),
  refreshBtn:   $('#refreshBtn'),
  optionsToggle: $('#optionsToggle'),
  optionsPanel: $('#optionsPanel'),
  sizeSlider:   $('#sizeSlider'),
  sizeValue:    $('#sizeValue'),
  marginSlider: $('#marginSlider'),
  marginValue:  $('#marginValue'),
  fgColor:      $('#fgColor'),
  bgColor:      $('#bgColor'),
  fgHex:        $('#fgHex'),
  bgHex:        $('#bgHex'),
  toast:        $('#toast'),
};

/* ============================================================
   Initialization
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  applyTheme(settings.theme);
  bindControls();
  await initTab();
});

/** Load persisted settings from chrome.storage */
async function loadSettings() {
  try {
    const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    settings = { ...DEFAULT_SETTINGS, ...stored };
  } catch {
    settings = { ...DEFAULT_SETTINGS };
  }

  // Apply settings to UI controls
  els.sizeSlider.value = settings.qrSize;
  els.sizeValue.textContent = `${settings.qrSize}px`;
  els.marginSlider.value = settings.margin;
  els.marginValue.textContent = settings.margin;
  els.fgColor.value = settings.fgColor;
  els.bgColor.value = settings.bgColor;
  els.fgHex.textContent = settings.fgColor;
  els.bgHex.textContent = settings.bgColor;
  updatePresetHighlight();
}

/** Debounced save to chrome.storage */
function saveSettings() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    chrome.storage.sync.set(settings);
  }, 300);
}

/* ============================================================
   Tab Detection
   ============================================================ */

/** Fetch the active tab and populate page info */
async function initTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error('No active tab');

    currentTab = tab;
    currentUrl = tab.url || '';

    // Restricted pages (chrome://, edge://, etc.) can't be encoded
    if (!isValidUrl(currentUrl)) {
      showRestrictedPage(tab);
      return;
    }

    updatePageInfo(tab);
    await generateQR();
  } catch (err) {
    console.error('Quick QR: tab init failed', err);
    els.pageTitle.textContent = 'Unable to read tab';
    els.pageUrl.textContent = 'Try refreshing the page';
    hideLoading();
  }
}

/** Check if URL is encodable in a QR code */
function isValidUrl(url) {
  return url && (url.startsWith('http://') || url.startsWith('https://'));
}

/** Display info for restricted chrome:// pages */
function showRestrictedPage(tab) {
  els.pageTitle.textContent = tab.title || 'Restricted Page';
  els.pageUrl.textContent = tab.url || '';
  els.favicon.src = tab.favIconUrl || getFallbackFavicon('');
  hideLoading();
  els.qrCanvas.style.display = 'none';

  const msg = document.createElement('p');
  msg.className = 'restricted-msg';
  msg.textContent = 'QR codes cannot be generated for browser internal pages.';
  msg.style.cssText = 'text-align:center;color:var(--text-secondary);font-size:12px;padding:20px 0;';
  els.qrCanvas.parentElement.appendChild(msg);
}

/** Populate favicon, title, and URL fields */
function updatePageInfo(tab) {
  els.pageTitle.textContent = tab.title || 'Untitled Page';
  els.pageUrl.textContent = tab.url || '';
  els.pageUrl.title = tab.url || '';

  const faviconUrl = tab.favIconUrl || getFallbackFavicon(tab.url);
  els.favicon.src = faviconUrl;
  els.favicon.alt = `${tab.title || 'Page'} favicon`;

  // Fallback if favicon fails to load
  els.favicon.onerror = () => {
    els.favicon.src = getFallbackFavicon(tab.url);
    els.favicon.onerror = null;
  };
}

/** Google favicon service as fallback */
function getFallbackFavicon(url) {
  try {
    const domain = new URL(url).origin;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return 'icons/icon48.png';
  }
}

/* ============================================================
   QR Code Generation
   ============================================================ */

/** Generate a high-quality QR code on the canvas */
async function generateQR() {
  if (!currentUrl || !isValidUrl(currentUrl)) return;

  showLoading();

  const options = {
    errorCorrectionLevel: 'H',
    margin: settings.margin,
    width: settings.qrSize,
    color: {
      dark: settings.fgColor,
      light: settings.bgColor,
    },
  };

  try {
    await QRCodeLib.toCanvas(els.qrCanvas, currentUrl, options);
    hideLoading();
  } catch (err) {
    console.error('Quick QR: generation failed', err);
    hideLoading();
    showToast('Failed to generate QR code');
  }
}

/** Generate a high-resolution canvas for PNG download (4× scale) */
async function generateHiresCanvas() {
  const hiresCanvas = document.createElement('canvas');
  const hiresOptions = {
    errorCorrectionLevel: 'H',
    margin: settings.margin,
    width: settings.qrSize * 4,
    color: {
      dark: settings.fgColor,
      light: settings.bgColor,
    },
  };

  await QRCodeLib.toCanvas(hiresCanvas, currentUrl, hiresOptions);
  return hiresCanvas;
}

function showLoading() {
  els.qrLoading.classList.remove('hidden');
}

function hideLoading() {
  els.qrLoading.classList.add('hidden');
}

/* ============================================================
   User Actions
   ============================================================ */

/** Copy the current URL to clipboard */
async function copyUrl() {
  if (!currentUrl) return;

  try {
    await navigator.clipboard.writeText(currentUrl);
    showToast('URL copied to clipboard!');
  } catch {
    // Fallback for older environments
    const ta = document.createElement('textarea');
    ta.value = currentUrl;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('URL copied to clipboard!');
  }
}

/** Download the QR code as a high-quality PNG */
async function downloadQR() {
  if (!currentUrl || !isValidUrl(currentUrl)) return;

  try {
    showToast('Preparing download…');
    const hiresCanvas = await generateHiresCanvas();
    const link = document.createElement('a');

    // Build a safe filename from the page title
    const safeName = (currentTab?.title || 'qr-code')
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .substring(0, 40)
      .toLowerCase();

    link.download = `${safeName}-qr.png`;
    link.href = hiresCanvas.toDataURL('image/png');
    link.click();
    showToast('QR code downloaded!');
  } catch (err) {
    console.error('Quick QR: download failed', err);
    showToast('Download failed');
  }
}

/** Open the current website in a new tab */
function openWebsite() {
  if (currentUrl && isValidUrl(currentUrl)) {
    chrome.tabs.create({ url: currentUrl });
  }
}

/** Re-fetch tab info and regenerate QR */
async function refreshQR() {
  showLoading();
  await initTab();
  showToast('QR code refreshed!');
}

/* ============================================================
   Theme
   ============================================================ */

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  settings.theme = theme;
  saveSettings();
}

function toggleTheme() {
  const next = settings.theme === 'light' ? 'dark' : 'light';
  applyTheme(next);
}

/* ============================================================
   Options Panel
   ============================================================ */

function toggleOptionsPanel() {
  const isOpen = els.optionsPanel.classList.toggle('open');
  els.optionsToggle.setAttribute('aria-expanded', String(isOpen));
}

/** Update preset button active state based on current colors */
function updatePresetHighlight() {
  document.querySelectorAll('.preset-btn').forEach((btn) => {
    const fg = btn.dataset.fg;
    const bg = btn.dataset.bg;
    btn.classList.toggle('active', fg === settings.fgColor && bg === settings.bgColor);
  });
}

/** Apply a color preset */
function applyPreset(fg, bg) {
  settings.fgColor = fg;
  settings.bgColor = bg;
  els.fgColor.value = fg;
  els.bgColor.value = bg;
  els.fgHex.textContent = fg;
  els.bgHex.textContent = bg;
  updatePresetHighlight();
  saveSettings();
  generateQR();
}

/* ============================================================
   Toast Notification
   ============================================================ */

let toastTimeout = null;

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => els.toast.classList.remove('show'), 2400);
}

/* ============================================================
   Event Bindings
   ============================================================ */

function bindControls() {
  // Theme
  els.themeToggle.addEventListener('click', toggleTheme);

  // Actions
  els.copyUrlBtn.addEventListener('click', copyUrl);
  els.downloadBtn.addEventListener('click', downloadQR);
  els.openSiteBtn.addEventListener('click', openWebsite);
  els.refreshBtn.addEventListener('click', refreshQR);

  // Options panel toggle
  els.optionsToggle.addEventListener('click', toggleOptionsPanel);

  // Size slider
  els.sizeSlider.addEventListener('input', () => {
    settings.qrSize = parseInt(els.sizeSlider.value, 10);
    els.sizeValue.textContent = `${settings.qrSize}px`;
    saveSettings();
    generateQR();
  });

  // Margin slider
  els.marginSlider.addEventListener('input', () => {
    settings.margin = parseInt(els.marginSlider.value, 10);
    els.marginValue.textContent = settings.margin;
    saveSettings();
    generateQR();
  });

  // Foreground color
  els.fgColor.addEventListener('input', () => {
    settings.fgColor = els.fgColor.value;
    els.fgHex.textContent = settings.fgColor;
    updatePresetHighlight();
    saveSettings();
    generateQR();
  });

  // Background color
  els.bgColor.addEventListener('input', () => {
    settings.bgColor = els.bgColor.value;
    els.bgHex.textContent = settings.bgColor;
    updatePresetHighlight();
    saveSettings();
    generateQR();
  });

  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyPreset(btn.dataset.fg, btn.dataset.bg);
    });
  });
}
