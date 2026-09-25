// ============================================================
// Configuração do Firebase — fonte única de verdade pra extensão.
// JavaScript puro (sem import/export): os content scripts aqui são
// carregados como scripts clássicos, um depois do outro, todos
// compartilhando o mesmo escopo global.
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyC03SpiPS6bfNJ442LMoRS2hmuiQ7O7Y5g",
  authDomain: "painel-de-notificacao.firebaseapp.com",
  projectId: "painel-de-notificacao",
  storageBucket: "painel-de-notificacao.firebasestorage.app",
  messagingSenderId: "309434470083",
  appId: "1:309434470083:web:d5bb8c6ffb7c5ea559dc7""
};
