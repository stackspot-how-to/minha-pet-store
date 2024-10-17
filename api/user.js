const express = require('express');
const router = express.Router();

// Dados de exemplo
let users = [
  { id: 1, name: 'João da Silva', email: 'joao@example.com' },
  { id: 2, name: 'Maria Souza', email: 'maria@example.com' }
];

// GET /users - Retorna todos os usuários
router.get('/', (req, res) => {
  res.json(users);
});

// GET /users/:id - Retorna um usuário pelo ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('Usuário não encontrado');
  res.json(user);
});

// POST /users - Cria um novo usuário
router.post('/', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /users/:id - Atualiza um usuário existente
router.put('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('Usuário não encontrado');

  user.name = req.body.name;
  user.email = req.body.email;
  res.json(user);
});

// DELETE /users/:id - Exclui um usuário
router.delete('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).send('Usuário não encontrado');

  users.splice(userIndex, 1);
  res.status(204).send();
});

module.exports = router;