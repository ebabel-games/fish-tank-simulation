process.env.NODE_ENV = 'test';

const { describe, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const Index = require('../src/index');
const descriptions = require('../src/descriptions.json');

describe('API', () => {
  it('should return a 200 http status, json type, and expected body description', (done) => {
    chai.request(Index)
      .get('/')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) console.error(err);   /* eslint no-console: 0 */
        expect(res).to.have.status(200);
        expect(res.type).to.eql('application/json');
        expect(res.body.description).to.eql(descriptions.fishes.get);
        done();
      });
  });
});
