import Api from '../../services/api.js'
const api = new Api()

async function login(formData) {
    const clientes = await api.getAllClients()
    const cliente = clientes.find(cliente => cliente.email === formData.credential || cliente.username === formData.credential)
    if(!cliente) return alert("Usuário não encontrado")
    
    if(cliente.password === formData.password){
        
    }
    else return alert("Senha inválida")
}

function logout() {
    localStorage.removeItem('username')
    window.location.href = '/'
}

async function signin(username, name, password, email, budget) {
    var regex = /^(?=(?:.*?[A-Z]){1})(?=(?:.*?[0-9]){2})(?=(?:.*?[!@#$%*()_+^&}{:;?.]){1})(?!.*\s)[0-9a-zA-Z!@#$%;*(){}_+^&]*$/;

    if(!username || !name || !password || !email || !budget) return alert("Preencha todos os campos")
    if(password.length < 8) return alert("A senha deve ter no mínimo 8 caracteres")
    if(!regex.test(password)) return alert("A senha deve conter pelo menos 1 letra maiúscula, 2 números e 1 caractere especial")
    if(budget < 0) return alert("O salário não pode ser negativo")

    const clientes = await api.getAllClients()
    console.log(clientes)
    if (clientes.some(cliente => cliente.username === username || cliente.email === email)) return alert("Usuário já cadastrado")

    const body = {
        "username": username,
        "nome": name,
        "email": email,
        "senha": password,
        "salario": budget,
        "fixos": [],
        "lancamentos": []
    }

    const status = await api.createClient(body);

    if (status === "Created") {
        localStorage.setItem('username', username)
        window.location.href = '/dashboard'
    }
    else alert("Erro ao cadastrar usuário")
}

function isAuthenticated() {
    return localStorage.getItem('username') !== null
}


export {
    login,
    logout,
    signin,
    isAuthenticated
}