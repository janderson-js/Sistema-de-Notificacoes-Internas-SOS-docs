import { getExtensaoId } from "../lib/employee-identity.js";
import { upsertDocument } from "../lib/firestore-rest.js";

const setupView = document.getElementById("setupView");
const statusView = document.getElementById("statusView");
const nameInput = document.getElementById("nameInput");
const saveNameBtn = document.getElementById("saveNameBtn");
const editNameBtn = document.getElementById("editNameBtn");
const employeeNameLabel = document.getElementById("employeeNameLabel");
const lastCheckLabel = document.getElementById("lastCheckLabel");

async function render() {
  const data = await chrome.storage.local.get(["employeeName", "lastChecked"]);

  if (data.employeeName) {
    setupView.classList.add("hidden");
    statusView.classList.remove("hidden");
    employeeNameLabel.textContent = data.employeeName;
    lastCheckLabel.textContent = data.lastChecked
      ? `Última checagem: ${new Date(data.lastChecked).toLocaleTimeString("pt-BR")}`
      : "Ainda não checou avisos";
  } else {
    setupView.classList.remove("hidden");
    statusView.classList.add("hidden");
  }
}

saveNameBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  if (!name) return;

  await chrome.storage.local.set({ employeeName: name });

  // Garante que o ID único da instalação já existe antes de fechar o
  // popup — o content script depende dele pra filtrar notificações
  // individuais direcionadas a esse funcionário especificamente.
  const extensaoId = await getExtensaoId();

  // Registra (ou atualiza) o funcionário na coleção "employees" — só o
  // nome, gravado uma única vez aqui. Isso é o que permite o painel
  // admin oferecer "enviar pra um funcionário específico". Não é um
  // heartbeat: não roda em intervalo, não grava status nem lastSeen.
  await upsertDocument("employees", extensaoId, { name });

  render();
});

editNameBtn.addEventListener("click", async () => {
  const data = await chrome.storage.local.get("employeeName");
  nameInput.value = data.employeeName || "";
  setupView.classList.remove("hidden");
  statusView.classList.add("hidden");
});

render();
