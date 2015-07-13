var animateCs;
$(document).ready(function() {
	var warp = $("#warp");
	var totalLen = warp.children(".row").length;
	var bulletsContainer = $('.bullets');

	//实例化cupScreen组件
	animateCs = cupScreen(warp);

	// 每层创建一个子弹
	for (var i = 0, len = totalLen; i < len; i++) {
		var bullet = $('<li></li>');
		//指定子弹默认位置
		bullet.addClass(i === animateCs.getIndex() ? 'active' : '');
		bulletsContainer.append(bullet);
	}
	bulletsContainer.find("li").click(function() {
		animateCs.switchPage($(this).index(), "zoomOut", "zoomIn", 555);
	})

	//触屏拖动事件
	warp.swipe({
		swipe: function(event, direction, distance, duration, fingerCount) {
			var inout = animateCs.getAnimate();
			$("ul.straight-bullets").find("li").removeClass("active").eq(0).addClass("active");
			if (direction == "left") {
				animateCs.next(inout[0], inout[1], inout[2]);
			} else if (direction == "right") {
				animateCs.prev(inout[0], inout[1], inout[2]);
			} else if (direction == "up") {

			} else if (direction == "down") {}
		}
	});
	addEventKeyup();
});

//绑定键盘事件
function addEventKeyup() {
	$(document).bind("keydown", function(e) {
		var k = e.keyCode || e.which;
		var inout = animateCs.getAnimate();
		if (k === 37) {
			animateCs.prev(inout[0], inout[1], inout[2]);
		} else if (k === 38) {} else if (k === 39) {
			animateCs.next(inout[0], inout[1], inout[2]);
		} else if (k === 40) {

		}
	})
}

var canvasloadTime;
var windowLoadTime = 1;
function loadCanvasFn() {
	var s = window.screen;
	var canvas = document.getElementById("load-canvas");
	var context = canvas.getContext("2d");
	var width = canvas.width = s.width;
	var height = canvas.height = s.height;
	var letters = Array(256).join(1).split('');
	var draw = function() {
		context.fillStyle = 'rgba(0,0,0,.05)';
		context.fillRect(0, 0, width, height);
		context.fillStyle = '#0F0';
		context.font = "20pt Arial";
		letters.map(function(y_pos, index) {
			text = (Math.floor(Math.random() * 2 + 1)) == 2 ? text = 0 : text = 1;
			x_pos = index * 20;
			context.fillText(text, x_pos, y_pos);
			letters[index] = (y_pos > 1000 + Math.random() * 1e4) ? 0 : y_pos + 30;
		});
	};
	canvasTime = setInterval(draw, 60);
	setInterval(function(){
		//最大等待5秒
		if(windowLoadTime == 5){
			windowLoadTime = 0;
			clearTimeout(canvasTime);
		}else{
			windowLoadTime++;
		}
	},1000);
}

window.onload = function(){
	var canvas = document.getElementById("load-canvas");
	clearTimeout(canvasTime);
	canvas.remove()
}
