;
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require, exports, module);
	} else {
		root.countUp = factory();
	}
}(this, function(require, exports, module) {
	var gsJsPlugs = {
		getRandom: function(x, y) { // --生成随机数 {X上限,Y下限}
			return parseInt(Math.random() * (y - x + 1) + x);
		},
		addLoadEvent: function(func) { // --dom加载完成再执行代码	
			/* gsJsPlugs.addLoadEvent(a);
			 * gsJsPlugs.addLoadEvent(b);
			 * */
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
		$id: function(id) { // 获取id
			return document.getElementById(id);
		},
		getClassName: function(className, parentElement) { // --获取class集合 
			var cn = className,
				pe = parentElement;
			// 先判断浏览器是否支持getElementsByClassName直接获取
			if (document.getElementsByClassName) {
				if (!pe) {
					return document.getElementsByClassName(cn);
				} else {
					return pe.getElementsByClassName(cn);
				}
			} else {
				var allTagName, classElm = [],
					arr = [];
				// 判断是否有提供父节点,没有则从document上获取所有节点
				if (!pe) {
					allTagName = document.getElementsByTagName("*");
				} else {
					allTagName = pe.getElementsByTagName("*");
				}
				for (var i = 0; i < allTagName.length; i++) {
					// 去除空格
					arr = allTagName[i].className.split(' ');
					for (var j = 0; j < arr.length; j++) {
						// 判断是否具有需要获取的class类
						if (arr[j] == cn) {
							// 获取符合的
							classElm.push(allTagName[i]);
						}
					}
				}
				return classElm;
			}
		},
		getStyle: function(nodeelement, name) { // --解决 style外嵌样式用js获取不到的问题。
			// gsJsPlugs.getStyle(dom,"color")
			if (nodeelement.style[name]) {
				return nodeelement.style[name];
			} else if (nodeelement.currentStyle) { // --ie
				return nodeelement.currentStyle[name];
			} else if (document.defaultView && document.defaultView.getComputedStyle) { //w3c
				name = name.replace(/([A-Z])/g, "-$1");
				name = name.toLowerCase();
				var s = document.defaultView.getComputedStyle(nodeelement, "");
				return s && s.getPropertyValue(name);
			} else {
				return null
			}
		},
		addClass: function(element, value) { // --追加样式
			// gsJsPlugs.addClass(_id,"red")
			if (!element.className) {
				element.className = value;
			} else {
				element.className += " " + value;
			}
		},
		getParameter: function(key) { // -- 得到url参数值
			/* var url = 'http:www.cssrain.cn/article.asp?id=100'
			 * var id = gsJsPlugs.getParameter("id");
			 * */
			var parameters = unescape(window.location.search.substr(1)).split("&");
			for (var i = 0; i < parameters.length; i++) {
				var paramCell = parameters[i].split("=");
				if (paramCell.length == 2 && paramCell[0].toUpperCase() == key.toUpperCase()) {
					return paramCell[1];
				}
			}
			return new String();
		},
		getRadioValue: function(radioName) { // --得到单选框选中的值
			// gsJsPlugs.getRadioValue('name')
			var obj = document.getElementsByName(radioName);
			for (var i = 0; i < obj.length; i++) {
				if (obj[i].checked) {
					return obj[i].value;
				}
			}
		},
		checkAll: function(form, sel) { // --复选框全选/不选/反选
			/* gsJsPlugs.checkAll(document.getElementById('form_a'),'all')"
			 * gsJsPlugs.checkAll(document.getElementById('form_a'),'none')"
			 * gsJsPlugs.checkAll(document.getElementById('form_a'),'')"
			 * */
			for (i = 0, n = form.elements.length; i < n; i++) {
				if (form.elements[i].type == "checkbox") {
					if (form.elements[i].checked == true) {
						form.elements[i].checked = (sel == "all" ? true : false);
					} else {
						form.elements[i].checked = (sel == "none" ? false : true);
					}
				}
			}
		},
		toClick: function(elm) { // --模拟点击
			if (document.all) {
				elm.fireEvent("onclick");
			} else {
				var e = document.createEvent('MouseEvent');
				e.initEvent('click', false, false);
				elm.dispatchEvent(e);
			}
		}
	}　
	return gsJsPlugs;　　
}));

/************************************ -- 基本类型拓展 ---**********************************************************/
Array.prototype.unique = function() { // --数组去重
	// arr.strip() 
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
};
(function() {
	function strip(arr) {
		var newArr = [arr[0]]; // 获取第一个
		for (var i = 0, j = arr.length; i < j; i++) {
			var ifRedo = true;
			for (var x = 0; x < newArr.length; x++) {
				if (newArr[x] == arr[i]) { // 循环新数组是否已经含有重复的值了
					ifRedo = false;
					break;
				}
			}
			if (ifRedo) { // 如果不含有就push
				newArr.push(arr[i])
			}
		}
		return newArr;
	}
	console.log(strip([1, 2, 1, 3]));
}());

Array.prototype.unique1 = function() {
	var n = []; //一个新的临时数组
	for (var i = 0; i < this.length; i++) //遍历当前数组
	{
		//如果当前数组的第i已经保存进了临时数组，那么跳过，
		//否则把当前项push到临时数组里面
		if (n.indexOf(this[i]) == -1) n.push(this[i]);
	}
	return n;
}

Array.prototype.unique2 = function() {
	var n = {},
		r = []; //n为hash表，r为临时数组
	for (var i = 0; i < this.length; i++) //遍历当前数组
	{
		if (!n[this[i]]) //如果hash表中没有当前项
		{
			n[this[i]] = true; //存入hash表
			r.push(this[i]); //把当前数组的当前项push到临时数组里面
		}
	}
	return r;
}

Array.prototype.unique3 = function() {
	var n = [this[0]]; //结果数组
	for (var i = 1; i < this.length; i++) //从第二项开始遍历
	{
		//如果当前数组的第i项在当前数组中第一次出现的位置不是i，
		//那么表示第i项是重复的，忽略掉。否则存入结果数组
		if (this.indexOf(this[i]) == i) n.push(this[i]);
	}
	return n;
}

Array.prototype.limit = function(i, n) { // --得到数组中 i-n 下标中的值 
	// arr.limit(2,4) 
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

Array.prototype.exists = function(item) { // --检测数组中是否含有某值
	// array.exists(5) 
	for (var i = 0; i < this.length; i++) {
		if (item == this[i]) {
			return true;
		}
	}
	return false;
}

Array.prototype.remove = function(item) { // --删除指定item
	// array1.remove("2") 
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

Date.prototype.format = function(format) { // --格式化时间
	// new Date().format("yyyy-MM-dd hh:mm:ss");
	// new Date().format("MM-dd-yyyy hh:mm:ss");
	var o = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S": this.getMilliseconds()
	}
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1,
				RegExp.$1.length == 1 ? o[k] :
				("00" + o[k]).substr(("" + o[k]).length));
	return format;
}

String.prototype.replaceAll = function(AFindText, ARepText) { // --替换字符串中的字符。
	// "javascript".replaceAll("t", "aaaaa");
	raRegExp = new RegExp(AFindText, "g");
	return this.replace(raRegExp, ARepText);
}

String.prototype.codeLength = function() { // --获取字符串真实长度
	/* str.codeLength();
	 * String有个属性length，但是它不能区分英文字符
	 * 计算中文字符和全角字符。但是在数据存储的时候中文和全角都是用两个字节来存储的
	 * */
	var len = 0;
	if (this == null || this.length == 0)
		return 0;
	var str = this.replace(/(^\s*)|(\s*$)/g, ""); //去掉前后空格
	for (i = 0; i < str.length; i++)
		if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128)
			len++;
		else
			len += 2;
	return len;
}

Number.prototype.format = function(digit) { // --截取小数(四舍五入)
	if (isNaN(this)) {
		alert("您传入的值不是数字！");
		return 0;
	} else if (Math.round(digit) != digit) {
		alert("您输入的小数位数不是整数！");
		return 0;
	} else
		return Math.round(parseFloat(this) * Math.pow(10, digit)) / Math.pow(10, digit);
}