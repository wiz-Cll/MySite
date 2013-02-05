window.onload = function() {
	// var content = document.body.children;
	var paperlizeBtn = document.createElement('div');
	paperlizeBtn.className = 'pBtn';
	paperlizeBtn.innerText = 'Paperlize It!';
	document.body.appendChild(paperlizeBtn);

	document.getElementsByClassName('pBtn')[0].addEventListener( 'click', paperlize, false );

}
function paperlize(){
	var content = document.body.children;
	var contentLen = content.length;
	console.log(contentLen);
	console.log(content[0]);
	console.log(content[1]);
	console.log(content[2]);
	var column = document.createElement( 'div' );
	var paper = document.createElement( 'div' );
	column.className = 'column';
	paper.className = 'paper';
	document.body.appendChild(paper);
	paper.appendChild(column);
	console.log(content);
	// 不可以直接插入content，因为content作为一个对象
	column.appendChild(content[0]);
	// 1.获取所有文本节点
		//body的所有子-文本节点
	// 2.形成一个文本段字符串
	// 3.预加载和文档重构，查看computeredStyle中的高度是否超过没列限制
		//3.1 定位是哪个childElementNode超出了限制 
	// 4.对超过高度的那个索引数组元素进行操作，使用二分法加快效率
	// 5. 从那个数组元素再开始累计和检测
}
// function getAllChildElements(el){
// 	// <p> jaijfejafa <a>eafak</a> dfaefhdah</p>
// 	var childElArray = [];
// 	childElArray[0] = el.firstElementChild;
// 	var childIndex = 1;
// 	while( sibling( el.firstElementChild, childIndex ) ){
// 		childElArray[ childIndex ] = sibiling(el, childIndex+1);
// 	}
// 	return childElArray;
// }
function sibling(el,n){
	while( el && n !== 0){
		if ( n > 0){
			if( el.nextElementSibling ){
				el=el.nextElementSibling;
			}
			else{
				for ( el = el.nextSibling; el && el.nodeType !== 1; el=el.nextSibling );
			}
			n--;
		}
		else{
			if( el.previousElementSibling ){
				el = el.previousElementSibling;
			} 
			else{
				for(el = el.previousSibling; el && el.nodeType !== 1; el = el.previousSibling);
			}
			n++;
		}
	}
	return el;
}
function cloneObj(obj) {
	var 
}