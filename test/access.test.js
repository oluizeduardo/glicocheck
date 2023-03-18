const request = require('supertest');
const app = require('../server');

describe('Testing the user accessing the system.', () => {
  it('Should register a new user', async () => {
    request(app)
        .post('/api/security/register')
        .send({
          name: 'Elon Musk',
          email: 'elon@gmail.com',
          password: '123456',
          role_id: 1,
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          expect(response.body).toEqual(
              expect.objectContaining({
                userId: expect.any(Object),
              }),
          );
        });
  });

  it('Should do the login with a valid user.', async () => {
    request(app)
        .post('/api/security/login')
        .send({
          email: 'luiz@test.com',
          password: '123456',
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .then((response) => {
          expect(response.body).toEqual(
              expect.objectContaining({
                user_id: expect.any(Number),
                accessToken: expect.any(String),
              }),
          );
        });
  });
});
