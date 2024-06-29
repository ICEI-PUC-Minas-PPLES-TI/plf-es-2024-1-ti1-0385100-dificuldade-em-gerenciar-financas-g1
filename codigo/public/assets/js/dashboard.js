import Api from '../../services/api.js'
const api = new Api()

import {Cookie} from '../../services/cookie.js'
const cookies = new Cookie()

document.addEventListener("DOMContentLoaded", () => {
    const balance = document.getElementById('balance')

    showBalance(balance)
    drawCategoryExpensesLineChart()

    document.querySelector('.card-button').addEventListener('click', () => {
        const hiddenBalance = document.getElementById('hidden-balance')
        const eyeOpen = document.getElementById('eye-open')
        const eyeClosed = document.getElementById('eye-closed')

        if (balance.classList.contains('visible-balance')) {
            balance.classList.remove('visible-balance')
            balance.classList.add('hidden-balance')
            hiddenBalance.classList.remove('hidden-balance')
            hiddenBalance.classList.add('visible-balance')
            eyeOpen.classList.add('hidden-balance')
            eyeClosed.classList.remove('hidden-balance')
        } else {
            balance.classList.add('visible-balance')
            balance.classList.remove('hidden-balance')
            hiddenBalance.classList.add('hidden-balance')
            hiddenBalance.classList.remove('visible-balance')
            eyeOpen.classList.remove('hidden-balance')
            eyeClosed.classList.add('hidden-balance')
        }
    })
})

const showBalance = async (balance) => {
    const user = await api.readClient(cookies.getCookie('username'))
    const launches = await api.getUserLaunches(user.username)
    let sum = 0

    for(const launch of launches) {
        sum += launch.valor
    }

    sum += user.salario

    balance.innerText = `R$ ${sum.toFixed(2)}`
}

const drawCategoryExpensesLineChart = async () => {
    const username = cookies.getCookie('username');

    // Obter dados
    const userLaunches = await api.getUserLaunches(username);
    const categories = await api.getCategories();

    // Processar dados
    const categoryData = {};
    userLaunches.forEach(launch => {
        const category = categories.find(cat => cat.id === launch.categoriaId);
        if (!categoryData[category.tipo]) {
            categoryData[category.tipo] = [];
        }
        categoryData[category.tipo].push({ date: launch.data, value: launch.valor });
    });

    // Organizar dados para o gráfico
    const datasets = [];
    const colorPalette = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    let colorIndex = 0;

    for (const [category, values] of Object.entries(categoryData)) {
        const sortedValues = values.sort((a, b) => new Date(a.date) - new Date(b.date));
        datasets.push({
            label: category,
            data: sortedValues.map(v => v.value),
            fill: false,
            borderColor: colorPalette[colorIndex % colorPalette.length],
            backgroundColor: colorPalette[colorIndex % colorPalette.length],
            yAxisID: 'y' + colorIndex,
        });
        colorIndex++;
    }

    // Labels do gráfico (datas)
    const labels = [...new Set(userLaunches.map(launch => launch.data))].sort();

    // Configurar e criar o gráfico
    const ctx = document.getElementById('categoryExpensesLineChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                y0: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                }
                // Adicione mais eixos 'y' conforme necessário
            }
        }
    });
};