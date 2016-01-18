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
	setTimeout(function() {
		$(".loading").hide();
	}, 333)
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
	
	var $window = $(window);
	// -- 加载登录模块
	var loginModule = function() {
		// -- 登录注册弹窗
		var lrpopup = $("#my-lr-popup"),
			toggleForm = lrpopup.find(".toggle-form"),
			form = lrpopup.find(".am-form");
		
		if (lrpopup.data("open")) {
			lrpopup.modal();
		} else {
			// 第一次打开配置modal属性,并记录以打开过
			lrpopup.modal({
				relatedTarget: this,
				closeViaDimmer: false
			}).data("open", true).find('.submit').off('click.close.modal.amui').on("click", function() {
				lrpopup.find("form:visible").submit();
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
		lrpopup.one('open.modal.amui opened.modal.amui', function(){
			/* 改变popup的默认高度，不需要过多白边 */
			if($window.width() <= 620){
				lrpopup.css("height","100%");
			}else{
				lrpopup.height("auto");
				lrpopup.removeClass("hide").css({"margin-top":-lrpopup.height()/2});
			}
			$window.on("resize",function(){
				if($(this).width() <=620){
					lrpopup.css({"height":"100%","margin-top":"0"})
				}else{
					lrpopup.height("auto");
					lrpopup.css({"margin-top":-lrpopup.height()/2});
				}
			})
		});

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