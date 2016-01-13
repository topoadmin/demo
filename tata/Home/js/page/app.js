(function(root, factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(["jquery", "amazeui"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"), require("amazeui"));
	} else {
		factory(root.jQuery);
	}

}(this, function($) {
	$(".loading").hide();

	var $body = $("body");
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
		});
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
	}
	
	// -- 宽窄屏切换
	require(["storage"], function(storage) {
		$(".fixed-widtn").on("click", function() {
			var $this = $(this),
				fixedTxt = $this.children(".fixed-txt"),
				txt = fixedTxt.text().trim();
			$this.parent("li").addClass("am-active").siblings("li").removeClass("am-active");	
			fixedTxt.text((txt == "宽屏") ? "窄屏" : "宽屏")
			$body.toggleClass("am-g-fixed-min");
			$(window).trigger("resize"); // 触发resize事件,轮播重设宽度
			if ($body.hasClass("am-g-fixed-min")) {
				storage.set("am-g-fixed-min", false);
			} else {
				storage.set("am-g-fixed-min", true);
				// 加载下一轮用户头像,防止页面加宽出现load图
				$("#user-box").find(".lazyload").trigger("sporty");	
			}
		});
		var afmStorage = storage.get("am-g-fixed-min");
		if (afmStorage) {
			$(".fixed-widtn").trigger("click");
		}
	});

	// -- 加载登录模块
	var loginModule = function() {
		// -- 登录注册弹窗
		var popup = $("#my-lr-popup"),
			toggleForm = popup.find(".toggle-form"),
			form = popup.find(".am-form");
		if (popup.data("open")) {
			// 打开Modal
			popup.modal();
		} else {
			// 第一次打开配置modal属性,并记录以打开过
			popup.modal({
				relatedTarget: this,
				closeViaDimmer: false
			}).data("open", true).find('.submit').off('click.close.modal.amui').on("click", function() {
				popup.find("form:visible").submit();
			});
			toggleForm.on("click", function() {
				var $this = $(this),
					$form = $this.data("form") || $this.attr("data-form");
				toggleForm.removeClass("am-btn-primary");
				$this.addClass("am-btn-primary");
				form.addClass("am-hide");
				$($form).removeClass("am-hide");
			});
		}
		// -- 加载表单验证模块
		require(["formValid"], function() {
			// 登录验证
			form.each(function() {
				var $this = $(this);
				$this.formValidator({
					success: function($form) {
						var $form = $form;
						$form.find(".offAuto").remove();
						if ($form.data("isdata")) {
							console.log($form.serialize());
						}
					},
					error: function($form) {}
				});
			})
		});
	}
	$(".login").on("click", function() {
		loginModule();
	});
	// -- 关闭浮动二维码
	var floatCode = $("#float-code");
	if (floatCode.length) {
		floatCode.on("click", ".am-btn-close", function() {
			floatCode.slideUp(666, function() {
				floatCode.remove();
			});
		});
	}

	// 浮动客服
	var floatKefu = $("#float-kefu");
	if (floatKefu.length) {
		var open = floatKefu.children(".open-img"),
			kefu = floatKefu.children(".open-kefu"),
			closeKefu = floatKefu.find(".close-kefu");
		open.on("click", function() {
			open.addClass("am-hide");
			kefu.removeClass("am-hide");
		});
		closeKefu.on("click", function() {
			kefu.addClass("am-hide");
			open.removeClass("am-hide");
		});
		floatKefu.on("click", ".am-btn-close", function() {
			floatKefu.slideUp(666, function() {
				floatKefu.remove();
			});
		});
	}

}));