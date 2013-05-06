var http = require('http');
var Weather = require('./mongoose');

var latestW = {};
function execAtO( minutes, func ){
    var now = new Date();
    var now_min = now.getMinutes();
    var now_sec = now.getSeconds();
    if(  fitType( minutes, now_min )  ){
        func();
        next = 60 - now_sec + ( minutes - 1 )*60;
        console.log('合适，立即执行\n');
        setTimeout( function(){ execAtO( minutes, func)}, next*1000);
    }
    else{
        next = ( getNextO( minutes, now_min ) - now_min - 1 ) * 60 + (60-now_sec);
        console.log('不合适，将在 '+ next + ' 秒后执行\n');
        setTimeout( function(){ execAtO( minutes, func)}, next*1000);
    }
    
    function fitType( Onum, now_min){
        if( now_min%Onum === 0 ){
            return true;
        }
        else{
            return false;
        }
    }

    function getNextO( Onum, now_min ){
    	return ( parseInt( now_min/Onum ) +1 )*Onum;
    }
}

function getWeatherAtO(){
	console.log('\n\n\n');
	var sendTime = new Date();
	console.log( '请求发送时间是： ' + sendTime + ', 也就是: ' + sendTime.valueOf() );
    var info = '';
    http.get('http://www.weather.com.cn/data/sk/101010100.html', function( res ){
    	res.on('data', function(data){
    		info += data;
    	});
    	res.on('end', function(){
    		console.log( '此时获取了天气信息： ' + (new Date()).valueOf() );
            var wObj = JSON.parse( info )
    		// console.log( wObj );

            console.log( wObj );
            var fakeObj = {city:'beijing', temp:'23'};
            var wEntity = Weather.init( fakeObj );

            wEntity.save( function(err){
                if( err ){
                    console.log('发生错误：' + err );
                }
                else{
                    console.log('保存成功！保存的天气信息为：');
                    Weather.model.find( null, function( err, infos){
                        if( !err ){
                            if( infos.length > 0){
                                console.log( infos );
                            }
                        }
                    });
                }
            });
    	});
    });
}

execAtO(2, getWeatherAtO);