var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var weatherSchema = mongoose.Schema({
	city: String,
	temp: Number,
	ws: Number
});

var WeatherModel = mongoose.model('Weather', weatherSchema);

var wInfo = new WeatherModel();

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
			 Weather.find( null,function( err, info ){
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

// Weather.prototype.save = function(first_argument) {
// 	// body...
// };
exports.init = function( obj ) {
			return new WeatherModel( obj );
		}
exports.model = WeatherModel;