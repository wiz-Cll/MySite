var http = require('http');
var Url = require('url');
var Weather = require('./mongoose');
var City = require('./City');

var latestW = [];

var cityId = '101010100';




execAtO(5, getWeatherAtO );

// execAtO(1, function(){
//     for( var i in City.map ){
//         cityId = i;
//         getWeatherAtO();
//     }
// });

http.createServer( sunnyServer ).listen(8080);

function sunnyServer( req, res){
    var pathName = Url.parse( req.url ).pathName;

    // res.writeHeader(200, {'Content-Type': 'test/plain'});
    // var str = '{"temp":"23", "ws":"3级"}';
    // res.write( str );

    res.writeHeader(200, {'Content-Type': 'application/json'});
    var obj = {temp:"23", ws:"3级"};
    res.write( JSON.stringify(obj) );

    res.end();
}


function execAtO( minutes, func ){
    var now = new Date();
    var now_min = now.getMinutes();
    var now_sec = now.getSeconds();
    if(  fitType( minutes, now_min )  ){
        func();
        next = 60 - now_sec + ( minutes - 1 )*60;
        // console.log('合适，立即执行\n');
        setTimeout( function(){ execAtO( minutes, func)}, next*1000);
    }
    else{
        next = ( getNextO( minutes, now_min ) - now_min - 1 ) * 60 + (60-now_sec);
        // console.log('不合适，将在 '+ next + ' 秒后执行\n');
        setTimeout( function(){ execAtO( minutes, func)}, next*1000);
    }
    
    function fitType( Onum, now_min){
        if( (now_min)%Onum === 0 ){
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
    // console.log('\n\n\n');
    var localCityId = cityId
    var sentTime = new Date();
    var info = '';

    var reqUrl = 'http://www.weather.com.cn/data/sk/'+ localCityId + '.html';
    // console.log( reqUrl );

    http.get( reqUrl, function( res ){
        res.on('data', function(data){
            info += data;
        });
        res.on('end',function(){
            callbackGetWeather(info, localCityId);
        });
    });



    function callbackGetWeather( info, localCityId){
        var gotTime = new Date();
        // console.log( '此时获取了天气信息： ' + gotTime );
        // console.log( info );
        try{
            var wObj = JSON.parse( info ).weatherinfo;
        }
        catch(err){
            console.log('出现错误：处理' + info + '时发生这个错误：----' + err);
            return false;
        }

        // 格式化时间  将获得的仅有小时分钟的时间转换为有年月日 时分的时间
        // 方便前端接收后的差时计算
        // 也便于后台辨别是否发布了更新的天气信息
        if( wObj.time.length === 4){
            wObj.time = '0' + wObj.time;
        }
        wObj.time.replace(':',' ');

        var date = new Date();
        today = date.getDate();
        var month = date.getMonth();
        if( month.length === 1 ){
            month = '0' + (Number(month)+1);
        }
        var year = Number(date.getYear()) + 1900;
        today = year + ' ' + month + ' ' + today;
        wObj.time = today + ' ' + wObj.time;

        // console.log( wObj.time + '\n' + latestW.time );

        // 只有在获取的天气信息的发布时间大于之前存储的“最新天气”时，才进行新实例化对象和存储的操作
        if( notCachedYet(latestW, localCityId, wObj) ){
            latestW[localCityId] = wObj;

            latestW[localCityId].sentTime = sentTime;
            latestW[localCityId].gotTime = gotTime;
            var wEntity = Weather.init( latestW[localCityId] );

            // console.log( '实例化的天气实体： ----' + wEntity );

            wEntity.save( function(err){
                if( err ){
                    console.log('发生错误：' + err );
                }
                else{
                    // console.log('保存成功!');
                    // Weather.model.find( showAllInfo );
                }
            });
        }
        else{
            // console.log('天气信息没有更新...')
        }
    }


    function showAllInfo( err, result ){
        if( !err ){
            // console.log( result );
        }
        else{
            console.log('发生错误： '+ err);
        }
    }

    function notCachedYet( latestW, cityId,  newW){
        if( !latestW[cityId] || !latestW[cityId].time || latestW[cityId].time < newW.time ){
            return true;
        }
        else{
            return false;
        }
    }
}


function sixDays(){

}