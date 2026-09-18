// ============================================================
// Formulário de envio de avisos. Depende de:
//   - sendNotification (firestore-service.js) pra gravar no Firestore
//   - setupEmployeePicker (employee-picker.js) pro modal de busca
//   - getCurrentEmployees (state.js) pra calcular totalTargets
//
// firestoreCtx é null quando o Firebase não está configurado (modo
// de exemplo) — nesse caso, o envio só mostra um aviso, sem gravar.
// ============================================================

import { setupEmployeePicker } from "./employee-picker.js";
import { getCurrentEmployees } from "./state.js";
import { sendNotification } from "./firestore-service.js";

export function setupSendForm(firestoreCtx) {
  const targetType = document.getElementById("targetType");
  const targetEmployeeWrap = document.getElementById("targetEmployeeWrap");
  const targetEmployeeLabel = document.getElementById("targetEmployeeLabel");
  const targetEmployeeId = document.getElementById("targetEmployeeId");
  const messageText = document.getElementById("messageText");
  const charCount = document.getElementById("charCount");
  const sendForm = document.getElementById("sendForm");
  const sendFeedback = document.getElementById("sendFeedback");

  targetType.addEventListener("change", () => {
    targetEmployeeWrap.style.display = targetType.value === "one" ? "block" : "none";
  });

  messageText.addEventListener("input", () => {
    charCount.textContent = messageText.value.length;
  });

  setupEmployeePicker({
    onSelect: ({ id, name }) => {
      targetEmployeeId.value = id;
      targetEmployeeLabel.textContent = name;
      targetEmployeeLabel.parentElement.classList.remove("is-empty");
    }
  });

  function resetForm() {
    sendForm.reset();
    charCount.textContent = "0";
    targetEmployeeWrap.style.display = "none";
    targetEmployeeLabel.textContent = "Selecionar funcionário...";
    targetEmployeeLabel.parentElement.classList.add("is-empty");
    targetEmployeeId.value = "";
  }

  sendForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const priority = document.querySelector('input[name="priority"]:checked').value;
    const target = targetType.value;

    if (target === "one" && !targetEmployeeId.value) {
      sendFeedback.innerHTML = `<span class="text-danger"><i class="bi bi-x-circle-fill me-1"></i>Selecione um funcionário.</span>`;
      return;
    }

    if (!firestoreCtx) {
      sendFeedback.innerHTML = `<span class="text-warning"><i class="bi bi-exclamation-triangle-fill me-1"></i>Modo de exemplo: configure o Firebase para enviar de verdade.</span>`;
      return;
    }

    const targetLabel = target === "all" ? "Todos" : targetEmployeeLabel.textContent;
    const totalTargets = target === "all" ? getCurrentEmployees().length : 1;

    const payload = {
      message: messageText.value.trim(),
      target: target === "one" ? targetEmployeeId.value : target,
      targetLabel,
      priority,
      totalTargets
    };

    try {
      await sendNotification(firestoreCtx, payload);
      sendFeedback.innerHTML = `<span class="text-success"><i class="bi bi-check-circle-fill me-1"></i>Aviso enviado com sucesso.</span>`;
      resetForm();
    } catch (err) {
      console.error(err);
      sendFeedback.innerHTML = `<span class="text-danger"><i class="bi bi-x-circle-fill me-1"></i>Falha ao enviar. Veja o console.</span>`;
    }
  });
}
