
var Title= new Vue({
        el: '#Title',
        mounted() {
            socket.on('connect', function(data) {
                console.log("connected");
                Title.greeting = "websocket connected";
                socket.emit('msg:join', 'Hello World from client');
            });
        },
        data: {
            greeting: "hello vue.js"
        }
    });

    var Login =new Vue({
        el: '#Login',
        data: {
            kayttajanimi: '',
            salasana:'',
            viesti: '',
        },
        methods: {
            vastuussa: function () {
                alert("Ryhmä 3: Antti Niemeläinen, Anssi Keinänen, Eero Nikkinen, Joonas Niinistö, Olli Ritari")
            },
            kirjautumisyritys: function() {
                this.viesti=this.kayttajanimi;
                axios.get('localhost:9000/api/v1/login', {
                    params: {
                        tieto1: this.kayttajanimi,
                        tieto2: this.salasana,
                    }
                })   
                .then(function (response){
                    if (response.data==true){
                        this.viesti="Tervetuloa " + kayttajanimi;
                        this.salasana='';
                        
                        axios.get('localhost:9000/api/v1/Chatname', {
                            params: {
                                tieto1: this.kayttajanimi
                            }
                        })
                    }
                    else {
                        this.viesti="Kirjautuminen epäonnistui! Yritä uudestaan."   
                    }
                })
            }
        }
    });

    var Highscore =new Vue({
        el: '#Highscore',
        data: {
            Highscore: [],
            paivitysaika: ''
        },
        lataahighscore: function() {
            socket.on('connect', function (socket) {    
                this.HaetaanHighscore();
            }.bind(this));
                    
            this.paivitysaika = setInterval(this.HaetaanHighscore, 5000); 
            },
        methods: {
            HaetaanHighscore: function() {
                axios.get('http://localhost:9000/api/v1/highscores').then(response=> this.Highscore =response.data); 
            }            
        }
    });

    var Online =new Vue({
        el: '#Online',
        data: {
           Players: [],
           paivitysaika: ''
        },
        created: function() {
            socket.on('connect', function (socket) {    
                this.Haetaantaulukko();
            }.bind(this));
            
            this.paivitysaika = setInterval(this.Haetaantaulukko, 5000); // Javascript metodi setInterval vastaa listan automaattisesta päivittämisestä. Haluttu aika annetaan millisekunteina.
        },
        methods: {
            Haetaantaulukko: function() {
                axios.get('http://localhost:9000/api/v1/kayttajat').then(response=> this.Players =response.data); // Axios framework auttaa välittämään kutsuja. Palvelimen vastaus siirretään "Players -taulukkoon" 
            }            
        }
    });

    var Chat =new Vue({
        el: '#Chat',
        data: {
            kaikkiviestit:[],
            viesti: ''
        },
        kayttajaliittyi: function() {
            socket.on('connect', function (socket) {    
                socket.emit ('join',[kayttajanimi] );
            });
            socket.on ('viesti', function(){
                this.kaikkiviestit.push();
            }.bind(this));
                     
            },
        methods: {
            lahetaviesti: function() {
                
            }        
        }
    });