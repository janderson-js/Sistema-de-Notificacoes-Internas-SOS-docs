// ============================================================
// Inicialização do Firebase. Responsabilidade única: checar se está
// configurado, importar o SDK, conectar, e devolver as funções do
// Firestore prontas pra uso — ou null se não deu pra conectar.
//
// Também atualiza o indicador de status (bolinha + texto) no topo da
// página, já que essa informação nasce exatamente aqui.
// ============================================================

// Coleções esperadas no Firestore:
//   employees      { name, status: 'online'|'offline', lastSeen: Timestamp }
//   notifications  { message, target: 'all'|employeeId, targetLabel,
//                    priority: 'normal'|'media'|'alta', sentAt: Timestamp,
//                    readCount: number, totalTargets: number }

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.firebasestorage.app",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};

const SDK_VERSION = "10.13.0";

export function isConfigured() {
  return firebaseConfig.apiKey !== "SUA_API_KEY";
}

// Devolve { db, collection, onSnapshot, addDoc, serverTimestamp, orderBy, query }
// em caso de sucesso, ou null se não estiver configurado / falhar a conexão.
export async function initFirebase() {
  const connDot = document.getElementById("connStatusDot");
  const connText = document.getElementById("connStatusText");
  const configBanner = document.getElementById("configBanner");

  if (!isConfigured()) {
    connText.textContent = "modo de exemplo";
    configBanner.classList.remove("d-none");
    return null;
  }

  try {
    const { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-app.js`);
    const fs = await import(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-firestore.js`);

    const app = initializeApp(firebaseConfig);
    const db = fs.getFirestore(app);

    connDot.className = "dot dot-online";
    connText.textContent = "conectado";

    return {
      db,
      collection: fs.collection,
      onSnapshot: fs.onSnapshot,
      addDoc: fs.addDoc,
      serverTimestamp: fs.serverTimestamp,
      orderBy: fs.orderBy,
      query: fs.query
    };
  } catch (err) {
    console.error("Erro ao conectar ao Firebase:", err);
    connText.textContent = "erro de conexão";
    return null;
  }
}
