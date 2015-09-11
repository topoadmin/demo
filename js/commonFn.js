window.cupScreen = function(node) {
	// 获取所有屏幕实例
	var page = $(node).children(".row");
	// 切换屏幕
	function switchPage(index, Out, come, animeteTime) {
		//关闭方向键翻页
		$(document).unbind("keydown");
		var thisPage = getIndex();
		var thisDom = page.eq(thisPage);
		var nextPage = page.eq(index);

		/*添加遮罩防止多次触屏滑动*/
		var backMask = $("<div class='backMask'></div>")
		$("body").append(backMask);

		thisDom.addClass(Out + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
			$(this).removeClass(Out + ' animated show').addClass("hide");
		});

		setTimeout(function() {
			nextPage.removeClass("hide").addClass(come + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				nextPage.removeClass(come + ' animated').addClass("show");
				$(".backMask").remove();
				addEventKeyup();
			});
		}, parseInt(animeteTime));

		//更新子弹层当前位置
		var bullet = $(".bullets").find("li").removeClass("active");
		bullet.eq(index).addClass("active");
	}

	// 上一页
	function prev(Out, come, animeteTime) {
		var index = getIndex() - 1;
		switchPage(index < 0 ? page.length - 1 : index, Out, come, animeteTime);
	}

	// 下一页
	function next(Out, come, animeteTime) {
		var index = getIndex() + 1;
		switchPage(index >= page.length ? 0 : index, Out, come, animeteTime);
	}

	// 获取当前页码
	function getIndex() {
		var index = 0;
		page.each(function(i) {
			if ($(this).hasClass("show")) {
				index = i;
				return false;
			}
		})
		return index;
	}

	// 获取总页数
	function getTotal() {
		return page.length;
	}

	// 获取当前页的内容结构
	function getHtml() {
		return page.eq(getIndex()).children("div");
	}

	// 自动生成动画
	function getAnimate() {
		var inam = ["bounceIn", "bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp", "fadeIn", "fadeInDown",
			"fadeInDownBig", "fadeInLeft", "fadeInLeftBig", "fadeInRight", "fadeInRightBig", "rollIn", "flipInY",
			"flipInX", "lightSpeedIn", "rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight",
			"slideInUp", "slideInDown", "slideInLeft", "slideInRight", "zoomIn", "zoomInDown", "zoomInLeft", "zoomInRight", "zoomInUp"
		]
		var outam = ["bounceOut", "bounceOutDown", "bounceOutRight", "bounceOutLeft", "bounceOutUp", "fadeOut", "fadeOutDown",
			"fadeOutDownBig", "fadeOutRight", "fadeOutRightBig", "fadeOutLeft", "fadeOutLeftBig", "rollOut", "flipOutY",
			"flipInX", "lightSpeedOut", "rotateOut", "rotateOutDownLeft", "rotateOutDownRight", "rotateOutUpLeft", "rotateOutUpRight",
			"slideOutUp", "slideOutDown", "slideOutRight", "slideOutLeft", "zoomOut", "zoomOutDown", "zoomOutLeft",
			"zoomOutRight", "zoomOutUp"
		]
		var time = [333, 100, 155, 155, 155, 666, 155,
			155, 155, 155, 155, 155, 155, 200,
			333, 333, 333, 266, 266, 266, 155,
			266, 266, 155, 155, 333, 266, 266
		]
		var num = GetRandomNum(0, inam.length - 1);
		var inout = [outam[num], inam[num], time[num]];
		return inout;
	}

	function GetRandomNum(Min, Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		return (Min + Math.round(Rand * Range));
	}

	return {
		getAnimate: getAnimate,
		switchPage: switchPage,
		prev: prev,
		next: next,
		getIndex: getIndex,
		getTotal: getTotal,
		getHtml: getHtml
	};
}

$(function() {
	var worker = new Worker("js/worker.js");
	worker.postMessage("发送的信息!"); //发送数据
	worker.onmessage = function(evt) {
		console.dir(evt.data);
		//		showMsgNotification(evt.data);
	}
})
window.addEventListener('load', function() {
	window.addEventListener('load', function() {
		// At first, let's check if we have permission for notification
		if (Notification && Notification.permission !== "granted") {
			Notification.requestPermission(function(status) {
				if (Notification.permission !== status) {
					Notification.permission = status;
				}
			});
		}
	});
});

function showMsgNotification(data) {
	var Notification = window.Notification || window.mozNotification || window.webkitNotification;
	if (Notification && Notification.permission === "granted") {
		var instance = new Notification(
			data.title, {
				body: data.msg,
				icon: data.ic
			}
		);
		instance.onclick = function() {
			// Something to do
			alert("点击关闭");
			setTimeout(instance.onclose, 100);
		};
		instance.onerror = function() {
			// Something to do
		};
		instance.onshow = function() {
			// Something to do
			// console.log(instance.close);
			setTimeout(instance.onclose, 1000);
		};
		instance.onclose = function() {
			// Something to do
		};

	} else if (Notification && Notification.permission !== "denied") {
		Notification.requestPermission(function(status) {
			if (Notification.permission !== status) {
				Notification.permission = status;
			}
			// If the user said okay
			if (status === "granted") {
				var instance = new Notification(
					title, {
						body: msg,
						icon: ic
					}
				);
				instance.onclick = function() {
					// Something to do
				};
				instance.onerror = function() {
					// Something to do
				};
				instance.onshow = function() {
					// Something to do
					setTimeout(instance.onclose, 1000);
				};
				instance.onclose = function() {
					// Something to do
				};
			} else {
				return false
			}
		});
	} else {
		return false;
	}
}

function printEffect(options) {
	var options = $.extend({
		intelTime:0,
		dom: "#p-msg",
		open: false,
		start: 300,
		speed: 50
	}, options);
	var printTime = options.intelTime;
	var _this = $(options.dom);
	var jsondata = _this.html().split("|");
	var newStr = "";
	for (var i = 0; i < jsondata.length; i++) {
		if (jsondata[i]) {
			newStr += jsondata[i] + "</br>";
		}
	}
	newStr += "</br>"
	var str = newStr.replace(/(s){2,}/g, "$1");
	var index = 0;
	if (options.open) {
		_this.html(str);
		return;
	}
	_this.html("");
	var timer = function() {
		var args = arguments;
		var current = str.slice(index, index + 1);
		if (current == '<') {
			index = str.indexOf('>', index) + 1;
		} else {
			index++;
		}
		if (index < str.length - 1) {
			_this.html(str.substring(0, index) + (index & 1 ? '_' : ''));
		} else {
			_this.html(str.substring(0, index));
			clearTimeout(timer);
			clearTimeout(printTime);
		};
		printTime = setTimeout(args.callee, options.speed)
	};
	setTimeout(timer, options.start);
}


// 生成随机颜色
var getRandomColor = function() {
	return '#' + (function(color) {
		return (color += '0123456789abcdef' [Math.floor(Math.random() * 16)]) && (color.length == 6) ? color : arguments.callee(color);
	})('');
}

// 生成 max 以下的随机数
var getRandom = function(max) {
	return Math.floor(Math.random() * max + 1)
}

// 日期格式转时间戳
// 2015-9-8 12:00:00
// 2015/9/8 12:00:00
function getTimeStamp(dateStr) {
	var newstr = dateStr.replace(/-/g, '/');
	var date = new Date(newstr);
	var time_str = date.getTime().toString();
	return (time_str.substr(0, 10)) * 1000;
}

/*
 * var date = Math.round(new Date().getTime());
 * var date = new Date().getTime();
 * var date = new Date().valueOf();
 * 日期格式转时间戳调用方法
 * alert(getLocalTime(date));
 * alert(getLocalTime(date,12));  // 12小时制
 * */
function getLocalTime(nS, type) {
	var Y, M, D, W, H, I, S;

	function fillZero(v) {
		if (v < 10) {
			v = '0' + v;
		}
		return v;
	}
	var d = new Date(parseInt(nS / 1000) * 1000);
	var Week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	Y = d.getFullYear();
	M = fillZero(d.getMonth() + 1);
	D = fillZero(d.getDate());
	W = Week[d.getDay()];
	H = fillZero(d.getHours());
	I = fillZero(d.getMinutes());
	S = fillZero(d.getSeconds());
	//12小时制显示模式
	if (type && type == 12) {
		//若要显示更多时间类型诸如中午凌晨可在下面添加判断
		if (H <= 12) {
			H = '上午 ' + H;
		} else if (H > 12 && H < 24) {
			H -= 12;
			H = '下午 ' + fillZero(H);
		} else if (H == 24) {
			H = '下午 00';
		}
	}
	var localTime = Y + '-' + M + '-' + D + ' ' + H + ':' + I + ':' + S;
	return localTime;
}