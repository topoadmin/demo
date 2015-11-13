/**
 * dom操作
 * @author gaoshi-github 
 * @version 1.0
 */
$(function() {
	var $fullText = $('.admin-fullText');

	$('#admin-fullscreen').on('click', function() {
		$.AMUI.fullscreen.toggle();
	});
	$(document).on($.AMUI.fullscreen.raw.fullscreenchange, function() {
		$fullText.text($.AMUI.fullscreen.isFullscreen ? '退出全屏' : '开启全屏');
	});

	var returnTop = $("#return-top"),	
		main = $("#main"),
		$window = $(window);
	checkScroll($window, returnTop);
	$window.on("scroll", function() {
		checkScroll($(this), returnTop);
	}).on("resize",function(){
		
	});
	// 添加背景动画
	var divv ='';
	for(var i=0;i<100;i++){
		divv += '<div class="c"></div>';
	}
	$(".bg-wrap").append(divv);
	

	function checkScroll(windows, elems) {
		var scroll = windows.scrollTop(),
			elem = elems;

		if (scroll > 70) {
			elem.removeClass("am-hide");
		} else {
			elem.addClass("am-hide");
		}
	}
})