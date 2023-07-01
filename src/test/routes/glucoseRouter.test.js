const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../server.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Glucose router - Integration Tests', function() {
  let accessToken;

  before(function(done) {
    const email = process.env.TEST_USER_REGULAR_EMAIL;
    const password = process.env.TEST_USER_REGULAR_PASSWORD;
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
        userId: '2222222-2222-2222-2222-222222222222',
        glucose: 100,
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
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('user_id');
            expect(res.body).to.have.property('glucose');
            expect(res.body).to.have.property('total_carbs');
            expect(res.body).to.have.property('dateTime');
            expect(res.body).to.have.property('markermeal_id');
            expect(res.body).to.have.property('created_at');
            expect(res.body).to.have.property('updated_at');
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

  describe('GET /api/glucose/:id', function() {
    it('should get a glucose by id', function(done) {
      const glucoseId = 1;

      chai
          .request(app)
          .get(`/api/glucose/${glucoseId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            done();
          });
    });

    it('should return 404 if the if is not a number', function(done) {
      const glucoseId = 'xxxxxx';

      chai
          .request(app)
          .get(`/api/glucose/${glucoseId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .end(function(err, res) {
            expect(res).to.have.status(404);
            done();
          });
    });
  });

  describe('GET /api/glucose/user/online', function() {
    it('should get all glucose reading by a user id', function(done) {
      chai
          .request(app)
          .get(`/api/glucose/user/online`)
          .set('Authorization', `Bearer ${accessToken}`)
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
          });
    });

    // eslint-disable-next-line max-len
    it('should should return 401 if the accessToken is invalid.', function(done) {
      const fakeToken = 'aaabbbccc';
      chai
          .request(app)
          .get(`/api/glucose/user/online`)
          .set('Authorization', `Bearer ${fakeToken}`)
          .end(function(err, res) {
            expect(res).to.have.status(401);
            done();
          });
    });
  });

  describe('GET /api/glucose/markermeal/:id', function() {
    it('should get all glucose reading by a marker meal id', function(done) {
      const markerMealId = 1;
      chai
          .request(app)
          .get(`/api/glucose/markermeal/${markerMealId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
          });
    });

    it('should return 404 if the id is not a number', function(done) {
      const markerMealId = 'xxx';
      chai
          .request(app)
          .get(`/api/glucose/markermeal/${markerMealId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .end(function(err, res) {
            expect(res).to.have.status(404);
            done();
          });
    });
  });

  describe('PUT /api/glucose/:id', function() {
    it('should update a glucose reading by id', function(done) {
      const glucoseId = 1;
      const updatedGlucoseReading = {
        glucose: 130,
        total_carbs: 70,
        markermeal_id: 3,
      };

      chai
          .request(app)
          .put(`/api/glucose/${glucoseId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(updatedGlucoseReading)
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('glucose');
            expect(res.body).to.have.property('total_carbs');
            expect(res.body).to.have.property('markermeal_id');
            expect(res.body).to.have.property('updated_at');
            done();
          });
    });
  });

  describe('DELETE /api/glucose/:id', function() {
    it('should delete a glucose reading by id', function(done) {
      const glucoseId = 1;
      chai
          .request(app)
          .delete(`/api/glucose/${glucoseId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            done();
          });
    });

    it('should return 404 if the id is not a number', function(done) {
      const glucoseId = 'xxxxxxxx';
      chai
          .request(app)
          .delete(`/api/glucose/${glucoseId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .end(function(err, res) {
            expect(res).to.have.status(404);
            done();
          });
    });
  });

  describe('DELETE /api/glucose/user/:id', function() {
    const USER_ID = '2222222-2222-2222-2222-222222222222';

    it('should create a new glucose reading.', function(done) {
      const newGlucose = {
        userId: USER_ID,
        glucose: 100,
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
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('user_id');
            expect(res.body).to.have.property('glucose');
            expect(res.body).to.have.property('total_carbs');
            expect(res.body).to.have.property('dateTime');
            expect(res.body).to.have.property('markermeal_id');
            expect(res.body).to.have.property('created_at');
            expect(res.body).to.have.property('updated_at');
            done();
          });
    });

    it('should delete all glucose readings by user id', function(done) {
      chai
          .request(app)
          .delete(`/api/glucose/user/${USER_ID}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            done();
          });
    });

    it('should return 404 if the user id is not a number', function(done) {
      chai
          .request(app)
          .delete(`/api/glucose/user/xxxxxxxxxxx`)
          .set('Authorization', `Bearer ${accessToken}`)
          .end(function(err, res) {
            expect(res).to.have.status(404);
            done();
          });
    });
  });
});
