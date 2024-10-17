const express = require('express');
const app = express();
const usersRouter = require('./user');

// Middleware para interpretar JSON
app.use(express.json());

// Rota para o recurso de usuários
app.use('/users', usersRouter);

// Porta onde o servidor vai rodar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});