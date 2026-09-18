// ============================================================
// Listener em tempo real do Firestore, em JavaScript puro. Usa o
// objeto global `firebase`, disponibilizado pelos arquivos
// vendor/firebase-app-compat.js e vendor/firebase-firestore-compat.js
// (carregados antes deste). Não precisa de npm, bundler, nem
// import/export — só os scripts do SDK incluídos localmente na
// extensão.
//
// Substitui por completo o sistema de sinal/polling: mantém uma
// conexão aberta com o Firestore que só "acorda" quando um
// documento novo realmente aparece.
//
// Depende de:
//   - firebaseConfig (definida em firebase-config.js)
//   - showOverlay()   (definida em overlay-ui.js)
// ============================================================

// Avisos recebidos enquanto a aba estava em segundo plano ficam aqui,
// e são mostrados assim que o funcionário volta pra essa aba.
let filaPendente = [];

function processarNovaNotificacao(notif) {
  const payload = {
    title: notif.priority === "alta" ? "⚠️ Aviso Urgente" : "Aviso do Supervisor",
    message: notif.message || "",
    priority: notif.priority || "normal",
    sender: notif.senderName || null
  };

  if (document.visibilityState === "visible") {
    showOverlay(payload);
  } else {
    filaPendente.push(payload);
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && filaPendente.length > 0) {
    const pendentes = filaPendente;
    filaPendente = [];
    pendentes.forEach((p) => showOverlay(p));
  }
});

// Atualiza o marcador de "já visto" pra esse timestamp, se for mais
// recente que o que já estava salvo — evita reprocessar o mesmo aviso
// se a aba for recarregada.
function avancarMarcador(sentAtMs) {
  chrome.storage.local.get("lastChecked").then(({ lastChecked }) => {
    if (!lastChecked || sentAtMs > new Date(lastChecked).getTime()) {
      chrome.storage.local.set({ lastChecked: new Date(sentAtMs).toISOString() });
    }
  }).catch(tratarErroDeContexto);
}

function tratarErroDeContexto(err) {
  if (err && err.message && err.message.includes("Extension context invalidated")) {
    // A extensão foi recarregada/atualizada enquanto essa aba já estava aberta.
    // Um F5 nessa aba resolve — não tem como continuar depois disso.
    console.warn("Extensão foi atualizada — recarregue esta aba (F5) para continuar recebendo avisos.");
    return true;
  }
  console.error("Erro no listener de notificações:", err);
  return false;
}

function iniciar() {
  chrome.storage.local.get("extensaoId").then(({ extensaoId }) => {
    if (!extensaoId) return; // extensão ainda sem nome/ID configurado (primeira instalação)

    chrome.storage.local.get("lastChecked").then(({ lastChecked }) => {
      const sinceDate = lastChecked ? new Date(lastChecked) : new Date(Date.now() - 5 * 60 * 1000);

      firebase.initializeApp(firebaseConfig);
      const db = firebase.firestore();
      const notificationsRef = db.collection("notifications");

      function escutar(targetValue) {
        notificationsRef
          .where("target", "==", targetValue)
          .where("sentAt", ">", sinceDate)
          .onSnapshot(
            (snapshot) => {
              snapshot.docChanges().forEach((change) => {
                if (change.type !== "added") return;

                const notif = change.doc.data();
                processarNovaNotificacao(notif);

                const sentAtMs = notif.sentAt && notif.sentAt.toMillis ? notif.sentAt.toMillis() : Date.parse(notif.sentAt);
                avancarMarcador(sentAtMs);
              });
            },
            (err) => {
              tratarErroDeContexto(err);
            }
          );
      }

      escutar("all");
      escutar(extensaoId);
    });
  }).catch(tratarErroDeContexto);
}

iniciar();
