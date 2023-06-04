const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../server.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Marker meal router - Integration Tests', function() {
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

  describe('POST /api/markermeal', function() {
    it('should create a new marker meal', function(done) {
      const newMarkerMeal = {
        description: 'Snack',
      };

      chai
          .request(app)
          .post('/api/markermeal')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(newMarkerMeal)
          .end(function(err, res) {
            expect(res).to.have.status(201);
            done();
          });
    });
  });

  describe('GET /api/markermeal', function() {
    it('should return all markermeals', function(done) {
      chai
          .request(app)
          .get('/api/markermeal')
          .set('Authorization', `Bearer ${accessToken}`)
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
          });
    });
  });

  describe('PUT /api/markermeal/:id', function() {
    it('should update an existing marker meal', function(done) {
      const markerMealId = 1;
      const updatedMarkerMeal = {
        description: 'Updated Snack',
      };

      chai
          .request(app)
          .put(`/api/markermeal/${markerMealId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(updatedMarkerMeal)
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('description');
            expect(res.body).to.have.property('updated_at');
            done();
          });
    });
  });

  describe('DELETE /api/markermeal/:id', function() {
    it('should delete a marker meal by its ID', function(done) {
      const markerMealId = 1;
      chai
          .request(app)
          .delete(`/api/markermeal/${markerMealId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            done();
          });
    });
  });
});
