// ============================================================
// Helpers puros — sem DOM, sem Firebase, sem estado. Só transformam
// dados. Reusados por todos os módulos de renderização.
// ============================================================

export function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

export function toDate(ts) {
  return ts?.toDate ? ts.toDate() : new Date(ts);
}

export function formatTime(ts) {
  if (!ts) return "-";
  const d = toDate(ts);
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export function priorityLabel(p) {
  return p === "alta" ? "Alta" : p === "media" ? "Média" : "Normal";
}
