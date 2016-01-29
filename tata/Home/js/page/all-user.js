(function(root, factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(["jquery"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"), require("amazeui"));
	} else {
		factory(root.jQuery);
	}

}(this, function($) {
	$("footer").addClass("am-g-fixed-min");
	// 加载更多图片
	require(["laytpl", "lazyload"], function(laytpl) {
		var $allUpImg = $("#all-user-box");
		$allUpImg.find(".lazyload").lazyload();
		var newsLoadBtn = $(".news-load-up-btn"),
			newsLoadI = newsLoadBtn.find(".news-load-i");

		var gettpl = document.getElementById("all-user-tpl").innerHTML;

		/* 查看用户信息 */
		if ($allUpImg.find(".user-img-box").length >= 1) {
			$allUpImg.userPopup();
		}

		newsLoadBtn.on("click", function() {
			loadUserUpImg($(this).data("load-url"), "load");
		});

		function loadUserUpImg(jsonUrl, method) {
			if (method) {
				newsLoadI.show();
			}
			$.getJSON(jsonUrl, function(data) {
				laytpl(gettpl).render(data, function(html) {
					$allUpImg.append(html);
				});
				$allUpImg.find(".lazyload").lazyload();
				if (method) {
					newsLoadI.hide();
				}
			});
		}
	});

	// 动态数字效果
	var $counUp = $(".countUp");
	if ($counUp.length > 0) {
		require(["countUp"], function(countUp) {　　
			$.fn.countUps = function(options) {
				var defaults = {
					target: "",
					startVal: "",
					endVal: "",
					decimals: 0,
					duration: 1
				};
				var $this = $(this),
					opts = $.extend(defaults, options);

				opts.startVal = opts.startVal || $this.data("startVal") || $this.text() || $this.val() || $this.attr("data-startVal");
				opts.endVal = opts.endVal || $this.data("endVal") || $this.attr("data-endVal");

				for (var i = 0; i < $this.length; i++) {
					new countUp($this[i], opts.startVal, opts.endVal, opts.decimals, opts.duration).start();
				}
			}
			$counUp.countUps({
				"duration": 2.5
			});
		});
	};

}));