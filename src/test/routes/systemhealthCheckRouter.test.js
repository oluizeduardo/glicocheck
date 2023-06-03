const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../server.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe('System Health check Test', function() {
  describe('GET /api/ping', function() {
    it('should check if the system is running', function(done) {
      chai.request(app)
          .get('/api/ping')
          .end(function(err, res) {
            expect(res).to.have.status(200);
            done();
          });
    });
  });
});
