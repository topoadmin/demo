var loginInterval; //鍊掕鏃跺畾鏃跺櫒
var whether; //鐧诲綍杩樻槸娉ㄥ唽
$(function() {
	/*鍥炶溅浜嬩欢*/
	$(document).bind("keydown",function(e){
		var k = e.keyCode || e.which;
		if (k === 13){
			if(whether == "鐧诲綍"){
				$("#loginbtn-one").click();
			}else{
				$("#loginbtn-two").click();
			}
			return false;
		} 
	})
	addEventInput();
	var form = $("form");
	$(':input', form).not(':button, :submit, :reset, :hidden').val('').attr("status", 0).css("border-color", "#d5d5d5");

	$(".login-one-div").click(function() {
		whether = "鐧诲綍";
		var submitBtn = $("#loginbtn-one");
		var one = $("#form-one");
		var two = $("#form-two");
		one.show();
		two.hide();
		$(':input', form).not(':button, :submit, :reset, :hidden').val('').attr("status", 0).css("border-color", "#d5d5d5");
	})
	$(".login-two-div").click(function() {
		whether = "娉ㄥ唽";
		clearTimeout(loginInterval);
		$("#loginbtn-two").attr("disabled", "disabled").css("background", "#ccc");
		$("#phoneBtn-enroll").html("鍏嶈垂鑾峰彇鍔ㄦ€佺爜").css({
			"color": "#CCC",
			"border-color": "#CCC"
		});
		var one = $("#form-one");
		var two = $("#form-two");
		one.hide();
		two.show();
		$(':input', form).not(':button, :submit, :reset, :hidden').val('').attr("status", 0).css("border-color", "#d5d5d5");
		$("#phoneBtn-enroll").attr("disabled", "disabled");
	})

	//鐐瑰嚮鎻愪氦鎸夐挳锛岄獙璇佽〃鍗�
	$("#loginbtn-one").click(function() {
		var open = submitClickFn($(this));
	});

	$("#loginbtn-two").click(function() {
		var open = ifWhetherFn();
		if (open == 1) {
			$("#loginbtn-two").attr("disabled", "disabled")
			$(this).html("鏁版嵁鎻愪氦涓�...")
			registerAjaxSubmit(register, "#form-login-enroll")
		}
	});

	//鍒濆鍖�
	$(".login-one-div").click();
});

//濡傛灉鏄敞鍐�
function ifWhetherFn() {
	var form = $("#form-two").children("form");
	var formInput = $(form).find("input");
	var open = 0;

	//鍒ゆ柇鏄惁涓虹┖
	$(formInput).each(function() {
		var $this = $(this);
		var th = $this.val();
		var ss = $this.attr("status")
			//鍒ゆ柇鏄惁蹇呭～鏍�
		if ($this.hasClass("required")) {
			if (ss == 2) {
				open = 1;
			} else {
				open = 0;
				return false;
			}
		}
	});
	if (open == 1) {
		$("#loginbtn-two").removeAttr("disabled").css("background", "#35B558");
	} else {
		$("#loginbtn-two").attr("disabled", "disabled").css("background", "#ccc");
	}
	return open;
}

function submitClickFn(dom) {
	var form = $(dom).siblings("form");
	var formInput = $(form).find("input");
	var open = 0;

	//鍒ゆ柇鏄惁涓虹┖
	$(formInput).each(function() {
		var $this = $(this);
		var th = $this.val();
		var ss = $this.attr("status")
		inputValidation($this);
		//鍒ゆ柇鏄惁蹇呭～鏍�
		if ($this.hasClass("required")) {
			if (ss == 0) {
				open = 0;
				submitValMut(dom, $this, "涓虹┖");
				return false;
			} else if (ss == 1) {
				open = 0;
				submitValMut(dom, $this, "涓嶄负绌�");
				return false;
			} else {
				open = 1;
			}
		}
	});

	if (open == 1) {
		$("#loginbtn-one").html("鏁版嵁澶勭悊涓�...")
		loginAjaxSubmit(login, "#form-login")
	}
	return open;
}

//楠岃瘉琛ㄥ崟鐘舵€�
function submitValMut(dom, titleDom, status) {
	var tip;
	if (status == "涓虹┖") {
		tip = "鏍忎笉鑳戒负绌�";
		titleDom.css("border-color", "#FF892A");
		dom.addClass("greenbtnWarning");
	} else {
		tip = "鏍忔牸寮忛敊璇�";
		titleDom.css("border-color", "red");
		dom.addClass("greenbtnRed");
	}
	var title = titleDom.attr("titles");

	var formerHtml = dom.html();
	var newHtml = title + tip;
	dom.html(newHtml).attr("disabled", "true").animate({
		"height": dom.height()
	}, 2000, function() {
		dom.removeAttr("disabled").removeClass("greenbtnWarning").removeClass("greenbtnRed").html(formerHtml);
	});
}

/**@method	input杈撳叆鐩戞帶
 * @param	form 瀵硅薄
 */
function addEventInput() {
	var psdFormInput = $("form").find("input");
	psdFormInput.attr("status", 0);
	//寮€濮嬬洃鎺�
	psdFormInput.bind('input propertychange', function() {
		inputValidation($(this));
		if (whether == "娉ㄥ唽") {
			ifWhetherFn();
		}
	});
}

function inputValidation(currentInput) {
	var $this = currentInput;
	var minLength = $this.attr("minlength"); //鏈€灏忛暱搴�
	var valTitles = $this.attr("titles"); //瑙勫畾瀛楄妭
	var psdMatching = $this.attr("equalTo"); //鍖归厤涓ゆ
	var thisVal = $this.val();
	var parentForm = $this.parent().parent().parent("form");
	var thisFormBtn = parentForm.nextAll("button");

	//鎴彇褰撳墠闀垮害
	var valLength = thisVal.replace(/\s*/, "").length;
	if (valTitles == "鎵嬫満") {
		var pb = $("#phoneBtn-enroll");
		pb.attr("disabled", "disabled").css({
			"color": "#ccc",
			"border-color": "#ccc"
		})
	}
	if (valLength < 1) {
		//涓嶈兘涓虹┖
		$this.css("border-color", "#d5d5d5");
		$this.attr("status", 0);
		if (valTitles == "鎵嬫満") {
			clearTimeout(loginInterval);
			$("#phoneBtn-enroll").html("鍏嶈垂鑾峰彇鍔ㄦ€佺爜").css("background", "#999").attr("disabled");
		}
	} else if (valLength > 0 && valLength < minLength) {
		//鑷畾涔夐暱搴�
		changStatusFn($this, 1);
		if (valTitles == "鎵嬫満") {
			clearTimeout(loginInterval);
			$("#phoneBtn-enroll").html("鍏嶈垂鑾峰彇鍔ㄦ€佺爜").css("background", "#999").attr("disabled");
		}
	} else {
		if (valTitles == "鎵嬫満") {
			var tel = /^[1-9]\d{4,11}@qq.com$/i;
			//var re = /[^u4e00-u9fa5]/g;
			var china = /^[\u4E00-\u9FA5]+$/;
			if (whether == "娉ㄥ唽") {
				if (thisVal.match(/^(((13[0-9]{1})|15[0-9]{1}|18[0-9]{1})+\d{8})$/)) {
					$.ajax({
						type: "POST",
						url: "index.php?s=/Home/User/checkMobile",
						data: {
							data: thisVal
						},
						datatype: "json",
						error: function() {
							changStatusFn($this, 1);
						},
						success: function(data) {
							if (typeof(data) == "string") {
								data = eval("(" + data + ")");
							}
							var dataSs = data.status; //楠岃瘉鐮�
							if (dataSs == 1) {
								changStatusFn($this, 2);
								phoneBtnFn($this);
								return false;
							} else {
								changStatusFn($this, 1);
								var phoneBtn = $("#loginbtn-two");
								phoneBtn.css({
									"background": "red"
								}).html(data.txt);
								setTimeout(function() {
									phoneBtn.css({
										"background": "#999"
									}).html('绔嬪嵆娉ㄥ唽');
								}, 2000)
							}
						}
					});
//					changStatusFn($this, 2);
//					phoneBtnFn($this);
				} else {
					changStatusFn($this, 1);
				}
			} else {
				if (thisVal.match(/^(((13[0-9]{1})|15[0-9]{1}|18[0-9]{1})+\d{8})$/) || tel.test(thisVal) || china.test(thisVal)) {
					changStatusFn($this, 2);
				} else {
					changStatusFn($this, 1);
				}
			}
		} else {
			$this.attr("status", 2).css("border-color", "green");
			if (valTitles == "楠岃瘉鐮�") {
				if (whether == "鐧诲綍" && thisVal.match(/^([0-9]{4})$/)) {
					changStatusFn($this, 2);
				} else if (whether == "娉ㄥ唽") {
					var phoneVal = $("#form-two").find("input[name='mobile']").val();
					$.ajax({
						async: false,
						cache: false,
						type: "POST",
						url: "index.php?s=/Home/User/phoneMsg",
						//url: "{:U('User/phoneMsg')}",
						data: {
							data: thisVal,
							mobile: phoneVal
						},
						datatype: "json",
						error: function() {
							var phoneBtn = $("#phoneBtn-enroll");
							phoneBtn.removeAttr("disabled").css({
								"color": "#35B558",
								"border-color": "#35B558",
								"background": "#fff"
							}).html("鍏嶈垂鑾峰彇鍔ㄦ€佺爜");
						},
						success: function(data) {
							if (typeof(data) == "string") {
								data = eval("(" + data + ")");
							}
							var dataSs = data.status; //楠岃瘉鐮�
							if (dataSs == 1) {
								changStatusFn($this, 2);
							} else {
								changStatusFn($this, 1);
							}
						}
					});
				}
			}
		}
	}
}

//鏀瑰彉鏍峰紡鍜岀姸鎬�
function changStatusFn($this, status) {
	var bdC = $this;
	if (bdC.hasClass("noBackColor")) {
		return false;
	}
	$this.attr("status", status);
	if (status == 1) {
		bdC.css("border", "1px solid red")
	} else if (status == 2) {
		bdC.css("border", "1px solid green")
	} else {
		bdC.css("border", "1px solid #d5d5d5")
	}
}

//鍙戦€侀獙璇佺爜鏂规硶
function phoneBtnFn(dom) {
	var pb = $("#phoneBtn-enroll");
	pb.removeAttr("disabled").css({
		"color": "#35B558",
		"border-color": "#35B558",
		"background": "#fff"
	}).html("鍏嶈垂鑾峰彇鍔ㄦ€佺爜");
	pb.unbind("click").bind("click", function() {
		var wait = 58;
		//鍗曞厓娴嬭瘯
//		setTimeSubmit(pb, wait);
//		return false;

		pb.html("绛夊緟涓�...").attr("disabled", "disabled");
		$.ajax({
			type: "POST",
			url: "index.php?s=/Home/User/sendPhoneMsg",
			data: {
				data: dom.val()
			},
			datatype: "json",
			success: function(data, st) {
				if (typeof(data) == "string") {
					data = eval("(" + data + ")");
				}
				if (data.status == 1) {
					pb.attr("disabled", "disabled").html(data.txt);
					setTimeout(function() {
						setTimeSubmit(pb, wait);
					}, 2000)
				} else {
					changStatusFn(pb, 1);
					pb.attr("disabled", true).html(data.txt);
					setTimeout(function() {
						pb.html('閲嶅彂鐭俊楠岃瘉鐮�');
					}, 2000)
				}
			}
		});
		//setTimeSubmit($(this), wait);
		return false;
	})

}

//楠岃瘉鐮佸€掕鏃�
function setTimeSubmit(dom, wait) {
	if (wait == 0) {
		changStatusFn(dom, 2);
		$(dom).removeAttr("disabled").html('閲嶅彂鐭俊楠岃瘉鐮�').css("color","green");
	} else {
		changStatusFn(dom, 0);
		$(dom).attr("disabled", true).html('' + wait + '绉掗噸鍙�').css("color","#d5d5d5");
		wait--;
		loginInterval = setTimeout(function() {
			setTimeSubmit(dom, wait);
		}, 100)
	}
}

function CharMode(iN) {
	if (iN >= 48 && iN <= 57) //鏁板瓧
		return 1;
	if (iN >= 65 && iN <= 90) //澶у啓瀛楁瘝
		return 2;
	if (iN >= 97 && iN <= 122) //灏忓啓
		return 4;
	else
		return 8; //鐗规畩瀛楃
}

//bitTotal鍑芥暟
//璁＄畻鍑哄綋鍓嶅瘑鐮佸綋涓竴鍏辨湁澶氬皯绉嶆ā寮�
function bitTotal(num) {
	modes = 0;
	for (i = 0; i < 4; i++) {
		if (num & 1) modes++;
		num >>>= 1;
	}
	return modes;
}

//checkStrong鍑芥暟
//杩斿洖瀵嗙爜鐨勫己搴︾骇鍒�
function checkStrong(sPW) {
	if (sPW.length <= 4)
		return 0; //瀵嗙爜澶煭
	Modes = 0;
	for (i = 0; i < sPW.length; i++) {
		//娴嬭瘯姣忎竴涓瓧绗︾殑绫诲埆骞剁粺璁′竴鍏辨湁澶氬皯绉嶆ā寮�
		Modes |= CharMode(sPW.charCodeAt(i));
	}
	return bitTotal(Modes);
}

function pwStrength(pwd) {
	O_color = "#eeeeee";
	L_color = "#FF0000";
	M_color = "#FF9900";
	H_color = "#33CC00";
	if (pwd == null || pwd == '') {
		Lcolor = Mcolor = Hcolor = O_color;
	} else {
		S_level = checkStrong(pwd);
		switch (S_level) {
			case 0:
				Lcolor = Mcolor = Hcolor = O_color;
			case 1:
				Lcolor = L_color;
				Mcolor = Hcolor = O_color;
				break;
			case 2:
				Lcolor = Mcolor = M_color;
				Hcolor = O_color;
				break;
			default:
				Lcolor = Mcolor = Hcolor = H_color;
		}
	}
	document.getElementById("strength_L").style.background = Lcolor;
	document.getElementById("strength_M").style.background = Mcolor;
	document.getElementById("strength_H").style.background = Hcolor;
	return;
}