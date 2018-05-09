process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../src/server/index');
const knex = require('../../src/server/db/connection');

describe('routes : measurements', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('GET /api/v1/measure', () => {
    it('should return all measures', (done) => {
      chai.request(server)
      .get('/api/v1/measure')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": [3 movie objects]}
        res.body.data.length.should.eql(3);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'tstamp',
          'type',
          'position',
          'sensor',
          'value',
          'id_user',
          'real_tstamp'
        );
        done();
      });
    });
  });

  describe('GET /api/v1/measure/:id', () => {
    it('should respond with all measures of one user', (done) => {
      chai.request(server)
      .get('/api/v1/measure/1')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 movie object}
        res.body.data[0].should.include.keys(
          'tstamp',
          'type',
          'position',
          'sensor',
          'value',
          'id_user',
          'real_tstamp'
        );
        done();
      });
    });
    it('should throw an error if the user does not exist', (done) => {
      chai.request(server)
      .get('/api/v1/measure/5')
      .end((err, res) => {
        // there should be no errors
        //should.not.exist(err);
        // there should be a 404 status code
        res.status.should.equal(404);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // the JSON response body should have a
        // key-value pair of {"message": "That movie does not exist."}
        res.body.message.should.eql('That user has not measurements.');
        done();
      });
    });
  });

  describe('POST /api/v1/measure', () => {
    it('should return the measurement that was added', (done) => {
      chai.request(server)
      .post('/api/v1/measure')
      .send({
        tstamp: 'now()',
        type: 'XX',
        position: 'XX',
        sensor: 'XX',
        value: 90.5,
        id_user: 2,
        real_tstamp: 'now()'
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 201 status code
        // (indicating that something was "created")
        res.status.should.equal(201);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 movie object}
        res.body.data[0].should.include.keys(
          'tstamp',
          'type',
          'position',
          'sensor',
          'value',
          'id_user',
          'real_tstamp'
        );
        done();
      });
    });
    it('should throw an error if the payload is malformed', (done) => {
      chai.request(server)
      .post('/api/v1/measure')
      .send({
        pola: 'Comunism'
      })
      .end((err, res) => {
        // there should an error
        should.exist(err);
        // there should be a 400 status code
        res.status.should.equal(400);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // the JSON response body should have a message key
        should.exist(res.body.message);
        done();
      });
    });
  });
});
