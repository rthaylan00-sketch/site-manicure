const firebaseConfig = {
  apiKey: "AIzaSyCeQD2PNlXf2j8lTbit6ktOZR2FtAufLbY",
  authDomain: "agendapro-788d0.firebaseapp.com",
  projectId: "agendapro-788d0",
  storageBucket: "agendapro-788d0.appspot.com",
  messagingSenderId: "627296929583",
  appId: "1:627296929583:web:d1773f21704407b41a43da"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ===== ELEMENTOS =====
const campoData = document.getElementById('data');
const selectHorario = document.getElementById('horario');

// ===== BLOQUEAR DATAS PASSADAS =====
const hoje = new Date().toISOString().split('T')[0];
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

  Array.from(selectHorario.options).forEach(option => {

    if (!option.value) return;

    if (horariosOcupados.includes(option.value)) {
      option.disabled = true;
      option.textContent = option.value + " (ocupado)";
    } else {
      option.disabled = false;
      option.textContent = option.value;
    }

  });
}

// ===== FORMULÁRIO =====
const form = document.getElementById('form-agendamento');

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
    const mensagem = `Olá! Gostaria de agendar:
💅 Serviço: ${servico}
📅 Data: ${data}
⏰ Horário: ${horario}
👤 Nome: ${nome}
📱 Telefone: ${telefone}`;

    const numero = '5511973086170';

    const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensagem)}`;

    window.open(url, '_blank');

    form.reset();

  } catch (erro) {
    alert('Erro: ' + erro.message);
  }
});
