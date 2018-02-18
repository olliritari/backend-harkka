"use strict"
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbUrl = "mongodb://login-db:27017/logindb";

const PORT = 8001;

// Setup express app
const app = express();

//connect to mongodb
mongoose.connect(dbUrl, {
    useMongoClient: true
});

mongoose.Promise = global.Promise;

// Init body-parser
app.use(bodyParser.json());

// Init routes
app.use('/api', require('./routes/api'));

//Error handler init
app.use(function(err, req, res, next){
    res.status(422).send({error: err.message});
});

//App listens the assigned port
app.listen(PORT, function() {
    console.log('App is listening port ' + PORT);
});