<<<<<<< HEAD
var name = 'global name';
var obj = {
	name: 'local obj name',
	thistest: this.name + ' this test',

	getName: function(){
		var that = this;
		return function(){
			return this.name;
		};
	}
}

var test = obj.getName()();
console.log( test );



var obj2 = {
	name: 'obj2 name',
	thistest: this.name + ' this test',
	getName: function(){
		var that = this;
		return function(){
			return that.name;
		}
	}
}

var test2 = obj2.getName()();
console.log( test2 );

// obj 内部的 this指向外部的环境  即obj<window
// obj 内部的 函数的 this  指向obj
// 函数 内部的 函数的 this  指向window
// 函数内部的obj的this 指向window
// these are tests

// obj内部
var thisobj = {
	thistest: this.name+ '---这里的this指向的是window，所以this.name是global',
	funcInObj: function(){
		return this;
	}
}
console.log( thisobj.thistest );
var thisOfFuncinobj = thisobj.funcInObj();
console.log( 'obj内部的函数的this，指向的是： ');
console.log( thisOfFuncinobj );

// 函数内部

function thisFunc(){
	console.log( this.name + '----这是函数内部的this，指向window');
	function funcInfunc(){
		console.log('函数内部的函数，this仍然指向window    ' + this.name);
	}
	funcInfunc();
	var objInfunc = {
		thistest: this.name
	}
}

=======
var name = 'global name';
var obj = {
	name: 'local obj name',
	thistest: this.name + ' this test',

	getName: function(){
		var that = this;
		return function(){
			return this.name;
		};
	}
}

var test = obj.getName()();
console.log( test );



var obj2 = {
	name: 'obj2 name',
	thistest: this.name + ' this test',
	getName: function(){
		var that = this;
		return function(){
			return that.name;
		}
	}
}

var test2 = obj2.getName()();
console.log( test2 );

// obj 内部的 this指向外部的环境  即obj<window
// obj 内部的 函数的 this  指向obj
// 函数 内部的 函数的 this  指向window
// 函数内部的obj的this 指向window
// these are tests

// obj内部
var thisobj = {
	thistest: this.name+ '---这里的this指向的是window，所以this.name是global',
	funcInObj: function(){
		return this;
	}
}
console.log( thisobj.thistest );
var thisOfFuncinobj = thisobj.funcInObj();
console.log( 'obj内部的函数的this，指向的是： ');
console.log( thisOfFuncinobj );

// 函数内部

function thisFunc(){
	console.log( this.name + '----这是函数内部的this，指向window');
	function funcInfunc(){
		console.log('函数内部的函数，this仍然指向window    ' + this.name);
	}
	funcInfunc();
	var objInfunc = {
		thistest: this.name
	}
}

>>>>>>> 5ef7ace48e2cd40c947c4bc7f1581b1a9eea51cc
thisFunc();