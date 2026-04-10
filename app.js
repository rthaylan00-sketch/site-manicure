const firebaseConfig = {
apiKey: “AIzaSyCeQD2PNlXf2j8lTbit6ktOZR2FtAufLbY”,
authDomain: “agendapro-788d0.firebaseapp.com”,
projectId: “agendapro-788d0”,
storageBucket: “agendapro-788d0.appspot.com”,
messagingSenderId: “627296929583”,
appId: “1:627296929583:web:d1773f21704407b41a43da”
};

// Preenche os beijinhos
const div = document.getElementById(‘beijinhos’);
if (div) {
div.textContent = ‘💋’.repeat(300);
}

if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ===== ELEMENTOS =====
const campoData = document.getElementById(‘data’);
const selectHorario = document.getElementById(‘horario’);

// ===== BLOQUEAR DATAS PASSADAS =====
const hoje = new Date();
const hojeFormatado = hoje.getFullYear() + ‘-’ +
String(hoje.getMonth() + 1).padStart(2, ‘0’) + ‘-’ +
String(hoje.getDate()).padStart(2, ‘0’);

campoData.setAttribute(‘min’, hojeFormatado);

// ===== BLOQUEAR DOMINGO + CARREGAR HORÁRIOS =====
campoData.addEventListener(‘change’, async function () {
const dataSelecionada = this.value;
const partes = dataSelecionada.split(’-’);
const dataObj = new Date(partes[0], partes[1] - 1, partes[2]);
const diaSemana = dataObj.getDay();

if (diaSemana === 0) {
alert(‘Domingos não há atendimento!’);
this.value = ‘’;
return;
}

await bloquearHorarios(dataSelecionada);
});

// ===== FUNÇÃO BLOQUEAR HORÁRIOS =====
async function bloquearHorarios(dataSelecionada) {
const snapshot = await db.collection(‘agendamentos’)
.where(‘data’, ‘==’, dataSelecionada)
.get();

const horariosOcupados = snapshot.docs.map(doc => doc.data().horario);
const todosHorarios = [‘13:00’, ‘16:30’, ‘19:00’, ‘21:30’];

selectHorario.innerHTML = ‘<option value="">Selecione…</option>’;

todosHorarios.forEach(horario => {
if (!horariosOcupados.includes(horario)) {
const option = document.createElement(‘option’);
option.value = horario;
option.textContent = horario;
selectHorario.appendChild(option);
}
});

if (selectHorario.options.length === 1) {
const option = document.createElement(‘option’);
option.value = ‘’;
option.textContent = ‘Nenhum horário disponível’;
option.disabled = true;
selectHorario.appendChild(option);
}
}

// ===== FORMATAR DATA =====
function formatarDataBR(data) {
const partes = data.split(’-’);
const novaData = new Date(partes[0], partes[1] - 1, partes[2]);
return novaData.toLocaleDateString(“pt-BR”, {
weekday: “long”,
day: “2-digit”,
month: “2-digit”,
year: “numeric”
});
}

// ===== FORMULÁRIO =====
const form = document.getElementById(‘form-agendamento’);

form.addEventListener(‘submit’, async function (e) {
e.preventDefault();

const nome = document.getElementById(‘nome’).value;
const telefone = document.getElementById(‘telefone’).value;
const servico = document.getElementById(‘servico’).value;
const data = document.getElementById(‘data’).value;
const horario = document.getElementById(‘horario’).value;

if (!nome || !telefone || !servico || !data || !horario) {
alert(‘Preencha todos os campos!’);
return;
}

// ===== MONTA MENSAGEM E URL =====
const mensagem = `Olá! Tudo bem? 😊

Gostaria de agendar um horário:

💅 Serviço: ${servico}
📅 Data: ${formatarDataBR(data)}
⏰ Horário: ${horario}
📍Local: Rua Pedro Escobar 06
Ponto de referência: Em cima da Farmácia Vital Farma
🗺️ Mapa: https://maps.google.com/?q=Rua+Pedro+Escobar+06

👤 Nome: ${nome}
📱 Telefone: ${telefone}

Aguardo confirmação 💖`;

const numero = ‘5511973086170’;
const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

// ===== ABRE O WHATSAPP (funciona no Safari e Android) =====
const link = document.createElement(‘a’);
link.href = url;
link.target = ‘_blank’;
link.rel = ‘noopener noreferrer’;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);

try {
// Verifica se o horário ainda está disponível
const snapshot = await db.collection(‘agendamentos’)
.where(‘data’, ‘==’, data)
.get();

```
const ocupado = snapshot.docs.some(doc => doc.data().horario === horario);

if (ocupado) {
  alert('Este horário já está ocupado! Escolha outro.');
  return;
}

// Salva no Firestore
await db.collection('agendamentos').add({
  nome,
  telefone,
  servico,
  data,
  horario,
  criadoEm: firebase.firestore.FieldValue.serverTimestamp()
});

form.reset();
```

} catch (erro) {
alert(’Erro: ’ + erro.message);
}
});
