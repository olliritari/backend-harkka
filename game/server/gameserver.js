"use strict";

// TEMP EDIT INCLUDE AXIOS
const axios = require('axios');

const Bubble = require('./bubble');
const Player = require('./player');

const config = require('./config.js');

class GameServer {
  constructor(wss) {
    console.log(":: starting up the game server ::");
    console.log("map size = " + config.map.x + "x" + config.map.y);
    this.wss = wss;
    this.game = { 
      bubbles: [], // hold "static" bubbles
      clients: []  // hold sockets
    };
    this.init();    
    this.socketHandler(wss);
  }

  init() {
    // Create bubbles
    this.initBubbles();

    // Start sync pulses 
    var tmo = setInterval((function() {
      var handle = this;
      // calculate client movement
      this.game.clients.forEach(function(item, index, object) {

        var self = item.player;
        var velocity = self.speed / self.mass;
        
        // Calculate new positions
        // Calculate X
        if (self.mousex >= config.viewport.x / 2) 
             { self.x += velocity; }
        else { self.x -= velocity; }
        // Calculate Y
        if (self.mousey >= config.viewport.y / 2) 
             { self.y += velocity; }
        else { self.y -= velocity; }

        // Calculate eaten bubbles
        this.game.bubbles.forEach(function(item, index, object) {
          var bubble = item;
          var dx = self.x - bubble.x;
          var dy = self.y - bubble.y;
          var distance = Math.sqrt(dx*dx+dy*dy);
      
          if(distance < self.radius + bubble.radius && (!item.name/* !== self.name TODO: player collisions*/)) {
            self.radius += (bubble.mass*10) / self.radius;
            self.speed -= bubble.mass / self.radius;
            // Bubble eaten, tag replot
            item.tagReplot();
            axios.get('http://localhost:9000/api/v1/kayttajat')
          }
        });
      }, this);

      // TODO: this sends a lot of data, optimize! (e.g. send only elements which location/status has changed)
      handle.updateBubbles();
    }).bind(this), config.game.syncinterval);
  }

  initBubbles() {
    for (let i=0; i<config.bubble.count; i++) {
      this.game.bubbles.push(new Bubble());
    }
  }

  updateBubbles() {
    let replotted = [];
    // Replot necessary bubbles
    this.game.bubbles.forEach(function(element) {
      if(element.replot === true) {
        if(!element.name) {
          element.rePlot();
        }
        replotted.push(element);
      }
    });
    this.wss.sockets.emit('game:sync:partial', replotted);
  }

  socketHandler(wss) {
    var handle = this;

    wss.on('connection', function(client) {
      handle.join(client);
      var clients = handle.game.clients;

      // TODO: sync should happen after a successful login
      //console.log("config:", config);
      client.emit('game:config', config);

      client.on('client:login', function(data) {
        console.log("client:login", data);

        // TODO: login
        this.emit('client:login', { player: this.player,
                                    response: true});

        this.emit('game:init', handle.game.bubbles.indexOf(client));
        
        this.emit('game:sync:full', handle.game.bubbles);
        
      });

      client.on('client:register', function(data) {
        // handle register here
      });

      client.on('client:location', function(data) {
        //console.log("client:location", data, this.player);
        // update user location
        this.player.mousex = data.x;
        this.player.mousey = data.y;
      });
      
      client.on('disconnect', function(client) {
        handle.leave(client);
      })
    });
  }

  join(client) {
    // add new client
    let newplayer = new Player();
    client.player = newplayer;
    client.emit('game:init', newplayer);
    client.emit('game:sync:full', this.game.bubbles);
    this.game.clients.push(client);
    this.game.bubbles.push(newplayer);
    console.log(`player joined, now we have ${this.game.bubbles.length} bubbles`);
  }

  leave(client) {

    delete this.game.clients[this.game.clients.indexOf(client)];
    this.game.clients.splice(this.game.clients.indexOf(client), 1);
    
    delete this.game.bubbles[this.game.bubbles.indexOf(client)];
    this.game.bubbles.splice(this.game.bubbles.indexOf(client), 1);
    console.log("player left");
  }
};

module.exports = GameServer;