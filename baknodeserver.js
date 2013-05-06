var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

// var daemon = require('daemon');

//daemon.start();

var mime = require('./src/script/mime').types;

// console.log( mime.types );

var server = http.createServer(function( req, res ){
	//获取请求的url或者pathname
	var pathName = url.parse( req.url ).pathname;
	var reqUlr = req.url;

	// console.log( pathName );

	// 判断文件是否存在
	var file2read = pathName;
	// 如果是根目录  则添加上index
	if( /\/$/.test(file2read) ){
		file2read += 'index.html';
	}
	console.log(file2read);

	// 原来给出的是/开头的，会被认为是绝对路径
	file2read = file2read.substr(1);

	
	fs.exists( file2read,function( exist ){
		// console.log( exist );
		if( exist ){
			// 存在则读取 返回
			fs.readFile(file2read,'binary', function( err, file ){
				// 成功避免"异步"/"回调"带来的无法匹配读取的二进制和原文件名的bug
				// 通过回调函数里面嵌一个函数,将读取时的文件路径 即文件名传过去
				readfileCallback(err, file, file2read);
				function readfileCallback(err, file, filename){
					if( err ){
						res.writeHeader(500, {'ContentType': 'text/plain'});
						res.write('server internal err:' + err );
						res.end();
					}
					else{
						console.log('read file success');
						// 扩展名...
						// 回调确实是有些麻烦的，如何在读取完成后确定读取的该文件的扩展名呢？
						// 不能预先获取  因为会有很多请求一起发过来，
						var ext = path.extname( filename );
						ext = ext? ext.substr(1) : 'unknown';
						var contentType = mime[ext] || "text/plain";

	 					res.writeHead(200, {
	                        'Content-Type': contentType
	                    });
	                    res.write(file, "binary",function( err ){
	                    	console.log('what happens ' + err);
	                    });
	                    res.end();
					}
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
