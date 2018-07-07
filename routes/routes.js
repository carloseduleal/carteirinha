const PREFIX = '/api'

module.exports = function(app) {
    app.get(PREFIX + '/status/:symbol', app.controllers.investment.currentState);
    app.post(PREFIX + '/investment', app.controllers.investment.createInvestment);
    app.get(PREFIX + '/investments', app.controllers.investment.listAllInvestments);
    app.get(PREFIX + '/investment/:id', app.controllers.investment.listSingleInvestment);
    app.delete(PREFIX + '/investment/:id', app.controllers.investment.deleteSingleInvestment);
    app.get(PREFIX + '/profit/:id', app.controllers.investment.showProfit);
}
