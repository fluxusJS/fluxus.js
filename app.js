
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , io = require('socket.io')
  , useragent = require('useragent')
  , gm = require('googlemaps')
  , pusher = require('node-pusher');

var app = module.exports = express.createServer();

// Clients is a list of users who have connected
var clients = [];

///////////////////////////////////////////////////////////////////// SEND() UTILITY
function send(message) { 

  clients.forEach(function(client) {
      client.send(message);
  });
}

///////////////////////////////////////////////////////////////////// DATE UTILITY
function getTime(){
	var currentTime = new Date();
	return currentTime;
}

// JADE Configuration ////////////////////////////////////////////////////////////////
	app.configure(function(){
	  app.set('views', __dirname + '/views');
	  app.set('view engine', 'jade');
	  app.use(express.bodyParser());
	  app.use(express.methodOverride());
	  // app.use(require('stylus').middleware({ src: __dirname + '/public' }));
	  app.use(app.router);
	  app.use(express.static(__dirname + '/public'));
	});

	app.configure('development', function(){
	  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
	});

	app.configure('production', function(){
	  app.use(express.errorHandler()); 
	});

// Jade Routes ////////////////////////////////////////////////////////////////////////
	
	app.get('/', routes.index);
	app.get('/spectator', routes.spectator);
	app.get('/performer', routes.performer);

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


///////////////////////////////////////////////////////////////////// SOCKET.IO SERVER
var sio = io.listen(app);
// console.log(sio.settings);

///////////////////////////////////////////////////////////////////// SOCKET.IO WEB SOCKETS
sio.sockets.on('connection', function(client) {
  // For each connection made add the client to the array of clients.
  console.log('server connection EVENT FIRED');
  //console.log('CLIENT connected'); 
  console.log('CLIENT ID: ' + client.id + ', TRANSPORT MECHANISM: ' + sio.transports[client.id].name);

///////////////////////////////////////////////////////////////////// BUILD CLIENTS LIST
  clients.push(client);
  console.log(clients.length);

  send(JSON.stringify({ "clients": clients.length }));

  // log each clients id
  clients.forEach(function(client) {

    console.log('CLIENT ID: ' + client.id);
    // console.log(client);

  });

  client.on('disconnect', function () {
    console.log('disconnect EVENT FIRED');
	console.log(clients.length)
	var index = clients.indexOf(client.id);
	console.log(index)
	clients.splice(index, 1);
	console.log(clients.length)
  });

  client.on('geo', function(data) {
	console.log('geo MESSAGE received ');
	console.log(data);
	var loc = data.lat + "," + data.long
	console.log(loc)
	gm.reverseGeocode(loc, function(err, data){

	  var city = data.results[0].address_components[2].long_name;	
	  var state = data.results[0].address_components[4].long_name;
	  var loc = city + ", " + state; 
	  send(JSON.stringify({ "loc": loc }));
	});
  });
});  





