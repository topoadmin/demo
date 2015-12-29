require.config({
	paths: {
//		  	"amazeui":"../assets/js/amazeui.min",	// 妹子Ui
		"jquery": "../assets/js/jquery.min",
		//		"jquery":"http://libs.baidu.com/jquery/2.0.0/jquery.min",	百度cdn搭配妹子会出BUG
		"amazeui": "http://cdn.amazeui.org/amazeui/2.5.0/js/amazeui.min",
		"lazyload": "module/jquery.lazyload",
		"easing": "module/jquery.easing",
		"mixitup": "module/jquery.mixitup",
		"storage": "module/storage",
		"laytpl": "module/laytpl",
		"formValid": "module/jquery.formValid",
		"app": "page/app",
		"article":"page/article",
		"home": "page/home"
	}
});
require(["jquery", "amazeui", "app"], function($) {
	require([thisPage]);
	
	
	
	var sendCode = $(".send-code");
	if (sendCode.length) {
		/*仿刷新：检测是否存在cookie*/
		require(["storage"], function(storage) {
			var count = storage.get("captcha");
			if (count) {
				checkCaptcha(sendCode, count);
			}
		});
		sendCode.on("click", function() {
			checkCaptcha($(this));
		})
	}

	// 发送验证码按钮定时器事件
	function checkCaptcha(elm, count) {
		var $mobile = $(this).parents("form").find(".js-pattern-mobile");
		var btn = $(elm);
		var count = count || 60;
		var resend = setInterval(function() {
			count--;
			if (count > 0) {
				btn.val(count + "秒后可重新获取");
				require(["storage"], function(storage) {
					storage.set("captcha", count, count);
				})
			} else {
				clearInterval(resend);
				if (!$mobile.hasClass("am-field-valid")) {
					btn.prop('disabled', false);
				} else {
					btn.prop('disabled', true);
				}
				btn.val("获取验证码");
			}
		}, 1000);
		btn.prop('disabled', true);
	}


});