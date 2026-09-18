// ============================================================
// Configuração do Firebase — versão ES module, usada por arquivos
// que rodam como módulo (popup, background), ao contrário de
// content/firebase-config.js, que é a mesma config em formato de
// script clássico (sem export), usada pelos content scripts.
// ============================================================

export const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.firebasestorage.app",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID""
};
