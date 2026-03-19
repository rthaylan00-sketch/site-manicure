import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function formatarDataBR(data) {
  const novaData = new Date(data);
  return novaData.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

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

    div.classList.add("card");

div.innerHTML = `
  <p><strong>Nome:</strong> ${data.nome || "-"}</p>
  <p><strong>Serviço:</strong> ${data.servico || "-"}</p>
  <p><strong>Data:</strong> ${data.data ? formatarDataBR(data.data) : "-"}</p>
  <p><strong>Hora:</strong> ${data.horario || "-"}</p>
  <button class="btn" onclick="cancelar('${docSnap.id}')">Cancelar</button>
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

const senha = prompt("Digite a senha:");

if (senha !== "Lu1234") {
  window.location.href = "agendamento.html";
}
