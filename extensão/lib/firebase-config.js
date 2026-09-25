// ============================================================
// Configuração do Firebase — versão ES module, usada por arquivos
// que rodam como módulo (popup, background), ao contrário de
// content/firebase-config.js, que é a mesma config em formato de
// script clássico (sem export), usada pelos content scripts.
// ============================================================

export const firebaseConfig = {
  apiKey: "AIzaSyC03SpiPS6bfNJ442LMoRS2hmuiQ7O7Y5g",
  authDomain: "painel-de-notificacao.firebaseapp.com",
  projectId: "painel-de-notificacao",
  storageBucket: "painel-de-notificacao.firebasestorage.app",
  messagingSenderId: "309434470083",
  appId: "1:309434470083:web:d5bb8c6ffb7c5ea559dc7"
};
