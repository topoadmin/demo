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
	var Hammer = $.AMUI.Hammer;
	var msgList = $("#msg-list");
	var msgListDom = msgList[0];
	var elmHammer = new Hammer(msgListDom);
	var msgListLi = msgList.children("li");
	elmHammer.on('pan', function(e) {
		var deltaX = e.deltaX;
		msgList.data("deltaX",deltaX);
	});
	
	// 点击关闭左滑效果
	$(document).on("click",function(){
		msgListLi.removeClass("left-touch");
	});
	
	// 删除按钮
	msgListLi.on("click",".right-remove",function(e){
		var $li = $(this).parents("li"),
			msgNoRead = $li.find(".msg-no-read");
		if(msgNoRead.length >= 1){
			$('#remove-msg-popup').modal({
				relatedTarget: this,
				onConfirm: function(options) {
					$li.remove();
				},
				onCancel: function() {
					alert("我还是先看看吧")
				}
			});
		}else{
			$li.remove();
		}
	});
	
	msgListDom.addEventListener("touchend",function(e){
		var deltaX = msgList.data("deltaX")
		var touchNode = $(e.target);
		var tagName = touchNode.get(0).tagName;
		if(tagName != "LI" || tagName != "li"){
			touchNode = touchNode.parents("li");
		}
		if(deltaX < 10){
			msgListLi.removeClass("left-touch");
			touchNode.addClass("left-touch");
		}else{
			touchNode.removeClass("left-touch");
		}
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
		$msgCheckbox.each(function() {
			var $this = $(this);
			if ($this.is(":checked")) {
				$this.parents("tr").remove();
			}
		});
		$allCheckbox.prop("checked", false);
	}
}));