const { describe, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const assert = chai.assert;

chai.use(chaiHttp);
process.env.NODE_ENV = 'test';

const Index = require('../src/index');
const descriptions = require('../src/descriptions.json');

describe('API ticks entity', () => {
  it('should return a 200 http status, json type, an array of ticks, and expected body description', (done) => {
    chai.request(Index)
      .get('/ticks')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) console.error(err);   /* eslint no-console: 0 */
        expect(res).to.have.status(200);
        expect(res.type).to.eql('application/json');
        assert(Array.isArray(res.body.ticks));
        expect(res.body.description).to.eql(descriptions.ticks.get);
        done();
      });
  });

  it('should create a new tick, and get expected tick properties', (done) => {
    chai.request(Index)
      .put('/ticks')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) console.error(err);   /* eslint no-console: 0 */
        expect(res).to.have.status(201);
        expect(res.type).to.eql('application/json');
        expect(res.body.description).to.eql(descriptions.ticks.put);
        expect(res.body.ticks).not.to.eql(undefined);
        expect(res.body.ticks[0].id).not.to.eql(undefined);
        expect(res.body.ticks.undefinedProperty).to.eql(undefined);
        assert(res.body.ticks[0].id >= 0);
        done();
      });
  });
});
