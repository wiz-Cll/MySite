var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chenllos');

//--------------- schemas -------------------
// 实时天气
var rtWeatherSchema = mongoose.Schema({
	city: String,
	cityid: String,
	temp: String,
	WD: String,
	WS: String,
	SD: String,
	WSE: String,
	time: String,
	sentTime: Date,
	gotTime: Date,
	isRadar: String,
	Radar: String
});

// 六天天气
var sdWeatherSchema = mongoose.Schema({
	city: String,
	city_en: String,
	date_y: String,
	date: String,
	week: String,
	fchh: String,
	cityid: String,
	temp1: String,
	temp2: String,
	temp3: String,
	temp4: String,
	temp5: String,
	temp6: String,
	tempF1: String,
	tempF2: String,
	tempF3: String,
	tempF4: String,
	tempF5: String,
	tempF6: String,
	weather1: String,
	weather2: String,
	weather3: String,
	weather4: String,
	weather5: String,
	weather6: String,
	img1: String,
	img2: String,
	img3: String,
	img4: String,
	img5: String,
	img6: String,
	img7: String,
	img8: String,
	img9: String,
	img10: String,
	img11: String,
	img12: String,
	img_single: String,
	img_title1: String,
	img_title2: String,
	img_title3: String,
	img_title4: String,
	img_title5: String,
	img_title6: String,
	img_title7: String,
	img_title8: String,
	img_title9: String,
	img_title10: String,
	img_title11: String,
	img_title12: String,
	img_title_single: String,
	wind1: String,
	wind2: String,
	wind3: String,
	wind4: String,
	wind5: String,
	wind6: String,
	fx1: String,
	fx2: String,
	fl1: String,
	fl2: String,
	fl3: String,
	fl4: String,
	fl5: String,
	fl6: String,
	index: String,
	index_d: String,
	index48: String,
	index48_d: String,
	index_uv: String,
	index48_uv: String,
	index_xc: String,
	index_tr: String,
	index_co: String,
	st1: String,
	st2: String,
	st3: String,
	st4: String,
	st5: String,
	st6: String,
	index_cl: String,
	index_ls: String,
	index_ag: String
});

// 博客文章的schema
var blogSchema = mongoose.Schema({});
// 文章评论的schema
var commitSchema = mongoose.Schema({});


// --------------------- models ---------------------
var rtWeatherModel = mongoose.model('rtWeather', rtWeatherSchema);
var sdWeatherModel = mongoose.model('sdWeather', sdWeatherSchema);
// var wInfo = new WeatherModel();

// wInfo.save( function(err){
// 	if( err ){
// 		console.log('出错了···' + err);
// 	}
// 	else{
// 		console.log('天气对象存储了没~？');
// 		console.log( WeatherModel.find( null,function( err, info ){
// 			console.log( info );
// 			// info是一个结果集   一个数组
// 			if( info.length !== 0){
// 				console.log('OK, 我们来进行删除的操作');
// 				deleteInfos();
// 			}
// 		}) );
// 	}
// })

function deleteInfos(){
	WeatherModel.remove( null , function( err, info){
		if( err ){
			console.log('出错了···' + err);
		}
		else{
			console.log('貌似成功了');
			 WeatherModel.find( null,function( err, info ){
				console.log( info );
			})
		}
	});
}

var Weather = function( obj ){
	this.init = function( obj ){
		return new WeatherModel( obj );
	}
}


// exports.init = function( obj ) {
// 			return new WeatherModel( obj );
// 		}
var models = {
	rtWeather: rtWeatherModel,
	sdWeather: sdWeatherModel
	// blog: blogModel,
}

exports.model = models;