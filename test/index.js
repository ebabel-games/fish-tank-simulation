const { describe, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const assert = chai.assert;

chai.use(chaiHttp);
process.env.NODE_ENV = 'test';

const Index = require('../src/index');
const descriptions = require('../src/descriptions.json');

describe('API', () => {
  it('should return a 200 http status, json type, an array of fishes, and expected body description', (done) => {
    chai.request(Index)
      .get('/')
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

  it('should create a new fish, and expected fish properties', (done) => {
    chai.request(Index)
      .put('/')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) console.error(err);   /* eslint no-console: 0 */
        expect(res).to.have.status(201);
        expect(res.type).to.eql('application/json');
        expect(res.body.description).to.eql(descriptions.fishes.put);
        expect(res.body.newFish).not.to.eql(undefined);
        expect(res.body.newFish.strength).not.to.eql(undefined);
        expect(res.body.newFish.undefinedProperty).to.eql(undefined);
        assert(res.body.newFish.strength > 0);
        assert(res.body.newFish.stamina > 0);
        assert(res.body.newFish.agility > 0);
        assert(res.body.newFish.life > 0);
        assert(res.body.newFish.attack > 0);
        assert(res.body.newFish.defence > 0);
        done();
      });
  });
});
