var http = require('http');
var Url = require('url');
var mModel = require('./mongoose').model;
// var City = require('./City');

var latestW = [];

var cityId = '101010100';

// 两个用来记录的setTimeout的id
var stID_rt;
var stID_sd;



// http.createServer( sunnyServer ).listen(8080);

// function sunnyServer( req, res){
//     var pathName = Url.parse( req.url ).pathName;

// }

// @func  在符合条件的间执行func函数
// @param minutes: 相隔的一段时间
//        func:    执行的函数 
//        blFirst: 是否第一次执行时执行func函数 默认为false
//        blRetry: 是否监控func的返回值，失败时进行重试 默认为false
//        stID:    用来记录settimeout的id
function execAtO( minutes, func, blFirst, blRetry, stID ){
    var now = new Date();
    var now_min = now.getMinutes();
    var now_sec = now.getSeconds();

    var victory;
    
    // 先不管后几个参数  合适就执行！
    if(  fitType( minutes, now_min )  ){
        console.log   ('合适，立即执行\n');
        victory = func();
        next = 60 - now_sec + ( minutes - 1 )*60;
        stID = setTimeout( function(){ execAtO( minutes, func, false, blRetry, stID )}, next*1000);
    }
    else{
        // 不合适的时候 才是看后几个参数的时候
        if( blFirst ){
            // 如果blFirst为真，则进来函数后不管是否符合条件就先执行一次
            // 后续的通过setTimeout调用自身的时候都设置为false
            victory = func();
        }
        else{
            // donothing
        }
        next = ( getNextO( minutes, now_min ) - now_min - 1 ) * 60 + (60-now_sec);
        console.log('不合适，将在 '+ next + ' 秒后执行\n');
        stID = setTimeout( function(){ execAtO( minutes, func, false, blRetry, stID)}, next*1000);
    }
    





        // 暂时没有retry的函数  不好做 以后会有的
        // if( blRetry ){
        //     // 如果失败 这重试
        //     if( !victory ){
        //         execAtO( minutes, func, blFirst, true, stID )
        //     }
        // }
        // else{
        //     // donothing 照常运行
        // }



    // function judgeAndExec(){

    // }


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


function getRTWeather(){
    console.log(' 获取实时天气信息的函数启动~ ');
    var localCityId = cityId;
    var sentTime = (new Date()).valueOf();
    var info='';

    var reqUrl = 'http://www.weather.com.cn/data/sk/'+ localCityId + '.html';
    console.log( '请求天气的地址是： ' + reqUrl );

    http.get( reqUrl, function( res ){
        res.on('data', function(data){
            info += data;
        });
        res.on('end',function(){
            // console.log( info);
            callbackGetRTWeather(info, localCityId);
        });
    });



    function callbackGetRTWeather( info, localCityId){
        var gotTime = (new Date()).valueOf();
        console.log( '此时获取了天气信息： ' + gotTime );
        // console.log( info );
        // 解析串-—》对象  方式有问题
        // 不是方式有问题  是info的初始化  应该为空串  而不是undefined
        try{
            var wObj = JSON.parse( info ).weatherinfo;
        }
        catch( err ){
            var info = info.replace('undefined','');
            // console.log( info );
            var wObj = JSON.parse( info ).weatherinfo;
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

            // console.log( latestW[localCityId] );
            // console.log( mModel );

            var wEntity = new mModel.rtWeather( latestW[localCityId] );

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


function getSDWeather(){
    console.log('获取6天的天气');
    var localCityId = cityId;
    // var localCityId = '101010100';

    var sentTime = (new Date()).valueOf();
    var info;

    var reqUrl = 'http://m.weather.com.cn/data/'+ localCityId + '.html';
    console.log(reqUrl);

    http.get( reqUrl, function( res ){
        res.on('data',function( data ){
            info += data;
            console.log('开始获取');
        });
        res.on('end', function(){
            console.log('获取成功');
            callBackGetSDWeather( info, localCityId );
        });
    });

    function callBackGetSDWeather( info, cityId ){
        // 取值 方便排序
        var gotTime = (new Date()).valueOf();
        // console.log( '天气的string是：  ' + info );
        try{
            var wObj = JSON.parse( info ).weatherinfo;
        }
        catch( err ){
            var info = info.replace('undefined','');
            // console.log( info );
            var wObj = JSON.parse( info ).weatherinfo;
        }
        console.log( wObj );
        // 加一层判断  是否为正确的city  是否为当天的天气
        console.log( wObj.date_y );
        console.log( gotTime.toLocaleDateString() );

        if( wObj.cityid === cityId &&  wObj.date_y === toChineseDate(gotTime) ){
            // 成功  则保存
            wObj.sentTime = sentTime;
            wObj.gotTime = gotTime;
            wEntity = new mModel.sdWeather( wObj );
            wEntity.save(null, function(err){
                if( !err ){
                    console.log('保存新的sdweather成功！');
                    return true;
                }
                else{
                    console.log('保存新的sdweather失败....');
                }
            })
        }
        else{
            // 获取失败  就返回false
            console.log('失败···')
            return false;
        }
    }
}


// @func 查询数据库中的天气信息 并返回
function resRTWeather( cityId, res ){
    // 查询最新
    // 返回数据
    var queryRes = queryMax( mModel.rtWeather, 'gotTime' );
    if( queryRes ){
        res.writeHeader(200, {'content-type': 'json/application'});
        var resObj = {
            return_code: 200,
            weather: queryRes
        }
        res.write( JSON.stringify( resObj ) );
        res.end();
    }
    else{
        console.log('查询实时天气时出现错误 ');
        res.writeHeader(500, {'content-type': 'json/application'});
        var resObj = {
            return_code: 500,
            msg: '查询数据库出错'
        }
        res.write( JSON.stringify( resObj ) );
        res.end();
    }
    return false;
}


// 将基础函数放在utility文件中 方便各处调用
// 如日期格式化函数，respond函数（ 传入响应码和对象，以及mime格式 ）

function queryMax( model, field ){
    model.find().sort( field ).exec( function( err, resu){
        if( !err ){
            return resu.pop();
        }
        else{
            return false;
        }
}
function toChineseDate( dateObj ){
    var year = ( dateObj.getYear() + 1900 )+'年';
    var month = ( dateObj.getMonth() + 1 )+'月';
    var date = ( dateObj.getDate() )+'日';
    return year+month+date;
}



// var query = mModel.rtWeather.find([]);
// query.desc( 'gotTime' );
// query.run( function( err, resoult ){
//     console.log( resoult[0] );
// })
mModel.rtWeather.find().sort('gotTime').exec( function( err, resu){
    console.log( resu.pop() );
    return false;
});


// query.sort()
// getRTWeather();
// getSDWeather();
// execAtO(5, getRTWeather );
// execAtO(1440, getRTWeather );



// exports.getRT = getRTWeather();
// exports.getSD = getSDWeather();