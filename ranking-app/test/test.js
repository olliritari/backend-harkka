var ranking = require('../ranking.js');
var chai = require('chai');
var expect = require('chai').expect;

describe('Ranking module', function () {
  var ranker = new ranking();

  //Laitetaan kolme uutta dokumenttia
  describe('#addScore()', function () {
    it('Should return true', function (done) {
      ranker.addScore('user4', 4, function (result) {
        expect(result).to.equal(true);
        done();
      });
      done();
    });
    it('Should return true', function (done) {
      ranker.addScore('user5', 5, function (result) {
        expect(result).to.equal(true);
        done();
      });
      done();
    });
    it('Should return true', function (done) {
      ranker.addScore('user6', 6, function (result) {
        expect(result).to.equal(true);
        done();
      });
      done();
    });
  })

  //testataan korkeimpien pisteiden hakua
  describe('#getHighScore()', function () {
    it('Should return an array with length of 3', function (done) {
      ranker.getHighScore(function (result2) {
        var parsed = JSON.parse(result2);
        var arr = [];
        for (var x in parsed) {
          arr.push(parsed[x]);
        }
        expect(arr).to.have.length(3);
        done();
      })
      done();
    });

    it('Each array element shoud have user and score', function (done) {
      ranker.getHighScore(function (result2b) {
        for (var i = 0; i < result2b.length; i++) {
          var objResult = JSON.parse(result2b[i]);
          expect(objResult).to.have.property('user');
          expect(objResult).to.have.property('score');
        }
        done();
      })
      done();
    })
  })

  //testataan korkeimpien käyttäjien hakua
  describe('#getHighUsers()', function () {
    it('Should return an array with length of 3', function (done) {
      ranker.getHighUsers(function (result3) {
        var parsed = JSON.parse(result3);
        var arr = [];
        for (var x in parsed) {
          arr.push(parsed[x]);
        }
        expect(arr).to.have.length(3);
        done();
      });
      done();
    });
  })

});
