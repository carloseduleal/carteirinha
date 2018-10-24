const db = require('./../config/database.js');
const ObjectId = require('mongodb').ObjectID;

module.exports = function(app) {

    const investments = db.getDb().collection('investments');

    var investmentsDao = {
        insert: function(element, callback) {
            investments.save(element, callback);
        },
        get: function(callback) {
            investments.findOne({}, callback);
        },
        getAll: function(callback) {
            investments.find().toArray(callback);
        },
        getWithCondintion: function(condintion, callback) {
            investments.find(condintion).toArray(callback);
        },
        clear: function(callback) {
            investments.remove(callback);
        },
        remove: function(id, callback) {
            investments.remove({
                _id: ObjectId(id)
            }, callback);
        },
        getById: function(id, callback) {
            investments.findOne({
                _id: ObjectId(id)
            }, callback);
        }
    };
    return investmentsDao;
}
