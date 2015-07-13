/**
* 公共函数
* 13701378834@163.com
* 2015-07-06 12:33:57
**/

/*
 * @method	多浏览器支持
 * @return 	定时器
 * @this 	根据设备性能确定循环时间
 */
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
			return window.setTimeout(callback, 1000 / 60);
		};
})();

/*
 * @method	计算长度的平方冥
 * @param 	
 */
function calLength2(x1, y1, x2, y2) {
	return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}

/*
 * @method	背景渐变
 * @param 	渐变元素 [c1,c2....]
 */
function gradientColor(obj){
	
}

/*
 * @method	获取随机颜色
 * @param 	透明度 [0,1]
 */
function randomColor() {
//	var alphaV = alpha == undefined ? 1:alpha;	
	var col = [0, 1, 2];
	col[0] = Math.random() * 100 + 155;
	col[0] = col[0].toFixed();
	col[1] = Math.random() * 100 + 155;
	col[1] = col[1].toFixed();
	col[2] = Math.random() * 100 + 155;
	col[2] = col[2].toFixed();
	var num = Math.floor(Math.random() * 3);
	col[num] = 0;
	return "rgba(" + col[0] + "," + col[1] + "," + col[2]+")";
//	return "rgba(" + col[0] + "," + col[1] + "," + col[2] + ","+alphaV+")";
}

/*
 * @method	随机数
 * @param 	最大值 [max]
 */
function rnd(m) {
	var n = m || 1;
	return Math.random() * n;
}

/*
 * @method	随机数
 * @param 	最小值,最大值 [min,max]
 */
function rateRandom(m, n) {
	var sum = 0;
	for (var i = 1; i < (n - m); i++) {
		sum += i;
	}

	var ran = Math.random() * sum;

	for (var i = 1; i < (n - m); i++) {
		ran -= i;
		if (ran < 0) {
			return i  + m;
		}
	}
}