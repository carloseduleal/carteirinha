const app = require('../index.js');
const yahooFinance = require('yahoo-finance');
const requestify = require('requestify');

module.exports = function(app) {

    const investmentService = app.service.investment;

    const controller = {
        currentState: function(req, res) {
            yahooFinance.quote({
                symbol: req.params.symbol + ".SA",
                modules: ['price']
            }, function(err, quotes) {
                this.priceVariation = quotes.price.regularMarketPrice - quotes.price.regularMarketPreviousClose
                this.variation = this.priceVariation / quotes.price.regularMarketPreviousClose * 100
                res.send({
                    'name': quotes.price.longName,
                    'currentPrice': quotes.price.regularMarketPrice,
                    'latestClose': quotes.price.regularMarketPreviousClose,
                    'priceVariation': this.priceVariation.toFixed(2),
                    'variation': this.variation.toFixed(2)
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
                    res.status(404);
                    res.send({
                        "message": "ID must be an ObjectID."
                    });
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
            var resultSum = ""
            var investments = await requestify.get('http://localhost:5000/api/investments/')
            investments = investments.getBody()

            for (var i = 0; i < investments.length; i++) {
                var result = await requestify.get('http://localhost:5000/api/status/' + investments[i].symbol)
                resultSum = resultSum + (result.getBody().currentPrice * investments[i].amount) - (investments[i].price * investments[i].amount)
            }

            res.send({
                "profit": resultSum
            }).status(200);
        },
        showSingleProfit: async function(req, res) {
            var storedInvestment = await requestify.get('http://localhost:5000/api/investment/' + req.params.id)
            storedInvestment = storedInvestment.getBody()
            var currentValueFromInvestment = await requestify.get('http://localhost:5000/api/status/' + storedInvestment.symbol)
            currentValueFromInvestment = currentValueFromInvestment.getBody()

            var worthIt = (currentValueFromInvestment.currentPrice * storedInvestment.amount) - (storedInvestment.price * storedInvestment.amount)

            res.send({
                value: worthIt
            }).status(200)
        }
    }
    return controller;
};
