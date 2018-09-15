const { describe, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const assert = chai.assert;

chai.use(chaiHttp);
process.env.NODE_ENV = 'test';

const Index = require('../src/index');
const descriptions = require('../src/descriptions.json');

//  simple test on GET on /
describe('API root entity', () => {
  it('should return a 200 http status, json type,  and expected body description', (done) => {
    chai.request(Index)
      .get('/')
      .set('Accept', 'application/json')
      .end((err, res) => {
        //console.log(`1: ${JSON.stringify(res.body.description)}`);  
        if (err) console.error(err);   /* eslint no-console: 0 */
        expect(res).to.have.status(200);
        expect(res.type).to.eql('application/json');
        expect(res.body.description).to.eql("List the number of records stored and the last record of each collection: fishes, ticks, and logs.");
        done();
      });
  });

});
