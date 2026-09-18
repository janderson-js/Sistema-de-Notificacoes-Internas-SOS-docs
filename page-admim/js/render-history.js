// ============================================================
// Renderização da tabela de histórico de avisos e dos KPIs
// relacionados (enviados hoje, taxa de leitura).
// ============================================================

import { escapeHtml, formatTime, toDate, priorityLabel } from "./utils.js";

export function renderHistory(items) {
  const tbody = document.getElementById("historyTableBody");
  const today = new Date().toDateString();
  const sentToday = items.filter((i) => i.sentAt && toDate(i.sentAt).toDateString() === today).length;
  document.getElementById("kpiSentToday").textContent = sentToday;

  const totalTargets = items.reduce((s, i) => s + (i.totalTargets || 0), 0);
  const totalRead = items.reduce((s, i) => s + (i.readCount || 0), 0);
  document.getElementById("kpiReadRate").textContent = totalTargets
    ? Math.round((totalRead / totalTargets) * 100) + "%"
    : "--";

  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-secondary py-4">Nenhum aviso enviado ainda</td></tr>`;
    return;
  }

  tbody.innerHTML = items
    .map(
      (i) => `
    <tr>
      <td class="ps-3">${escapeHtml(i.message || "")}</td>
      <td>${escapeHtml(i.targetLabel || i.target || "-")}</td>
      <td><span class="badge badge-priority-${i.priority || "normal"} rounded-pill px-2">${priorityLabel(i.priority)}</span></td>
      <td class="text-secondary small">${formatTime(i.sentAt)}</td>
      <td class="pe-3 text-secondary small">${i.readCount || 0}/${i.totalTargets || 0}</td>
    </tr>
  `
    )
    .join("");
}
