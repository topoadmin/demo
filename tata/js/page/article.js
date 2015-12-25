(function(root, factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(["jquery", "laytpl"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"), require("laytpl"));
	} else {
		factory(root.jQuery);
	}
}(this, function($, laytpl) {
	var articleUser = $("#article-user");
	articleUser.on("click", "li", function(e) {
		console.log($(this).html());
		
	});

}));