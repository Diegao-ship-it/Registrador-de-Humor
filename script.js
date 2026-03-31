console.log("SCRIPT CARREGOU");

const buttons = document.querySelectorAll('.botoes button');
const texto = document.getElementById('texto');
const historyContainer = document.getElementById('historyContainer');
const summaryContainer = document.getElementById('summaryContainer'); // container para o resumo

const messages = {
  feliz: "Que bom que você está feliz! 😄",
  triste: "Tudo bem se sentir triste. Respire fundo 😢",
  bravo: "Respire fundo e tente relaxar 😡",
  neutro: "Dia normal, aproveite o momento 😐",
  confiante: "Você está confiante, aproveite essa energia! 😎",
  ansioso: "Tente relaxar e focar no presente 😰",
  desmotivado: "Dia difícil, mas amanhã é outro dia 😔",
  cansado: "Hora de descansar um pouco 😴",
  relaxado: "Que bom que você está relaxado! 🤗",
  apaixonado: "O coração está cheio de alegria! 😍",
  desesperado: "Respire fundo, vai passar! 😭",
  aliviado: "Ufa! Que bom que isso passou 😅",
  pensativo: "Hora de refletir e organizar as ideias 🤔",
  nervoso: "Calma! Respire devagar 😬",
  grato: "Que bom reconhecer as coisas boas! 😇",
  brincalhao: "Hora de se divertir e rir um pouco 😜",
  indeciso: "Tente pensar com calma antes de decidir 😶",
  assustado: "Tudo vai ficar bem, respire fundo 😱"
};

const allHumors = [
  "😃 Feliz", "😢 Triste", "😡 Bravo", "😐 Neutro", "😎 Confiante",
  "😰 Ansioso", "😔 Desmotivado", "😴 Cansado", "🤗 Relaxado", "😍 Apaixonado",
  "😭 Desesperado", "😅 Aliviado", "🤔 Pensativo", "😬 Nervoso", "😇 Grato",
  "😜 Brincalhão", "😶 Indeciso", "😱 Assustado"
];

// Mapa humor -> cor do gráfico
const humorColors = {
  "😃 Feliz": "#FF6384",
  "😢 Triste": "#36A2EB",
  "😡 Bravo": "#FFCE56",
  "😐 Neutro": "#9CCC65",
  "😎 Confiante": "#FF9F40",
  "😰 Ansioso": "#4BC0C0",
  "😔 Desmotivado": "#9966FF",
  "😴 Cansado": "#FF6384",
  "🤗 Relaxado": "#36A2EB",
  "😍 Apaixonado": "#FFCE56",
  "😭 Desesperado": "#9CCC65",
  "😅 Aliviado": "#FF9F40",
  "🤔 Pensativo": "#4BC0C0",
  "😬 Nervoso": "#9966FF",
  "😇 Grato": "#FF6384",
  "😜 Brincalhão": "#36A2EB",
  "😶 Indeciso": "#FFCE56",
  "😱 Assustado": "#9CCC65"
};

// Mapa humor -> cor do fundo da página
const backgroundColors = {
  "😃 Feliz": "#FFF0F0",
  "😢 Triste": "#E0F0FF",
  "😡 Bravo": "#FFE0E0",
  "😐 Neutro": "#F0F0F0",
  "😎 Confiante": "#FFF8E0",
  "😰 Ansioso": "#E0EFFF",
  "😔 Desmotivado": "#F0E0F8",
  "😴 Cansado": "#E0E0FF",
  "🤗 Relaxado": "#E0FFE0",
  "😍 Apaixonado": "#FFE0F0",
  "😭 Desesperado": "#D0E0FF",
  "😅 Aliviado": "#FFF8D0",
  "🤔 Pensativo": "#F0F8FF",
  "😬 Nervoso": "#FFE8E0",
  "😇 Grato": "#F0FFF0",
  "😜 Brincalhão": "#FFF0E0",
  "😶 Indeciso": "#F8F8F8",
  "😱 Assustado": "#FFD0D0"
};

let history = JSON.parse(localStorage.getItem('humorHistory')) || [];

// Renderiza histórico
function renderHistory() {
  historyContainer.innerHTML = '';
  const grouped = {};

  history.forEach(entry => {
    if (!grouped[entry.date]) grouped[entry.date] = [];
    grouped[entry.date].push(entry);
  });

  for (let date in grouped) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day-history');

    const dayTitle = document.createElement('h3');
    dayTitle.textContent = date;
    dayDiv.appendChild(dayTitle);

    const ul = document.createElement('ul');
    grouped[date].forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.time} - ${entry.humor}`;
      ul.appendChild(li);
    });

    dayDiv.appendChild(ul);
    historyContainer.appendChild(dayDiv);
  }
}

// Atualiza cor de fundo
function updateBackground(humor) {
  const color = backgroundColors[humor] || "#FFFFFF";
  document.body.style.backgroundColor = color;
}

// Adiciona humor
function addHumor(humor, displayText) {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  history.push({ date, time, humor: displayText.trim() });
  localStorage.setItem('humorHistory', JSON.stringify(history));

  texto.textContent = messages[humor];
  renderHistory();
  renderChart();
  renderSummary();
  updateBackground(displayText.trim()); // atualiza cor do fundo
}

// Eventos dos botões
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const humor = button.dataset.humor;
    const displayText = button.textContent;
    addHumor(humor, displayText);
  });
});

renderHistory();

// Renderiza gráfico
function renderChart() {
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 6);

  const filtered = history.filter(h => new Date(h.date) >= last7Days);

  const counts = {};
  allHumors.forEach(h => counts[h] = 0);

  filtered.forEach(entry => {
    if (counts[entry.humor] !== undefined) counts[entry.humor]++;
  });

  const labels = Object.keys(counts);
  const data = Object.values(counts);
  const bgColors = labels.map(label => humorColors[label] || "#000");

  if (window.humorChartInstance) {
    window.humorChartInstance.data.labels = labels;
    window.humorChartInstance.data.datasets[0].data = data;
    window.humorChartInstance.data.datasets[0].backgroundColor = bgColors;
    window.humorChartInstance.data.datasets[0].borderColor = bgColors;
    window.humorChartInstance.update();
    return;
  }

  const ctx = document.getElementById('humorChart').getContext('2d');
  window.humorChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Quantidade de vezes',
        data: data,
        backgroundColor: bgColors,
        borderColor: bgColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, precision: 0 } }
    }
  });
}

// Renderiza resumo do estado emocional
function renderSummary() {
  if (!summaryContainer) return;

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 6);

  const recentEntries = history.filter(h => new Date(h.date) >= last7Days);
  const counts = {};
  recentEntries.forEach(entry => { counts[entry.humor] = (counts[entry.humor] || 0) + 1; });

  const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);

  let summary = "Nos últimos 7 dias, a pessoa esteve principalmente ";
  if (sorted.length > 0) {
    summary += sorted[0][0];
    if (sorted.length > 1) {
      summary += ", mas também apresentou humores como " + sorted.slice(1,4).map(s => s[0]).join(", ");
    }
    // Atualiza cor de fundo pelo último humor registrado
    updateBackground(sorted[0][0]);
  } else {
    summary = "Não há registros recentes.";
  }

  summaryContainer.textContent = summary;
}

renderChart();
renderSummary();