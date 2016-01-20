(function(root, factory) {
	if (typeof define === "function" && define.amd) {
		define(["jquery", "amazeui"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"), require("amazeui"));
	} else {
		factory(root.jQuery);
	}

}(this, function($) {
	var loading = $(".loading");
	var $window = $(window);
	setTimeout(function() {
		loading.hide();
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

	// -- 加载登录模块
	var loginModule = function(method) {
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
		/*lrpopup.one('open.modal.amui opened.modal.amui', function() {
			if ($window.width() <= 620) {
				lrpopup.css({
					"height": "100%",
					"margin-top": "0"
				})
			} else {
				lrpopup.css({
					"margin-top": -lrpopup.height() / 2
				});
			}
			$window.on("resize", function() {
				if ($(this).width() <= 620) {
					lrpopup.css({
						"height": "100%",
						"margin-top": "0"
					})
				} else {
					lrpopup.height("auto");
					lrpopup.css({
						"margin-top": -lrpopup.height() / 2
					});
				}
			})
		});*/

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

	/* 打开用户弹窗 */
	$.fn.userPopup = function(opt) {
		var defaults = {
			$userPopup: $("#my-user-popup"),
			$userImgBox: ".user-img-box"
		};
		var opts = $.extend(defaults, opt);
		var self = $(this);
		self.on("click", opts.$userImgBox, function() {
			openUserPopup($(this));
		})

		function openUserPopup(elm) {
			loading.show().find(".txt").html("用户内容加载中。。。");
			var $abox = elm.children("a"),
				$userImg = $abox.children(".user-avatar").attr("src"),
				$rankImg = $abox.children(".user-rank").attr("src");
			setTimeout(function() {
				// 点击查看用户资料
				$.getJSON("js/data/userInfo.json", function(data) {
					loading.hide();
					data.userimg = $userImg;
					data.rank = $rankImg;
					data.characterDom = splitCharacter(data.character);
					fillUserPopup(data);
				});
			}, 333);
		}

		function splitCharacter(character) {
			var jsondata = character.split("|");
			var newStr = "";
			for (var i = 0; i < jsondata.length; i++) {
				if (jsondata[i]) {
					newStr += "<p>" + jsondata[i] + "</p>";
				}
			}
			newStr += "</br>"
			return newStr;
		}

		// -- 填充用户信息
		function fillUserPopup(data) {
			var $data = data,
				$userPopup = opts.$userPopup,
				$userDom = {
					username: $userPopup.find(".user-username"),
					site: $userPopup.find(".user-site"),
					age: $userPopup.find(".user-age"),
					height: $userPopup.find(".user-height"),
					weight: $userPopup.find(".user-weight"),
					constellation: $userPopup.find(".user-constellation"),
					job: $userPopup.find(".user-job")
				},
				$character = $userPopup.find(".user-character"),
				$addPraise = $userPopup.find(".add-praise"),
				$praise = $userPopup.find(".user-praise");

			for (var k in $userDom) {
				$userDom[k].text($data[k]);
			}
			if ($userPopup.data("open")) {
				$userPopup.modal();
			} else {
				$userPopup.modal({
					relatedTarget: this,
					closeViaDimmer: false
				}).data("open", true).on("click", ".add-praise", function() {
					// -- 点赞
					var $this = $(this),
						$praise = $this.find(".user-praise span");
					var praiseSize = parseFloat($praise.text()) + 1;
					$praise.text(praiseSize);
				});
			}
			$character.html(data.characterDom)
			$userPopup.find(".user-img-popup").attr("src", $data.userimg);
			$userPopup.find(".user-rank").attr("src", $data.rank);
		}
	}

}));