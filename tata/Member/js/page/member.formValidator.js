(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require, exports, module);
	} else {
		factory();
	}
}(this, function(require, exports, module) {
	$.fn.setForm = function(json) {
		var jsonObj = json,
			$this = $(this);
		if (typeof json === "string") {
			jsonObj = $.parseJSON(json);
		}
		for (var key in jsonObj) {
			$this.find("[name='" + key + "']").val(jsonObj[key]);
		}
	}

	$.fn.formValidator = function() {
		var amAler = $("<div class='am-alert am-alert-warning' data-am-alert id='my-amAlert'></hr>请检查未勾选选项</div>");
		$(this).validator({
			patterns: {
				mobile: /^\s*1\d{10}\s*$/
			},
			validClass: 'am-field-valid',
			validateOnSubmit: true,
			onValid: function(validity) {
				// 验证通过
				var $field = $(validity.field),$type = $field.attr("type");
				$field.closest('.am-form-group').find('.am-alert').fadeOut(333);
				$("#my-amAlert").fadeOut(555,function(){
					$(this).detach()
				});
			},
			onInValid: function(validity) {
				var $field = $(validity.field),
					_this = this;
				$field.on('focusin focusout', function(e) {
					var $type = $field.attr("type");
					if($type == "radio" || $type == "checkbox"){
						if($("#my-amAlert").length == 0){
							$field.parents("#open-radio-alert").prepend(amAler);
						}
					}else{
						addAlert(validity, $field, _this);
					}
				});
				
			},
			validate: function(validity) {
				var $field = $(validity.field),
					_this = this;
				// 自定义验证方式
				if ($field.is('.js-my-card')) {
					if (idcard($field.val())) {
						validity.valid = true;
					} else {
						validity.valid = false;
						$field.data('validationMessage', "请输入正确的身份证号")
						addAlert(validity, $field, _this);
					}
				}
			},
			submit: function(e, validity) {
				var formValidity = this.isFormValid();
				var $thisForm = $(e.target);
				if (formValidity) {
					$thisForm.data("isdata", true);
				} else {
					$thisForm.data("isdata", false);
				}
				return false;
			}
		});
	}
	// 添加form规则不通过规则
	function addAlert(validity, $field, _this) {
		// 使用自定义的提示信息 或 插件内置的提示信息
		var msg = $field.data('validationMessage') || _this.getValidationMessage(validity),
			$group = $field.closest('.am-form-group'),
			$alert = $group.find('.am-alert');
		if (!$alert.length) {
			$alert = $('<div class="am-alert am-alert-danger"></div>').hide().appendTo($group);
		}
		$alert.html(msg).show();
	}

	// 验证身份证号码
	function idcard(gets) {
		var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子;
		var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值，10代表X;
		if (gets.length == 15) {
			return isValidityBrithBy15IdCard(gets);
		} else if (gets.length == 18) {
			var a_idCard = gets.split(""); // 得到身份证数组   
			if (isValidityBrithBy18IdCard(gets) && isTrueValidateCodeBy18IdCard(a_idCard)) {
				return true;
			}
			return false;
		}
		return false;

		function isTrueValidateCodeBy18IdCard(a_idCard) {
			var sum = 0; // 声明加权求和变量   
			if (a_idCard[17].toLowerCase() == 'x') {
				a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作   
			}
			for (var i = 0; i < 17; i++) {
				sum += Wi[i] * a_idCard[i]; // 加权求和   
			}
			valCodePosition = sum % 11; // 得到验证码所位置   
			if (a_idCard[17] == ValideCode[valCodePosition]) {
				return true;
			}
			return false;
		}

		function isValidityBrithBy18IdCard(idCard18) {
			var year = idCard18.substring(6, 10);
			var month = idCard18.substring(10, 12);
			var day = idCard18.substring(12, 14);
			var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
			// 这里用getFullYear()获取年份，避免千年虫问题   
			if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
				return false;
			}
			return true;
		}

		function isValidityBrithBy15IdCard(idCard15) {
			var year = idCard15.substring(6, 8);
			var month = idCard15.substring(8, 10);
			var day = idCard15.substring(10, 12);
			var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
			// 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
			if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
				return false;
			}
			return true;
		}
	}
	
	// 添加多选选项和默认选择	
	$.fn.addCheckbox = function(settings) {
		if (this.length < 1) {
			return;
		};

		settings = $.extend({
			sex: 0
		}, settings);

		var qdata;
		if (settings.sex) {
			qdata = {
				character: [
					"温柔贤惠、懂生活、会持家长的顺眼就行。",
					"你要是能力强，愿意养家，我做家庭煮夫也是可以的。",
					"漂亮大方、懂事、健康、对生活充满热情的人。",
					"美女、个高、腿长、肤白、上得厅堂、入得厨房。",
					"懂事能撒娇，又能孝顺父母的姑娘就OK了。",
					"有爱心，喜欢孩子，能烧一手好菜。",
					"懂得给男人空间，做事得体大方，有气质，有学识，有一定社交能力的女孩。",
					"爱旅行爱运动，善于与人沟通，不人云亦云，有自己的主见。",
					"对婆媳关系处理上有耐心，懂得忍让，知晓吃亏是福的道理。"
				],
				characteristic: [
					"体贴人", "勇敢", "毅力", "细心", "果断", "浪漫", "孝顺", "有责任心", "急性子", "爱运动",
					"有主见", "有点大男子主义", "喜欢小孩", "不抽烟", "偶尔喝点", "会做饭", "没有女闺蜜", "善于沟通"
				]
			}
		} else {
			qdata = {
				character: [
					"成熟、稳重、顾家、有责任心的男人。",
					"阳光帅气、对生活充满热情的男人。",
					"颜值不重要,重要的是具备男人的气质,踏实勤奋，知道疼老婆，要是还懂一点浪漫就更好了!",
					"我的男人颜值很重要,颜值虽然不能当饭吃,但可以让我心情愉快,心情愉快是女人永葆青春的秘诀!",
					"孝顺有爱心,有自己的事业和追求,做事果断不拖泥带水。",
					"希望他气质儒雅,生活规律,再有点幽默感就足已了。"
				],
				characteristic: [
					"温柔", "贤惠", "大方", "漂亮", "善解人意", "果断", "浪漫", "孝顺", "有责任心", "美图达人",
					"恐高", "有主见", "购物狂", "急性子", "女汉子", "会做饭", "生活规律", "有点小资",
					"喜欢小孩", "有点胆小", "想早点结婚", "喜欢旅行", "选择综合症", "没有男闺蜜", "喜欢养宠物"
				]
			}
		}
		this.each(function() {
			var $this = $(this);
			$this.on("click", function() {
				var jsondata = $this.val().split("|");
				var name = $this.attr("name"),
					$md = $("#my-quality-popup");
				
				init(qdata[name], $md.find(".my-modal-content"), name,jsondata);
				$md.data("input", $this).modal();
			})
		})

		function init(data, elm, name,jsondata) {
			var _html = "",
				$elm = $(elm);
			
			for (var i = 0; i < data.length; i++) {
				var val = data[i],check="";
				for(var j=0; j < jsondata.length;j++){
					if(val == jsondata[j]){
						check = "checked='checked'";
					}
				}
				_html += "<label class='am-checkbox-inline'><input "+check+" name='" + name + "' type='checkbox' value='" + val + "' data-am-ucheck>" + val + "</label>";
			}
			$elm.html(_html)
		}
	};

}));