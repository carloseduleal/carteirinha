const app = require('../index.js');
const yahooFinance = require('yahoo-finance');
const utils = require('../utils/utils')

module.exports = function(app) {
    const investmentService = app.service.investment;

    const controller = {
        currentState: function(req, res) {
            yahooFinance.quote({
                symbol: req.params.symbol + ".SA",
                modules: ['price']
            }, function(err, quotes) {
                const priceVariation = quotes.price.regularMarketPrice - quotes.price.regularMarketPreviousClose
                const variation = this.priceVariation / quotes.price.regularMarketPreviousClose * 100
                res.send({
                    'name': quotes.price.longName,
                    'currentPrice': quotes.price.regularMarketPrice,
                    'latestClose': quotes.price.regularMarketPreviousClose,
                    'priceVariation': priceVariation.toFixed(2),
                    'variation': variation.toFixed(2)
                }).status(200);
            });
        },
        createInvestment: function(req, res) {
            const elements = req.body;
            investmentService.saveInvestmentOnDatabase(elements, function(err, result) {
                if (err) {
                    res.status(401);
                    res.send("Body invalid to save this Investment. Please, check it and try again.");
                    return;
                }
                res.send(elements).status(200);
            });
        },
        listAllInvestments: function(req, res) {
            investmentService.getInvestmentsFromDatabase(function(err, result) {
                if (err) {
                    res.send({
                        "message": "Something goes wrong trying to list all investments. Try again later."
                    }).status(401);
                    return;
                }
                res.send(result).status(200);
            });
        },
        listSingleInvestment: function(req, res) {
            investmentService.getSingleInvestmentFromDatabase(req.params.id, function(err, result) {
                if (err) {
                    res.status(404);
                    res.send({
                        "message": "ID must be an ObjectID."
                    });
                    return;
                }
                if (result) {
                    res.send(result).status(200);
                } else {
                    res.send({
                        "message": "Investment not found."
                    }).status(404);
                }
            });
        },
        deleteSingleInvestment: function(req, res) {
            investmentService.deleteSingleInvestmentFromDatabase(req.params.id, function(err, result) {
                if (err) {
                    res.send({
                        "message": "ID must be an ObjectID."
                    }).status(404);
                    return;
                }
                if (result) {
                    res.send({
                        "message": "Investment succesfully deleted"
                    }).status(200);
                } else {
                    res.send({
                        "message": "Investment not found."
                    }).status(404);
                }
            });
        },
        showFullProfit: async function(req, res) {
            let resultSum = ""
            investmentService.getInvestmentsFromDatabase(async function(err, investments) {
                if (err) {
                    res.send({
                        "message": "Something goes wrong trying to get investments from database. Try again later."
                    }).status(401);
                    return;
                }  
                
                await utils.asyncForEach(investments, async (investment) => {
                    await yahooFinance.quote({
                        symbol: investment.symbol + ".SA",
                        modules: ['price']
                    }, function(err, quotes) {
                        let priceVariation = quotes.price.regularMarketPrice - quotes.price.regularMarketPreviousClose
                        let variation = priceVariation / quotes.price.regularMarketPreviousClose * 100
                        let investment_status = {
                            'name': quotes.price.longName,
                            'currentPrice': quotes.price.regularMarketPrice,
                            'latestClose': quotes.price.regularMarketPreviousClose,
                            'priceVariation': priceVariation.toFixed(2),
                            'variation': variation.toFixed(2)
                        }
                        resultSum = resultSum + (investment_status.currentPrice * investment.amount) - (investment.price * investment.amount)
                    });
                })    
                res.send({
                    "profit": resultSum
                }).status(200);  
            })
        },
        showSingleProfit: async function(req, res) {
            let worthIt = ""
            investmentService.getSingleInvestmentFromDatabase(req.params.id, async function(err, result) {
                await yahooFinance.quote({
                    symbol: result.symbol + ".SA",
                    modules: ['price']
                }, function(err, quotes) {
                    worthIt = (quotes.price.regularMarketPrice * result.amount) - (result.price * result.amount)
                });
                res.send({
                    value: worthIt
                }).status(200)
            });
        }
    }
    return controller;
};
