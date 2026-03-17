// Pega o formulário pelo id
const form = document.getElementById('form-agendamento');

// Quando clicar em confirmar...
form.addEventListener('submit', function(e) {
  e.preventDefault(); // impede a página de recarregar

  // Pega o que foi digitado em cada campo
  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const servico = document.getElementById('servico').value;
  const data = document.getElementById('data').value;
  const horario = document.getElementById('horario').value;

  // Verifica se todos os campos foram preenchidos
  if (!nome || !telefone || !servico || !data || !horario) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  // Monta a mensagem
  const mensagem = `Olá Luiza! Gostaria de agendar:
💅 Serviço: ${servico}
📅 Data: ${data}
⏰ Horário: ${horario}
👤 Nome: ${nome}
📱 Telefone: ${telefone}`;

  // Número do WhatsApp da Luiza (substitui pelo número real)
  const numero = '+5511973086170';

  // Abre o WhatsApp
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;


  window.open(url, '_blank');
});

