const config = require('./config.js');

var id = 0;

/* Don't delete bubbles! rePlot them! */
class Bubble  {
  constructor (x, y, color) {
    this.id = id++;
    this.x = x || this.randomizeLocation(config.map.x);
    this.y = y || this.randomizeLocation(config.map.y);
    this.mass = (Math.random()).toFixed(3);
    this.radius = config.bubble.radius;
    this.color = color || this.randomizeColor();
    this.replot = false;    
  }

  randomizeLocation(max) {
    return Math.floor(Math.random()*max);
  }

  randomizeColor() {
      return config.bubble.colors[Math.floor(Math.random()*config.bubble.colors.length)];
  }

  tagReplot() {
    this.replot = true;
  }

  rePlot(x, y) {
    this.replot = false;
    this.x = x || this.randomizeLocation(config.map.x);
    this.y = y || this.randomizeLocation(config.map.y);
    this.mass = (Math.random()).toFixed(3);
    this.radius = config.bubble.radius;
    this.color = this.randomizeColor();
  }
};

module.exports = Bubble;