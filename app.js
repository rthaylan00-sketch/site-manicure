const firebaseConfig = {
  apiKey: "AIzaSyCeQD2PNlXf2j8lTbit6ktOZR2FtAufLbY",
  authDomain: "agendapro-788d0.firebaseapp.com",
  projectId: "agendapro-788d0",
  storageBucket: "agendapro-788d0.appspot.com",
  messagingSenderId: "627296929583",
  appId: "1:627296929583:web:d1773f21704407b41a43da"
};

// Preenche os beijinhos
const div = document.getElementById('beijinhos');
if (div) {
  div.textContent = '💋'.repeat(300);
}


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ===== ELEMENTOS =====
const campoData = document.getElementById('data');
const selectHorario = document.getElementById('horario');

// ===== BLOQUEAR DATAS PASSADAS =====
const hoje = new Date();
const hojeFormatado = hoje.getFullYear() + '-' +
  String(hoje.getMonth() + 1).padStart(2, '0') + '-' +
  String(hoje.getDate()).padStart(2, '0');

campoData.setAttribute('min', hojeFormatado);
campoData.setAttribute('min', hoje);

// ===== BLOQUEAR DOMINGO + CARREGAR HORÁRIOS =====
campoData.addEventListener('change', async function() {

  const dataSelecionada = this.value;

  const dataObj = new Date(dataSelecionada + 'T00:00:00');
  const diaSemana = dataObj.getDay();

  if (diaSemana === 0) {
    alert('Domingos não há atendimento!');
    this.value = '';
    return;
  }

  await bloquearHorarios(dataSelecionada);
});

// ===== FUNÇÃO BLOQUEAR HORÁRIOS =====
async function bloquearHorarios(dataSelecionada) {

  const snapshot = await db.collection('agendamentos')
    .where('data', '==', dataSelecionada)
    .get();

  const horariosOcupados = snapshot.docs.map(doc => doc.data().horario);

  const todosHorarios = [
    '09:00',
    '13:00',
    '16:30',
    '19:00',
    '21:30'
  ];

  // Limpa a lista
  selectHorario.innerHTML = '<option value="">Selecione...</option>';

  // Adiciona só os disponíveis
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
    option.value = '';
    option.textContent = 'Nenhum horário disponível';
    option.disabled = true;
    selectHorario.appendChild(option);
  }
}


// ===== FORMULÁRIO =====
const form = document.getElementById('form-agendamento');

function formatarDataBR(data) {
  const novaData = new Date(data);
  return novaData.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

form.addEventListener('submit', async function(e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const servico = document.getElementById('servico').value;
  const data = document.getElementById('data').value;
  const horario = document.getElementById('horario').value;

  if (!nome || !telefone || !servico || !data || !horario) {
    alert('Preencha todos os campos!');
    return;
  }

  try {
    // verifica novamente antes de salvar
    const snapshot = await db.collection('agendamentos')
      .where('data', '==', data)
      .get();

    const ocupado = snapshot.docs.some(doc => {
      return doc.data().horario === horario;
    });

    if (ocupado) {
      alert('Este horário já está ocupado!');
      return;
    }

    await db.collection('agendamentos').add({
      nome,
      telefone,
      servico,
      data,
      horario,
      criadoEm: new Date().toISOString()
    });

    alert('Agendamento confirmado!');

    // ===== WHATSAPP =====
    const mensagem = `Olá! Tudo bem? 😊

Gostaria de agendar um horário:

💅 Serviço: ${servico}
📅 Data: ${formatarDataBR(data)}
⏰ Horário: ${horario}

👤 Nome: ${nome}
📱 Telefone: ${telefone}

Aguardo confirmação 💖`;

    const numero = '5511973086170';

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

    window.location.href= url;

    form.reset();

  } catch (erro) {
    alert('Erro: ' + erro.message);
  }
});
