var server = require('./server');
var route = require('./route');
var rh = require('./requestHandler');

// 若使用对象字面量声明处理程序合集对象，则必须在调用对象之前
// 还是预编译的问题，跟“函数声明” 一样   在此之前的语句只会拿到undefined的值

// 教程中给出的那种  先声明空对象  然后各个属性赋值  不会出现这个问题
var handler = {
	'/': rh.start,
	'/start': rh.start,
	'/upload': rh.upload
};

server.start( route.route, handler);




