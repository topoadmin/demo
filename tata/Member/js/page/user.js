(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require, exports, module);
	} else {
		factory();
	}
}(this, function(require, exports, module) {
	require(["amazeui", "formValid"], function() {　　
		addOption(150, 200, "#sel-height");
		addOption(40, 90, "#kg-height");

		// 绑定form验证
		var $formArr = $(".form-vail");
		$formArr.each(function(i) {
			var $this = $(this);
			$this.formValidator();
			$this.on("submit", function() {
				var $formJson = $this.serialize();
				if ($this.data("isdata")) {
					console.log("提交这段数据吧[" + $formJson + "]");
				}
				return false;
			})
		})

		// 验证真实信息
		$("#checkinfo").on("click", function(e) {
			var $this = $(this),
				$form = $this.parents("form");
			if ($form.validator('isFormValid')) {
				$.getJSON('data/checkinfo.json', function(data) {
					$form.setForm(data.user);
					$("#my-checkinfo").modal().find(".my-modal-content").text(JSON.stringify(data.user));
				});
			}
		})

		// 地区选择
		var citySel = $("#city-sel");
		if (citySel.length > 0) {
			require(["citySelect"], function() {　　
				citySel.citySelect({
					prov: "北京",
					city: "东城区",
					nodata: "none"
				});
			});
		}

		// -- 品质选择
		var $checkSex = 0; // 性别 1为男  0为女
		$("#options-tab").find("input.checkboxq").addCheckbox({
			"sex": $checkSex
		}); // 添加多选

		// 关闭品质选择
		$("#my-quality-popup").on("close.modal.amui", function() {
			var $this = $(this),
				$input = $this.data("input");

			var str = "";
			$this.find("input").each(function() {
				if ($(this).prop("checked")) {
					str += $(this).val() + "|";
				}
			})
			if (str) {
				$input.val(str);
			}
		});

		// -- 用户提交须知
		$("#notice-popup").on("close.modal.amui", function() {
			$("#notice").attr("checked","checked")
		});
	});
}));


/**
 * 添加下拉框选项
 * @param {min} 开始数
 * @param {max} 结束数
 * @param {elm} select 节点
 */
function addOption(min, max, elm) {
	var _html = "",
		$elm = $(elm),
		value = $elm.attr("data-value") || $elm.data("value");
	for (var i = parseInt(min); i < parseInt(max); i++) {
		_html += "<option value='" + i + "'" + ((value == i) ? ' selected="selected"' : '') + ">" + i + "</option>"
	}
	$elm.html(_html)
}







/* end */