// ============================================================
// UI do overlay de popup: só cuida de desenhar na tela. Não sabe
// nada sobre Firestore, sinal, ou de onde vem o aviso — recebe
// título/mensagem/prioridade prontos e mostra.
// ============================================================

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function showOverlay({ title, message, priority, sender }) {
  // Evita empilhar vários popups se chegar mais de um aviso ao mesmo tempo
  const existente = document.getElementById("__equipe-popup-overlay");
  if (existente) existente.remove();

  const corPrioridade = priority === "alta" ? "#dc2626" : "#2563eb";

  const overlay = document.createElement("div");
  overlay.id = "__equipe-popup-overlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: system-ui, -apple-system, sans-serif;
  `;

  const box = document.createElement("div");
  box.style.cssText = `
    background: #ffffff;
    border-radius: 14px;
    padding: 28px 32px;
    max-width: 440px;
    width: 90%;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
    border-top: 6px solid ${corPrioridade};
    animation: __equipe-popup-in 0.2s ease-out;
  `;

  const remetenteHtml = sender
    ? `<div style="font-size:13px;color:#6b7280;margin-bottom:14px;">Enviado por <b>${escapeHtml(sender)}</b></div>`
    : "";

  box.innerHTML = `
    <div style="font-size:13px;font-weight:700;color:${corPrioridade};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">
      ${escapeHtml(title)}
    </div>
    <div style="font-size:17px;color:#111827;line-height:1.55;margin-bottom:14px;white-space:pre-wrap;">
      ${escapeHtml(message)}
    </div>
    ${remetenteHtml}
    <div style="display:flex;justify-content:flex-end;">
      <button id="__equipe-popup-close" style="
        background:${corPrioridade};
        color:white;
        border:none;
        border-radius:8px;
        padding:10px 22px;
        font-size:14px;
        font-weight:600;
        cursor:pointer;
      ">OK, entendi</button>
    </div>
  `;

  const styleTag = document.createElement("style");
  styleTag.textContent = `
    @keyframes __equipe-popup-in {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(styleTag);

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  document.getElementById("__equipe-popup-close").addEventListener("click", () => {
    overlay.remove();
  });
}
