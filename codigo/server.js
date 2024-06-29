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

/** Adaptado por Bernardo Alvim */

const app = express();
const routerPath = path.join(__dirname, 'public', 'assets', 'data', 'db.json');
const router = jsonServer.router(routerPath);
const middlewares = jsonServer.defaults();

app.use(cors());
app.use(middlewares);

// Usar o router do JSON Server para a API
app.use('/api', router);

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));


// Rotas específicas para servir os arquivos HTML
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views/login.html'));
});

app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views/cadastro.html'));
});

app.get('/perfil', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views/perfil.html'))
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views/dashboard.html'));
});

app.get('/calculadora-financeira', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views/calculadora-financeira.html'));
});

app.get('/lancamento', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views/lancamento.html'));
});

app.get('/investimentos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views/investimento.html'));
});

const PORT = 3080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
