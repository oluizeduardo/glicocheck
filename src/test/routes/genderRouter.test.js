const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../server.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Gender router - Integration Tests', function() {
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

  describe('POST /api/gender', function() {
    it('should create a new gender', function(done) {
      const newGender = {
        description: 'Non Binary',
      };

      chai
          .request(app)
          .post('/api/gender')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(newGender)
          .end(function(err, res) {
            expect(res).to.have.status(201);
            done();
          });
    });
  });

  describe('GET /api/gender', function() {
    it('should return all genders', function(done) {
      chai
          .request(app)
          .get('/api/gender')
          .set('Authorization', `Bearer ${accessToken}`)
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
          });
    });
  });
});
