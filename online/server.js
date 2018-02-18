
var express = require('express');
var app = express();
var server = app.listen(8002);

var pelaajat=[];
console.log('Palvelin kuuntelee porttia 8002');  

app.use(express.static(__dirname));

app.get('/', function(request, response){
    res.sendfile('testi.html');
    console.log('Paikalla');      
});

app.get('/api/v1/kayttajat', function(request,response) {
    pelaajat.sort(function(a,b) { return (b.pisteet- a.pisteet ) });
    response.send(pelaajat.slice(0,20));
});

app.get('/api/v1/liittyminen', function(request,response) {
    pelaajat.push({nimi: request, pisteet: 0});
    console.log('Käyttäjä ' +request + ' liittyi peliin ');
});

app.get('/api/v1/poistuminen', function(request,response) {
    console.log('Käyttäjä ' + request + ' poistui pelistä'); 
    for(var i in pelaajat){
        if (pelaajat[i].nimi==request){
            pelaajat.splice(i,1);
            break;
        }
    }
});

