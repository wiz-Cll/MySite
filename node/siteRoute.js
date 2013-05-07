var url = require('url');
var fs = require('fs');
var path = require('path');
// var querystring = require('querystring');

var mime = require('../src/script/mime').types;


function staticServer( req, res, basePath){
	var pathName = url.parse( req.url ).pathname;
	// 判断文件是否存在
	var file2read = pathName;
	// 如果是目录，即应该自动读取index  则添加上index
	if( /\/$/.test(file2read)){
		file2read += 'index.html';
	}
	else if( !/\./.test( file2read )){
		file2read += '/index.html';
	}

	// 原来给出的是/开头的，会被认为是绝对路径
	file2read = basePath + file2read.substr(1);

	console.log(file2read);

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
						console.log( file2read + ' read failed');
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
}

function dynamicServer( req, res,basePath ){
	res.writeHeader(200, {'content-type': 'text/plain'});
	res.write(' dynamic in cons````');
	res.end();
}
function route( req, res){
	// 判断是对那个分站的请求
	var basePath = '';	
	switch( req.headers.host ){
		case 'sunny.chenllos.com':
			basePath = 'sunny/';
			break;
		default:
			basePath = './';
			break;
	}

	// 判断请求是动态还是静态  
	// 貌似现在这个不可靠啊···比如带有时间戳的文件请求

	var urlParams = url.parse( req.url, true).query;
	// 如果query为空 说明没有参数  是静态的请求
	if( isEmpty( urlParams ) ){
		staticServer( req, res, basePath );
	}
	else{
		dynamicServer( req, res, basePath );
	}

	// // 用新的判断方法： 有没有.
	// if()
}
exports.route = route;










function isEmpty( obj ){
	for( var i in obj){
		// 可以读取属性 说明是非空
		return false;
	}
	return true;

}