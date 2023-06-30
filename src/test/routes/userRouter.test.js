const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../server.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe('User router - Integration Tests', function() {
  let accessToken;

  before(function(done) {
    const email = process.env.TEST_USER_ADMIN_EMAIL;
    const password = process.env.TEST_USER_ADMIN_PASSWORD;
    chai
        .request(app)
        .post('/api/security/login')
        .send({email, password})
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('accessToken');
          accessToken = res.body.accessToken;
          done();
        });
  });

  describe('POST /api/security/register', function() {
    it('should create a new user', function(done) {
      const newUser = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        cod_role: '98805e1e-4dbe-483d-8a78-5f1e7e4f72b3',
      };

      chai
          .request(app)
          .post('/api/security/register')
          .send(newUser)
          .end(function(err, res) {
            expect(res).to.have.status(201);
            done();
          });
    });
  });

  describe('GET /api/users', function() {
    it('should return all users', function(done) {
      chai
          .request(app)
          .get('/api/users')
          .set('Authorization', `Bearer ${accessToken}`)
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
          });
    });
  });
});
