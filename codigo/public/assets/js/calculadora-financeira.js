const formulario = document.getElementById('formulario-financiamento');
const valorFinanciamentoInput = document.getElementById('valorFinanciamento');
const taxaJurosInput = document.getElementById('taxaJuros');
const tempoMesesInput = document.getElementById('tempoMeses');
const metodoAmortizacaoSelect = document.getElementById('metodoAmortizacao');
const parcelaValorSpan = document.querySelector('form span');
const dicasSection = document.getElementById('texto');
const topicosSection = document.getElementById('topicos');
const dicasImage = document.querySelector('#texto img');
const topicosImage = document.querySelector('#topicos img');

formulario.addEventListener('submit', (event) => {
  event.preventDefault();

  const valorFinanciamento = parseFloat(valorFinanciamentoInput.value);
  const taxaJuros = parseFloat(taxaJurosInput.value) / 100;
  const tempoMeses = parseInt(tempoMesesInput.value);
  const metodoAmortizacao = metodoAmortizacaoSelect.value;

  if(valorFinanciamento < 0 || taxaJuros < 0 || tempoMeses < 0){
    alert("Os valores não podem ser negativos.")
    return
  }

  let parcela;

  if (metodoAmortizacao === 'sac') {
    parcela = calcularParcelaSac(valorFinanciamento, taxaJuros, tempoMeses);
  } else if (metodoAmortizacao === 'price') {
    parcela = calcularParcelaPrice(valorFinanciamento, taxaJuros, tempoMeses);
  } else {
    console.error('Método de amortização inválido:', metodoAmortizacao);
    return;
  }

  parcelaValorSpan.textContent = `R$ ${parcela.toFixed(2)}`;
});

function calcularParcelaSac(valorFinanciamento, taxaJuros, tempoMeses) {
  return (valorFinanciamento / tempoMeses) + (valorFinanciamento * taxaJuros);
}

function calcularParcelaPrice(valorFinanciamento, taxaJuros, tempoMeses) {
  return (valorFinanciamento * taxaJuros) / (1 - Math.pow((1 + taxaJuros), -tempoMeses));
}

function toggleSections() {
  if (dicasSection.style.display === 'none') {
    dicasSection.style.display = 'block';
    topicosSection.style.display = 'none';
  } else {
    dicasSection.style.display = 'none';
    topicosSection.style.display = 'block';
  }
}

dicasImage.addEventListener('click', toggleSections);
topicosImage.addEventListener('click', toggleSections);

