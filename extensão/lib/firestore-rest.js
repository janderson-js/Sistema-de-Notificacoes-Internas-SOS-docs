// ============================================================
// Escrita mínima no Firestore via REST API — sem precisar do SDK
// completo (que só é necessário pro listener em tempo real do
// content script). Usado pelo popup só pra registrar o nome do
// funcionário na coleção "employees", uma única vez (não é um
// heartbeat: não roda em intervalo, só quando o nome é salvo).
// ============================================================

import { firebaseConfig } from "./firebase-config.js";

const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

function toFirestoreFields(obj) {
  const fields = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") fields[key] = { stringValue: value };
    else if (typeof value === "number") fields[key] = { integerValue: String(value) };
    else if (typeof value === "boolean") fields[key] = { booleanValue: value };
  }
  return fields;
}

// Cria ou atualiza um documento com ID fixo (upsert). fieldsToUpdate é
// um objeto simples, ex: { name: "Ana Souza" }.
export async function upsertDocument(collectionName, docId, fieldsToUpdate) {
  const mask = Object.keys(fieldsToUpdate)
    .map((key) => `updateMask.fieldPaths=${encodeURIComponent(key)}`)
    .join("&");
  const url = `${FIRESTORE_BASE_URL}/${collectionName}/${docId}?${mask}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: toFirestoreFields(fieldsToUpdate) })
  });

  if (!res.ok) {
    console.error(`Falha ao gravar em ${collectionName}/${docId}:`, res.status, await res.text());
  }
}
