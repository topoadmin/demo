(function(root, factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(["jquery"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"));
	} else {
		factory(root.jQuery);
	}
}(this, function($) {
	var $articleUser = $("#article-user");
	$articleUser.on("click", ".am-gallery-item", function() {
		// 打开报名窗口
		if (!$(this).hasClass("user-img-box")) {
			$("#my-apply-popup").modal({
				relatedTarget: this,
				closeViaDimmer: false
			})
		}
	});
	// 查看用户信息 
	require(["app"], function() {
		$articleUser.userPopup();
	});

	/*
	 * 根据bind-gallery类生成画廊
	 * @author gaoshi-github
	 * 类标签上 data-big-src 为大图路径
	 * 类标签上 data-title 为名称文本
	 */
	var $gallery = $("#article-gallery"),
		$bindGallery = $("img.bind-gallery"),
		imgGallery = "";

	$bindGallery.each(function() {
		var _this = this,
			$this = $(_this),
			_src = $this.attr("data-big-src") || _this.src,
			_title = $this.attr("data-title") || $this.siblings("span").text(),
			_thisIndex = $bindGallery.index($this);

		if (!$this.parents("li").hasClass("clone")) { // 不能为克隆的标签
			imgGallery += '<li><div class="am-gallery-item"><a href="' + _src + '"' +
				'title="' + _title + '"></a></div></li>';
		}
		$this.on("click", function() {
			$("#article-gallery li a").eq(_thisIndex).trigger("click");
		});
	});

	if ($gallery.length == 1) {
		$gallery.append(imgGallery);
	} else {
		$gallery = $('<ul data-am-widget="gallery" id="article-gallery" class="am-gallery am-avg-sm-2 am-gallery-imgbordered am-hide"">' + imgGallery + '</ul>');
		$("body").append($gallery);
		$gallery.pureview({
			target: 'a'
		});
	}

	/* -- 侦测导航 -- */
	var $window = $(window),
		stickyBind = false; // 绑定了导航跟随判断，防止重复执行
	if ($window.width() > 640) {
		addSticky();
		stickyBind = true;
	}
	$window.on("resize", function() {
		if ($window.width() > 640 && !stickyBind) {
			stickyBind = true;
			addSticky();
		}
	});
	/* 绑定导航跟随事件 */
	function addSticky() {
		var at = $("#article-template"), // 需要侦测的盒子
			atNav = at.find(".at-nav"), // 需要侦测的导航
			atRight = at.find(".c-right"),
			$win = $(window);
		if (atNav.length > 0) {
			if (!atNav.is(":hidden")) {
				atNav.sticky({
					top: 61
				}).scrollspynav();
			}
			$win.on("scroll", function() {
				scrollAtNav(atNav, atRight);
			});
		}
	}
	/* 判断导航是否隐藏 */
	function scrollAtNav(atNav, atRight) {
		var leftTop = atNav.offset().top + atNav.height();
		var rightTop = atRight.offset().top + atRight.height();
		if (leftTop >= rightTop - 50) {
			atNav.hide();
		} else {
			atNav.show();
		}
	}
}));