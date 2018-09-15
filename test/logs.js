const { describe, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const assert = chai.assert;

chai.use(chaiHttp);
process.env.NODE_ENV = 'test';

const Index = require('../src/index');
const descriptions = require('../src/descriptions.json');

//  simple test on descriptions.logs.get
describe('API logs entity', () => {
  it('should return a 200 http status, json type, an array of logs, and expected body description', (done) => {
    chai.request(Index)
      .get('/logs')
      .set('Accept', 'application/json')
      .end((err, res) => {
        //console.log(`1: ${JSON.stringify(res.body)}`);  
        if (err) console.error(err);   /* eslint no-console: 0 */
        expect(res).to.have.status(200);
        expect(res.type).to.eql('application/json');
        assert(Array.isArray(res.body.logs));
        expect(res.body.description).to.eql(descriptions.logs.get);
        done();
      });
  });

  it('should return an array of logs with 0 element: [0] fish tank simulation starts.', (done) => {
    chai.request(Index)
      .get('/logs')
      .set('Accept', 'application/json')
      .end((err, res) => {
        //console.log(`1: ${res.body.logs[0]}`);  
        if (err) console.error(err);   /* eslint no-console: 0 */
        expect(res).to.have.status(200);
        expect(res.type).to.eql('application/json');
        assert(Array.isArray(res.body.logs));
        expect(res.body.logs[0]).to.eql("[0] fish tank simulation starts.");
        done();
      });
  });

});
