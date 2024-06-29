import config from '../../services/config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const apiKey = config.FMP_API_KEY;
    const apiUrl = `https://financialmodelingprep.com/api/v3/stock/actives?apikey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Erro ao buscar dados das ações');
        }
        const data = await response.json();
        console.log(data);
        const top10Stocks = data.mostActiveStock.splice(0, 10);

        // Renderizar informações das ações
        renderStocksInfo(top10Stocks);

        // Configurações do gráfico
        const labels = top10Stocks.map(stock => stock.ticker);
        const datasets = [{
            label: 'Rendimento',
            data: top10Stocks.map(stock => stock.changesPercentage),
            fill: false,
            borderColor: '#5500ff',
            lineTension: 0.1
        }];

        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        fontSize: 26,
                        text: 'Rendimento das Ações'
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Ações'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Rendimento (%)'
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error('Erro ao carregar dados das ações:', error);
    }
});

function renderStocksInfo(stocks) {
    const acoesList = document.getElementById('acoes-list');

    stocks.forEach(stock => {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');

        card.innerHTML = `
            <div class="card-header">
                <h5 class="card-title" title=${stock.companyName}>${stock.ticker}</h5>
            </div>
            <div class="card-body">
                <p class="card-text">Preço: $<span style="color: darkgoldenrod">${stock.price}</span></p>
                <p class="card-text">Rendimento: <span style="color: ${stock.changesPercentage > 0 ? 'green' : 'red'}">${stock.changesPercentage}</span></p>
            </div>
        `;

        acoesList.appendChild(card);
    });
}
