// ============================================================
// Dados de exemplo (modo de demonstração), usados só quando o
// Firebase não está configurado ou falhou ao conectar.
// ============================================================

export function getMockEmployees() {
  return [
    { id: "1", name: "Ana Souza" },
    { id: "2", name: "Bruno Lima" },
    { id: "3", name: "Carla Dias" },
    { id: "4", name: "Diego Alves" }
  ];
}

export function getMockHistory() {
  return [
    {
      message: "Reunião na sala 2 em 5 minutos",
      targetLabel: "Todos",
      priority: "alta",
      sentAt: new Date(),
      readCount: 3,
      totalTargets: 4
    },
    {
      message: "Pausa para o café às 15h",
      targetLabel: "Ana Souza",
      priority: "normal",
      sentAt: new Date(Date.now() - 7200e3),
      readCount: 1,
      totalTargets: 1
    }
  ];
}
