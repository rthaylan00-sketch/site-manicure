const form = document.getElementById('form-agendamento');

// Bloqueia domingos no calendário
const campoData = document.getElementById('data');

campoData.addEventListener('change', function() {
  const dataSelecionada = new Date(this.value + 'T00:00:00');
  const diaSemana = dataSelecionada.getDay();

  if (diaSemana === 0) {
    alert('Domingos não há atendimento! Por favor escolha outro dia.');
    this.value = '';
  }
});

// Define data mínima como hoje
const hoje = new Date().toISOString().split('T')[0];
campoData.setAttribute('min', hoje);

form.addEventListener('submit', function(e) {
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

  const mensagem = `Olá Luiza! Gostaria de agendar:
💅 Serviço: ${servico}
📅 Data: ${data}
⏰ Horário: ${horario}
👤 Nome: ${nome}
📱 Telefone: ${telefone}`;

  const numero = '5511973086170';
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
});
