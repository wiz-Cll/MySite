var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var server = http.createServer(function( req, res ){
	//获取请求的url或者pathname
	var pathName = url.parse( req.url ).pathname;
	var reqUlr = req.url;
	console.log( pathName );

	// 判断文件是否存在 
	var file2read = pathName.substr(1);
	if( /\/$/.test(file2read) ){
		file2read += 'index.html';
	}
	console.log( file2read ) ;
	fs.exists( file2read,function( exist ){
		console.log( exist );
		if( exist ){
			// 存在则读取 返回
			fs.readFile(file2read,'binary', function( err, file ){
				if( err ){
					res.writeHeader(500, {'ContentType': 'text/plain'});
					res.write('server internal err:' + err );
					res.end();
				}
				else{
					console.log('read file success');
 					res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    res.write(file, "binary",function( err ){
                    	console.log('what happens ' + err);
                    });
                    res.end();
				}
			})
		}
		else{
			// 不存在 404
			res.writeHeader(404,{'ContentType': 'text/plain'});
			res.write( 'Ooops~ file not found' );
			res.end();
		}
	})
	// 不能有多余的res的操作！
	// res.writeHeader(200, {'ContentType': 'text/plain'});
	// res.write('hello, res');
	// res.end();
});

server.listen(80,function(){
	console.log('server is listening at 80 port');
});
