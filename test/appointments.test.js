const request = require('supertest');
const app = require('../src/app');

describe('Appointments API', () => {
  let token;

  before(async () => {
    const email = `paciente${Date.now()}@email.com`;

    await request(app)
      .post('/auth/register/patient')
      .send({
        name: 'Paciente Teste',
        email,
        password: '123456'
      });

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email,
        password: '123456'
      });

    token = loginResponse.body.token;

    if (!token) {
      throw new Error('Token não foi retornado no login');
    }
  });

  it('não deve criar atendimento sem endereço cadastrado', async () => {
    const response = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        serviceName: 'Aferição de pressão',
        area: 'Verdun',
        window: '14:00 to 16:00',
        symptoms: 'Tontura e dor de cabeça'
      });

    if (response.status !== 400) {
      throw new Error(`Esperado 400, veio: ${response.status} - ${JSON.stringify(response.body)}`);
    }

    if (!response.body.message.includes('endereço')) {
      throw new Error(`Mensagem inesperada: ${JSON.stringify(response.body)}`);
    }
  });

  it('não deve criar atendimento sem token', async () => {
    const response = await request(app)
      .post('/appointments')
      .send({
        serviceName: 'Aferição de pressão',
        area: 'Verdun',
        window: '14:00 to 16:00',
        symptoms: 'Tontura e dor de cabeça'
      });

    if (![401, 403].includes(response.status)) {
      throw new Error(`Esperado 401/403, veio: ${response.status}`);
    }
  });

  it('deve retornar 404 ao buscar atendimento inexistente', async () => {
    const response = await request(app)
      .get('/appointments/9999')
      .set('Authorization', `Bearer ${token}`);

    if (response.status !== 404) {
      throw new Error(`Esperado 404, veio: ${response.status}`);
    }
  });

  it('deve falhar login com senha incorreta', async () => {
  const response = await request(app)
    .post('/auth/login')
    .send({
      email: 'teste@email.com',
      password: 'senhaerrada'
    });

  if (![400, 401].includes(response.status)) {
    throw new Error(`Esperado erro de login, veio: ${response.status}`);
    }
  });
});