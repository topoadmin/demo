(function(root, factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		define(["jquery"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"));
	} else {
		factory(root.jQuery);
	}

}(this, function($) {
	var msgList = $("#msg-list");
	var msgListLi = msgList.children("li");
	var msgPopup = $('#remove-msg-popup');
	// 单条消息滑动事件
	require(["touch"], function(touch) {
		msgListLi.each(function() {
			var _this = this,
				$this = $(this);
			touch.on(_this, 'swiperight', function(ev) {
				var touchNode = $(ev.target);
				var tagName = touchNode.get(0).tagName;
				if (tagName != "LI" || tagName != "li") {
					touchNode = touchNode.parents("li");
				}
				touchNode.removeClass("left-touch");
			});

			touch.on(_this, 'swipeleft', function(ev) {
				var touchNode = $(ev.target);
				var tagName = touchNode.get(0).tagName;
				if (tagName != "LI" || tagName != "li") {
					touchNode = touchNode.parents("li");
				}
				msgListLi.removeClass("left-touch");
				touchNode.addClass("left-touch");
			});
			touch.on($this.find(".right-remove"), 'touchstart', function(ev) {
				$this.remove();
			});
		});
		touch.on(msgListLi, 'touchstart', function(ev) {
			ev.preventDefault();
		});
	});
	// 删除按钮
	$(".msg-list-all-remove").on("click", function() {
		msgPopup.modal({
			onConfirm: function(options) {
				msgList.html('<li class="am-g am-list-item-dated"><h1 class="am-text-success am-margin-sm">暂时没有新消息</h1></li>');
			},
			onCancel: function() {
				alert("我还是先看看吧")
			}
		});
	})


	var $table = $("#msg-table"),
		$allCheckbox = $(".all-msg-checkbox input"),
		$msgCheckbox = $table.find("tbody .msg-checkbox input"),
		$msgBtnCheck = $("#msg-btn-check");

	$msgBtnCheck.on("click", ".all-trig-check", function() {
		$allCheckbox.trigger("click");
	});
	$msgBtnCheck.on("click", ".invert-check", function() {
		invertCheck();
	});
	$msgBtnCheck.on("click", ".remove-check", function() {
		removeCheck();
	});

	$allCheckbox.on("click", function() {
		allCheck($allCheckbox.is(":checked"));
	});
	$msgCheckbox.on("click", function() {
		oneCheck($(this));
	});
	// 全选
	function allCheck(checked) {
		$msgCheckbox.prop("checked", checked);
	}
	// 单选
	function oneCheck(elm) {
		var checkStatus = elm.is(":checked");
		if (checkStatus) {
			// 循环获取总选中数，再与总条数相匹配
			var checkLength = 0;
			$msgCheckbox.each(function() {
				if ($(this).is(":checked")) {
					checkLength++;
				}
			});
			if (checkLength == $msgCheckbox.length) {
				$allCheckbox.prop("checked", true);
			} else {
				$allCheckbox.prop("checked", false);
			}
		} else {
			$allCheckbox.prop("checked", false);
		}
	}
	// 反选
	function invertCheck() {
		var checkLength = 0;
		$msgCheckbox.each(function() {
			var $this = $(this);
			if ($this.is(":checked")) {
				$this.prop("checked", false);
			} else {
				checkLength++;
				$this.prop("checked", true);
			}
		});
		if (checkLength == $msgCheckbox.length) {
			$allCheckbox.prop("checked", true);
		} else {
			$allCheckbox.prop("checked", false);
		}
	}
	// 删除选中
	function removeCheck() {
		if ($allCheckbox.is(":checked")) {
			msgPopup.modal({
				onConfirm: function(options) {
					$allCheckbox.prop("checked", false);
					$table.find("tbody").html("");
					$table.after('<h1 class="am-text-success am-margin-sm">暂时没有新消息</h1><hr>');
				},
				onCancel: function() {
					alert("我还是先看看吧")
				}
			});
		};
	}
}));