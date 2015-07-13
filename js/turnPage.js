var animateCs;
$(document).ready(function() {
	//修改测试
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
	bulletsContainer.find("li").click(function(){
		animateCs.switchPage($(this).index(),"zoomOut","zoomIn",555);
	})

	//触屏拖动事件
	warp.swipe({swipe: function(event, direction, distance, duration, fingerCount) {
			var inout = animateCs.getAnimate();
			$("ul.straight-bullets").find("li").removeClass("active").eq(0).addClass("active");
			if (direction == "left") {
				animateCs.next(inout[0],inout[1],inout[2]);
			} else if (direction == "right") {
				animateCs.prev(inout[0],inout[1],inout[2]);
			}else if(direction == "up"){
				
			}else if(direction == "down"){
			}
		}
	});
	addEventKeyup();
});

//绑定键盘事件
function addEventKeyup(){
	$(document).bind("keydown",function(e){
		var k = e.keyCode || e.which;
		var inout = animateCs.getAnimate();
		if (k === 37){
			animateCs.prev(inout[0],inout[1],inout[2]);
		}else if(k === 38){
		}else if(k === 39){
			animateCs.next(inout[0],inout[1],inout[2]);
		}else if(k === 40){
			
		}
	})
}
