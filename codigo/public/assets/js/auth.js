import Api from '../../services/api.js'
const api = new Api()

import {Cookie} from '../../services/cookie.js'
const cookies = new Cookie()

async function login(credential, password) {
    const clientes = await api.getAllClients()
    const cliente = clientes.find(cliente => cliente.email === credential || cliente.username === credential)
    if(!cliente) return alert("Usuário não encontrado")

    if(cliente.senha === password){
        cookies.setCookie('username', credential)
        window.location.href = '/dashboard'
    }
    else return alert("Senha inválida")
}

function logout() {
    cookies.unsetCookie('username')
    window.location.href = '/login'
}

async function signin(username, name, password, email, budget) {
    var regex = /^(?=(?:.*?[A-Z]){1})(?=(?:.*?[0-9]){2})(?=(?:.*?[!@#$%*()_+^&}{:;?.]){1})(?!.*\s)[0-9a-zA-Z!@#$%;*(){}_+^&]*$/;

    if(!username || !name || !password || !email || !budget) return alert("Preencha todos os campos")
    if(password.length < 8) return alert("A senha deve ter no mínimo 8 caracteres")
    if(!regex.test(password)) return alert("A senha deve conter pelo menos 1 letra maiúscula, 2 números e 1 caractere especial")
    if(budget < 0 || isNaN(budget)) return alert("O salário deve ser um número não nulo")

    const clientes = await api.getAllClients()
    console.log(clientes)
    if (clientes.some(cliente => cliente.username === username || cliente.email === email)) return alert("Usuário já cadastrado")

    const body = {
        "username": username,
        "nome": name,
        "email": email,
        "senha": password,
        "salario": budget
    }

    const status = await api.createClient(body);

    if (status === "Created") {
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