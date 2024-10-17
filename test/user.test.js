const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../api/index'); // Importa o app da API
const { expect } = chai;
const request = require('supertest');

chai.use(chaiHttp);

describe('Testes da API de Usuários', () => {
  // Teste para a rota GET /users
  it('Deve retornar todos os usuários', (done) => {
    request(app)
      .get('/users')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.equal(2); // Espera que haja 2 usuários
        done();
      });
  });

  // Teste para a rota GET /users/:id
  it('Deve retornar um usuário específico pelo ID', (done) => {
    request(app)
      .get('/users/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id', 1);
        expect(res.body).to.have.property('name', 'João da Silva');
        done();
      });
  });

  // Teste para a rota POST /users
  it('Deve criar um novo usuário', (done) => {
    const newUser = { name: 'Carlos Pereira', email: 'carlos@example.com' };
    request(app)
      .post('/users')
      .send(newUser)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name', 'Carlos Pereira');
        expect(res.body).to.have.property('email', 'carlos@example.com');
        done();
      });
  });

  // Teste para a rota PUT /users/:id
  it('Deve atualizar um usuário existente', (done) => {
    const updatedUser = { name: 'João Atualizado', email: 'joaoatualizado@example.com' };
    request(app)
      .put('/users/1')
      .send(updatedUser)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('name', 'João Atualizado');
        expect(res.body).to.have.property('email', 'joaoatualizado@example.com');
        done();
      });
  });

  // Teste para a rota DELETE /users/:id
  it('Deve excluir um usuário', (done) => {
    request(app)
      .delete('/users/1')
      .end((err, res) => {
        expect(res).to.have.status(204);
        done();
      });
  });
});