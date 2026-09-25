// ============================================================
// Renderização da tabela de funcionários. Também atualiza o estado
// compartilhado com a lista mais recente, que o employee-picker.js
// usa pra busca.
//
// Não mostra status online/offline nem última atividade: isso
// dependia do heartbeat, que foi removido — hoje a extensão só
// registra o nome do funcionário uma vez, ao configurar.
// ============================================================

import { escapeHtml } from "./utils.js";
import { setCurrentEmployees } from "./state.js";

export function renderEmployees(employees) {
  setCurrentEmployees(employees);

  const tbody = document.getElementById("employeeTableBody");
  document.getElementById("employeeCountBadge").textContent = employees.length;
  document.getElementById("kpiTotal").textContent = employees.length;

  if (!employees.length) {
    tbody.innerHTML = `<tr><td colspan="1" class="text-center text-secondary py-4">Nenhum funcionário cadastrado</td></tr>`;
    return;
  }

  tbody.innerHTML = employees
    .map(
      (e) => `
    <tr>
      <td class="ps-3 pe-3 fw-semibold">${escapeHtml(e.name || "Sem nome")}</td>
    </tr>
  `
    )
    .join("");
}
