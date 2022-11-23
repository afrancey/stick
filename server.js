// started 8:50pm nov 22
// https://gamedevacademy.org/create-a-basic-multiplayer-game-in-phaser-3-with-socket-io-part-1/

var express = require('express');
var app = express();
var server = require('http').Server(app);
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
server.listen(8080, "0.0.0.0", function () {
  console.log(`Listening on ${server.address().port}`);
});