(function(root, factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(["jquery", "laytpl", "lazyload", "app"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"), require("laytpl"), require("lazyload"), require("app"));
	} else {
		factory(root.jQuery);
	}
}(this, function($, laytpl) {
	// -- 开启轮播
	var homeCarousel = $("#home-carousel");
	homeCarousel.flexslider({
		smoothHeight: false,
		slideshowSpeed: 5000,
		controlNav: false,
		start:function(){
		}
	});
	
	// -- 添加用户
	$.getJSON("js/data/user.json", function(data) {
		var gettpl = document.getElementById("users-tpl").innerHTML;
		laytpl(gettpl).render(data, function(html) {
			document.getElementById("user-box").innerHTML = html;
		});
		var $userBox = $("#user-box");
		// 开启赖加载 绑定sporty事件立即执行
		var userLazyLoad = $userBox.find(".lazyload"),
			iw, // 获取用户图片指定宽度
			userHeadSize; // 记录每页显示多少用户头像

		userLazyLoad.lazyload({
			event: "sporty"
		});
		if ($userBox.width() > 1000) {
			userHeadSize = 8; // 宽屏页面
			if ($(".am-g-fixed-min").length >= 1) {
				userHeadSize = 6; // 窄屏页面 
			}
			iw = $userBox.width() / userHeadSize;
		} else if ($userBox.width() < 1000 && $userBox.width() > 720) {
			userHeadSize = 4; // 平板页面
			iw = $userBox.width() / userHeadSize;
		} else {
			userHeadSize = 3; // 手机页面
			iw = $userBox.width() / userHeadSize;
		}
		// 打开页面时加载多少个用户头像
		userLazyLoad.each(function(index) {
			if (index < userHeadSize) {
				$(this).trigger("sporty")
			}
		})
		var $userPopup = $("#my-user-popup"); // 用户弹窗
		$userBox.find(".am-slider").flexslider({
			itemWidth: iw,
			itemMargin: 5,
			controlNav: false,
			pauseOnHover: true,
			slideshowSpeed: 5000,
			after: function() {
				userLazyLoad.trigger("sporty");
			}
		});
		/* 查看用户信息 */
		$userBox.userPopup();

	});

	// -- 促销活动
	$.getJSON("js/data/activity-soft.json", function(data) {
		addActivity("activity-tpl", "activity-soft", data);
		addGallery(document.getElementById("activity-soft"));
		$("#activity-soft .lazyload").lazyload({
			threshold: 280
		});
	});
	// -- 所有活动
	$.getJSON("js/data/activity-box.json", function(data) {
		addActivity("activity-tpl", "activity-box", data);
		$("#activity-box .lazyload").lazyload({
			threshold: 300
		});
		// -- mixitup 排序分类
		require(["mixitup"], function() {
			var filter = $("#classify .filter"); // -- 分类按钮节点
			filter.on("click", function() {
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
					// 触发浏览器滚动事件   防止有些图片卡在加载
					$(window).trigger("scroll");
				}
			});
		});
	});
	// -- 活动模版
	function addActivity(tplId, setDomId, data) {
		var gettpl = document.getElementById("article-tpl").innerHTML;
		laytpl(gettpl).render(data, function(html) {
			document.getElementById(setDomId).innerHTML = html;
		});
	}
	// - 给am-gallery-item添加动画- 移动端效果不佳 暂不开启
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
			var delay = parseInt(Math.random() * 150); // 生成随机数
			animateDom[i].setAttribute("data-am-scrollspy", "{animation: 'fade',delay:" + delay + ",repeat: false}")
		}
	}
}));