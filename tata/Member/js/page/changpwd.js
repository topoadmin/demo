(function(root, factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(["jquery", "amazeui", "formValidator"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"), require("amazeui"), require("formValidator"));
	} else {
		factory(root.jQuery);
	}

}(this, function($) {
	// 绑定form验证
	var $formArr = $(".am-form");
	$formArr.each(function(i) {
		var $this = $(this);
		$this.formValidator();
		$this.on("submit", function() {
			var $formJson = $this.serialize();
			if ($this.data("isdata")) {
				console.log("提交这段数据吧[" + $formJson + "]");
			}
			return false;
		})
	});
}));