var http = require('http');
var url = require('url');
// var fs = require('fs');
var path = require('path');

var Route = require('./node/siteRoute');

// console.log( mime.types );

var server = http.createServer(function( req, res ){

	Route.route( req, res);
	console.log(' 在nodeserver中 收到请求： -------------');
	console.log( ' 在nodeserver中 ' + url.parse( req.url).query );
	console.log(' 在nodeserver中 -------------');

});

server.listen(8800,function(){
	console.log('在nodeserver中, server is listening at 8800 port');
});
