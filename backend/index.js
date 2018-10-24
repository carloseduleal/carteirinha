'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const requestify = require('requestify');
const load = require('express-load');
const database = require('./config/database.js');
const app = express();

database.ConnectWithDB(function(err) {
    if (err) {
        console.log(err);
    }
    load('dao').then('service').then('controllers').then('routes').into(app);
});

process.env.TZ = 'America/Recife';

app.use(bodyParser.json())

app.listen(5000, function() {
    console.log('Working at port 3000')
})

module.exports = app;
