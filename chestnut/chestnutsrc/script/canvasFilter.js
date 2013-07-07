$(document).ready( function(){

	$('#btn_gs').click( function(){
		var img = document.querySelector('#gs');
		var canvas = document.querySelector('#test');

		runFilter( img, canvas, 'grayscale' );
	});

	$('#btn_ft').click( function(){ 
		var canvas = $('#ft').get(0);
		var str = '56';
		// Text.
		var funcStart = new Date();
		Text.echoColorSpot( str, canvas);
		var funcEnd= new Date();
		console.log('整个函数，创建虚拟的canvas，写字  读字  描边 写回去，共花费时间： ' + ( funcEnd.valueOf() - funcStart.valueOf() ));
		// alert( $('body').css('font') );

	} );


	$('#bezier_btn').click(function(){
		bezierTest1();
	});
});

var Filter = {};
Filter.getCanvas = function(w, h){
	if( $( '.fakecanvas').length > 0 ){
		return $( '.fakecanvas').get(0);
	}
	else{
		var c = document.createElement('canvas');
		c.className = 'fakecanvas';
		c.width = w;
		c.height = h;
		// $('body').append( $( c ));
		return c;
	}
}

Filter.getPixels = function( img ){
	// 老是出dom exception啊  怎么个原因
	// a a a   
	// 原来是getcanvas的时候初始宽度错误了！！！！！
	var w = img.width;
	var h = img.height;
	var c= this.getCanvas( w, h );
	var ctx = c.getContext('2d');
	try{
		// var c= $('canvas').get(0);
		// var ctx=c.getContext("2d");
		// var img=$('img').get(0);
		console.log( c.width + ' - - - ' + c.height);
		// 从这里可以看出 在元素创建了之后，即便没有append到dom树中，也是可以操作的，
		// 也就是说，优化dom操作的过程中就可以这样做： 将所有的操作都做完  最后才append 
		// 而不是append后又一而再再而三的改变节点导致reflow和rerender
		ctx.drawImage(img, 0, 0);
		return ctx.getImageData(0,0,c.width,c.height);
		// return false;
	}
	catch( err ){
		console.log( err );
	}
	return ctx.getImageData( 0, 0, w, h );
}

Filter.grayscale = function( img ){
	var idata = this.getPixels( img );

	var d = idata.data;

    var len = d.length;
	for( var i = 0, len = d.length; i < len ; i += 4 ){
		// 获取三原色 和 透明度
		var r = d[i];
		var g = d[i+1];
		var b = d[i+2];
		// var opacity = d[3];

		// 计算灰度值
		var v = r*0.2126 + g* 0.7152 + b* 0.0722;
		// 0.2126*r + 0.7152*g + 0.0722*b; 

		// 重新给imgdata
		d[i] = d[i+1] = d[i+2] = v;
		if( i > 80000){
			// d[i] = d[i+1] = d[i+2] = 255;
			break;
		}
	}
	return idata;
}

var Text = {};
Text.getPixels = function fillText( str ){
	var c = document.createElement('canvas');
	c.width  = 500;
	c.height = 500;

	var ctx = c.getContext('2d');
	ctx.font = 'bold 300px arial';
	ctx.fillStyle= '#ef7f7f';
	ctx.fillText( str , 50, 400);

	var iData = ctx.getImageData(0,0, c.width, c.height );
	return iData;
}

Text.echoColorSpot = function( str, c){
	c.width = 500;
	c.height = 500;
	var iData = this.getPixels( str );
	var d = iData.data;
	var total = 0;
	console.log('现在开始统计循环花费的时间');
	var start = new Date();
	for(var i = 0, len = d.length; i< len; i +=4){
		total = d[i] + d[i+1] + d[i+2];

		// 判断边缘  左边缘   右边缘与之类似   但是填充显示出来很差劲···
		// 因为从来都不是绝对的边缘  都是平滑过渡的
		if( this.isEdge( d, i, iData.width) ){

			var w = iData.width;
			var h = iData.height; 
			var coordObj = getCoord( i, w, h );

			// console.log( d[i] + ' ---- ' +d[i+1] + ' ---- ' + d[i+2] + ' --- '+ d[i+3] );
			// console.log( d[i] + ' 和 ' + d[i+4] + ' 的色值是不一样的' );

			// 透明的色值是这样的： rgb为0  alpha也为0
			d[i] = d[i+1] = d[i+2] = 255 ;
			// d[i+4] = d[i+5] = d[i+6] = 0 ;

			// canvas的透明度是全局的啊··一旦修改了  透明的背景也变成黑色的了
			// 是这样的吗···
			// d[i+3] = 255;
			// d
			// d[i+3] = 1;

			// if( i > 143000){ 
			// 	break;
			// }
		}
		else{
			// console.log( i + '不是边缘');
		}
	}
	var end = new Date();
	console.log('循环和轻微计算共花费时间： ' + (end.valueOf() - start.valueOf()) );
	// 我勒个去···才12ms  很快嘛
	var ctx = c.getContext('2d');
	ctx.putImageData( iData, 0, 0 );
	return false;
}

Text.isEdge = function( d, i, width ){
	// 左边缘   本身透明度不为0    它 左边 的元素为0
	if( d[i+3] === 0 && d[i-4+3] !== 0){
		// console.log( i );

		return true;
	}
	// 右边缘     本身透明度不为0    它 右边 的元素为0
	else if( d[i+3] !== 0 && d[i+4+3] === 0 ){
		return true;
	} 
	// 上边缘  本身透明度不为0    它 头顶 的元素为0
	else if( d[i+3] !== 0 && d[i - 4*width +3] === 0 ){
		return true;
	}
	// 下边缘 本身透明度不为0    它 脚下 的元素为0
	else if( d[i+3] !== 0 && d[i+ 4*width +3] === 0 ){
		return true;
	}
	else{
		return false;
	}

}


function runFilter( img, canvas, filter, arg1, arg2, arg3){
	var idata = Filter[ filter ]( img, arg1, arg2, arg3);

	canvas.width = img.width;
	canvas.height = img.height;

	var ctx = canvas.getContext( '2d' );
	ctx.putImageData( idata, 0, 0);

	document.querySelector('.filter').className += 'done';
	return false;
}


function getCoord( i, w, h ){

	var pixelIndex = i/4;

	var x = pixelIndex%w;
	var y = parseInt( pixelIndex/w );

	return {x: x, y: y};
}


/*   ------------------- 贝塞尔曲线测试 bezierCurveTo and quadraticCurveTo--------------------------*/

function bezierTest1(){
	var c = document.querySelector('#bezier_canvas');
	var ctx = c.getContext('2d');
	ctx.beginPath();
	ctx.moveTo(110,100);
	ctx.lineTo(10,10);
	ctx.quadraticCurveTo( 110, 100, 210,10);
	ctx.lineTo( 110,100);
	ctx.stroke();

	return false;
}