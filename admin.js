function verificarSenha() {
  const senha = document.getElementById('campo-senha').value;
  if (senha === "Lu1234") {
    document.getElementById('tela-senha').style.display = 'none';
    document.getElementById('painel').style.display = 'block';
    carregarAgendamentos();
  } else {
    alert('Senha incorreta!');
  }
}

function formatarDataBR(data) {
  const partes = data.split('-');
  const novaData = new Date(partes[0], partes[1] - 1, partes[2]);
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

  const querySnapshot = await db.collection("agendamentos").get();

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const div = document.createElement("div");
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

window.cancelar = async (id) => {
  if (confirm("Deseja cancelar esse agendamento?")) {
    await db.collection("agendamentos").doc(id).delete();
    carregarAgendamentos();
  }
};
