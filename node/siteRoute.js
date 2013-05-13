var url = require('url');
var fs = require('fs');
var path = require('path');

// var querystring = require('querystring');

var mime = require('../src/script/mime').types;
var weather = require('./Weather');


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
						res.writeHeader(500, {'Content-Type': 'text/plain'});
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

function dynamicServer( req, res ){
	// console.log( res );

	var reqQuery = url.parse( req.url, true).query;
	console.log( '在siteRoute中： querystring是： ');
	console.log( reqQuery );
	if( reqQuery.type ){
		weather.res( reqQuery.type,reqQuery.cityid, res );
	}
	else{
		console.log( arguments.callee.name + '   请求的不是天气')
	}
	// try{
	// 	switch( reqQuery.type ){
	// 		case 'rt':
	// 			console.log('请求查询实时天气------');
	// 			weather.resRT( reqQuery.cityid, res );
	// 			return false;
	// 		case 'sd':
	// 			console.log('请求查询六天天气------');
	// 			weather.resSD( reqQuery.cityid, res );
	// 			return false;
	// 	}
	// }
	// catch( err ){
	// 	console.log( '在siteRoute中：请求类型不是weather')
	// }

}

function route( req, res){
	// 判断是对那个分站的请求
	var basePath = '';
	var host = req.headers.host;
	var pathname = url.parse( req.url ).pathname
	console.log( ' 在route中 请求头的host为： ' + host);
	console.log( ' 在route中 请求path为： ' +  pathname );
	switch( host ){
		case 'sunny.chenllos.com':
			basePath = 'sunny/';
			break;
		// case 'sunny.chenllos.com':
		// 	basePath = 'sunny/';
		// 	break;
		default:
			basePath = './';
			break;
	}

	
	// 判断请求是动态还是静态  
	// 貌似现在这个不可靠啊···比如带有时间戳的文件请求

	var urlParams = url.parse( req.url, true).query;
	// 如果query为空 说明没有参数  是静态的请求
	if( isEmpty( urlParams ) ){
		/*
		 * 在生产环境下
		 * 如果通过chenllos.com/sunny访问sunny的目录，则进行重定向;
		 * 
		 * 
		*/
		if( pathname.indexOf('/sunny') != 0 ){
			console.log( arguments.callee.name + '   不符合跳转的判断: pathname中的sunny位置不对');
			console.log( '在siteRoute中：------------使用静态服务组件------------');
			staticServer( req, res, basePath );
		}
		else{
			if( host.indexOf('127.0.0.1') < 0 ){
				console.log( arguments.callee.name + '   符合跳转的判断, 即将进行跳转')

				res.writeHead(302, {
				  'Location': 'http://sunny.chenllos.com'
				  //add other headers here...
				});
				res.end();
				return false;
			}
			else{
				console.log( arguments.callee.name + '   不符合跳转的判断, 不进行跳转')
				// do nothing
			}
		}
		
	}
	else{
		console.log( '在siteRoute中：----------使用  dongtai 服务组件------------');

		dynamicServer( req, res );
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
