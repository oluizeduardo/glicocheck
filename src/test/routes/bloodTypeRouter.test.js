const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../server.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Blood type router - Integration Tests', function() {
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

  describe('POST /api/bloodtype', function() {
    it('should create a new bloodtype', function(done) {
      const newBloodtype = {
        description: 'Test+',
      };

      chai
          .request(app)
          .post('/api/bloodtype')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(newBloodtype)
          .end(function(err, res) {
            expect(res).to.have.status(201);
            done();
          });
    });
  });

  describe('GET /api/bloodtype', function() {
    it('should return all bloodtype', function(done) {
      chai
          .request(app)
          .get('/api/bloodtype')
          .set('Authorization', `Bearer ${accessToken}`)
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
          });
    });
  });
});
