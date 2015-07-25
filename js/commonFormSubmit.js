/*
 * this 	开发版
 * author 	13701378834@163.com
 * version 	1.1
 * requires jquery
 * */


// input 输入验证，并且追加条件,初始化页面执行
function addEventInput() {
	$(':input').not(':button, :submit, :reset, :hidden').val('');
	$("input.phone").data({"minlength":11,"titles":"手机"}).attr({"onkeyup":"keyupFn(this)","onafterpaste":"afterpasteFn(this)"});
	$("input").attr("onkeydown","if(event.keyCode==32||event.keyCode==188||event.keyCode==222){return false;}"); 
	$("input.password").data({"minlength":6,"titles":"密码"});
	$("input.password-confirmation").data({"minlength":6,"titles":"匹配密码","equalTo":".password"});
	$("input.verify-code").data({"minlength":6,"titles":"验证码"});
	
	var psdFormInput = $("form").find("input");
	psdFormInput.data("status", 0);
	psdFormInput.bind('input propertychange', function() {
		inputValidation($(this));
	});
}

/*	this 	对当前正在输入的文本框进行验证 
 *	param 	{当前输入框} 
 * */
function inputValidation(currentInput) {
	var $this = $(currentInput);
	var minLength = $this.data("minlength"); 	//获取设置的最小长度
	var valTitles = $this.data("titles"); 		//获取当前备注
	var psdMatching = $this.data("equalTo"); 	//匹配两次密码
	var thisVal = $this.val();					//获取当前输入值
	var parentsForm = $this.parents("form");	//获取当前表单
	var valLength = thisVal.replace(/\s*/, "").length;	//获取当前输入的长度
	
	if(valTitles == "手机"){
		$(".send_sms_code").attr("disabled","disabled");;
	}
	
	if (valLength < 1) {
		changStatusFn($this, 0);
	} else if (valLength > 0 && valLength < minLength) {
		changStatusFn($this, 1);
	} else {
		changStatusFn($this, 2);
		if(valTitles == "手机"){
			if (thisVal.match(/^(((1[0-9]{1}))+\d{9})$/)){
				console.info(thisVal);
				// 改变发送验证码样式
				$(".send_sms_code").removeAttr("disabled").css({"color":"#fff","background":"#a2867c"});
			};
		}else if(valTitles == "验证码"){
			// 进行ajax验证
			verifyMsg($this);
		}else if(valTitles == "匹配密码"){
			var oneVal = parentsForm.find($this.data("equalTo")).val();
			if(thisVal == oneVal){
				changStatusFn($this, 2);
			}else{
				changStatusFn($this, 1);
			}
		}
		
	}
}

/*	this 	验证当前输入框状态，给予指定样式
 *	param 	{当前输入框,状态值[0,1,2]}
 * */
function changStatusFn($this, status) {
	var $this = $this;
	if ($this.hasClass("noBackColor")) {
		return false;
	}
	$this.attr("status", status);
	if (status == 1) {
		$this.css("border", "1px solid #F68484")
	} else if (status == 2) {
		$this.css("border", "1px solid #37A53C ")
	} else {
		$this.css("border", "1px solid #d5d5d5")
	}
}

/*	this 	发送验证码短信
 *	param 	{触发按钮}
 * */
function sendMsg(msgNode){
	var msg = $(msgNode);
	var phoneVal = msg.parents("form").find(".phone").val();
	msg.blur();
	console.info(phoneVal);
	var wait = 60;
	setTimeSubmit(msg, wait);
}

/*	this 	验证短信验证码
 *	param 	{输入的验证码值}
 * */
function verifyMsg(msgVal){
	var msg = $(msgVal);
	var phoneVal = msg.parents("form").find(".phone").val();
	console.info(phoneVal+"=="+msg.val());
}

/*	this 	验证码倒计时
 *	param 	{倒计时展示按钮,时间}
 * */
function setTimeSubmit(dom, wait) {
	if (wait == 0) {
		$(dom).removeAttr("disabled").html('发送验证码').css({"color":"#fff","background":"#a2867c"});
	} else {
		$(dom).attr("disabled", true).html('' + wait + '后重新发送').css("color","#d5d5d5");
		wait--;
		loginInterval = setTimeout(function() {
			setTimeSubmit(dom, wait);
		}, 100)
	}
}

/*	this 	提交按钮验证表单
 *	param 	{当前form表单}
 * */
function ifWhetherFn(formNode) {
	var form = $(formNode);
	var formInput = form.find("input");
	var affirm = {};

	$(formInput).each(function() {
		var $this = $(this);
		affirm.titles = $this.attr("placeholder");
		var th = $this.val();
		var status = $this.attr("status")
		if (status == 2) {
			affirm.status = 1;
		} else {
			affirm.status = 0;
			changStatusFn($this, 1);
			$this.focus();
			return false;
		}
	});
	return affirm;
}

