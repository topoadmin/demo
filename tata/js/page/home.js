(function(root, factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(["jquery","laytpl"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"),require("laytpl"));
	} else {
		factory(root.jQuery);
	}

}(this, function($,laytpl) {
	$.getJSON("js/data/activity-soft.json",function(data){
		addActivity("activity-tpl","activity-soft",data);
		addGallery(document.getElementById("activity-soft"));
	});
	
	$.getJSON("js/data/activity-soft.json",function(data){
		addActivity("activity-tpl","activity-box",data);
		addGallery(document.getElementById("activity-box"));
	});
	
	function addActivity(tplId,setDomId,data){
		var gettpl = document.getElementById(tplId).innerHTML;
		laytpl(gettpl).render(data, function(html) {
			document.getElementById(setDomId).innerHTML = html;
		});
	}
	
	$('#home-carousel').flexslider({
		playAfterPaused: 8000,
		slideshowSpeed: 3000,
		controlNav: false
	});

	$(".fixed-widtn").on("click", function() {
		var fixedTxt = $(this).children(".fixed-txt"),
			txt = fixedTxt.text().trim();
		fixedTxt.text((txt == "宽屏") ? "窄屏" : "宽屏")
		$("body").toggleClass("am-g-fixed-1200");
		$(window).trigger("resize"); // 触发resize事件,轮播重设宽度
	})
}));