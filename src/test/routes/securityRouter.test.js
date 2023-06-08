const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../server.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Security router - Integration Tests', function() {
  describe('POST /api/security/register', function() {
    it('should return error message when email or password are not provided',
        function(done) {
          const email = '';
          const password = '';
          chai
              .request(app)
              .post('/api/security/login')
              .send({email, password})
              .end(function(err, res) {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message');
                done();
              });
        });
  });

  describe('GET /api/users', function() {
    it('should return access token when the login is successfully made',
        function(done) {
          const email = process.env.TEST_USER_EMAIL;
          const password = process.env.TEST_USER_PASSWORD;
          chai
              .request(app)
              .post('/api/security/login')
              .send({email, password})
              .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('user_id');
                expect(res.body).to.have.property('accessToken');
                done();
              });
        });
  });
});
