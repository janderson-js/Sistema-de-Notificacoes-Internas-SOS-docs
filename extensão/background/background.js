// ============================================================
// Service worker: sem heartbeat, sem alarms. A única responsabilidade
// que sobra aqui é garantir que abas que já estavam abertas ANTES da
// instalação/atualização da extensão recebam o content script — sem
// isso, só páginas abertas DEPOIS da instalação o receberiam
// automaticamente, exigindo F5 manual nas demais.
// ============================================================

const CONTENT_SCRIPT_FILES = [
  "content/vendor/firebase-app-compat.js",
  "content/vendor/firebase-firestore-compat.js",
  "content/firebase-config.js",
  "content/overlay-ui.js",
  "content/firestore-listener.js"
];

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason !== "install" && details.reason !== "update") return;

  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.id || !tab.url || !/^https?:\/\//.test(tab.url)) continue;

    chrome.scripting
      .executeScript({ target: { tabId: tab.id }, files: CONTENT_SCRIPT_FILES })
      .catch(() => {
        // Algumas abas (páginas internas do Chrome, Web Store, etc.) bloqueiam
        // injeção de scripts — é esperado e pode ser ignorado.
      });
  }
});
