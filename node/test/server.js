var http = require('http');
var Url = require('url');

function start( route, handler, response ){
	console.log('服务器启动... ...');
	http.createServer( helloworld ).listen(8080);

	function helloworld( request, response){
		var pathName = Url.parse( request.url ).pathname;
		console.log( 'request for "' + pathName + '" recived\n' );
		route( handler,  pathName, response );
		// response.writeHeader(200, {'Content-Type': 'text/plain'});
		// response.write('<h2>Hello World!</h2><p>Well, it didn\'t show listening port 8888</p>');
		// response.end();
	}
}

exports.start = start;
