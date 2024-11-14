const express = require('express');
const { check, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const router = express.Router();
const petService = require('./petService');

// Middleware de segurança
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Token não fornecido.' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido.' });
    req.user = user;
    next();
  });
};

// Middleware de tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.stack}`);
  if (err.status && err.status >= 400 && err.status < 500) {
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Ocorreu um erro no servidor.' });
  }
};

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: 'Muitas requisições feitas a partir deste IP, tente novamente mais tarde.'
});

// Aplicar o rate limiter e helmet
router.use(limiter);
router.use(helmet());

// Endpoint para listar todos os pets com paginação
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pets = await petService.getAllPets({ page, limit });
    if (pets.length === 0) {
      return res.status(204).send(); // Sem conteúdo
    }
    res.json(pets);
  } catch (err) {
    next(err);
  }
});

// Endpoint para listar os pets de um dono específico
router.get('/owner/:ownerId', [
  check('ownerId').isInt().withMessage('O ID do dono deve ser um número inteiro.').toInt().escape()
], authenticateToken, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const ownerId = req.params.ownerId;
    const ownerPets = await petService.getPetsByOwnerId(ownerId);

    if (ownerPets.length > 0) {
      res.json(ownerPets);
    } else {
      res.status(404).json({ message: 'Nenhum pet encontrado para esse dono.' });
    }
  } catch (err) {
    next(err);
  }
});

// Middleware de tratamento de erros deve ser o último
router.use(errorHandler);

module.exports = router;