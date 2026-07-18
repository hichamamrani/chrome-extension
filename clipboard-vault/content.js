(function () {
  "use strict";

  if (window.__clipboardVaultInitialized) return;
  window.__clipboardVaultInitialized = true;

  function getCopiedText(event) {
    let text = "";

    if (event && event.clipboardData) {
      text = event.clipboardData.getData("text/plain");
    }

    if (text) return text;

    const target = event && event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    ) {
      const start = target.selectionStart;
      const end = target.selectionEnd;
      if (start !== null && end !== null && start !== end) {
        return target.value.slice(start, end);
      }
      if (target.value) return target.value;
    }

    const active = document.activeElement;
    if (
      active instanceof HTMLInputElement ||
      active instanceof HTMLTextAreaElement
    ) {
      const start = active.selectionStart;
      const end = active.selectionEnd;
      if (start !== null && end !== null && start !== end) {
        return active.value.slice(start, end);
      }
    }

    const selection = window.getSelection();
    if (selection && selection.toString()) {
      return selection.toString();
    }

    return "";
  }

  function sendText(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (!chrome.runtime?.id) return;

    try {
      chrome.runtime.sendMessage(
        { type: "SAVE_CLIPBOARD", text: trimmed },
        () => {
          void chrome.runtime.lastError;
        }
      );
    } catch {
      // Extension context invalidated — page needs a refresh.
    }
  }

  function handleCopy(event) {
    const text = getCopiedText(event);
    sendText(text);
  }

  function handleKeyboardCopy(event) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "c") {
      return;
    }

    if (event.shiftKey || event.altKey) return;

    setTimeout(() => {
      const text = getCopiedText(null);
      sendText(text);
    }, 50);
  }

  document.addEventListener("copy", handleCopy, true);
  window.addEventListener("copy", handleCopy, true);
  document.addEventListener("keydown", handleKeyboardCopy, true);
})();
