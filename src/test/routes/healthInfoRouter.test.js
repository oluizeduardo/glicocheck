const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../server.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Health Info router - Integration Tests', function() {
  let accessToken;

  before(function(done) {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
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

  describe('POST /api/healthinfo', function() {
    it('should create a new health info register', function(done) {
      const newRegister = {
        userId: '1111111-1111-1111-1111-111111111111',
        diabetesType: 1,
        monthDiagnosis: 'May 2021',
        bloodType: 1,
      };

      chai
          .request(app)
          .post('/api/healthinfo')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(newRegister)
          .end(function(err, res) {
            expect(res).to.have.status(201);
            done();
          });
    });
  });

  describe('GET /api/healthinfo', function() {
    it('should return all the health info registers', function(done) {
      chai
          .request(app)
          .get('/api/healthinfo')
          .set('Authorization', `Bearer ${accessToken}`)
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
          });
    });
  });
});
