var gsJsPlugs = {
	getRandom: function(x, y) {
		// --生成随机数 {X上限,Y下限}
		return parseInt(Math.random() * (y - x + 1) + x);
	},
	addLoadEvent: function(func) {
		// -- window.onload是不能同时加载多个函数的，本函数解决	
		var oldonload = window.onload;
		if (typeof window.onload != 'function') {
			window.onload = func;
		} else {
			window.onload = function() {
				oldonload();
				func();
			}
		}
	},
	$id: function(id) {
		try {
			return document.getElementById(id);
		} catch (err) {
			console.warn(err);
		}
	},
	getStyle: function(elem, name) {
		if (elem.style[name]) {
			return elem.style[name];
		} else if (elem.currentStyle) {
			return elem.currentStyle[name];
		} else if (document.defaultView && document.defaultView.getComputedStyle) {
			name = name.replace(/([A-Z])/g, "-$1");
			name = name.toLowerCase();
			var s = document.defaultView.getComputedStyle(elem, "");
			return s && s.getPropertyValue(name);
		} else {
			return null
		}
	},
	addClass: function(element, value) {
		// -- 追加样式，而不是替换样式
		if (!element.className) {
			element.className = value;
		} else {
			element.className += " ";
			element.className += value;
		}
	},
	getParameter: function(key) {
		// -- 得到url参数值
		var parameters = unescape(window.location.search.substr(1)).split("&");
		for (var i = 0; i < parameters.length; i++) {
			var paramCell = parameters[i].split("=");
			if (paramCell.length == 2 && paramCell[0].toUpperCase() == key.toUpperCase()) {
				return paramCell[1];
			}
		}
		return new String();
	},
	parallelLoadScripts: function(scripts, callback) {
		// -- 写入js 并在加载完成以后调用回调函数
		if (typeof(scripts) != "object") var scripts = [scripts];
		var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement,
			s = new Array(),
			loaded = 0;
		for (var i = 0; i < scripts.length; i++) {
			s[i] = document.createElement("script");
			s[i].setAttribute("type", "text/javascript");
			s[i].onload = s[i].onreadystatechange = function() { //Attach handlers for all browsers
				if (! /*@cc_on!@*/ 0 || this.readyState == "loaded" || this.readyState == "complete") {
					loaded++;
					this.onload = this.onreadystatechange = null;
					this.parentNode.removeChild(this);
					if (loaded == scripts.length && typeof(callback) == "function") callback();
				}
			};
			s[i].setAttribute("src", scripts[i]);
			HEAD.appendChild(s[i]);
		}
	},
	getRadioValue: function(radioName) {
		// -- 得到单选框选中的值
		// getRadioValue('name')
		var obj = document.getElementsByName(radioName);
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].checked) {
				return obj[i].value;
			}
		}
	},
	checkAll: function(form, sel) {
		// -- 复选框全选/不选/反选
		// checkAll(document.getElementById('formid'),'all')"
		// checkAll(document.getElementById('formid'),'none')"
		// checkAll(document.getElementById('formid'),'')"
		for (i = 0, n = form.elements.length; i < n; i++) {
			if (form.elements[i].type == "checkbox") {
				if (!sel) {
					form.elements[i].checked = false;
				} else if (form.elements[i].checked == true) {
					form.elements[i].checked = (sel == "all" ? true : false);
				} else {
					form.elements[i].checked = (sel == "none" ? false : true);
				}
			}
		}
	},
	toClick: function(id) {
		// -- 模拟点击
		var obj = document.getElementById(id);
		if (document.all) {
			obj.fireEvent("onclick");
		} else {
			var e = document.createEvent('MouseEvent');
			e.initEvent('click', false, false);
			obj.dispatchEvent(e);
		}
	},
	resetCss: function(elem, prop) {
		// -- 重置css
		var old = {};
		for (var i in prop) {
			old[i] = elem.style[i];
			elem.style[i] = prop[i];
		}
		return old;
	},
	restoreCss: function(elem, prop) {
		// -- 还原css
		for (var i in prop) {
			elem.style[i] = prop[i];
		}
	},
	getFullWH: function(elem) {
		// -- 获取元素完整宽高度
		if (gsJsPlugs.getStyle(elem, "display") != "none") {
			return getHeight(elem) || elem.offsetHeight;
		} else {
			var old = gsJsPlugs.resetCss(elem, {
				display: "block",
				visibility: "hidden",
				position: "absolute"
			});
			var h = elem.clientHeight || getHeight(elem);
			var w = elem.clientWidth || getWidth(elem);
			gsJsPlugs.restoreCss(elem, old);
			return {
				width: w,
				height: h
			};
		}
	}

}




/**
 *
 *                           ,.
 *                         (_|,.
 *                        ,' /, )_______   _
 *                     __j o``-'        `.'-)'
 *                    (")                 \'
 *                     `-j                |
 *                       `-._(           /
 *                          |_\  |--^.  /
 *                         /_]'|_| /_)_/
 *                            /_]'  /_]'
 *
 */

/************************************************************************************************************************/
// -- arr.strip() 数组去重
Array.prototype.strip = function() {
		if (this.length < 2) return [this[0]] || [];
		var retArr = [];
		for (var i = 0; i < this.length; i++) {
			retArr.push(this.splice(i--, 1));
			for (var j = 0; j < this.length; j++) {
				if (this[j] == retArr[retArr.length - 1]) {
					this.splice(j--, 1);
				}
			}
		}
		return retArr;
	}
	// -- arr.limit(2,4) 得到数组中 i-n 下标中的值 
Array.prototype.limit = function(i, n) {
		var arr = this;
		var retArr = [];
		i = i < 0 ? 0 : i;
		n = n > arr.length ? arr.length : n;
		for (var j = 0; j < arr.length; j++) {
			if (j >= i && j <= n) retArr[retArr.length] = arr[j];
			if (j > n) break;
		};
		return retArr;
	}
	// -- array.exists(5) 包含true;不包含false;
Array.prototype.exists = function(item) {
		for (var i = 0; i < this.length; i++) {
			if (item == this[i]) {
				return true;
			}
		}
		return false;
	}
	// -- array1.remove("2") 删除指定item
Array.prototype.remove = function(item) {
		for (var i = 0; i < this.length; i++) {
			if (item == this[i]) {
				break;
			}
		}
		if (i == this.length) {
			return;
		}
		for (var j = i; j < this.length - 1; j++) {
			this[j] = this[j + 1];
		}
		this.length--;
	}
	/**************
	更精确的加减乘除 
	(40).divide(4) = 10;
	**************/
Number.prototype.divide = function(arg1) {
	var t1 = 0,
		t2 = 0,
		r1, r2;

	try {
		t1 = arg1.toString().split(".")[1].length
	} catch (e) {}
	try {
		t2 = this.toString().split(".")[1].length
	} catch (e) {}
	with(Math) {
		r1 = Number(this.toString().replace(".", ""))
		r2 = Number(arg1.toString().replace(".", ""))
		return (r1 / r2) * pow(10, t1 - t2);
	}
}
Number.prototype.mul = function(arg) {
	var m = 0,
		s1 = this.toString(),
		s2 = arg.toString();
	try {
		m += s1.split(".")[1].length
	} catch (e) {}
	try {
		m += s2.split(".")[1].length
	} catch (e) {}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
Number.prototype.add = function(arg) {
	var r1, r2, m;
	try {
		r1 = arg.toString().split(".")[1].length
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = this.toString().split(".")[1].length
	} catch (e) {
		r2 = 0
	}
	m = Math.pow(10, Math.max(r1, r2))
	return (arg * m + this * m) / m
}
Number.prototype.sub = function(arg) {
		var r1, r2, m, n;
		try {
			r1 = this.toString().split(".")[1].length
		} catch (e) {
			r1 = 0
		}
		try {
			r2 = arg.toString().split(".")[1].length
		} catch (e) {
			r2 = 0
		}
		m = Math.pow(10, Math.max(r1, r2));
		//last modify by deeka
		//动态控制精度长度
		n = (r1 >= r2) ? r1 : r2;
		return ((this * m - arg * m) / m).toFixed(n);
	}
	/**************
	获取自定义格式的当前时间。
	console.log(new Date().getUstom());
	**************/
Date.prototype.getUstom = function() {
		var xYear = this.getYear() + 1900,
			xMonth = this.getMonth() + 1,
			xDay = this.getDate(),
			xHours = this.getHours(),
			xMinutes = this.getMinutes(),
			xSeconds = this.getSeconds();
		if (xMonth < 10) {
			xMonth = "0" + xMonth;
		}
		if (xDay < 10) {
			xDay = "0" + xDay;
		}
		if (xHours < 10) {
			xHours = "0" + xHours;
		}
		if (xMinutes < 10) {
			xMinutes = "0" + xMinutes;
		}
		if (xSeconds < 10) {
			xSeconds = "0" + xSeconds;
		}
		return xYear + "-" + xMonth + "-" + xDay + " " + xHours + ":" + xMinutes + ":" + xSeconds;
	}
	/**************
	替换字符串中的字符。
	"javascript".replaceAll("t", "aaaaa");
	**************/
String.prototype.replaceAll = function(AFindText, ARepText) {
		raRegExp = new RegExp(AFindText, "g");
		return this.replace(raRegExp, ARepText);
	}
	/************************
	//格式化字符串
	var cls="我是class";					
	var text="我是内容";
	var str='<div class="{0}">{1} {2}</div>'.diy_format(cls, text,"按顺序下去呗");	
	alert(str);
	// 感觉并没什么卵用,熟悉下
	************************/
String.prototype.format = function() {
		var args = arguments;
		return this.replace(/\{(\d+)\}/g, function(m, i) {
			return args[i];
		});
	}
	/**************
	* 计算字符串的真正长度
	<input type="text" name="rain" id="rain" />
	<input type="button" id="test" value="test" onclick="alert(  document.getElementById('rain').value.codeLength()  )"/>
	**************/
String.prototype.codeLength = function() {
		var len = 0;
		if (this == null || this.length == 0)
			return 0;
		var str = this.replace(/(^\s*)|(\s*$)/g, ""); //去掉空格
		for (i = 0; i < str.length; i++)
			if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128)
				len++;
			else
				len += 2;
		return len;
	}
	/**************
	//编码HTML  和  解码Html。
	//在评论的时候为了防止用户提交带有恶意的脚本，可以先过滤HTML标签，过滤掉双引号，单引号，符号&，符号<，符号
	<input type="text" name="rain" id="rain" />
	<input type="button" value="test" onclick=" document.getElementById('rain2').value= document.getElementById('rain').value.htmlEncode()  "/>
	<input type="button" value="test" onclick=" document.getElementById('rain').value= document.getElementById('rain2').value.htmlDecode()  "/>
	**************/
String.prototype.htmlEncode = function() {
	return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&#34;").replace(/\'/g, "&#39;");
}
String.prototype.htmlDecode = function() {
	return this.replace(/\&amp\;/g, '\&').replace(/\&gt\;/g, '\>').replace(/\&lt\;/g, '\<').replace(/\&quot\;/g, '\'').replace(/\&\#39\;/g, '\'');
}
String.prototype.removeBlank = function() {
	return this.replace(/\s+/g, "");
}