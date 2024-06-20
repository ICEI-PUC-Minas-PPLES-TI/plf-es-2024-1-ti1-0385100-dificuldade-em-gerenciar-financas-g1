/* Trabalho Interdisciplinar 1 - Aplicações Web

  Esse módulo implementa uma API RESTful baseada no JSONServer
  O servidor JSONServer fica hospedado na seguinte URL
  https://jsonserver.rommelpuc.repl.co/contatos

  Para montar um servidor para o seu projeto, acesse o projeto 
  do JSONServer no Replit, faça o FORK do projeto e altere o 
  arquivo db.json para incluir os dados do seu projeto.

  URL Projeto JSONServer: https://replit.com/@rommelpuc/JSONServer

  Autor: Rommel Vieira Carneiro (@rommelcarneiro)
  Data: 03/10/2023

*/

/** Adaptado por @alvimdev */

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(cors());

/* Serve arquivos estáticos das pastas assets e data */
// app.use('/assets', express.static(path.join(__dirname, 'assets')));
// app.use('/data', express.static(path.join(__dirname, 'assets', 'data')));

// // Serve arquivos estáticos para serviços
// app.use('/services', express.static(path.join(__dirname, 'services')));

const views = path.join(__dirname, 'views');

// Define rotas para as páginas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/perfil', (req, res) => {
  res.sendFile(path.join(views, 'perfil.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(views, 'login.html'));
});

app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(views, 'cadastro.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(views, 'dashboard.html'));
});

/* Ainda não commitados nesta branch */
// app.get('/calculadora-financeira', (req, res) => {
//   res.sendFile(path.join(views, 'calculadora-financeira.html'));
// });

// app.get('/lancamento', (req, res) => {
//   res.sendFile(path.join(views, 'lancamento.html'));
// });

// Rota para páginas que não existem (404)
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(views, '404.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
