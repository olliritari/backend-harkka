"use strict";
const express = require('express');
const app = express();

const HOST = "127.0.0.3";
const PORT = 8003;

// Add websocket support
const server = require('http').createServer(app);  
var wss = require('socket.io')(server);
// Start game server
const GameServer = new (require("./server/gameserver"))(wss);

app.use('/client', express.static(__dirname + '/client'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/api/v1/connectgame', function(req, res) {
  res.send(HOST + ":" + PORT);
});

wss.listen(PORT, function () {
  console.log('server up @ http://' + HOST + ":" + PORT);
});