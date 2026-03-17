// ===== FIREBASE =====
const firebaseConfig = {
  apiKey: "AIzaSyCeQD2PNlXf2j8lTbit6ktOZR2FtAufLbY",
  authDomain: "agendapro-788d0.firebaseapp.com",
  projectId: "agendapro-788d0",
  storageBucket: "agendapro-788d0.firebasestorage.app",
  messagingSenderId: "627296929583",
  appId: "1:627296929583:web:d1773f21704407b41a43da"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ===== BLOQUEIA DOMINGOS E DATAS PASSADAS =====
const campoData = document.getElementById('data');
const hoje = new Date().toISOString().split('T')[0];
campoData.setAttribute('min', hoje);

campoData.addEventListener('change', function() {
  const dataSelecionada = new Date(this.value + 'T00:00:00');
  const diaSemana = dataSelecionada.getDay();
  if (diaSemana === 0) {
    alert('Domingos não há atendimento! Por favor escolha outro dia.');
    this.value = '';
  }
});

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
    alert('Por favor, preencha todos os campos!');
    return;
  }

  try {
    const snapshot = await db.collection('agendamentos')
      .where('data', '==', data)
      .where('horario', '==', horario)
      .get();

    if (!snapshot.empty) {
      alert('Este horário já está ocupado! Por favor escolha outro.');
      return;
    }

    const docRef = await db.collection('agendamentos').add({
      nome: nome,
      telefone: telefone,
      servico: servico,
      data: data,
      horario: horario,
      criadoEm: new Date().toISOString()
    });

    console.log('Agendamento salvo:', docRef.id);

    const mensagem = `Olá Luiza! Gostaria de agendar:
💅 Serviço: ${servico}
📅 Data: ${data}
⏰ Horário: ${horario}
👤 Nome: ${nome}
📱 Telefone: ${telefone}`;

    const numero = '5511973086170';
    const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');

  } catch(erro) {
    alert('Erro ao salvar: ' + erro.message);
  }
});
