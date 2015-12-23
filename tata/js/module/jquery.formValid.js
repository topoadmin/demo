(function(root, factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(["jquery", "amazeui"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"), require("amazeui"));
	} else {
		factory(root.jQuery);
	}
}(this, function($) {
	$.fn.setForm = function(json) {
		var jsonObj = json,
			$this = $(this);
		if (typeof json === "string") {
			jsonObj = $.parseJSON(json);
		}
		for (var key in jsonObj) {
			$this.find("[name='" + key + "']").val(jsonObj[key]);
		}
	}

	$.fn.formValidator = function(opt) {
		var defaults = {
			success: function(){},
			error:function(){}
		};
		var options = $.extend(defaults, opt);
		
		$(this).validator({
			validate: function(validity) {
				var $this = $(validity.field),
					v = $this.val(),
					$validity = validity,
					valid = validity.valid;

				// -- 异步验证手机号码
				if ($this.hasClass('user')) {
					if (/^(((1[3578]{1}))+\d{9})$/.test(v)) {
						return $.ajax({
							url: 'js/data/checkUser.json',
							dataType: 'json'
						}).then(function(data) {
							$validity.valid = data.status;
							return $validity;
						}, function() {
							return $validity;
						});
					} else {
						$validity.valid = false;
					}
				}
			},
			submit: function(e, validity) {
				var formValidity = this.isFormValid();
				var $thisForm = $(e.target);
				
				$thisForm.data("isdata", false).attr("onsubmit", "return false;");
				$.when(formValidity).then(function() {
					if (formValidity) {
						$thisForm.data("isdata", true);
						options.success($thisForm);
					}else{
						options.error($thisForm);
					}
				}, function() {
					options.error($thisForm);
				});
			}
		});
		return $(this);
	}

	$.fn.submitForm = function() {

	}

}));