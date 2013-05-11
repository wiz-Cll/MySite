/*
 * 解析#后的颜色字符串为颜色对象
 *
 *
 *
 *
 */
function parseColor( colorStr ){
	var charArr = [];
	charArr = colorStr.split('');
	var rgbArr = [];
	var rgbObj = null;
	var charCount = colorStr.length;

	if( charCount === 3){
		for( var i=0; i < 3; i++){
			rgbArr[i] = charArr[i] + charArr[i];
		}
	}
	else if( charCount === 6 ){
		var j = 0;
		for( var i=0; i < 3; i++){
			j = 2*i;
			rgbArr[i] = charArr[j] + charArr[j+1];
		}
	}
	else{
		console.warn('color string is not fitted');
		return false;
	}
	return { 
		r: Number('0x'+rgbArr[0]),
		g: Number('0x'+rgbArr[1]),
		b: Number('0x'+rgbArr[2])
	}
}