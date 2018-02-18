const Bubble = require('./bubble.js');
const config = require('./config.js');

class Player extends Bubble {

  constructor(x, y, color, name) {
    super(x, y, color);
    this.name = name || (config.player.name + Math.floor(Math.random()*1000000));
    this.mass = config.player.mass;
    this.radius = config.player.radius;
    this.speed = config.player.speed;
    this.replot = true; // must be ´true´ to update in every sync rounds
    
    console.log("created player", this);
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

module.exports = Player;