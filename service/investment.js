const app = require('../index.js');

module.exports = function(app) {
    const investmentsCollection = app.dao.investment;

    var investmentService = {
        saveInvestmentOnDatabase: function(elements, callback) {
            investmentsCollection.insert(elements, function(err, result) {
                if (err) {
                    console.log("Error while saving invesment in database");
                    console.log(err);
                }
                callback(err, result);
            });
        },
        getInvestmentsFromDatabase: function(callback) {
            investmentsCollection.getAll(function(err, result) {
                if (err) {
                    console.log("Error while getting all invesments from database");
                    console.log(err);
                }
                callback(err, result);
            });
        },
        getSingleInvestmentFromDatabase: function(id, callback) {
            investmentsCollection.getById(id, function(err, result) {
                if (err) {
                    console.log("Error while getting single investment from database");
                    console.log(err);
                }
                callback(err, result);
            });
        },
        deleteSingleInvestmentFromDatabase: function(id, callback) {
            investmentsCollection.remove(id, function(err, result) {
                if (err) {
                    console.log("Error while deleting single investment from database");
                    console.log(err);
                }
                callback(err, result);
            });
        }
    };
    return investmentService;
};
