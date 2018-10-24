const app = require('../index.js');
const objectId = require('mongodb').ObjectID;

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
            if (objectId.isValid(id)){
              investmentsCollection.getById(id, function(err, result) {
                  if (err) {
                      console.log("Error while getting single investment from database");
                      console.log(err);
                  }
                  callback(err, result);
              });
            } else {
              callback('OBJECTID IS NOT VALID', null);
            }
        },
        deleteSingleInvestmentFromDatabase: function(id, callback) {
            if (objectId.isValid(id)){
              investmentsCollection.remove(id, function(err, result) {
                  if (err) {
                      console.log("Error while deleting single investment from database");
                      console.log(err);
                  }
                  callback(err, result);
              });
           } else {
             callback('OBJECTID IS NOT VALID', null);
           }
        }
    };
    return investmentService;
};
