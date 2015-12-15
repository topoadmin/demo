(function(root, factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(["jquery", "laytpl", "lazyload"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"), require("laytpl"), require("lazyload"));
	} else {
		factory(root.jQuery);
	}

}(this, function($, laytpl) {
	// 添加模版
	function addActivity(tplId, setDomId, data) {
		var gettpl = document.getElementById(tplId).innerHTML;
		laytpl(gettpl).render(data, function(html) {
			document.getElementById(setDomId).innerHTML = html;
		});
	}
	// 给am-gallery-item添加动画
	function addGallery(elm) {
		var animateDom;
		if (elm) {
			animateDom = elm.getElementsByClassName("am-gallery-item");
		} else {
			animateDom = document.getElementsByClassName("am-gallery-item");
		}
		if (animateDom.length < 1) {
			return false;
		}
		for (var i = 0; i < animateDom.length; i++) {
			var delay = parseInt(Math.random() * (150 - 250 + 1) + 230); // 生成随机数
			animateDom[i].setAttribute("data-am-scrollspy", "{animation: 'scale-down',delay:" + delay + ",repeat: false}")
		}
	}

	$.getJSON("js/data/activity-soft.json", function(data) {
		addActivity("activity-tpl", "activity-soft", data);
//		addGallery(document.getElementById("activity-soft"));
		$(".lazyload").lazyload({
			threshold: 280
		}); // 开启赖加载
	});

	$.getJSON("js/data/activity-box.json", function(data) {
		addActivity("activity-tpl", "activity-box", data);
		//addGallery(document.getElementById("activity-box"));
		$(".lazyload").lazyload({
			threshold: 280
		}); // 开启赖加载
	});
	$('#home-carousel').flexslider({
		playAfterPaused: 8000,
		slideshowSpeed: 3000,
		controlNav: false
	});

	$(".fixed-widtn").on("click", function() {
		var fixedTxt = $(this).children(".fixed-txt"),
			txt = fixedTxt.text().trim();
		fixedTxt.text((txt == "宽屏") ? "窄屏" : "宽屏")
		$("body").toggleClass("am-g-fixed-1200");
		$(window).trigger("resize");	 // 触发resize事件,轮播重设宽度
	});

	require(["mixitup"], function() {
		// -- mixitup 排序分类
		var filter = $("#classify .filter"); // -- 分类按钮节点
		filter.on("click",function(){
			$(this).addClass("am-active").siblings(".filter").removeClass("am-active");
		});
		$('#activity-box').mixitup({
			targetSelector: ".all",
			filterSelector: ".filter",
			effects: ["fade"],
			easing: "snap",
			onMixStart: function(event) {
				filter.addClass("am-disabled");
			},
			onMixEnd: function(event) {
				filter.removeClass("am-disabled");
				$(window).trigger("scroll"); // 触发浏览器滚动事件   防止图片卡在赖加载
			}
		});
	});


	return {
		addActivity: addActivity
	}
}));