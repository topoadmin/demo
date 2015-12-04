/*仿刷新：检测是否存在cookie*/
function checkSms() {
	if ($.cookie("captcha")) {
		var count = $.cookie("captcha");
		var btn = $('.btn-sendsms');
		btn.val(count + '秒后可重新获取').attr('disabled', true).css('cursor', 'not-allowed');
		var resend = setInterval(function() {
			count--;
			if (count > 0) {
				btn.val(count + '秒后可重新获取').attr('disabled', true).css('cursor', 'not-allowed');
				$.cookie("captcha", count, {
					path: '/',
					expires: (1 / 86400) * count
				});
			} else {
				clearInterval(resend);
				btn.val("获取验证码").removeClass('disabled').removeAttr('disabled style');
			}
		}, 1000);
	}
}

function sendSms(elm) {
	var btn = elm,
		count = 60;
	var resend = setInterval(function() {
		count--;
		if (count > 0) {
			btn.val(count + "秒后可重新获取");
			$.cookie("captcha", count, {
				path: '/',
				expires: (1 / 86400) * count
			});
		} else {
			clearInterval(resend);
			btn.val("获取验证码").removeAttr('disabled style');
		}
	}, 1000);
	btn.attr('disabled', true).css('cursor', 'not-allowed');
}

function formValidator(form) {
	$(form).validator({
		patterns: {
			mobile: /^\s*1\d{10}\s*$/
		},
		onValid: function(validity) {
			$(validity.field).closest('.am-form-group').find('.am-alert').hide();
		},
		onInValid: function(validity) {
			var $field = $(validity.field),
				$group = $field.closest('.am-form-group'),
				$alert = $group.find('.am-alert');

			// 使用自定义的提示信息 或 插件内置的提示信息
			var msg = $field.data('validationMessage') || this.getValidationMessage(validity);
			if (!$alert.length) {
				$alert = $('<div class="am-alert am-alert-danger"></div>').hide().
				appendTo($group);
			}
			$alert.html(msg).show();
		},
		validate: function(validity) {
			var v = $(validity.field).val();
			var comparer = function(v1, v2) {
				if (v1 != v2) {
					validity.valid = false;
				}else{
					validity.valid = true;
				}
			};
//			if ($(validity.field).is('.sendsms-input')) {
//				return $.ajax({
//					url: 'http://s.amazeui.org/media/i/demos/validate.json',
//					// cache: false, 实际使用中请禁用缓存
//					dataType: 'json'
//				}).then(function(data) {
//					comparer(data.count, v);
//					return validity;
//				}, function() {
//					return validity;
//				});
//			}
			if ($(validity.field).is('.sendsms-input')) {
				comparer(123456, v);
			}
		}
	});
}