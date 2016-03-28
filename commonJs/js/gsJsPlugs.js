/*
 * gaoshi-github 
 * QQ:465040621
 * 开始时间： 2016年3月25日 15:21:24
 * 常用函数集合
 * */
;
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.gs = factory();
	}
}(this, function(root, undefined) {
	'use strict';
	var gs = function(param) {
		return new gs.fn.init(param);
	};

	gs.fn = gs.prototype;

	/* 拷贝函数复制 jq 源码   -。-   */
	gs.extend = gs.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			deep = false,
			i = 1,
			length = arguments.length;
		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1] || {};
			i = 2;
		}
		if (typeof target !== "object" && !gs.isFunction(target)) {
			target = {};
		}
		if (length === i) {
			target = this;
			--i;
		}
		for (; i < length; i++) {
			if ((options = arguments[i]) != null) {
				for (name in options) {
					src = target[name];
					copy = options[name];
					if (target === copy) {
						continue;
					}
					if (deep && copy && (gs.isPlainObject(copy) || (copyIsArray = gs.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && gs.isArray(src) ? src : [];

						} else {
							clone = src && gs.isPlainObject(src) ? src : {};
						}

						target[name] = gs.extend(deep, clone, copy);

					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
		return target;
	};
	/* 拷贝函数复制 jq 源码   -。-   */
	gs.extend({
		isFunction: function(obj) {
			return gs.type(obj) === "function";
		},
		isArray: Array.isArray,
		isWindow: function(obj) {
			return obj != null && obj === obj.window;
		},
		type: function(obj) {
			if (obj == null) {
				return String(obj);
			}
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[core_toString.call(obj)] || "object" :
				typeof obj;
		},
		isPlainObject: function(obj) {
			if (gs.type(obj) !== "object" || obj.nodeType || gs.isWindow(obj)) {
				return false;
			}
			try {
				if (obj.constructor &&
					!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
					return false;
				}
			} catch (e) {
				return false;
			}
			return true;
		},
	});
	
	/* 自定义拓展函数 */
	gs.extend({
		typeOf: function(param) { // --获取对象的格式
			return param !== undefined && param !== null && Object.prototype.toString.call(param).slice(8, -1);
		},
		number: function(value, param) { // --格式化数字
			/* 符号说明：
			 * 0 表示补0 的数字占位
			 * . 表示小数点
			 * , 数字分组符号 如123,456.123
			 * # 表示不补0 的数字占位
			 * value                  Pattern     结果
			 * 1234.567     		  #,###.###   1,234.567
			 * 123.125                ##,#.#,#    1,2,3.1,3
			 * 123.125                00000       00123
			 * 123.125                .000        .125
			 * 0.125                  0.0000      0.1250
			 * */
			return value.gsJsPlugsFormat(param);
		},
		date: function(param) {	// --时间格式化
			var _param = param,rreturn = "";
			if (_param) {
				if (_param.hasOwnProperty("timestamp")) { // --包含时间戳参数
					rreturn = new Date(parseInt(_param.timestamp)).gsJsPlugsFormat(_param.timeFormat || "yyyy-MM-dd hh:mm:ss");
				} else if (_param.hasOwnProperty("timeFormat")) { // 只具备时间格式
					rreturn = new Date().gsJsPlugsFormat(_param.timeFormat);
				}else{
					rreturn = new Date().gsJsPlugsFormat("yyyy-MM-dd hh:mm:ss");
				}
			}else{
				// 无参时返回object
				var _date = new Date();
				var rreturn = {
					"y": _date.getFullYear(),
					"M": _date.getMonth() + 1,
					"d": _date.getDate(),
					"h": _date.getHours(),
					"m": _date.getMinutes(),
					"s": _date.getSeconds(),
					"ms": _date.getMilliseconds()
				};
			}
			return rreturn;
		},
		getWeekOfYear : function(year, month, day) { // --获取当前日期为全年第几周
			var date = new Date(),newYear = year || date.getFullYear(),newMonth = month || date.getMonth()+1,
				newDay = date.getDate();
			var date1 = new Date(newYear, 0, 1);	
			var date2 = new Date(newYear, newMonth - 1, newDay, 1);
			var dayMS = 24 * 60 * 60 * 1000;
			var firstDay = (7 - date1.getDay()) * dayMS;
			var weekMS = 7 * dayMS;
			date1 = date1.getTime();
			date2 = date2.getTime();
			return Math.ceil((date2 - date1 - firstDay) / weekMS) + 1;
		},
		getLastDay : function(year, month) { // --根据年和月取当月的最后一天
			var newYear = "",
				newMonth = "";
			if (year && month) {
				newYear = year; // 获取年
				newMonth = month++;
				if (month > 12) {
					//如果当前是12月，则转至下一年
					newMonth -= 12;
					newYear++;
				}
			} else {
				var newDate = new Date();
				newYear = newDate.getFullYear();
				newMonth = newDate.getMonth() + 1;
			}
			var newDate = new Date(newYear, newMonth, 1);
			return (new Date(newDate.getTime() - 1000 * 60 * 60 * 24)).getDate();
		},
		getDomainName: function(param) {
			var url = param || document.location+""; // 转为字符串
			var index = url.indexOf('://')+3;
			return url.substring(index,url.indexOf('/',index));
		}
	});
	
	/* 自定义拓展原型 */
	gs.fn.extend({
		replaceAll: function(repStrA, repStrB) {
			return this.value.replace(new RegExp(repStrA, "gm"), repStrB)
		},
		trim: function(position){
			var _value = this.value;
			switch (position) {
				case "left":
					return _value.replace( /^(\s*|　*)/, "");
					break;
				case "right":
					return _value.replace( /(\s*|　*)$/, "");
					break;	
				default:
					//将字符串前后空格,用空字符串替代。;
					return _value.replace(/(^\s*)|(\s*$)/g, ""); 
			}
		},
		strLength: function(){
			var _this = this.value;
			var len = 0;
			if (_this == null || _this.length == 0){
				return 0;
			}
			var str = gs(_this).trim(); // 去除空格
			for (var i = 0; i < str.length; i++){
				if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128){
					len++;
				}else{
					len += 2;
				}
			}
				
			return len;
		}
	})
	

	gs.fn.init = function(param) {
		this.value = param;
		return this;
	};
	gs.fn.init.prototype = gs.fn;
	return gs;
}));

Date.prototype.gsJsPlugsFormat = function(format) { // --格式化时间
	// 抽离时间的各个单位
	var obj = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S": this.getMilliseconds()
	};
	// --替换表达式
	if (/(y+)/.test(format)) { // 由于年份是四位，所以单独抽离
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var key in obj) { // 提取时间的其他单位，并组装
		if (new RegExp("(" + key + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? obj[key] : ("00" + obj[key]).substr(("" + obj[key]).length));
		}
	}
	return format;
}

Number.prototype.gsJsPlugsFormat = function(pattern) { // -- 格式化数字
	var _this = this;
	function trim(data, pattern, purePattern) {
		if (pattern) {
			if (purePattern) {
				if (purePattern.charAt() == '0') {
					data = data + purePattern.substr(data.length);
				}
				if (purePattern != pattern) {
					var pattern = new RegExp("(\\d{" + pattern.search(/[^\d#]/) + "})(\\d)");
					while (data.length < (data = data.replace(pattern, '$1,$2')).length);
				}
				data = '.' + data
			} else {
				var purePattern = pattern.replace(/[^\d#]/g, '');
				if (purePattern.charAt() == '0') {
					data = purePattern.substr(data.length) + data;
				}
				if (purePattern != pattern) {
					var pattern = new RegExp("(\\d)(\\d{" + (pattern.length - pattern.search(/[^\d#]/) - 1) + "})\\b");
					while (data.length < (data = data.replace(pattern, '$1,$2')).length);
				}
			}
			return data;
		} else {
			return '';
		}
	}
	return pattern.replace(/([#0,]*)?(?:\.([#0,]+))?/, function(param, intPattern, floatPattern) {
		var floatPurePattern = floatPattern.replace(/[^\d#]/g, '');
		_this = _this.toFixed(floatPurePattern.length).split('.');
		return trim(_this[0], intPattern) + trim(_this[1] || '', floatPattern, floatPurePattern);
	})
}




