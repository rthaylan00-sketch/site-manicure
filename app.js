window.addEventListener('DOMContentLoaded', function () {

  // ===== FIREBASE =====
  const firebaseConfig = {
    apiKey: "AIzaSyCeQD2PNlXf2j8lTbit6ktOZR2FtAufLbY",
    authDomain: "agendapro-788d0.firebaseapp.com",
    databaseURL: "https://agendapro-788d0-default-rtdb.firebaseio.com",
    projectId: "agendapro-788d0",
    storageBucket: "agendapro-788d0.firebasestorage.app",
    messagingSenderId: "627296929583",
    appId: "1:627296929583:web:cfabd5e29ef204471a43da",
    measurementId: "G-98ZM1P83QX"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.firestore();

  const campoData = document.getElementById('data');
  const selectHorario = document.getElementById('horario');

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

  async function bloquearHorarios(dataSelecionada) {
    try {
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
    } catch (erro) {
      console.error('Erro ao buscar horários:', erro);
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

  async function confirmarAgendamento() {
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
      await db.collection('agendamentos').add({
        nome,
        telefone,
        servico,
        data,
        horario,
        criadoEm: firebase.firestore.FieldValue.serverTimestamp()
      });

      const dataFormatada = formatarDataBR(data);
      const mensagem = `Olá! Gostaria de confirmar meu agendamento:%0A%0A👤 ${nome}%0A📱 ${telefone}%0A✂️ ${servico}%0A📅 ${dataFormatada}%0A🕐 ${horario}`;
      const url = `https://wa.me/5511973086170?text=${mensagem}`;
      window.open(url, "_blank");

    } catch (erro) {
      alert('Erro ao salvar: ' + erro.message);
    }
  }

  document.getElementById('btnAgendar').addEventListener('click', confirmarAgendamento);

});
