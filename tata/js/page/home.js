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
	// 促销活动
	$.getJSON("js/data/activity-soft.json", function(data) {
		addActivity("activity-tpl", "activity-soft", data);
		//addGallery(document.getElementById("activity-soft"));
		$("#activity-soft .lazyload").lazyload({
			threshold: 280
		});
	});
	// 所有活动
	$.getJSON("js/data/activity-box.json", function(data) {
		addActivity("activity-tpl", "activity-box", data);
		$("#activity-box .lazyload").lazyload({
			threshold: 280
		});
	});
	
	// 添加用户
	$.getJSON("js/data/user.json", function(data) {
		var gettpl = document.getElementById("user-tpl").innerHTML;
		laytpl(gettpl).render(data, function(html) {
			document.getElementById("user-box").innerHTML = html;
		});
		var $userBox = $("#user-box");
		
		// 开启赖加载 绑定sporty事件立即执行
		var userLazyLoad = $userBox.find(".lazyload");
		userLazyLoad.lazyload({
			event : "sporty"  
		});
		var iw;	// 获取用户图片指定宽度
		if($userBox.width() > 1000){
			iw = $userBox.width()/6;
			// 打开页面时加载前7个用户头像
			userLazyLoad.each(function(index){
				if(index < 7){
					$(this).trigger("sporty")
				}
			})
		}else{
			iw = $userBox.width()/3;
			// 打开页面时加载前4个用户头像
			userLazyLoad.each(function(index){
				if(index < 4){
					$(this).trigger("sporty")
				}
			})
		}
		
		
		$userBox.find(".am-slider").flexslider({
			itemWidth: iw,
			itemMargin: 5,
			pauseOnHover: true,
			slideshowSpeed: 300000,
			after:function(){
				userLazyLoad.trigger("sporty");
			}
		});
	});
	
	$("#home-carousel").flexslider({
		slideshowSpeed : 3000,
		controlNav: false
	})

	require(["mixitup"], function() {
		// -- mixitup 排序分类
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
				$(window).trigger("scroll"); // 触发浏览器滚动事件   防止图片卡在加载
			}
		});
	});

	// 添加模版
	function addActivity(tplId, setDomId, data) {
		var gettpl = '<ul class="am-gallery am-avg-sm-2 am-avg-md-3 am-avg-lg-5 am-gallery-imgbordered">{{# for(var i = 0, len = d.length; i< len; i++){ }} {{# if(d[i].privilege){ }} <li class="all {{ d[i].site }} 特价">{{# }else{ }}<li class="all {{ d[i].site }}">{{# }}}<div class="am-gallery-item"><a href="{{ d[i].href }}"><img class="lazyload" data-original="{{ d[i].img }}" src="img/load.gif" alt="{{ d[i].alt }}" /><h3 class="am-gallery-title">{{ d[i].site }} - {{ d[i].site2 }}</h3><div class="am-gallery-desc"><span>出发时间:</span><span>{{ d[i].time }}</span><div class="am-text-lg">{{# if(d[i].privilege){ }}<del>￥:<span class="am-text-sm">{{ d[i].price }}.00</span></del> <span class="am-text-danger am-text-sm">{{ d[i].privilege }}.00</span> {{# }else{ }} ￥:<span class="am-text-danger">{{ d[i].price }}.00</span> {{# }}}</div></div></a></div></li>{{# } }}</ul>'
		laytpl(gettpl).render(data, function(html) {
			document.getElementById(setDomId).innerHTML = html;
		});
	}
	// 给am-gallery-item添加动画
	// -- 移动端效果不佳 暂不开启
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
}));