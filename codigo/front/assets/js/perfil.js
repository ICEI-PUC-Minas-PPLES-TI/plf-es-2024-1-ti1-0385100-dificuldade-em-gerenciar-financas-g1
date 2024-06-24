import Api from "/services/api.js"
const api = new Api()

import { Cookie } from "/services/cookie.js"
const cookies = new Cookie()

document.addEventListener('DOMContentLoaded', async () => {
    const cliente = await api.readClient(cookies.getCookie('username'))
    carregaCLiente(cliente)

    const editBtn = document.getElementById('edit-btn')
    const form = document.getElementById('client-form')
    let actions;

    editBtn.addEventListener('click', (event) => {
        event.preventDefault()

        // Ativar os campos do formulário
        form.elements['name'].disabled = false
        form.elements['email'].disabled = false
        form.elements['salary'].disabled = false
        form.elements['password'].disabled = false
        form.elements['password'].required = true
        form.elements['password'].value = ''

        // Desabilitar o botão de edição
        editBtn.disabled = true;

        if (!actions) {
            carregaCLiente(cliente);

            actions = document.createElement('div')
            actions.className = 'actions'
            actions.style.display = 'flex'
            actions.style.justifyContent = 'space-evenly'
            actions.style.alignItems = 'center'

            form.appendChild(actions)


            const saveBtn = document.createElement('button')
            saveBtn.type = 'submit'
            saveBtn.className = 'btn btn-save'
            saveBtn.textContent = 'Salvar'

            const cancelBtn = document.createElement('button')
            cancelBtn.type = 'button'
            cancelBtn.className = 'btn btn-cancel'
            cancelBtn.textContent = 'Cancelar'

            const deleteBtn = document.createElement('button')
            deleteBtn.type = 'button'
            deleteBtn.className = 'btn btn-delete'
            deleteBtn.textContent = 'Excluir Perfil'

            // Adicionar os botões ao formulário
            actions.appendChild(cancelBtn)
            actions.appendChild(deleteBtn)
            actions.appendChild(saveBtn)

            // Adicionar eventos aos botões
            cancelBtn.addEventListener('click', () => {

                // Desabilitar os campos
                form.elements['name'].disabled = true
                form.elements['email'].disabled = true
                form.elements['salary'].disabled = true
                form.elements['password'].disabled = true
                form.elements['password'].value = '*******'

                // Habilitar o botão de edição
                editBtn.disabled = false

                // Remover os botões
                actions.removeChild(saveBtn)
                actions.removeChild(cancelBtn)
                actions.removeChild(deleteBtn)
                form.removeChild(actions)

                // Limpar a referência dos botões
                actions = null
            })

            deleteBtn.addEventListener('click', () => 
                deletaCliente(cliente.id)
            )

            form.addEventListener('submit', async () => {
                const formData = new FormData(form)
                const budget = parseFloat(formData.get('salary').replace('$', ''))
                if(budget < 0 || isNaN(budget)) return alert('Salário deve ser um número não nulo')

                const body = {
                    nome: formData.get('name') || cliente.nome,
                    email: formData.get('email') || cliente.email,
                    salario: budget || cliente.salario
                };

                if(cliente.senha !== formData.get('password'))
                    return alert('Senha incorreta')

                try {
                    const status = await api.updateClient(body, cliente.id)
                    console.log('Cliente atualizado com sucesso ', status)

                    if (status === 200 || status === 201) {
                        alert('Cliente atualizado com sucesso')
                    } else {
                        return alert('Erro ao atualizar o cliente')
                    }

                    // Desabilitar os campos do formulário após a edição
                    form.elements['name'].disabled = true
                    form.elements['email'].disabled = true
                    form.elements['salary'].disabled = true
                    form.elements['password'].disabled = true
                    form.elements['password'].value = '*******'

                    // Ativar o botão de edição novamente
                    editBtn.disabled = false

                    // Remover o botão "Salvar"
                    actions.removeChild(saveBtn)
                    actions.removeChild(deleteBtn)
                    actions.removeChild(cancelBtn)
                    form.removeChild(actions)

                    // Limpar a referência dos botões
                    actions = null
                } catch (error) {
                    console.error('Erro ao atualizar o cliente:', error)
                }
            })
        }
    })
})

const carregaCLiente = (cliente) => {
    try {
        document.getElementById('name').value = cliente.nome
        document.getElementById('email').value = cliente.email
        document.getElementById('salary').value = cliente.salario.toFixed(2)
        document.getElementById('user-name').textContent = cliente.username
    
    } catch (error) {
        console.error('Erro ao carregar as informações do cliente:', error)
    }
}

const deletaCliente = async (id) => {
    const confirmacao = confirm('Tem certeza que deseja deletar o cliente?')
    if (confirmacao) {
        try {
            const status = await api.deleteClient(id)
            if (status === 200 || status === 204) {
                console.log('Cliente deletado com sucesso ', status)
                cookies.unsetCookie('username')
                window.location.href = '/'
            }
        } catch (error) {
            throw new Error('Erro ao deletar o cliente: ', error)
        }
    }
}