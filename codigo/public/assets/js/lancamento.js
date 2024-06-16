import Api from '../../services/api.js'
const api = new Api()

import { Cookie } from "../../services/cookie.js"
const cookies = new Cookie()

document.addEventListener('DOMContentLoaded', async () => {
    const categories = await api.getCategories()
    const methods = await api.getMethods()
    
    populateSelects(categories, methods)

    document.getElementById('expenses-form').addEventListener('submit', async (e) => {
        e.preventDefault()

        const body = {
            clienteId: (await api.readClient(cookies.getCookie('username'))).id,
            data: document.getElementById('expense-date').value,
            descricao: document.getElementById('expense-description').value,
            valor: +document.getElementById('expense-amount').value,
            metodoId: +document.getElementById('expense-method').value,
            categoriaId: +document.getElementById('expense-category').value
        }

        console.log(body)

        //const res = await api.createLaunch(data)

        // if (res.status === 201) {
        //     alert('Transação cadastrada com sucesso!')
        //     window.location.href = '/dashboard'
        // }
    })
})

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
