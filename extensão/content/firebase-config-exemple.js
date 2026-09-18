// ============================================================
// Configuração do Firebase — fonte única de verdade pra extensão.
// JavaScript puro (sem import/export): os content scripts aqui são
// carregados como scripts clássicos, um depois do outro, todos
// compartilhando o mesmo escopo global.
// ============================================================

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.firebasestorage.app",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};
