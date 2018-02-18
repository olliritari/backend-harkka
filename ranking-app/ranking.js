var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//Ei yhdisteta localhostiin vaan ranking-db:hen, koska sillä nimellä määritelty docker-composessa
mongoose.connect('mongodb://ranking-db/data/db:27018');
var db = mongoose.connection;

//Määritellään schema
var rankingSchema = mongoose.Schema({
    user: { type: String, required: true },
    score: { type: Number, required: true }
});

var rankingModel = mongoose.model('rankingModel', rankingSchema);

db.on('error', console.error.bind(console, 'connection error: '));

class Ranking {
    constructor() {
    }

    getHighScore(callback) {
        //Haetaan mongosta 15 korkeinta pistemäärää
        var results = [];
        var JSONresults;
        var query = rankingModel.
            find().
            lean().
            limit(15).
            sort('-score').
            select('user score');

        query.exec(function (err, scores) {
            if (err) {
                console.log(err);
                callback(err, null);
            }
            else {
                for (var i = 0; i < scores.length; i++) {
                    results.push(scores[i].user + ": " + scores[i].score);
                }
                JSONresults = JSON.stringify(results);
                console.log(JSONresults);
                callback(null, JSONresults);
            }
        })
    }

    getHighUsers(callback) {
        //Haetaan mongosta 15 korkeinta käyttäjää
        var results = [];
        var JSONresults;

        var query = rankingModel.aggregate(
            [
                { "$group": { _id: "$user", score: { $max: "$score" } } },
                { "$sort": { score: -1 } },
                { "$limit": 15 }
            ]);

        query.exec(function (err, scores) {
            if (err) {
                console.log(err);
                callback(err, null);
            }
            else {
                for (var i = 0; i < scores.length; i++) {
                    results.push(scores[i]._id + ": " + scores[i].score);
                }
                JSONresults = JSON.stringify(results);
                console.log(JSONresults);
                callback(null, JSONresults);
            }
        });
    }

    addScore(username, scorepoints, callback) {
        //Lisätään mongoon uudet pisteet
        var newScore = new rankingModel({
            user: username,
            score: scorepoints
        })

        newScore.save(function (err, newScore) {
            if (err) {
                console.log(err);
                callback(err, null);
            }
            else{
                console.log("Score saved!");
                callback(null, true);
            }
        });
    }

}

module.exports = Ranking;