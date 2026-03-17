const firebaseConfig = {
  apiKey: "AIzaSyCeQD2PNlXf2j8lTbit6ktOZR2FtAufLbY",
  authDomain: "agendapro-788d0.firebaseapp.com",
  projectId: "agendapro-788d0",
  storageBucket: "agendapro-788d0.firebasestorage.app",
  messagingSenderId: "627296929583",
  appId: "1:627296929583:web:d1773f21704407b41a43da",
  measurementId: "G-66SHNPQPMR"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const form = document.getElementById('form-agendamento');

form.addEventListener('submit', async function(e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const servico = document.getElementById('servico').value;
  const data = document.getElementById('data').value;
  const horario = document.getElementById('horario').value;
  if (!nome || !telefone || !servico || !dataInput || !horario) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  // Formata a data para yyyy-mm-dd independente do iPhone ou Android
  const partes = dataInput.split('-');
  const data = partes.length === 3 ? dataInput : new Date(dataInput).toISOString().split('T')[0];

  // Formata horário para HH:MM
  const horarioFormatado = horario.substring(0, 5);

  try {
    const snapshot = await db.collection('agendamentos')
      .where('data', '==', data)
      .where('horario', '==', horarioFormatado)
      .get();

    if (!snapshot.empty) {
      alert('Este horário já está ocupado! Por favor escolha outro.');
      return;
    }

    await db.collection('agendamentos').add({
      nome,
      telefone,
      servico,
      data,
      horario: horarioFormatado,
      criadoEm: new Date()
    });

    const mensagem = `Olá Luiza! Gostaria de agendar:
💅 Serviço: ${servico}
📅 Data: ${data}
⏰ Horário: ${horarioFormatado}
👤 Nome: ${nome}
📱 Telefone: ${telefone}`;

    const numero = '5511973086170';
    const url = `whatsapp://send?phone=${numero}&text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');

  } catch(erro) {
    alert('Erro: ' + erro.message);
  }
});
