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

	(function() {
		// 显示隐藏导航
		$("#is-left-nav").on("click", function() {
			$("#admin-offcanvas").toggleClass("admin-sidebar")
			$("#admin-right-main").toggleClass("pd-left270")
		});
		
		// 浏览器动作
		/*var returnTop = $("#return-top"),
			main = $("#main"),
			$window = $(window);
		checkScroll($window, returnTop);
		$window.on("scroll", function() {
			checkScroll($(this), returnTop);
		});

		function checkScroll(windows, elems) {
			var scroll = windows.scrollTop(),
				elem = elems;
			if (scroll > 70) {
				elem.removeClass("am-hide");
			} else {
				elem.addClass("am-hide");
			}
		}*/
	}());
})