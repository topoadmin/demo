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
	$(function() {
		$('#home-carousel').flexslider({
			playAfterPaused: 8000,
			slideshowSpeed:50000,
			controlNav:false
		});
		
		var mainTop = $("#main").offset().top,headerHeight = $("header").height();
		if(mainTop > headerHeight+10){
			$("#main").css({"position":"absolute","top":mainTop-headerHeight+10})
		}
		
	})
}));