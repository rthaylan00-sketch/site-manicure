import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const lista = document.getElementById("lista");

async function carregarAgendamentos() {
  lista.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "agendamentos"));

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();

    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.margin = "10px";
    div.style.padding = "10px";

    div.innerHTML = `
      <p><strong>Nome:</strong> ${data.nome}</p>
      <p><strong>Serviço:</strong> ${data.servico}</p>
      <p><strong>Data:</strong> ${data.data}</p>
      <p><strong>Hora:</strong> ${data.hora}</p>
      <button onclick="cancelar('${docSnap.id}')">Cancelar</button>
    `;

    lista.appendChild(div);
  });
}

// função global (precisa estar no window)
window.cancelar = async (id) => {
  if (confirm("Deseja cancelar esse agendamento?")) {
    await deleteDoc(doc(db, "agendamentos", id));
    carregarAgendamentos(); // recarrega lista
  }
};

carregarAgendamentos();
