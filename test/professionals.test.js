const request = require('supertest');
const app = require('../src/app');

describe('Professionals API', () => {
  it('deve cadastrar um profissional com sucesso', async () => {
    const response = await request(app)
      .post('/auth/register/professional')
      .send({
        name: 'Profissional Teste',
        email: `profissional${Date.now()}@email.com`,
        password: '123456',
        profession: 'enfermeira',
        serviceAreas: ['Verdun']
      });

    if (![200, 201].includes(response.status)) {
      throw new Error(`Erro inesperado: ${response.status} - ${JSON.stringify(response.body)}`);
    }
  });

  it('não deve aprovar profissional sem autenticação de admin', async () => {
    const response = await request(app)
      .patch('/admin/professionals/1/approve');

    if (![401, 403].includes(response.status)) {
      throw new Error(`Esperado 401/403, veio: ${response.status} - ${JSON.stringify(response.body)}`);
    }
  });
});