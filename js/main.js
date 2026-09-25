// ============================================================
// Entrypoint do painel admin. Não contém lógica de negócio própria —
// só decide entre modo real (Firebase configurado) e modo de exemplo,
// e liga as peças definidas nos outros módulos.
// ============================================================

import { initFirebase } from "./firebase-init.js";
import { listenEmployees, listenHistory } from "./firestore-service.js";
import { renderEmployees } from "./render-employees.js";
import { renderHistory } from "./render-history.js";
import { setupSendForm } from "./form-handler.js";
import { getMockEmployees, getMockHistory } from "./mock-data.js";

async function main() {
  const firestoreCtx = await initFirebase();

  if (firestoreCtx) {
    listenEmployees(firestoreCtx, renderEmployees);
    listenHistory(firestoreCtx, renderHistory);
  } else {
    // Sem Firebase configurado ou falha na conexão: mostra dados de exemplo
    renderEmployees(getMockEmployees());
    renderHistory(getMockHistory());
  }

  setupSendForm(firestoreCtx);
}

main();
