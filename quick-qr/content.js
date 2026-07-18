/**
 * Quick QR — Content Script
 * Provides an in-page QR overlay when triggered from the context menu
 * (fallback when the popup cannot be opened programmatically).
 */

(function () {
  'use strict';

  const OVERLAY_ID = 'quick-qr-overlay';

  /** Listen for messages from the background service worker */
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'SHOW_QR_OVERLAY') {
      showOverlay(message.url, message.title);
    }
  });

  /**
   * Render a glassmorphism QR overlay on the current page.
   * QRCodeLib is available because lib/qrcode.bundle.js is loaded
   * as a content script dependency in manifest.json.
   */
  async function showOverlay(url, title) {
    document.getElementById(OVERLAY_ID)?.remove();

    if (!url || !(url.startsWith('http://') || url.startsWith('https://'))) {
      return;
    }

    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.innerHTML = `
      <style>
        #${OVERLAY_ID} {
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          animation: qqFadeIn 0.3s ease;
        }
        @keyframes qqFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        #${OVERLAY_ID} .qq-card {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
          text-align: center;
          max-width: 340px;
          width: 90%;
          animation: qqSlideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes qqSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        #${OVERLAY_ID} .qq-title {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        #${OVERLAY_ID} .qq-url {
          font-size: 11px;
          color: #64748b;
          margin: 0 0 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        #${OVERLAY_ID} .qq-canvas-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
        }
        #${OVERLAY_ID} canvas {
          border-radius: 8px;
        }
        #${OVERLAY_ID} .qq-close {
          padding: 8px 24px;
          border: none;
          border-radius: 10px;
          background: #2563eb;
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        #${OVERLAY_ID} .qq-close:hover {
          background: #1d4ed8;
          transform: scale(1.03);
        }
        #${OVERLAY_ID} .qq-brand {
          font-size: 10px;
          color: #94a3b8;
          margin-top: 12px;
        }
        #${OVERLAY_ID} .qq-brand a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }
        #${OVERLAY_ID} .qq-brand a:hover {
          text-decoration: underline;
        }
      </style>
      <div class="qq-card">
        <p class="qq-title">${escapeHtml(title || 'Quick QR')}</p>
        <p class="qq-url">${escapeHtml(url)}</p>
        <div class="qq-canvas-wrap">
          <canvas id="qq-overlay-canvas"></canvas>
        </div>
        <button class="qq-close">Close</button>
        <p class="qq-brand">Quick QR by <a href="https://algobots.co.uk" target="_blank" rel="noopener noreferrer">Algobots</a></p>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.classList.contains('qq-close')) {
        overlay.remove();
      }
    });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', onKey);
      }
    };
    document.addEventListener('keydown', onKey);

    try {
      const canvas = overlay.querySelector('#qq-overlay-canvas');
      await QRCodeLib.toCanvas(canvas, url, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 240,
        color: { dark: '#000000', light: '#ffffff' },
      });
    } catch (err) {
      console.error('Quick QR overlay: generation failed', err);
    }
  }

  /** Prevent XSS in overlay text content */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
