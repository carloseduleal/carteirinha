'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const load = require('express-load');
const database = require('./config/database.js');
const app = express();
const PORT = 5001;

database.ConnectWithDB(function(err) {
    if (err) {
        console.log(err);
    }
    load('dao').then('service').then('controllers').then('routes').into(app);
});

process.env.TZ = 'America/Recife';

app.use(bodyParser.json())

app.listen(PORT, function() {
    console.log('Working at port '+ PORT)
})

module.exports = app;
