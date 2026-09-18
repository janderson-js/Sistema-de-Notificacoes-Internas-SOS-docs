// ============================================================
// Serviço do Firestore: única camada do painel que efetivamente lê
// ou escreve no banco. Todo o resto (render, formulário, picker)
// passa por aqui em vez de chamar o Firestore direto — assim, se um
// dia a estrutura das coleções mudar, só esse arquivo precisa mexer.
// ============================================================

// firestoreCtx é o objeto devolvido por initFirebase(): { db, collection, onSnapshot, addDoc, serverTimestamp, orderBy, query }

export function listenEmployees(firestoreCtx, onChange) {
  const { db, collection, onSnapshot } = firestoreCtx;
  onSnapshot(collection(db, "employees"), (snap) => {
    const employees = [];
    snap.forEach((d) => employees.push({ id: d.id, ...d.data() }));
    onChange(employees);
  });
}

export function listenHistory(firestoreCtx, onChange) {
  const { db, collection, onSnapshot, query, orderBy } = firestoreCtx;
  const q = query(collection(db, "notifications"), orderBy("sentAt", "desc"));
  onSnapshot(q, (snap) => {
    const items = [];
    snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
    onChange(items);
  });
}

export async function sendNotification(firestoreCtx, payload) {
  const { db, collection, addDoc, serverTimestamp } = firestoreCtx;
  await addDoc(collection(db, "notifications"), {
    ...payload,
    sentAt: serverTimestamp(),
    readCount: 0
  });
}
