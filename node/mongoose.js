var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var weatherSchema = mongoose.Schema({
	city: String,
	temp: Number,
	ws: Number
});

var Weather = mongoose.model('Weather', weatherSchema);

var wInfo = new Weather({city: 'beijing', temp:15, ws: '3'});

wInfo.save( function(err){
	if( err ){
		console.log('出错了···' + err);
	}
	else{
		console.log('天气对象存储了没~？');
		console.log( Weather.find( null,function( err, info ){
			console.log( info );
			// info是一个结果集   一个数组
			if( info.length !== 0){
				console.log('OK, 我们来进行删除的操作');
				deleteInfos();
			}
		}) );
	}
})

function deleteInfos(){
	Weather.remove( null , function( err, info){
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

