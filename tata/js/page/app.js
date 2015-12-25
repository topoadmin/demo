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
	}, 500);
	
	var $body = $("body");
	require(["storage"], function(storage) {
		// -- 宽窄屏切换
		$(".fixed-widtn").on("click", function() {
			var fixedTxt = $(this).children(".fixed-txt"),
				txt = fixedTxt.text().trim();
			fixedTxt.text((txt == "宽屏") ? "窄屏" : "宽屏")
			$body.toggleClass("am-g-fixed-min");
			$(window).trigger("resize"); // 触发resize事件,轮播重设宽度
			if($body.hasClass("am-g-fixed-min")){
				storage.set("am-g-fixed-min", true);
			}else{
				storage.set("am-g-fixed-min", false);
			}
		});
		var afmStorage = storage.get("am-g-fixed-min");
		if(!afmStorage){
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
	floatCode.on("click", ".am-btn", function() {
		floatCode.fadeOut(1000, function() {
			floatCode.removeClass("am-show-lg-only");
		});
	});
	
	// 浮动客服
	var floatKefu = $("#float-kefu");
	if(floatKefu.length){
		var open = floatKefu.children(".open-img"),kefu = floatKefu.children(".open-kefu"),
			closeKefu = floatKefu.find(".close-kefu");
		open.on("click",function(){
			open.addClass("am-hide");
			kefu.removeClass("am-hide");
		});
		closeKefu.on("click",function(){
			kefu.addClass("am-hide");
			open.removeClass("am-hide");
		});
	}
	
	
	
	return {
		loginModule: loginModule
	}

}));



