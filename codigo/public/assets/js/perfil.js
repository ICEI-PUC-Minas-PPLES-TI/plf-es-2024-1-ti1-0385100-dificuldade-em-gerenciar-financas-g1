import Api from "../../services/api.js"
const api = new Api()

import { Cookie } from "../../services/cookie.js"
const cookies = new Cookie()

import './lancamento.utils.js'

document.addEventListener('DOMContentLoaded', async () => {
    const cliente = await api.readClient(cookies.getCookie('username'))
    carregaCliente(cliente)
    carregaLancamentos(cliente.id)

    const editBtn = document.getElementById('edit-btn')
    const form = document.getElementById('client-form')
    const tabela = document.getElementById('fixos')
    const fixos_title = document.getElementById('fixos-title')
    let actions

    document.getElementById('btnDialog').addEventListener('click', () => criaLancamento(cliente.id))
    document.getElementById('close-add-btn').addEventListener('click', () => closeDialog('dialog-add-fixos'))
    document.getElementById('close-edit-btn').addEventListener('click', () => closeDialog('dialog-edit-fixos'))

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
        editBtn.disabled = true

        if (!actions) {
            carregaCliente(cliente)

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

            // Esconder a tabela se a largura da janela for inferior a 700px
            if (window.innerWidth < 700) {
                tabela.style.display = 'none'
            }

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

            form.addEventListener('submit', async (event) => {
                event.preventDefault()

                const formData = new FormData(form)
                const budget = parseFloat(formData.get('salary').replace('$', ''))
                if (budget < 0 || isNaN(budget)) return alert('Salário deve ser um número não nulo')

                const body = {
                    nome: formData.get('name') || cliente.nome,
                    email: formData.get('email') || cliente.email,
                    salario: budget || cliente.salario
                }

                if (cliente.senha !== formData.get('password')) {
                    return alert('Senha incorreta')
                }

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

const carregaCliente = (cliente) => {
    try {
        document.getElementById('name').value = cliente.nome
        document.getElementById('email').value = cliente.email
        document.getElementById('salary').value = cliente.salario.toFixed(2)
        document.getElementById('user-name').textContent = cliente.username
    } catch (error) {
        console.error('Erro ao carregar as informações do cliente:', error)
    }
}

const carregaLancamentos = async () => {
    try {
        const response = await api.getUserLaunches(cookies.getCookie('username'))
        const lancamentos = response.filter(lancamento => lancamento.categoriaId === 5)
        const tabela = document.getElementById('fixos').getElementsByTagName('tbody')[0]
        tabela.innerHTML = '' // Limpar tabela

        lancamentos.forEach(lancamento => {
            const linha = tabela.insertRow()
            linha.insertCell(0).textContent = lancamento.descricao
            linha.insertCell(1).textContent = `R$ ${Math.abs(lancamento.valor).toFixed(2)}`
            linha.cells[1].style.color = lancamento.valor > 0 ? 'green' : 'red'

            const acoesCell = linha.insertCell(2)
            acoesCell.style.display = 'flex'
            acoesCell.style.flexWrap = 'wrap'
            acoesCell.style.gap = '10px'

            const editBtn = document.createElement('button')
            editBtn.textContent = 'Editar'
            editBtn.className = 'btn btn-primary btn-sm launch-btn'
            editBtn.addEventListener('click', () => {
                editarLancamento(lancamento.id)
            })

            const deleteBtn = document.createElement('button')
            deleteBtn.textContent = 'Excluir'
            deleteBtn.className = 'btn btn-danger btn-sm'
            deleteBtn.addEventListener('click', () => {
                excluirLancamento(lancamento.id)
            })

            acoesCell.appendChild(editBtn)
            acoesCell.appendChild(deleteBtn)
        })
    } catch (error) {
        console.error('Erro ao carregar os lançamentos fixos:', error)
    }
}

const criaLancamento = (clientId) => {
    showDialog('dialog-add-fixos')
    const form = document.getElementById('novo-lancamento-form')

    // Remover qualquer evento de submissão existente para evitar múltiplos manipuladores
    form.removeEventListener('submit', form.onsubmit)

    form.onsubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData(form)

        const lancamento = {
            clienteId: clientId,
            descricao: formData.get('descricao-add'),
            data: new Date().toISOString().split('T')[0],
            valor: parseFloat(formData.get('valor-add')),
            categoriaId: 5
        }

        try {
            const status = await api.createLaunch(lancamento, clientId)
            if (status === 201) {
                window.location.reload()
                closeDialog('dialog-add-fixos')
                form.reset()
            } else {
                alert('Erro ao adicionar lançamento fixo')
            }
        } catch (error) {
            console.error('Erro ao adicionar lançamento fixo:', error)
        }
    }
}

const editarLancamento = async (id) => {
    try {
        showDialog('dialog-edit-fixos')
        const lancamento = await api.getLaunch(id)
        const form = document.getElementById('edita-lancamento-form')

        document.getElementById('descricao-edit').value = lancamento.descricao
        document.getElementById('valor-edit').value = lancamento.valor.toFixed(2)

        form.addEventListener('submit', async (event) => {
            event.preventDefault()

            const formData = new FormData(event.target)

            if(lancamento.descricao === formData.get('descricao-edit') || lancamento.valor === +formData.get('valor-edit'))
                return closeDialog('dialog-edit-fixos')

            lancamento.descricao = formData.get('descricao-edit')
            lancamento.valor = +formData.get('valor-edit')

            try {
                const status = await api.updateLaunch(lancamento, id)
                if (status === 200 || status === 204) {
                    alert('Lançamento fixo atualizado com sucesso!')
                    window.location.reload()

                    closeDialog('dialog-edit-fixos')
                    form.reset()
                } else {
                    alert('Erro ao atualizar o lançamento fixo')
                }
            } catch (error) {
                console.error('Erro ao atualizar o lançamento fixo:', error)
            }
        })
    } catch (error) {
        console.error('Erro ao carregar o lançamento:', error)
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
            console.error('Erro ao deletar o cliente: ', error)
        }
    }
}

function closeDialog(dialogId) {
    const dialog = document.getElementById(dialogId)
    if (dialog) {
        dialog.close()
    }
}

const showDialog = (dialogId) => {
    const dialog = document.getElementById(dialogId)
    if (dialog) {
        dialog.showModal()
    }
}