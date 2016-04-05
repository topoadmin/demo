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
			success: function() {},
			error: function() {}
		};
		var options = $.extend(defaults, opt);
		var $thisForm = $(this);
		$thisForm.validator({
			patterns: {
				"mobile": /^1((3|5|8){1}\d{1}|70)\d{8}$/
			},
			patternClassPrefix: 'js-pattern-',
			validate: function(validity) {
				var $validity = validity,
					$this = $($validity.field),
					valid = validity.valid;
				// 给与验证通过的input状态
				$this.data("validator", valid);
			},
			submit: function(e, validity) {
				var formValidity = this.isFormValid();
				var $thisForm = $(e.target);

				$thisForm.data("isdata", false).attr("onsubmit", "return false;");
				$.when(formValidity).then(function() {
					if (formValidity) {
						$thisForm.data("isdata", true);
						options.success($thisForm);
					} else {
						options.error($thisForm);
					}
				}, function() {
					options.error($thisForm);
				});
			}
		});
		return $thisForm;
	}

}));