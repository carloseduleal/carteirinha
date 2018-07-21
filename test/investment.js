'use strict';

const app = require('../index.js');
const chai = require('chai')
  ,chaiHttp = require('chai-http');
const faker = require('faker');
const expect = require('chai').expect
chai.use(chaiHttp);

describe('Investment test suite', function() {
  it('it should create a new invesment', function(done) {

    const fakeSymbol = faker.company.companyName();
    const fakePrice = faker.finance.amount();
    const fakeAmount = faker.finance.amount();

    const investmentJson = {
      symbol: fakeSymbol,
      price: fakePrice,
      amount: fakeAmount
    };

    chai.request(app)
      .post('/api/investment')
      .send(investmentJson)
      .end(function(err, res) {
        expect(res.body.symbol).to.be.equal(fakeSymbol)
        expect(res.body.price).to.be.equal(fakePrice)
        expect(res.body.amount).to.be.equal(fakeAmount)
        expect(res).to.have.status(200);
        done();
      });
  });
});
