'use strict';

const app = require('../index.js');
const chai = require('chai')
  ,chaiHttp = require('chai-http');
const faker = require('faker');
const expect = require('chai').expect
chai.use(chaiHttp);

describe('Investments', function() {

  const fakeSymbol = faker.company.companyName();
  const fakePrice = faker.random.number({max:100});
  const fakeAmount = faker.random.number({max:90000, min:100});

  it('Should create a new invesment', function(done) {
    const investmentJson = {
      symbol: fakeSymbol,
      price: fakePrice,
      amount: fakeAmount
    };

    chai.request(app)
      .post('/api/investment')
      .send(investmentJson)
      .end(function(err, res) {
        let body = res.body
        process.env.INVESTMENT_ID = body._id
        expect(body.symbol).to.be.equal(fakeSymbol)
        expect(body.price).to.be.equal(fakePrice)
        expect(body.amount).to.be.equal(fakeAmount)
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should list a single investment', function(done) {
    chai.request(app)
      .get('/api/investment/'+process.env.INVESTMENT_ID)
      .end(function(err, res) {
        let body = res.body
        expect(body._id).to.be.equal(process.env.INVESTMENT_ID)
        expect(body.symbol).to.be.equal(fakeSymbol)
        expect(body.price).to.be.equal(fakePrice)
        expect(body.amount).to.be.equal(fakeAmount)
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should delete an investment', function(done) {
    chai.request(app)
      .delete('/api/investment/'+process.env.INVESTMENT_ID)
      .end(function(err, res) {
        expect(res.body.message).to.be.equal('Investment succesfully deleted')
        expect(res).to.have.status(200);
        done();
      });
  });


});
