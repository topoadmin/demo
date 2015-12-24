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
	setTimeout(function() {
		$(".loading").hide();
	}, 222);
	
	var $fullText = $('.admin-fullText');
	$('#admin-fullscreen').on('click', function() {
		$.AMUI.fullscreen.toggle();
	});
	$(document).on($.AMUI.fullscreen.raw.fullscreenchange, function() {
		$fullText.text($.AMUI.fullscreen.isFullscreen ? '退出全屏' : '开启全屏');
	});

	// 显示隐藏导航
	$("#is-left-nav").on("click", function() {
		$("#admin-offcanvas").toggleClass("admin-sidebar")
		$("#admin-right-main").toggleClass("pd-left270")
	});

	if ($(".countUp").length > 0) {
		require(["countUp"], function(countUp) {　　
			$.fn.countUps = function(options) {
				var defaults = {
						target: "",
						startVal: "",
						endVal: "",
						decimals: 0, 
						duration: 1 
					},
					$this = $(this),
					opts = $.extend(defaults, options);

				opts.startVal = opts.startVal || $this.data("startVal") || $this.text() || $this.val() || $this.attr("data-startVal");
				opts.endVal = opts.endVal || $this.data("endVal") || $this.attr("data-endVal");

				for (var i = 0; i < $this.length; i++) {
					new countUp($this[i], opts.startVal, opts.endVal, opts.decimals, opts.duration).start();
				}
			}
			$(".countUp").countUps({
				"duration": 2.5
			});
		});
	}

	if ($('.form-datetime').length > 0) {
		require(["datetime"], function(countUp) {　　
			$.fn.datetimepicker.dates['zh-CN'] = {
				days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
				daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
				daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
				months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
				monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
				today: "今日",
				suffix: [],
				meridiem: ["上午", "下午"]
			};
			$('.form-datetime').datetimepicker({
				language: 'zh-CN',
				todayBtn: true,
				autoclose: true,
				todayHighlight: true
			});
		});
	}

	if ($('.form-select').length > 0) {
		require(["chosen"], function() {　　
			$('.form-select').chosen({
				disable_search_threshold: 10,
				default_multiple_text: "多选",
				default_single_text: "单选",
				no_results_text: '没有找到匹配的项!',
				width: '100%'
			});
		});
	}



}));



