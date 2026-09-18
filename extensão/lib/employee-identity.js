// ============================================================
// Identidade do funcionário: gera/lê o ID único da instalação e o
// nome configurado. Só mexe em chrome.storage.local — nenhuma
// chamada de rede acontece aqui (o heartbeat que fazia isso foi
// removido; esse ID hoje só serve pra filtrar notificações
// individuais no content script).
// ============================================================

// Cache da Promise: garante que chamadas concorrentes aguardem a MESMA
// geração/leitura de ID, evitando gerar dois IDs diferentes por engano.
let extensaoIdPromise = null;

export function getExtensaoId() {
  if (!extensaoIdPromise) {
    extensaoIdPromise = (async () => {
      const data = await chrome.storage.local.get("extensaoId");
      if (data.extensaoId) return data.extensaoId;

      const newId = crypto.randomUUID();
      await chrome.storage.local.set({ extensaoId: newId });
      return newId;
    })();
  }
  return extensaoIdPromise;
}

export async function getEmployeeName() {
  const data = await chrome.storage.local.get("employeeName");
  return data.employeeName || null;
}
