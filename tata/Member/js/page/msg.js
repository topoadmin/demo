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
	/****************************  移动端list事件  **************************************/
	var $msgMobile = $("#msg-mobile"),$msgList = $msgMobile.find("#msg-list"),
		$msgListLi = $msgList.children("li"),$msgPopup = $('#remove-msg-popup');
	
	// 消息点击事件
	$msgListLi.each(function() {
		var _this = this,
			$this = $(this),
			$readMsg = $this.find(".read-msg");
		$this.on("click", function(event) {
			if ($(event.target).attr("class") == "msg-list-content") {
				$msgListLi.removeClass("left-touch");
				$this.remove();
			} else {
				$this.toggleClass("left-touch").siblings("li").removeClass("left-touch");
			}
		});
		$this.find(".right-remove").on("click",function(){
			$this.fadeOut(function(){
				console.log("删除id："+$readMsg.data("mid"));
				$this.remove();
			});
		});
	});
	// 消息滑动事件
	require(["touch"], function(touch) {
		$msgListLi.each(function() {
			var _this = this,
				$this = $(this),
				$readMsg = $this.find(".read-msg");
			touch.on(_this, 'swiperight', function(ev) {
				$this.removeClass("left-touch");
			});
			touch.on(_this, 'swipeleft', function(ev) {
				$this.toggleClass("left-touch").siblings("li").removeClass("left-touch");
			});
			touch.on($this.find(".right-remove"), 'touchstart', function(ev) {
				$this.fadeOut(function(){
					console.log("删除id："+$readMsg.data("mid"));
					$this.remove();
				})
			});
		});
		touch.on($msgListLi, 'touchstart', function(ev) {
			ev.preventDefault();
		});
	});
	$msgMobile.on("click",".msg-list-all-remove",function(){
		// 全部删除
		var unreadArr = [];
		$msgListLi.find(".read-msg").each(function() {
			var $this = $(this);
			unreadArr.push($this.data("mid") || $this.attr("data-mid"));
		});
		$msgPopup.modal({
			onConfirm: function(options) {
				$msgList.html('<li class="am-g am-list-item-dated"><h1 class="am-text-success am-margin-sm">暂时没有新消息</h1></li>');
			}
		});
	}).on("click",".mark-read",function(){
		// 全部已读
		var unreadArr = [];
		$msgListLi.find(".unread-msg").each(function() {
			var $this = $(this);
			$this.text("已读").addClass("am-text-success").removeClass("am-text-danger unread-msg");
			unreadArr.push($this.data("mid") || $this.attr("data-mid"));
		});
	});
	
	/****************************  pc端table事件  **************************************/
	var $msgPc = $("#msg-pc"),$table = $msgPc.find("#msg-table"),
		$allCheckbox = $table.find(".all-msg-checkbox input"),
		$msgCheckbox = $table.find("tbody .msg-checkbox input"),
		$msgBtnCheck = $msgPc.find("#msg-btn-check");
	
	
	$allCheckbox.on("click", function() {
		// 全选
		allCheck($allCheckbox.is(":checked"));
	});
	$msgBtnCheck.on("click", ".all-trig-check", function() {
		// 触发全选
		$allCheckbox.trigger("click");
	});
	$msgBtnCheck.on("click", ".invert-check", function() {
		// 反选
		invertCheck();
	}); 
	$msgBtnCheck.on("click", ".mark-read", function() {
		// 标记已读
		var ckArr =getCheckArr("mark");
		for(var i=0;i<ckArr.length;i++){
			ckArr[i].unread.text("已读").addClass("am-text-success").removeClass("am-text-danger unread-msg");
		}
	});
	$msgBtnCheck.on("click", ".remove-check", function() {
		// 删除选中
		var ckArr =getCheckArr();
		if ($allCheckbox.is(":checked")) {
			$msgPopup.modal({
				onConfirm: function(options) {
					$allCheckbox.prop("checked", false);
					$table.find("tbody").html("");
					$table.after('<h1 class="am-text-success am-margin-sm">暂时没有新消息</h1><hr>');
				},onCancel: function() {
				}
			});
		}else{
			for(var i=0;i<ckArr.length;i++){
				ckArr[i].tr.remove();
			}
		}
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
	// 获取选中
	function getCheckArr(method){
		var arr = [];
		$msgCheckbox.each(function(){
			var $this= $(this);
			if($this.is(":checked")){
				var $thisTr = $this.parents("tr");
				if(method=="mark"){
					var unread = $thisTr.find(".unread-msg");
					if(unread.length > 0){
						var checkObj = {
							"mid":$this.data("mid") || $this.attr("data-mid"),
							"node":$this,
							"unread":unread,
							"tr":$thisTr
						}
						arr.push(checkObj);
					}
				}else{
					var checkObj = {
						"mid":$this.data("mid") || $this.attr("data-mid"),
						"node":$this,
						"tr":$thisTr
					}
					arr.push(checkObj);
				}
			}
		});
		return arr;
	}
}));