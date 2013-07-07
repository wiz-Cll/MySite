function start( response ){
	console.log('gonna "start" fucntion');
	response.writeHeader(200, {'Content-Tpye':'text/plain'});
	response.write('<head><meta charset="utf-8"/></head>');
	response.write('我们来到了start的处理函数，通过直接将response对象传给请求处理函数来实现');
	response.end();
}
function upload( response ){
	console.log('gonna start "upload" function');
}

exports.start = start;
exports.upload = upload;