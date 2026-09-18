// ============================================================
// Modal de seleção de funcionário com busca. Lê a lista mais
// recente do state.js (atualizada por render-employees.js) e
// escreve a escolha diretamente nos campos ocultos do formulário
// via o callback onSelect.
// ============================================================

import { escapeHtml } from "./utils.js";
import { getCurrentEmployees } from "./state.js";

export function setupEmployeePicker({ onSelect }) {
  const employeeSearchInput = document.getElementById("employeeSearchInput");
  const employeePickList = document.getElementById("employeePickList");
  const employeePickEmpty = document.getElementById("employeePickEmpty");
  const employeePickerModalEl = document.getElementById("employeePickerModal");
  const targetEmployeeId = document.getElementById("targetEmployeeId");

  function renderPickList(filterText) {
    const filtered = getCurrentEmployees().filter((e) =>
      (e.name || "").toLowerCase().includes(filterText.trim().toLowerCase())
    );

    employeePickEmpty.classList.toggle("d-none", filtered.length > 0);

    employeePickList.innerHTML = filtered
      .map(
        (e) => `
      <div class="employee-pick-item d-flex justify-content-between align-items-center ${e.id === targetEmployeeId.value ? "selected" : ""}"
           data-id="${e.id}" data-name="${escapeHtml(e.name || "")}">
        <span>${escapeHtml(e.name || "Sem nome")}</span>
      </div>
    `
      )
      .join("");

    employeePickList.querySelectorAll(".employee-pick-item").forEach((item) => {
      item.addEventListener("click", () => {
        onSelect({ id: item.dataset.id, name: item.dataset.name });
        const modal = bootstrap.Modal.getInstance(employeePickerModalEl);
        modal.hide();
      });
    });
  }

  employeeSearchInput.addEventListener("input", () => renderPickList(employeeSearchInput.value));

  employeePickerModalEl.addEventListener("shown.bs.modal", () => {
    employeeSearchInput.value = "";
    renderPickList("");
    employeeSearchInput.focus();
  });
}
