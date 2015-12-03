/**
 * 各类公共插件初始执行模块
 * @author gaoshi-github 
 * @version 1.0
 */
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require, exports, module);
	} else {
		factory();
	}
}(this, function(require, exports, module) {
	if ($(".countUp").length > 0) {
		require(["countUp"], function(countUp) {　　
			$.fn.countUps = function(options) {
				var defaults = {
						target: "",
						startVal: "",
						endVal: "",
						decimals: 0, //--小数位数
						duration: 1 //--持续时间
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
	
	
	if ($('#province').length > 0) {
		require(["citiesChange","chosen"], function() {　　
			var province = $("#province"),city = $("#city");
			$.initProv(province, city, province.data("province") || pc.attr("data-province"), city.data("city") || city.attr("data-city"));
		});
	}
}));