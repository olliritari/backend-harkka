const express = require('express');
const router = express.Router();
const User = require('../models/user');

//Create a new user to the DB
router.post('/v1/create', function(req, res, next) {

    console.log("Sever got an /api/login request");
    
    // Before save calls save pre-handler from models/user.js
    // then saves the user to the db if the mormat matches.
    User.create(req.body).then(function(user) {
        res.send({user: "success"});
    }).catch(next);
});

//Login a user to the game
router.post('/v1/login', function(req, res, next) {

    console.log("Server got an /api/login request");

    // Finds a user with the given username from database
    User.findOne({ username: req.body.username}, 'username password', function(user) {
    }).then(function(user) {
        //If user null error to frontend
        if(user === null) {
            res.send({error: "Username not found"});
        } else {
            //Checks for valid password and sends user or error message
            user.isValidPassword(req.body.password, function(next, isMatch) {
                if(isMatch == true) {
                    res.send({username: user.username});
                } else {
                    res.send({error: "given password or username incorrect" });
                }
            });
        };
    }).catch(next);
});

// DELETE request by user ID. Uses :id parameter to delete the user.
router.delete('/v1/delete/:id', function(req, res, next) {
    User.findOneAndRemove({username: req.params.id}).then(function(user) {
        res.send(user);
    }).catch(next);
});

// PUT request to update user by ID. Searches by :id parameter to update user information
router.put('/v1/update/:id', function(req, res, next) {
    User.findOneAndUpdate({username: req.params.id}).then(function(user) {
        User.findOne({username: req.params.id}).then(function(user) {
            res.send(user);
        }).catch(next);
    }).catch(next);
});

module.exports = router;