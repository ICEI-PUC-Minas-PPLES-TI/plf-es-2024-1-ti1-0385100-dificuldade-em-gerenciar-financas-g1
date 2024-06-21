# Tutorial Deploy Vercel

Tutorial de como fazer deploy no vercel a partir de dois projetos diferentes.

Para começar, vamos dividir seu projeto completo em duas partes (caso tenha feito igual a mim e fez tudo no mesmo diretório)

## Decomposição do projeto

Pegue seu db.json e separe em um diretório e crie um server.js para ele

Posteriormente, pegue todos os seus arquivos html, css, js e imagens e separe em outra pasta

A estrutura deverá ser mais ou menos assim:

```plaintext
codigo/  (essa pasta aqui)
│
├── README.md
│
├── Front/
│   ├── assets/ (pasta de imagens, estilos e scripts)
│   ├── services/ (pata para armazenar componentes de interação com o servidor)
│   ├── pages/ (pasta para armazenar as páginas html)
│   ├── index.html
│   ├── index.js (script para habilitar o roteamento no navegador)
│   └── vercel.json (arquivo de configuração para vercel quase igual ao do @profdiegoaugusto)
│
├── Back/
│   ├── data/
│   │   └── db.json (seus dados do trabalho, onde armazenamos usuários, posts, etc)
│   ├── server.js
│   └── vercel.json (arquivo de configuração para vercel igual ao do @profdiegoaugusto)
│
└── README.md
```

## Deploy do Back

### Vamos hospedar o JSON Server

Primeiramente, você deve criar um projeto no Vercel.

Para criar um projeto no Vercel e fazer o deploy, siga os passos abaixo:

### 1. Criar uma Conta e Logar no Vercel

1. Acesse o [site do Vercel](https://vercel.com/).
2. Crie uma conta ou faça login se você já tiver uma.

### 2. Conectar o Repositório

1. Após fazer login, você será direcionado ao dashboard do Vercel.
2. Clique em "New Project".
3. Selecione o repositório que deseja conectar.
   
![Captura de tela 2024-06-20 203016](https://github.com/ICEI-PUC-Minas-PPLES-TI/plf-es-2024-1-ti1-0385100-dificuldade-em-gerenciar-financas-g1/assets/83983141/10d3727c-b2f0-4691-a368-d6846dadfb63)


### 3. Configurar o Projeto

Defina as configurações do projeto, como o nome do projeto e no diretório de origem coloque **Back** (pois é assim que está na estrutura acima).

### 4. Configurar o Build e o Deploy

Configure o comando de instalação para `npm install` ou `npm i`. Assim, o vercel instala as dependências no `package.json` ao fazer o deploy  

### 5. Configurar o `vercel.json`

Configuração do @profdiegoaugusto para hospedar o JSONServer

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["data/db.json"]
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### 6. Configurar o `package.json`

```json
    {
        "devDependencies": {
            "json-server": "^0.17.4"
        }
    }
```

### 7. Configurar o server.js

```js
const jsonServer = require('json-server')
const server = jsonServer.create()

const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'data/db.json')
const data = fs.readFileSync(filePath, "utf-8");
const db = JSON.parse(data);
const router = jsonServer.router(db)

const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server rodando em 3000')
})
```

### Não se esqueça de dar commit nos arquivos `vercel.json`, `server.js` e `package.json` antes de dar o deploy  

### 8. Fazer o Deploy

1. Clique em "Deploy".
2. O Vercel iniciará o processo de deploy. Isso pode levar alguns minutos.

### 9. Verificar o Deploy

1. Após o deploy ser concluído, você verá a URL do seu projeto.
2. Copie a URL e use-a para fazer as requisições no Front.

## Deploy do Front

O deploy do Front é bem parecido.

Para isso, você precisa criar outro projeto no [vercel](https://vercel.com/).

Ao clicar em "New Project", selecione o mesmo repositório, pois o diferencial estará na pasta *root* do projeto.

### 1. Configurar o Projeto

Defina as configurações do projeto, como o nome do projeto e no diretório de origem coloque **Front** (aqui está a diferença).

### 2. Configurar o Build e o Deploy

Configure o comando de instalação para `npm install` ou `npm i`. Assim, o vercel instala as dependências no `package.json` ao fazer o deploy  

### 3. Configurar o `vercel.json`

```json
{
    "version": 2,
    "builds": [
      {
        "src": "index.js",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "index.js"
      }
    ]
}
```

### 4. Configurar o `package.json`

Aqui é onde você colocará o json que usou no projeto até o momento, com as bibliotecas `cors`, `path`, `express`, `dotenv`, etc.

**exemplo**:
```json
{
  "name": "my-node-app",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.17.1"
  }
}
```

### 5. Configurar o `index.js`

Aqui é onde você configura as rotas para o seu site funcionar efetivamente e tornar os imports possíveis

```javascript
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

/* Serve arquivos estáticos das pastas assets e data */
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/data', express.static(path.join(__dirname, 'assets/data')));

/* Serve arquivos estáticos para serviços como api */
app.use('/services', express.static(path.join(__dirname, 'services')));

/* Define rotas para as páginas HTML */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/formulario.html'));
});

// E assim vai indo com suas outras páginas...

app.listen(3030, () => {
  console.log(`Index is running on 3030`);
});

```

### 6. Configurar `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ]
}
```

### Não se esqueça de dar commit nos arquivos `vercel.json`, `index.js` e `package.json` antes de dar o deploy 

### 7. Fazer o Deploy

1. Clique em "Deploy".
2. O Vercel iniciará o processo de deploy. Isso pode levar alguns minutos.

### 8. Verificar o Deploy

1. Após o deploy ser concluído, você verá a URL do seu projeto.
2. Acesse a URL para verificar se o seu projeto está funcionando corretamente.

## Considerações Finais

**Relembrando:** Não se esqueça de usar o link recebido no deploy do Back para fazer as requisições no Front

Com esses passos, você deve ser capaz de criar um projeto no Vercel e fazer o deploy dele com sucesso. Se houver algum problema, os logs de erro fornecidos pelo Vercel podem ajudar a diagnosticar e corrigir qualquer problema que ocorra.

Caso haja dúvidaa, me chame no discord ``alvimb_``
