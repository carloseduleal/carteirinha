'use strict';

const app = require('../index.js');
const chai = require('chai');
const request = require('supertest');
const faker = require('faker');
const expect = require('chai').expect

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

    request(app)
      .post('/api/investment')
      .send(investmentJson)
      .end(function(err, res) {
        expect(res.body.symbol).to.be.equal(fakeSymbol)
        expect(res.body.price).to.be.equal(fakePrice)
        expect(res.body.amount).to.be.equal(fakeAmount)
        expect(400,done());
      });
  });
});
