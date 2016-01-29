(function(root, factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(["jquery", "amazeui", "formValidator"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"), require("amazeui"), require("formValidator"));
	} else {
		factory(root.jQuery);
	}

}(this, function($) {
	addOption(150, 200, "#sel-height");
	addOption(40, 90, "#kg-height");
	$(".am-popup").one('open.modal.amui opened.modal.amui', function() {
		/* 改变popup的默认高度，不需要过多白边 */
		var $thisPopup = $(this);
		if ($(window).width() <= 620) {
			$thisPopup.css("height", "100%");
		} else {
			$thisPopup.height("auto");
			$thisPopup.removeClass("hide").css({
				"margin-top": -$thisPopup.height() / 2
			});
		}
		$(window).on("resize", function() {
			if ($(this).width() <= 620) {
				$thisPopup.css({
					"height": "100%",
					"margin-top": "0"
				})
			} else {
				$thisPopup.height("auto");
				$thisPopup.css({
					"margin-top": -$thisPopup.height() / 2
				});
			}
		})
	});
	// 绑定form验证
	var $formArr = $(".am-form");
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
	});
	// 验证真实信息
	$("#checkinfo").on("click", function(e) {
		var $this = $(this),
			$form = $this.parents("form");
		if ($form.validator('isFormValid')) {
			$.getJSON('data/checkinfo.json', function(data) {
				$("#reality-info").setForm(data.user);
				$("#my-checkinfo").modal().find(".my-modal-content").text(JSON.stringify(data.user));
			});
		}
	});
	// 品质选择
	var $checkSex = 0;
	// 性别 1为男  0为女
	$("#options-tab").find("input.checkboxq").addCheckbox({
		"sex": $checkSex
	});
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
		$("#notice").attr("checked", "checked")
	});

	// -- 上传头像
	var $file = $("#file"),
		$load = $(".loading"),
		$uploadModal = $('#my-upload-head');
	$("#upload-head").on("click", function() {
		$uploadModal.modal({
			relatedTarget: this,
			closeViaDimmer: false
		});
		$uploadModal.find('.am-modal-btn').off('click.close.modal.amui');
		var clipArea = $("#clipArea");
		if ($.fn.photoClip) {
			$file.click();
		} else {
			$load.find(".txt").text("初次加载，请稍候..").show();
			require(["photoClip"], function() {
				$(".clip-text").fadeOut();
				clipArea.photoClip({
					width: 232,
					height: 299,
					fileMinSize:40,
					file: $file,
					view: "#user-head",
					ok: "#clipBtn",
					loadStart: function() {
						//console.log("照片读取中");
						$("#clipAlert").addClass("am-hide");
						$load.show();
					},
					loadComplete: function() {
						//console.log("照片读取完成");
						$load.hide();
					},
					clipFinish: function(dataURL) {
						var headdata = {
							"userhead": dataURL
						}
						clipArea.find("img").attr("src", "");
						console.log("裁剪完成：" + headdata);
					},
					imgSizeMin: function(kbs, error) {
						// 上传图片过小
						$uploadModal.modal();
						$load.hide();
						$("#my-clip-alert").modal({
							relatedTarget: this,
							onConfirm: function(options) {
								$uploadModal.modal();
								$file.click();
							}
						});
					}
				});
				$load.hide();
			});
		}
	});
	$("#new-change-img").on("click", function() {
		// 重新选择
		$file.click();
	});
	$("#clipBtn").on("click", function() {
		// 裁剪完毕
		$uploadModal.modal("close");
	});
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
	};
	// -- 添加下拉框
	function addOption(min, max, elm) {
		var _html = "",
			$elm = $(elm),
			value = $elm.attr("data-value") || $elm.data("value");
		for (var i = parseInt(min); i < parseInt(max); i++) {
			_html += "<option value='" + i + "'" + ((value == i) ? ' selected="selected"' : '') + ">" + i + "</option>"
		}
		$elm.html(_html)
	}

}));