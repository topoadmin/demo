/**
 * dom操作
 * @author gaoshi-github 
 * @version 1.0
 */
define(["amazeui"], function() {　　　　
	$(function() {
		var $fullText = $('.admin-fullText');

		$('#admin-fullscreen').on('click', function() {
			$.AMUI.fullscreen.toggle();
		});
		$(document).on($.AMUI.fullscreen.raw.fullscreenchange, function() {
			$fullText.text($.AMUI.fullscreen.isFullscreen ? '退出全屏' : '开启全屏');
		});
		
		
		// -- 返回顶部按钮
		var returnTop = $("#return-top");
		returnTop.on("click", function() {
			$("html,body").animate({
				scrollTop: 0
			}, 555);
		});
		checkScroll($(window), returnTop);
		$(window).on("scroll", function() {
			checkScroll($(this), returnTop);
		})
	});

	function checkScroll(scrollValue, elems) {
		var scroll = $(this).scrollTop(),
			elem = elems;
		
		if (scroll > 70) {
			elem.removeClass("am-hide");
		} else {
			elem.addClass("am-hide");
		}
	}
});