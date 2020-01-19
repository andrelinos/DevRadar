const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const routes = require('./routes');
const { setupWebsocket } = require('./websocket')

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://<user>:<pass>@omnistack-875.mongodb.net/week10omnistack?retryWrites=true&w=majority',
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set('useCreateIndex', true);

// Define a mesma url de conexão para a api, web e mobile
app.use(cors());

// Define o express para JSON nas respostas
app.use(express.json());
app.use(routes);

// Métodos HTTP: GET, POST, PUT, DELETE

// Tipos de parâmetros:

// Query Params: request.query (Filtros, ordenação, paginação...)
// Route Params: request.params (Indentificar um recurso na alteração ou remoção)
// Body: request.body (Dados para criação ou alteração de um registro)

// MongoDB (não-relacional)


server.listen(3333);
