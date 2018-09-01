process.env.NODE_ENV = 'test';

const Index = require('../index');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('Index', () => {
  it('should return a greeting message', (done) => {
    chai.request(Index)
      .get('/')
      .end((err, res) => {
	res.should.have.status(200);
	res.text.should.eql('Welcome to your virtual aquarium');
        done();
      });
  });
});
