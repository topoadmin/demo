require.config({
	paths: {
		"jquery": "//cdn.bootcss.com/jquery/3.4.1/jquery.min",
		"amazeui": "//cdn.bootcss.com/amazeui/2.7.2/js/amazeui.min",
		"touchSwiper": "../../build/js/jquery/jquery.touchSwipe", // 滑屏事件
		"gsPage": "jquery.gsPage"
	}
});
require(["jquery", "gsPage"], function($) {
	$("#warp").gsPage();
	// 生成随机颜色
	var getRandomColor = function(color) {
		return '#' + (function(color) {
			return (color += '0123456789abcdef' [Math.floor(Math.random() * 16)]) && (color.length == 6) ? color : arguments.callee(color);
		})('');
	}
	$("#prev").click(function(){
		$.fn.gsPage.prev();
	});
	$("#next").click(function(){
		$.fn.gsPage.next();
	});
	$("#keydown").click(function(){
		alert("你现在可以按方向键控制了");
		$.fn.gsPage.keyDownFn();
	});
	$("#touch").click(function(){
		alert("你现在滑动控制了");
		$.fn.gsPage.swipeFn();
	});
	setInterval(function() {
		$("#info span").css("color", getRandomColor());
	}, 333);
});