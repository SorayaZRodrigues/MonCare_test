const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
  it('deve cadastrar um paciente com sucesso', async () => {
    const response = await request(app)
      .post('/auth/register/patient')
      .send({
        name: 'Teste QA',
        email: `teste${Date.now()}@email.com`,
        password: '123456'
      });

    if (![200, 201].includes(response.status)) {
      throw new Error(`Erro inesperado: ${response.status}`);
    }
  });
});