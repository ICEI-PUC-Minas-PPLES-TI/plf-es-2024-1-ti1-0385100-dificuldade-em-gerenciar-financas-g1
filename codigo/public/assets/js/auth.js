import Api from '../../services/api.js'
const api = new Api()

import {Cookie} from '../../services/cookie.js'
const cookies = new Cookie()

async function login(credential, password) {
    const clientes = await api.getAllClients()
    const cliente = clientes.find(cliente => cliente.email === credential || cliente.username === credential)
    if (!cliente) return alert("Usuário não encontrado")

    const body = {
        cliente: cliente,
        senha: password
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body),
        })

        if (response.ok) {
            cookies.setCookie('username', cliente.username)
            window.location.href = '/dashboard'
        } else {
            const errorData = await response.json()
            alert(`Erro: ${errorData.error}`)
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error)
        alert('Erro ao fazer login, tente novamente mais tarde.')
    }
}

function logout() {
    cookies.unsetCookie('username')
    window.location.href = '/login'
}

async function signin(username, name, password, email, budget) {
    var regex = /^(?=(?:.*?[A-Z]){1})(?=(?:.*?[0-9]){2})(?=(?:.*?[!@#$%*()_+^&}{:;?.]){1})(?!.*\s)[0-9a-zA-Z!@#$%;*(){}_+^&]*$/;

    if(!username || !name || !password || !email || !budget) return alert("Preencha todos os campos")
    if(password.length < 6) return alert("A senha deve ter no mínimo 6 caracteres")
    if(!regex.test(password)) return alert("A senha deve conter pelo menos 1 letra maiúscula, 2 números e 1 caractere especial")
    if(budget < 0 || isNaN(budget)) return alert("O salário deve ser um número não nulo")

    const clientes = await api.getAllClients()
    if (clientes.some(cliente => cliente.username === username || cliente.email === email)) return alert("Usuário já cadastrado")

    const body = {
        username: username,
        nome: name,
        email: email,
        salario: budget,
        senha: password
    }

    const status = await api.createClient(body)

    if (status === 201) {
        cookies.setCookie('username', username)
        window.location.href = '/dashboard'
    }
    else alert("Erro ao cadastrar usuário")
}

function isAuthenticated() {
    return cookies.getCookie('username') !== undefined
}


export {
    login,
    logout,
    signin,
    isAuthenticated
}