/**
 * 各类插件初始执行模块
 * @author gaoshi-github 
 * @version 1.0
 */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require, exports, module);
	} else {
		root.CountUp = factory();
	}
}(this, function(require, exports, module) {
	require(['countUp'], function(countUp) {
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
		$(".countUp").countUps({"duration":2.5})　　
	});
}));