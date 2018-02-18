const express = require('express');
var bodyParser = require('body-parser');
var ranking = require('./ranking.js');

const PORT = 8000;
const HOST = '0.0.0.0';

var app = express();
app.use(bodyParser.json());

app.use('/public', express.static(__dirname + '/public'));

var ranker = new ranking();


app.get('/', function (req, res) {
    console.log("GET etusivulle");

    res.send("HELLOOOOUU!");
})

app.post('/api/v1/newscore', function (req, res) {
    console.log("POST uudelle scorelle");
    console.log(req.body);
    var success = ranker.addScore(req.body.user, req.body.score, function (err, result) {
        if (err) {
            console.log(err);
            res.send("save error!");
        }
        res.send("score saved");
    });

});

app.get('/api/v1/highscores', function (req, res) {
    console.log("GET highscoreille");
    ranker.getHighScore(function (err, JSONresults) {
        if (err) {
            console.log(err);
        }
        console.log("serverillä: " + JSONresults);
        res.send(JSONresults);
    });
})

app.get('/api/v1/highusers', function (req, res) {
    console.log("GET highusereille");
    ranker.getHighUsers(function (err, JSONresults) {
        if (err) {
            console.log(err);
        }
        console.log("serverillä: " + JSONresults);
        res.send(JSONresults);
    });

})

app.listen(PORT, HOST, function () {
    console.log("kuuntelen osoitteessa http://" + HOST + ":" + PORT);
})
