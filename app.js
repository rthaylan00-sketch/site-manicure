// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyCeQD2PNlXf2j8lTbit6ktOZR2FtAufLbY",
  authDomain: "agendapro-788d0.firebaseapp.com",
  projectId: "agendapro-788d0",
  storageBucket: "agendapro-788d0.appspot.com",
  messagingSenderId: "627296929583",
  appId: "1:627296929583:web:d1773f21704407b41a43da"
};

// ===== INICIAR FIREBASE =====
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ===== ELEMENTOS =====
const campoData = document.getElementById('data');
const selectHorario = document.getElementById('horario');

// ===== BLOQUEAR DATAS PASSADAS =====
if (campoData) {
  const hoje = new Date();
  const hojeFormatado = hoje.getFullYear() + '-' +
    String(hoje.getMonth() + 1).padStart(2, '0') + '-' +
    String(hoje.getDate()).padStart(2, '0');

  campoData.setAttribute('min', hojeFormatado);

  campoData.addEventListener('change', async function () {
    const dataSelecionada = this.value;
    const partes = dataSelecionada.split('-');
    const dataObj = new Date(partes[0], partes[1] - 1, partes[2]);
    const diaSemana = dataObj.getDay();

    if (diaSemana === 0) {
      alert('Domingos não há atendimento!');
      this.value = '';
      return;
    }

    await bloquearHorarios(dataSelecionada);
  });
}

// ===== BLOQUEAR HORÁRIOS =====
async function bloquearHorarios(dataSelecionada) {
  const snapshot = await db.collection('agendamentos')
    .where('data', '==', dataSelecionada)
    .get();

  const horariosOcupados = snapshot.docs.map(doc => doc.data().horario);
  const todosHorarios = ['13:00', '16:30', '19:00', '21:30'];

  selectHorario.innerHTML = '<option value="">Selecione...</option>';

  todosHorarios.forEach(horario => {
    if (!horariosOcupados.includes(horario)) {
      const option = document.createElement('option');
      option.value = horario;
      option.textContent = horario;
      selectHorario.appendChild(option);
    }
  });

  if (selectHorario.options.length === 1) {
    const option = document.createElement('option');
    option.textContent = 'Nenhum horário disponível';
    option.disabled = true;
    selectHorario.appendChild(option);
  }
}

// ===== FORMATAR DATA =====
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

// ===== AGENDAR =====
function confirmarAgendamento() {
  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const servico = document.getElementById('servico').value;
  const data = document.getElementById('data').value;
  const horario = document.getElementById('horario').value;

  if (!nome || !telefone || !servico || !data || !horario) {
    alert('Preencha todos os campos!');
    return;
  }

  const mensagem = `Olá! Tudo bem? 😊

Gostaria de agendar um horário:

💅 Serviço: ${servico}
📅 Data: ${formatarDataBR(data)}
⏰ Horário: ${horario}
📍 Local: Rua Pedro Escobar 06
👤 Nome: ${nome}
📱 Telefone: ${telefone}

Aguardo confirmação 💖`;

  const url = `https://wa.me/5511973086170?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}

// 🔥 MUITO IMPORTANTE
window.confirmarAgendamento = confirmarAgendamento;
