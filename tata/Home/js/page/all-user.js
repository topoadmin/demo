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
	require(["laytpl","lazyload"],function(laytpl){
		var $allUpImg = $("#all-user-box");
		var gettpl = document.getElementById("all-user-tpl").innerHTML;
		var newsLoadBtn = $(".news-load-up-btn"),
			newsLoadI = newsLoadBtn.find(".news-load-i");
			
		loadUserUpImg("js/data/up-img.json");
		newsLoadBtn.on("click",function(){
			loadUserUpImg("js/data/load-user-up-img.json","load");
		});
		
		// 加载更多图片
		function loadUserUpImg(jsonUrl,method){
			if(method){
				newsLoadI.show();
			}
			$.getJSON(jsonUrl, function(data) {
				laytpl(gettpl).render(data, function(html) {
					$allUpImg.append(html);
				});
				$allUpImg.find(".lazyload").lazyload();
				if(method){
					newsLoadI.hide();
				}
			});
		}
	})
	
	// 动态数字效果
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
	};
	
}));