function removerGasto(botao) {
    const row = botao.parentNode.parentNode; // Obtém a linha da tabela
    row.remove(); // Remove a linha da tabela
}

document.addEventListener("DOMContentLoaded", function () {
    initializeBalance();
    handleFixedExpenses();
    hamburguer();
});

function hamburguer() {
    const hamBurger = document.querySelector(".toggle-btn");

    hamBurger.addEventListener("click", function () {
        document.querySelector("#sidebar").classList.toggle("expand");
    });
}

function initializeBalance() {
    // Selecionar elementos
    const toggleBalanceButton = document.getElementById("toggle-balance");
    const balanceValue = document.getElementById("balance-value");
    const toggleIcon = document.getElementById("toggle-icon");

    const savedVisibility = localStorage.getItem("balanceVisibility");

    if (savedVisibility === "hidden") {
        balanceValue.style.display = "none";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        balanceValue.style.display = "block";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }

    // Ocultar/Exibir saldo
    toggleBalanceButton.addEventListener("click", function () {
        if (balanceValue.style.display === "none") {
            balanceValue.style.display = "block";
            toggleIcon.classList.remove("fa-eye-slash");
            toggleIcon.classList.add("fa-eye");
        } else {
            balanceValue.style.display = "none";
            toggleIcon.classList.remove("fa-eye");
            toggleIcon.classList.add("fa-eye-slash");
        }
    });
}

function handleFixedExpenses() {
    const saldoElemento = document.getElementById('balance-value');
    const listaGastosFixos = document.getElementById('fixed-expenses-list');
    const formularioGastosFixos = document.getElementById('fixed-expenses-form');

    let saldoAtual = parseFloat(saldoElemento.getAttribute('data-balance').replace(',', ''));

    const atualizarSaldoExibicao = () => {
        const saldoFormatado = saldoAtual.toFixed(2).replace('.', ',');
        saldoElemento.textContent = `R$ ${saldoFormatado}`;
        saldoElemento.setAttribute('data-balance', saldoAtual.toFixed(2));
    };

    const atualizarSaldo = (valor) => {
        saldoAtual -= valor;
        atualizarSaldoExibicao();
    };

    formularioGastosFixos.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const nomeGasto = document.getElementById('expense-name').value.trim();
        const valorGasto = parseFloat(document.getElementById('expense-amount').value);

        if (nomeGasto && !isNaN(valorGasto) && valorGasto > 0) {
            const novoItemLista = `
                <li>${nomeGasto}: R$ ${valorGasto.toFixed(2).replace('.', ',')}
                    <button class="btn btn-danger btn-sm ms-2" onclick="removerGasto(this)">Remover</button>
                </li>`;

            listaGastosFixos.innerHTML += novoItemLista;

            atualizarSaldo(valorGasto);

            document.getElementById('expense-name').value = '';
            document.getElementById('expense-amount').value = '';
        } else {
            alert('Por favor, preencha todos os campos com valores válidos.');
        }
    });

    atualizarSaldoExibicao();
}

document.addEventListener('DOMContentLoaded', () => {
    //formulário de gastos
    const expensesForm = document.getElementById('expenses-form');
    const expensesTableBody = document.getElementById('expenses-table').querySelector('tbody');

    expensesForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const date = document.getElementById('expense-date').value;
        const description = document.getElementById('expense-description').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const method = document.getElementById('expense-method').value;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${date}</td>
            <td>${description}</td>
            <td>R$${amount.toFixed(2)}</td>
            <td>${category}</td>
            <td>${method}</td>
            <td><button class="btn btn-danger btn-sm remove-btn" onclick="removerGasto(this)">Remover</button></td>
        `;
        expensesTableBody.appendChild(row);

        // Chamar a função para atualizar o saldo
        updateBalance('expense');
    });

    // Formulário de receitas
    const incomeForm = document.getElementById('income-form');
    const incomeTableBody = document.getElementById('income-table').querySelector('tbody');

    incomeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const date = document.getElementById('income-date').value;
        const description = document.getElementById('income-description').value;
        const amount = parseFloat(document.getElementById('income-amount').value);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${date}</td>
            <td>${description}</td>
            <td>R$${amount.toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm remove-btn" onclick="removerGasto(this)">Remover</button></td>
        `;
        incomeTableBody.appendChild(row);

        // Chamar a função para atualizar o saldo
        updateBalance('income');
    });
});

function updateBalance(type) {
    // Update do localstorage conforme os itens gerados
    const balanceElement = document.getElementById('balance-value');
    let currentBalance = parseFloat(balanceElement.getAttribute('data-balance').replace(',', ''));
    const amount = parseFloat(document.getElementById(type + '-amount').value);
    const newBalance = type === 'expense' ? currentBalance - amount : currentBalance + amount;
    const oldBalance = localStorage.getItem('previousBalance');
    const previousBalance = oldBalance ? parseFloat(oldBalance) : 0;
    const totalBalance = previousBalance + newBalance;
    balanceElement.textContent = `R$ ${newBalance.toFixed(2).replace('.', ',')}`;
    balanceElement.setAttribute('data-balance', newBalance.toFixed(2));
    localStorage.setItem('previousBalance', totalBalance.toFixed(2));
    localStorage.setItem('balanceValue', newBalance.toFixed(2));
}
