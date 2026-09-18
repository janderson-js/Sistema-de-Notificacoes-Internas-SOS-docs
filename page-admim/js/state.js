// ============================================================
// Estado compartilhado entre módulos. Hoje só guarda a lista mais
// recente de funcionários (atualizada pelo render-employees.js,
// lida pelo employee-picker.js na hora de filtrar a busca).
// ============================================================

let currentEmployees = [];

export function setCurrentEmployees(employees) {
  currentEmployees = employees;
}

export function getCurrentEmployees() {
  return currentEmployees;
}
