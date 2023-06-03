const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../server.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Glucose router - Integration Tests', function() {
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

  describe('POST /api/glucose', function() {
    it('should create a new glucose reading.', function(done) {
      const newGlucose = {
        userId: '1111111-1111-1111-1111-111111111111',
        glucose: 100,
        glucose_unity_id: 1,
        total_carbs: 40,
        dateTime: new Date().toLocaleString('pt-BR'),
        markerMealId: 1,
      };

      chai
          .request(app)
          .post('/api/glucose')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(newGlucose)
          .end(function(err, res) {
            expect(res).to.have.status(201);
            done();
          });
    });
  });

  describe('GET /api/glucose', function() {
    it('should return all glucose', function(done) {
      chai
          .request(app)
          .get('/api/glucose')
          .set('Authorization', `Bearer ${accessToken}`)
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
          });
    });
  });
});
