var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var Route = require('./node/siteRoute');

// console.log( mime.types );

var server = http.createServer(function( req, res ){

	Route.route( req, res);

});

server.listen(80,function(){
	console.log('server is listening at 80 port');
});
