var http  = require('http');

// var options = {
//   hostname: 'www.weather.com.cn',
//   // port: 80,
//   path: '/data/sk/101010100.html',
//   method: 'GET'
// };

// var req = http.request(options, function(res) {
//   console.log('STATUS: ' + res.statusCode);
//   console.log('HEADERS: ' + JSON.stringify(res.headers));
//   res.setEncoding('utf8');
//   res.on('data', function (chunk) {
//     console.log('BODY: ' + chunk);
//   });
// });


// 成功的使用封装好的get方法获取实时天气信息
// var info = '';

http.get("http://www.weather.com.cn/data/sk/101010100.html", function(res) {
	res.on('data', function(data){
		info += data;
	});
	res.on('end', function(){
		var formatInfo = JSON.parse(info);
		console.log('接受完成...');
		console.log(formatInfo);
	});
  console.log("Got response: " + res.statusCode);
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});