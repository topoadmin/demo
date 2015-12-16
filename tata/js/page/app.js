(function(root, factory) {
	"use strict";

	if (typeof define === "function" && define.amd) {
		define(["jquery"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"));
	} else {
		factory(root.jQuery);
	}

}(this, function($) {
	setTimeout(function() {
		$(".loading").hide();
	}, 222)
	
	// -- 宽窄屏切换
	$(".fixed-widtn").on("click", function() {
		var fixedTxt = $(this).children(".fixed-txt"),
			txt = fixedTxt.text().trim();
		fixedTxt.text((txt == "宽屏") ? "窄屏" : "宽屏")
		$("body").toggleClass("am-g-fixed-1200");
		$(window).trigger("resize"); // 触发resize事件,轮播重设宽度
	});
	
	// -- 关闭浮动二维码
	var floatCode = $("#float-code");
	floatCode.on("click",".am-btn",function(){
		floatCode.fadeOut(1000,function(){
			floatCode.removeClass("am-show-lg-only");
		});
	})
	
}));