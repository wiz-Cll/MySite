// ( function(){
	var P = 640;
	var W = 100;
	var ANG = 45;
	function calc(oldx, angle, p){
	    var x =Math.cos(angle)* oldx;
	    var z =Math.sin(angle)* oldx;
	    return x * p /(p+z);
	}

	function cacuD( oldD, w, angle, p ){
		return p*( Math.abs(oldD) + w/2 -Math.cos( angle*Math.PI/180 ) ) / ( p + Math.sin( angle*Math.PI/180 )*w/2 );
	}

	function cacuC( oldC, w, angle, p ){
		return p*( Math.abs(oldC) - w/2 + Math.cos( angle*Math.PI/180 ) ) / ( p - Math.sin( angle*Math.PI/180 ) * w/2 );
	}
	function changeAngle( nodeObj, transStr){
		// var setting = 'perspective(' + P +') ';
		nodeObj.style.webkitTransform = transStr;
	}


	function initTransDeg( nodeList, deg ){
		var nodeCount = nodeList.length;
		var defaultLoca = 0;
		var angle;
		defaultTrans = 'perspective(640) ';

		for( var i = 0; i< nodeCount; i++ ){
			if( i%2 == 0){
				angle = deg;
			}
			else{
				angle = -deg;
			}
			nodeList[i].style.webkitTransform = defaultTrans + 'rotateY(' + angle + 'deg)';
			nodeList[i].style.left = i*25 + '%';
		}
	}

	function moveToRightPos( nodeList, angle ){
		var oldA = 0;
		var oldB = W;
		var cordA, cordB;
		var newA, newB;
		/* -- 挪到中点坐标 -- */
		oldA -= W/2;
		oldB -= W/2;
		/* -- 使用StackOverflow给出的公式计算 -- */
		cordA = calc( oldA, angle * (Math.PI/180), P );
		cordB = calc( oldB, angle * (Math.PI/180), P );
		/* -- 还原坐标 -- */
		newA = cordA + W/2;
		newB = cordB + W/2;
		// 在动画中输出console信息反而是浪费时间的···
		console.log( 'coord: ' + cordA + ' -- ' + cordB );
		console.log( 'new: ' + newA + ' -- ' + newB );

		var realWidth = newB - newA;


		for( var j = 0; j < nodeList.length; j++){
			var toLeft = j * realWidth;
			if( j%2 == 0 ){
				nodeList[j].style.left = toLeft - newA + 'px';
			}
			else{
				nodeList[j].style.left = toLeft + ( -(W - newB) ) + 'px';
			}
		}
	}

	function slowMotion( transList, angle ){
		initTransDeg( transList, angle );
		moveToRightPos( transList, angle );
	}

	window.onload = function(){
		var transList = document.querySelectorAll('.ctn .trans');

		p = Number( window.getComputedStyle( document.querySelector('.ctn') ).width.substr(0,3) );

		slowMotion( transList, 45);
		// initTransDeg( transList, ANG);
		// moveToRightPos( transList );
	}


	// var angle = 0;
	// var transList = document.querySelectorAll('.ctn .trans');

	// var stID = setInterval( function(){
	// 	if( angle < 40 ){
	// 		angle++;
	// 		slowMotion( transList, angle );
	// 	}
	// 	else{
	// 		clearInterval( stID );
	// 	}
	// }, 20);



// })();