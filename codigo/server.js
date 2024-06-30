/* Trabalho Interdisciplinar 1 - Aplicações Web

  Esse módulo implementa uma API RESTful baseada no JSONServer
  O servidor JSONServer fica hospedado na seguinte URL
  https://jsonserver.rommelpuc.repl.co/contatos

  Para montar um servidor para o seu projeto, acesse o projeto 
  do JSONServer no Replit, faça o FORK do projeto e altere o 
  arquivo db.json para incluir os dados do seu projeto.

  URL Projeto JSONServer: https://replit.com/@rommelpuc/JSONServer

  Autor: Rommel Vieira Carneiro
  Data: 03/10/2023

*/

const express = require('express');
const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const fs = require('fs');
// const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const routerPath = path.join(__dirname, 'public', 'assets', 'data', 'db.json');
const router = jsonServer.router(routerPath);
const middlewares = jsonServer.defaults();

app.use(cors());
app.use(express.json());
app.use(middlewares);

// Usar o router do JSON Server para a API
app.use('/api', router);

app.post('/cadastro', async (req, res) => {
  const { username, nome, senha, email, salario } = req.body;

  if (!username || !nome || !senha || !email || !salario) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const newUser = {
      username,
      nome,
      email,
      salario,
      senha: hashedPassword
    };

    const response = await fetch('/api/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newUser)
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
    } 
    
    res.status(201).json({ message: 'Usuário criado com sucesso', newUser });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

app.post('/login', async (req, res) => {
  const { cliente, senha } = req.body;

  if (!cliente || !senha) {
    return res.status(400).json({ error: `Parâmetros insuficientes.` });
  }

  try {

    // Comparar a senha fornecida com o hash armazenado
    const isMatch = await bcrypt.compare(senha, cliente.senha);

    if (!isMatch) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    res.status(200).json({ message: 'Login bem-sucedido' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

const views = path.join(__dirname, 'public', 'views');

// Rotas específicas para servir os arquivos HTML
app.get('/login', (req, res) => {
  res.sendFile(path.join(views, 'login.html'));
});

app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(views, 'cadastro.html'));
});

app.get('/perfil', (req, res) => {
  res.sendFile(path.join(views, 'perfil.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(views, '/dashboard.html'));
});

app.get('/calculadora-financeira', (req, res) => {
  res.sendFile(path.join(views, 'calculadora-financeira.html'));
});

app.get('/lancamento', (req, res) => {
  res.sendFile(path.join(views, 'lancamento.html'));
});

app.get('/fmpKey', (req, res) => {
  res.json({ apiKey: process.env.FMP_API_KEY });
});

app.get('/investimentos', (req, res) => {
  res.sendFile(path.join(views, 'investimento.html'));
});

// Rota para páginas que não existem (404)
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(views, '404.html'));
});

const PORT = 3080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});