var http = require('http');
var Url = require('url');
var mModel = require('./mongoose').model;
// var City = require('./City');


// var cityId = '101010100';
var cachedCityW = {};
var cachedCityID = ['101010100'];

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
        console.log('在weather中 合适，立即执行\n');
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
        console.log(' 在weather中  不合适，将在 '+ next + ' 秒后执行\n');
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


function getRTWeather( cityId, callback ){
    console.log('在weather中  获取实时天气信息的函数启动~ ');
    var type = 'rt';
    if( cityId ){
       getRT( cityId );
    }
    else{
        for( var i =0, len = cachedCityID.length; i< len; i++ ){
            getRT( cachedCityID[i] );
        } 
    }

    function getRT( innerID ){
        var localCityId = innerID;
        var sentTime = (new Date()).valueOf();
        var info='';

        var reqUrl = 'http://www.weather.com.cn/data/sk/'+ localCityId + '.html';
        console.log( '在weather中 请求天气的地址是： ' + reqUrl );

        http.get( reqUrl, function( res ){
             callbackGetData( res, type,  localCityId );
        });
    }
    
    
}


function getSDWeather( cityId ){
    console.log('获取6天的天气');
    var type = 'sd';
    if( cityId ){
        getSD( cityId )
    }
    else{
        for( var i =0, len = cachedCityID.length; i< len; i++ ){
            getSD( cachedCityID[i] );
        }
    }
    

    function getSD( innerID ){
        var localCityId = innerID;
        var sentTime = (new Date()).valueOf();
        var info='';

        var reqUrl = 'http://m.weather.com.cn/data/'+ localCityId + '.html';
        console.log( '在weather中 请求天气的地址是： ' + reqUrl );

        http.get( reqUrl, function( res ){
             callbackGetData( res, type, sentTime, localCityId );
        });
    }
    
}


// @func 查询数据库中的天气信息 并返回
function resWeather( type, cityId, res ){
    console.log( '在weather中  有请求过来了，要做出相应 ------ ' + cityId);
    // 查询最新
    // 返回数据
    //  var condition = { cityid: cityId };
    //  if( type === 'rt'){
    //      var queryRes = queryMax( mModel.rtWeather, condition, 'gotTime',writeRes, res );
    //      // 这里还是回调  也就是说应该在查询结果的回调中对请求作出相应

    //  }
    //  else{
    //     var queryRes = queryMax( mModel.sdWeather, condition, 'gotTime',writeRes, res );
    // }

   // 采用空间换时间后的作法：
    if( cachedCityW.cityId.type ){
        writeRes( cachedCityW.cityId.type, res);
    }
    else{
        if( type === 'rt' ){
            getRTWeather( cityId, function(){
                resWeather( type, cityId, res )
            });
        }
        else{
            getSDWeather( cityId, function(){
                resWeather( type, cityId, res )
            });
        }
    }

    return false;
}






function callbackGetData( res,  type, sentTime, localCityId, callback ){
    res.on('data', function(data){
        info += data;
    });
    res.on('end',function(){
        // console.log( '在weather中'  + info);
        callbackGetRTWeather(info, type, sentTime, localCityId, callback);
    });
}

function callbackGetRTWeather( info, type, sentTime, localCityId, callback){
    var gotTime = (new Date()).valueOf();
    console.log( '在weather中  此时获取了天气信息： ' + gotTime );
    // console.log( info );
    // 解析串-—》对象  方式有问题
    // 不是方式有问题  是info的初始化  应该为空串  而不是undefined
    try{
        var wObj = JSON.parse( info ).weatherinfo;
    }
    catch( err ){
        var info = info.replace('undefined','');
        console.log( info );
        var wObj = JSON.parse( info ).weatherinfo;
    }

    // 一下函数不需要了：采用空间换时间的方法 将已存在的时间缓存在内存里

    // 格式化时间  将获得的仅有小时分钟的时间转换为有年月日 时分的时间
    // 方便前端接收后的差时计算
    // 也便于后台辨别是否发布了更新的天气信息
    // if( wObj.time.length === 4){
    //     wObj.time = '0' + wObj.time;
    // }
    // wObj.time.replace(':',' ');

    // var date = new Date();
    // today = date.getDate();
    // var month = date.getMonth();
    // if( month.length === 1 ){
    //     month = '0' + (Number(month)+1);
    // }
    // var year = Number(date.getYear()) + 1900;
    // today = year + ' ' + month + ' ' + today;
    // wObj.time = today + ' ' + wObj.time;


    // 只有在获取的天气信息的发布时间大于之前存储的“最新天气”时，才进行新实例化对象和存储的操作
    if( notCachedYet('rt', localCityId, wObj) ){
        console.log( arguments.callee.name + '   天气是新的' );
        // 进行存储到数据库的操作
        wObj.sentTime = sentTime;
        wObj.gotTime = gotTime;

        var wEntity = new mModel.rtWeather( wObj );

        wEntity.save( function(err){
            if( err ){
                console.log('在weather中 发生错误：' + err );
            }
            else{
                console.log('保存成功!');
                // mModel.rtWeather.find( showAllInfo );
            }
        });
    }
    else{
        console.log('天气信息没有更新...')
    }

    callback();
}


function showAllInfo( err, result ){
    if( !err ){
        console.log( result );
    }
    else{
        console.log('在weather中  发生错误： '+ err);
    }
}







// 书写响应，作为queryMax的回调传入
function writeRes( queryRes, res ){
    console.log( arguments.callee.name+ '^^^^^^^^^^^^^^^');
    // console.log( res );
    if( queryRes ){
        console.log( '在weather中， 查询的结果是：%……&   ');
        console.log( queryRes );
        res.writeHeader(200, {'content-type': 'application/json;charset=UTF-8'});
        // res.writeHeader(200, {'content-type': 'text/plain;charset=UTF-8'});
        var resObj = {
            return_code: 200,
            weather: queryRes
        }
        // 写json出了问题····为什么在content-type为json.application的时候  返回的是一个文件呢
        res.write( JSON.stringify( resObj ) );
        // res.write( JSON.stringify( { cityid: 'beijing', temp: '32'} ) );
        res.end();
    }
    else{
        console.log('在weather中 查询实时天气时出现错误 ');
        res.writeHeader(500, {'content-type': 'json/application'});
        var resObj = {
            return_code: 500,
            msg: '查询数据库出错'
        }
        res.write( JSON.stringify( resObj ) );
        res.end();
    }
}


// 将原来不存在数据库中的cityid添加到city的列表里
function writeIntoDesire( args ){
    console.log( arguments.callee.name + '  出现没有的城市');
    cachedCity.push( args[1].cityid );
    // getWeather();
    return false;
}


// 还没有在数据库里面存储
function notCachedYet( type, cityId,  newW ){
    if( cachedCityW[ cityId ]  ){
        if( cachedCityW[cityId][type].time === newW.time || cachedCityW[cityId][type].date_y === newW.date_y){
            return false;
        }
        else{
            cachedCityW[cityId][type] = newW;
            cachedCityID.push( cityId );
            return true;
        }
    }
    else{
        cachedCityW[cityId][type] = newW;
        cachedCityID.push( cityId );
        return true;
    }
    // var model = type + 'Weather';
    // var field = '';
    // if( type === 'rt'){
    //     field = 'time';
    // }
    // else{
    //     field = 'date_y';
    // }
    // queryMax( mModel[model], { cityid: cityId }, field, isUpdated, null, notInDB );

    function isUpdated( existW ){
        switch( type ){
            case 'rt':
              if( existW.time !== newW.time ){
                    return true;
                }
                else{
                    return false;
                }
                break;
            case 'sd':
                if( existW.date_y !== newW.date_y ){
                    return true;
                }
                else{
                    return false;
                }
                break;
            default:
                console.log( arguments.callee.name + '  进入了daefault选项');
                return true;         
        }
    }

    function notInDB( args ){
        return true;
    }
}


// 将基础函数放在utility文件中 方便各处调用
// 如日期格式化函数，respond函数（ 传入响应码和对象，以及mime格式 ）

function queryMax( model, condition, field, callback1,  res, callback2){

    console.log( arguments.callee.name+ '>>>>>>>>>>>>>>>>');
    console.log( arguments );
    // console.log( res );
    model.find( condition ).sort( field ).exec( function( err, resu){
        if( !err ){
            if( resu.length > 0 ){
                try{
                    callback1( resu.pop(), res );
                }
                catch( err ){
                    console.log( arguments.callee.name + ' 查询最大值时出错，而且没有callback函数')
                }
            }
            else{
                // 在查询到的结果集为空时执行callback2
                try{
                    callback2( arguments );
                }
                catch( err ){
                    console.log( arguments.callee.name + '查询最大值时出错，而且没有callback2');
                }
                return false;
            }
            // console.log( resu.pop() );
        }
        else{
            // 在发生错误时执行callback2
            // try{
            //     callback2( arguments );
            // }
            // catch( err ){
            // }
            console.log( arguments.callee.name + '查询最大值时出错，而且没有callback2');

            return false;
        }
    });
}

function toChineseDate( dateObj ){
    var year = ( dateObj.getYear() + 1900 )+'年';
    var month = ( dateObj.getMonth() + 1 )+'月';
    var date = ( dateObj.getDate() )+'日';
    return year+month+date;
}


// if( test )
// execAtO(10, getRTWeather );
// mModel.rtWeather.find( {cityid: '10934435'}, showAllInfo );

// getRTWeather( cityId );
// getSDWeather( cityId );

exports.getRT = getRTWeather;
exports.getSD = getSDWeather;
exports.res = resWeather;
// exports.resSD = getSDWeather();
