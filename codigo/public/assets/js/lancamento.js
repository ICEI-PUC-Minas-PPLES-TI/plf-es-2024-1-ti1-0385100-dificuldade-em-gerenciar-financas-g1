import Api from '../../services/api.js'
const api = new Api()

import { Cookie } from "../../services/cookie.js"
const cookies = new Cookie()

import './lancamento.utils.js'

document.addEventListener('DOMContentLoaded', async () => {
    const categories = await api.getCategories()
    const methods = await api.getMethods()
    categories.splice(categories.indexOf(categories.find(method => method.id === 5)), 1)

    // Exibir a tabela por padrão
    carregaLancamentos()
    populateSelects(categories, methods)
})

async function carregaLancamentos() {
    try {
        const response = await api.getUserLaunches(cookies.getCookie('username'))
        const lancamentos = response.filter(lancamento => lancamento.categoriaId !== 5) // Excluir fixos
        const categorias = await api.getCategories()
        const metodos = await api.getMethods()
        const container = document.getElementById('lancamentos-card-container')
        container.innerHTML = '' // Limpar contêiner

        lancamentos.forEach(lancamento => {
            const card = document.createElement('div')
            card.className = 'card-lancamento'

            const data = document.createElement('h5')
            data.textContent = formatarData(lancamento.data)
            card.appendChild(data)

            const descricao = document.createElement('p')
            descricao.textContent = lancamento.descricao
            card.appendChild(descricao)

            const valor = document.createElement('p')
            valor.textContent = `R$ ${Math.abs(lancamento.valor).toFixed(2)}`
            valor.style.color = lancamento.valor > 0 ? 'green' : 'red'
            card.appendChild(valor)

            const categoria = document.createElement('p')
            categoria.textContent = categorias.find(categoria => categoria.id === lancamento.categoriaId).tipo
            card.appendChild(categoria)

            const metodo = document.createElement('p')
            metodo.textContent = metodos.find(metodo => metodo.id === lancamento.metodoId).tipo
            card.appendChild(metodo)
            
            const actions = document.createElement('div')
            actions.style.display = 'flex'
            actions.style.gap = '10px'

            const editBtn = document.createElement('button')
            editBtn.textContent = 'Editar'
            editBtn.className = 'btn btn-primary btn-sm launch-btn'
            editBtn.addEventListener('click', () => {
                editarLancamento(lancamento.id)
            })
            actions.appendChild(editBtn)

            const deleteBtn = document.createElement('button')
            deleteBtn.textContent = 'Excluir'
            deleteBtn.className = 'btn btn-danger btn-sm'
            deleteBtn.addEventListener('click', () => {
                excluirLancamento(lancamento.id)
            })
            actions.appendChild(deleteBtn)

            card.appendChild(actions)
            container.appendChild(card)
        })
    } catch (error) {
        console.error('Erro ao carregar lançamentos:', error)
    }
}

// Pega campos do forms
const data = document.getElementById('expense-date')
const description = document.getElementById('expense-description')
const amount = document.getElementById('expense-amount')
const category = document.getElementById('expense-category')
const method = document.getElementById('expense-method')

let editMode = false
let editId = null

const editarLancamento = async (id) => {
    try {
        const lancamento = await api.getLaunch(id)
        const form = document.getElementById('expenses-form')
        const submitButton = form.querySelector('button[type="submit"]')

        data.value = lancamento.data
        description.value = lancamento.descricao
        amount.value = lancamento.valor.toFixed(2)
        category.value = lancamento.categoriaId
        method.value = lancamento.metodoId

        // Mudar o nome do botão para "Atualizar"
        submitButton.textContent = 'Atualizar'

        editMode = true
        editId = id

    } catch (error) {
        console.error('Erro ao carregar o lançamento:', error)
    }
}

const populateSelects = (categories, methods) => {
    const categorySelect = document.getElementById('expense-category')
    const methodSelect = document.getElementById('expense-method')

    fillSelectWithOptions(categorySelect, categories)
    fillSelectWithOptions(methodSelect, methods)
}

function fillSelectWithOptions(selectElement, options) {
    options.forEach(option => {
        const optionElement = document.createElement('option')
        optionElement.value = option.id
        optionElement.textContent = option.tipo
        selectElement.appendChild(optionElement)
    })
}

document.getElementById('expenses-form').addEventListener('submit', async (e) => {
    e.preventDefault()

    const body = {
        clienteId: (await api.readClient(cookies.getCookie('username'))).id,
        data: document.getElementById('expense-date').value,
        descricao: document.getElementById('expense-description').value,
        valor: +document.getElementById('expense-amount').value,
        categoriaId: +document.getElementById('expense-category').value,
        metodoId: +document.getElementById('expense-method').value
    }

    try {
        let status
        if (editMode) {
            if(
                (data.value === '' || description.value === '' || amount.value === '' || !category.value || !method.value) ||
                (data.value === body.data || description.value === body.descricao || amount.value === body.valor || category.value === body.categoriaId || method.value === body.metodoId)
            ) return alert('Campos iguais ou vazios')
            status = await api.updateLaunch(body, editId)
        } else {
            status = await api.createLaunch(body)
        }

        if ((editMode && (status === 200 || status === 204)) || (!editMode && status === 201)) {
            alert(editMode ? 'Lançamento atualizado com sucesso!' : 'Transação cadastrada com sucesso!')
            window.location.reload()
        } else {
            alert('Erro ao processar a transação: ' + status)
        }
    } catch (error) {
        console.error('Erro ao processar a transação:', error)
    } finally {
        editMode = false
        editId = null
        document.getElementById('expenses-form').reset()
        document.querySelector('button[type="submit"]').textContent = 'Registrar'
    }
})

function formatarData(data) {
    const dataObj = new Date(data)
    return dataObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}