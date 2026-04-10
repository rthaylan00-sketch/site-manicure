window.addEventListener('DOMContentLoaded', function () {

  const campoData = document.getElementById('data');
  const selectHorario = document.getElementById('horario');

  if (campoData) {
    const hoje = new Date();
    const hojeFormatado = hoje.getFullYear() + '-' +
      String(hoje.getMonth() + 1).padStart(2, '0') + '-' +
      String(hoje.getDate()).padStart(2, '0');

    campoData.setAttribute('min', hojeFormatado);

    campoData.addEventListener('change', function () {
      const dataSelecionada = this.value;
      const partes = dataSelecionada.split('-');
      const dataObj = new Date(partes[0], partes[1] - 1, partes[2]);
      const diaSemana = dataObj.getDay();

      if (diaSemana === 0) {
        alert('Domingos não há atendimento!');
        this.value = '';
      }
    });
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

    const dataFormatada = formatarDataBR(data);
    const mensagem = `Olá! Gostaria de confirmar meu agendamento:%0A%0A👤 ${nome}%0A📱 ${telefone}%0A✂️ ${servico}%0A📅 ${dataFormatada}%0A🕐 ${horario}`;
    const url = `https://wa.me/5511973086170?text=${mensagem}`;
    window.open(url, "_blank");
  }

  document.getElementById('btnAgendar').addEventListener('click', confirmarAgendamento);

});
