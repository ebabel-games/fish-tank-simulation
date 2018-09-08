const { describe, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const assert = chai.assert;

chai.use(chaiHttp);
process.env.NODE_ENV = 'test';

const Index = require('../src/index');
const descriptions = require('../src/descriptions.json');

describe('API fishes entity', () => {
  it('should return a 200 http status, json type, an array of fishes, and expected body description', (done) => {
    chai.request(Index)
      .get('/fishes')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) console.error(err);   /* eslint no-console: 0 */
        expect(res).to.have.status(200);
        expect(res.type).to.eql('application/json');
        assert(Array.isArray(res.body.fishes));
        expect(res.body.description).to.eql(descriptions.fishes.get);
        done();
      });
  });

  it('should create a new fish, and get expected fish properties', (done) => {
    chai.request(Index)
      .put('/fishes')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) console.error(err);   /* eslint no-console: 0 */
        expect(res).to.have.status(201);
        expect(res.type).to.eql('application/json');
        expect(res.body.description).to.eql(descriptions.fishes.put);
        expect(res.body.fish).not.to.eql(undefined);
        expect(res.body.fish.strength).not.to.eql(undefined);
        expect(res.body.fish.undefinedProperty).to.eql(undefined);
        assert(res.body.fish.strength > 0);
        assert(res.body.fish.stamina > 0);
        assert(res.body.fish.agility > 0);
        assert(res.body.fish.life > 0);
        assert(res.body.fish.attack > 0);
        assert(res.body.fish.defence > 0);
        done();
      });
  });
});
