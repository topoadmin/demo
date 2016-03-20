/*
 * gaoshi-github 
 * 13701379934@163.com
 * 2016年3月20日 
 * 动画翻页
 * */
;
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory;
	} else {
		factory(jQuery);
	}
}(function($) {
	// 缓存对象
	var $body = $("body"),
		$document = $(document);
	var methods = {
		init: function(pageLen) { // -- 初始化
			// 生成子弹栏
			var $bulletsContainer = $('ul.bullets');
			if ($bulletsContainer.length == 0) {
				$bulletsContainer = $('<ul class="bullets"></ul>')
			}
			// 获取一个页创建一个子弹
			var bullet = "";
			for (var i = 0, len = pageLen; i < len; i++) {
				var cl = i === 0 ? 'active' : '';
				bullet += ('<li class="' + cl + '"></li>');
			}
			$bulletsContainer.append(bullet);
			$body.append($bulletsContainer); // 子弹栏插入页面
			$bulletsContainer.on("click", "li", function() {
				methods.switchPage($(this).index());
			});
		},
		switchPage: function(index) { // -- 切换页面 index 翻页页码
			//更新子弹层当前位置
			var bullet = $("ul.bullets li").removeClass("active");
			bullet.eq(index).addClass("active");
			//关闭方向键翻页,防止重复执行
			$document.unbind("keydown");
			/*添加遮罩防止多次触屏滑动*/
			if ($.fn.gsPage.backMask) {
				$.fn.gsPage.backMask.show();
			} else {
				$.fn.gsPage.backMask = $("<div class='backMask'></div>");
				$body.append($.fn.gsPage.backMask);
			}

			/* 获取动画效果
			 * 判断是否有自定义动画效果
			 * */
			var ga = methods.getAnimate(),
				outA, comeA, speed, options = $.fn.gsPage.defaults;
			outA = (options.outAnimate) ? options.outAnimate : ga[0];
			comeA = (options.outAnimate) ? options.outAnimate : ga[1];
			speed = (options.outAnimate) ? options.outAnimate : ga[2];

			var page = $.fn.gsPage.element; // 获取所有页
			var thisDom = page.eq(methods.getIndex()); //获取当前页
			var nextPage = page.eq(index); // 获取下一页

			// 当前页消失动画
			thisDom.addClass(outA + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				$(this).removeClass(outA + ' animated show').addClass("hide");
			});

			// 下一页打开动画
			setTimeout(function() {
				nextPage.removeClass("hide").addClass(comeA + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
					nextPage.removeClass(comeA + ' animated').addClass("show");
					$.fn.gsPage.backMask.hide(); // 隐藏遮罩
					$.fn.gsPage.keyDownFn(); // 重新绑定键盘事件
				});
			}, parseInt(speed));
		},
		prev: function() { // -- 上一页
			var index = methods.getIndex() - 1;
			methods.switchPage(index < 0 ? $.fn.gsPage.element.length - 1 : index);
		},
		next: function() { // -- 下一页
			var index = methods.getIndex() + 1;
			methods.switchPage(index >= $.fn.gsPage.element.length ? 0 : index);
		},
		getIndex: function() { // -- 获取当前页
			var index = 0;
			$.fn.gsPage.element.each(function(i) {
				if ($(this).hasClass("show")) {
					index = i;
					return false;
				}
			})
			return index;
		},
		getAnimate: function() {
			/* 生成动画效果
			 * 返回一个数组
			 * [关闭动画，开始动画，动画时间]
			 * */
			var inam = ["bounceIn", "bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp", "fadeIn", "fadeInDown",
				"fadeInDownBig", "fadeInLeft", "fadeInLeftBig", "fadeInRight", "fadeInRightBig", "rollIn", "flipInY",
				"flipInX", "lightSpeedIn", "rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight",
				"slideInUp", "slideInDown", "slideInLeft", "slideInRight", "zoomIn", "zoomInDown", "zoomInLeft", "zoomInRight", "zoomInUp"
			];
			var outam = ["bounceOut", "bounceOutDown", "bounceOutRight", "bounceOutLeft", "bounceOutUp", "fadeOut", "fadeOutDown",
				"fadeOutDownBig", "fadeOutRight", "fadeOutRightBig", "fadeOutLeft", "fadeOutLeftBig", "rollOut", "flipOutY",
				"flipInX", "lightSpeedOut", "rotateOut", "rotateOutDownLeft", "rotateOutDownRight", "rotateOutUpLeft", "rotateOutUpRight",
				"slideOutUp", "slideOutDown", "slideOutRight", "slideOutLeft", "zoomOut", "zoomOutDown", "zoomOutLeft",
				"zoomOutRight", "zoomOutUp"
			];
			var speed = [333, 100, 155, 155, 155, 666, 155,
				155, 155, 155, 155, 155, 155, 200,
				333, 333, 333, 266, 266, 266, 155,
				266, 266, 155, 155, 333, 266, 266
			]
			var num = methods.getRandomNum(0, inam.length - 1);
			var inout = [outam[num], inam[num], speed[num]];
			return inout;
		},
		getRandomNum: function(Min, Max) { // -- 获取一个范围内的随机数  
			var Range = Max - Min;
			var Rand = Math.random();
			return (Min + Math.round(Rand * Range));
		}
	}

	$.fn.gsPage = function(options, callback) {
		var thisEl = this;
		$.fn.gsPage.thisEl = thisEl;
		var options = $.extend($.fn.gsPage.defaults, options);
		$.fn.gsPage.element = thisEl.children(options.children); // 获取所有页
		methods.init($.fn.gsPage.element.length); // 初始化
		if (options.keyDown) {
			$.fn.gsPage.keyDownFn();
		}
		if (options.keyDown) {
			$.fn.gsPage.swipeFn();
		}
		return thisEl;
	}
	$.fn.gsPage.defaults = {
		children: "div.am-g",
		keyDown: false, // 键盘事件
		swipe: false, // 滑动事件，依赖 jquery.touchSwiper
		outAnimate: false, // 自定义关闭动画
		comeAnimate: false, // 自定义开始动画
		animateSpeed: false, // 自定义动画速度
	}
	$.fn.gsPage.prev = function() {
		methods.prev();
	};
	$.fn.gsPage.next = function() {
		methods.next();
	};
	$.fn.gsPage.keyDownFn = function() {
		// 键盘按下事件
		$document.on("keydown", function(e) {
			var k = e.keyCode || e.which;
			if (k === 37) {
				$.fn.gsPage.prev();
			} else if (k === 38) {} else if (k === 39) {
				$.fn.gsPage.next()
			}
		})
	};
	$.fn.gsPage.swipeFn = function(element) {
		// 滑屏事件
		if (typeof define === "function" && define.amd) {
			require(["touchSwiper"], function() {
				init($.fn.gsPage.thisEl);
			})
		} else {
			init($.fn.gsPage.thisEl);
		}

		function init(element) {
			element.swipe({
				swipe: function(event, direction, distance, duration, fingerCount) {
					if (direction == "left") {
						$.fn.gsPage.next();
					} else if (direction == "right") {
						$.fn.gsPage.prev();
					} else if (direction == "up") {

					} else if (direction == "down") {}
				}
			});
		}
	};
}));