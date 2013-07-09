var http = require('http');
var url = require('url');
// var fs = require('fs');
var path = require('path');

var Route = require('./node/siteRoute');

// console.log( mime.types );

var server = http.createServer(function( req, res ){

	Route.route( req, res);
});

server.listen(8800,function(){
	console.log('在nodeserver中, server is listening at 8800 port');
});
