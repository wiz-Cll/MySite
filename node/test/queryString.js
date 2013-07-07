var queryString = require('querystring');

var obj = {
	firstname: 'Liangliang',
	lastname: 'Chen',
	age: '23'
}
var obj2str = queryString.stringify( obj, sep='&', eq='=');
console.log( obj);
console.log( '转化为字符串是: ' + obj2str );
console.log( JSON.stringify( obj ));

var str2obj = queryString.parse( obj2str , sep='&', eq='=' );

console.log( str2obj );


// 结论： node的querystring和JSON的方法是不一样的

// querystring.stringify   -》  { firstname: 'Liangliang', lastname: 'Chen', age: '23' }
// JSON.stringify          ->   {"firstname":"Liangliang","lastname":"Chen","age":"23"}

//相应的  再转化为对象也要使用相应的方法 