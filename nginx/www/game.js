var socket = io.connect('http://localhost:80', { path: '/api/v1/connectgame/socket.io' });
//var socket = io.connect('http://a41d.k.time4vps.cloud:8000');

var vm = new Vue({
  el: '#vueapp',
  data: {
    greeting: "hello vue.js",
    bubbles: [],
    width: 400,
    height: 300,
    player: {
      x: 100, 
      y: 100
    },
    mouseloc: {
      x: 0,
      y: 0
    },
    config: ""
  },
  methods: {
    moveBubble(event) {
      //console.log("sending coords!", event);
      vm.mouseloc.x = event.offsetX;
      vm.mouseloc.y = event.offsetY;
    },

    initGameboard() {
      console.log("initializing gameboard");
      var ctx = vm.$refs.canvas.getContext("2d");
      ctx.clearRect(0, 0, vm.width, vm.height);
      console.log(`plotting player (${vm.width/2},${vm.height/2}) radius ${vm.player.radius} color ${vm.player.color}`);
      vm.plotBubble((vm.width / 2), (vm.height / 2), "red", vm.player.name, vm.player.radius, ctx);
      vm.plotBubble((vm.width / 2), (vm.height / 2), "red", "asdf", 1, ctx);
    },

    renderBubbles() {
      console.log(`rendering ${vm.bubbles.length} bubbles`);
      var ctx = vm.$refs.canvas.getContext("2d");

      ctx.clearRect(0, 0, vm.width, vm.height);

      // Plot center
      vm.plotBubble((vm.width / 2), (vm.height / 2), "black", "", 1, ctx);

      let newx = 0;
      let newy = 0;

      vm.bubbles.forEach(function(element) {
        // Render only objects visible to player
        //console.log("player", vm.player.x, vm.player.y);
        let diffx = Math.abs(vm.player.x - element.x);
        let diffy = Math.abs(vm.player.y - element.y);

        if(element.name === vm.player.name) {
          newx = element.x;
          newy = element.y;
          //console.log("element:", element, vm.player);
        }

        if(diffx < vm.width / 2 && diffy < vm.height / 2) {
          // Plot only bubbles visible to player
          // Calculate offset and plot bubble
          let topleft = {x: vm.player.x - vm.width / 2,
                         y: vm.player.y - vm.height / 2};
          vm.plotBubble(element.x - topleft.x, element.y - topleft.y, element.color, element.name, element.radius, ctx);
        }
      });

      // Set new player location
      if(newy && newx) {
        vm.player.x = newx;
        vm.player.y = newy;
        socket.emit('client:location', vm.mouseloc);
      }
    },

    plotBubble(x,y,color,name,radius,ctx) {
      ctx.beginPath();
      ctx.arc(x, y, radius, Math.PI*2, 0, true);
       // uncomment below if you want to use the same color in bubble and text
      ctx.fillStyle = color;
      if(name) { 
        ctx.font = "20px Georgia";
        ctx.fillText(name, x - 55, y - (radius+5));
      }

      ctx.fill();
      ctx.stroke();
    }
  },
  mounted() {
    socket.on('connect', function() {
      console.log("connected");
      vm.greeting = "websocket connected";
    });

    socket.on('game:config', function(msg) {
      // Update online players
      console.log("game:config", msg);
      vm.width = msg.viewport.x;
      vm.height = msg.viewport.y;
      vm.config = msg;
    });

    socket.on('game:sync:full', function(msg) {
      //console.log("game:sync:full", msg);
      if(msg) {
        vm.bubbles = msg;
      } else {
        console.log("bogus data from server", msg);
      }
    });
    socket.on('game:sync:partial', function(msg) {
      //console.log("game:sync:partial", msg);
      if(msg) {
        msg.forEach(function(element) {
          vm.bubbles[element.id] = element;
        });
      } else {
        console.log("bogus data from server", msg);
      }
      vm.renderBubbles();
    });

    socket.on('game:init', function(player) {
      // Plot bubbles on canvas
      console.log("got init", player);
      vm.player = player;
      vm.initGameboard();
    });
  }
});
