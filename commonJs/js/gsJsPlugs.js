/*
 * gaoshi-github 
 * QQ:465040621
 * version: "0.0.1",
 * 开始时间：2016年3月25日 15:21:24
 * 最后时间：2016年3月29日 02:20:34
 * 常用函数集合
 * */
;
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);	 // amd
	} else if (typeof exports === 'object') {
		module.exports = factory();	// node.js
	} else {
		root.gs = factory();	//	root == window
	}
}(this, function(root, undefined) {
	'use strict';
	var gs = function(param) {
		return new gs.fn.init(param);
	};

	gs.fn = gs.prototype = {
		init : function(param) {
			this.recordValue = param; // 记录传值
			return this;
		}
	}
	gs.fn.init.prototype = gs.fn;
	
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
	/* 拷贝函数复制 jq 源码   -。- */
	gs.extend({
		version: "0.1",
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
		isString: function(obj){
			return gs.typeOf(obj) === "String";
		}
	});

	gs.extend({
		getRandomColor: function() {
			/**
			 * 获取随机RGB颜色
			 */
			return "rgba("+Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random())+",1)";
		},
	 	getBrowserInfo: function() {
	 		/**
			 * 获取浏览器信息
			 * return [浏览器 , 版本]
			 */
			var agent = navigator.userAgent.toLowerCase(),
			regStr_ie = /msie [\d.]+;/gi,
			regStr_ff = /firefox\/[\d.]+/gi,
			regStr_chrome = /chrome\/[\d.]+/gi,
			regStr_saf = /safari\/[\d.]+/gi,
			browse = "";
			if (agent.indexOf("msie") > 0) {
				console.log(agent.match(regStr_ie));
				browse = (agent.match(regStr_ie))[0].split(" ");
			}
			if (agent.indexOf("firefox") > 0) {
				browse = (agent.match(regStr_ff))[0].split("/");
			}
			if (agent.indexOf("chrome") > 0) {
				browse = (agent.match(regStr_chrome))[0].split("/");
			}
			if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
				browse = (agent.match(regStr_ie))[0].split("/");
			}
			return browse;
		},
		typeOf: function(obj) {
			/**
			 * 获取对象的格式
			 * @param 任意对象
			 * @return string
			 * @demo gs.typeOf([1,2,3]);   //返回array
			 */
			return obj !== undefined && obj !== null && Object.prototype.toString.call(obj).slice(8, -1);
		},
		date: function(obj) {
			/**
			 * 时间格式工具
			 * @param param 
			 * 	true 返回格式化后时间的string对象
			 * 	{"timestamp":"时间戳","timestamp":"处理格式"} 返回格式化后时间的string对象
			 * 	false 返回当前时间的object对象		
			 * @return string
			 * @demo 
			 * 		gs.date()
			 * 		gs.date(true)
			 * 		gs.date({timeFormat:"yyyy-MM-dd hh:mm:ss"})
			 * 		gs.date({timestamp:1458977810777})
			 * 		gs.date({timeFormat:"yyyy-MM-dd hh:mm:ss",timestamp:1458977810777})
			 */
			var _param = obj,
				rreturn = "";
			if (_param) {
				if (_param.hasOwnProperty("timestamp")) { // 参数包含时间戳参数时
					rreturn = new Date(parseInt(_param.timestamp)).gsJsPlugsFormat(_param.timeFormat || "yyyy-MM-dd hh:mm:ss");
				} else if (_param.hasOwnProperty("timeFormat")) { // 参数只具备时间格式参数时
					rreturn = new Date().gsJsPlugsFormat(_param.timeFormat);
				} else {
					// 默认返回格式
					rreturn = new Date().gsJsPlugsFormat("yyyy-MM-dd hh:mm:ss");
				}
			} else {
				// 无参时返回object,以便自定义组装
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
		getWeekOfYear: function(year, month, day) {
			/**
			 * 获取当前日期为全年第几周
			 * @param year  年
			 * @param month	月
			 * @param day	日
			 * @return string
			 * @wrning 参数未填项自动以当前时间替补
			 * @demo gs.getWeekOfYear(2016,3,27)
			 */
			var date = new Date(),
				newYear = year || date.getFullYear(),
				newMonth = month || date.getMonth() + 1,
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
		getLastDay: function(year, month) {
			/**
			 * 根据年和月取当月的最后一天
			 * @param year  年
			 * @param month	月
			 * @return string
			 * @wrning 参数未填项自动以当前时间替补
			 * @demo gs.getLastDay(2016,2)
			 */
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
		getDomainName: function(url) {
			/**
			 * 截取域名
			 * @param url 链接,不传值则获取当前域
			 * @return string
			 * @demo gs.getDomainName("https://www.baidu.com/sadas")
			 */
			var newUrl = url || window.location + ""; // 转为字符串
			var index = newUrl.indexOf('://') + 3;
			return newUrl.substring(index, newUrl.indexOf('/', index));
		},
		getUrlParam: function(key){
			/**
			 * 获取url参数值
			 * @param key 需要获取的参数
			 * @return string
			 * @demo gs.getUrlParam("key")
			 */
			if(!key){
				return;
			}
			var parameters = unescape(window.location.search.substr(1)).split("&");
			for (var i = 0; i < parameters.length; i++) {
				var paramCell = parameters[i].split("=");
				if (paramCell.length == 2 && paramCell[0].toUpperCase() == key.toUpperCase()) {
					return paramCell[1];
				}
			}
			return new String();
		},
		getRandom:function(min,max){
			/**
			 * 生成随机数
			 * @param min 最小值
			 * @param max 最大值
			 * @return string
			 * @demo gs.getRandom(3,5);
			 */
			return parseInt(Math.random() * (max - min + 1) + min);  
		}
	});
	
	gs.fn.extend({
		number: function(format) {
			/** 
			 * 数字格式工具
			 * @param value  需格式的数字 
			/* @param format 格式条件
			 * @demo
			 * 	value                  format     结果
			 * 	1234.567     		  #,###.###   1,234.567
			 * 	123.125                ##,#.#,#    1,2,3.1,3
			 * 	123.125                00000       00123
			 * 	123.125                .000        .125
			 * 	0.125                  0.0000      0.1250
			 * 		gs(1234.15).number("####.#")
			 * 		gs(123.125).number(".000")
			 * */
			return this.recordValue.gsJsPlugsFormat(format);
		},
		replaceAll: function(repStrA, repStrB) {
			/**
			 * 字符串替换
			 * @param repStrA  需替换的值
			 * @param repStrB  替换后的值
			 * @return string
			 * @demo gs("替换掉我").replaceAll("我","你")
			 */
			return this.recordValue.replace(new RegExp(repStrA, "gm"), repStrB)
		},
		trim: function(position) {
			/**
			 * 去除指定空格
			 * @param string left:right:不传则去除两侧空格
			 * @return string
			 * @demo
			 * 		gs(" 去掉空格 ").trim();
			 * 		gs(" 去掉左边空格 ").trim("left")
			 * 		gs(" 去掉右边空格 ").trim("right")
			 */
			var _value = this.recordValue;
			switch (position) {
				case "left":
					return _value.replace(/^(\s*|　*)/, "");
					break;
				case "right":
					return _value.replace(/(\s*|　*)$/, "");
					break;
				default:
					//将字符串前后空格,用空字符串替代。;
					return _value.replace(/(^\s*)|(\s*$)/g, "");
			}
		},
		strLength: function() {
			/**
			 * 获取字符串真实长度
			 * @return string
			 * @demo gs("我的长度?").strLength()
			 */
			this.recordValue += "";	// 强制转换成string类
			var newStr = this.trim();	// 去空格
			var len = 0;
			if (newStr == null || newStr.length == 0) {
				return 0;
			}
			for (var i = 0,j=newStr.length; i < j; i++) {
				if (newStr.charCodeAt(i) > 0 && newStr.charCodeAt(i) < 128) {
					len++;
				} else {
					len += 2;
				}
			}
			return len;
		}
	})
	
	return gs;
}));

/* 基本类型拓展，别冲突了哦  */
Date.prototype.gsJsPlugsFormat = function(format) {
	// --格式化时间
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

Number.prototype.gsJsPlugsFormat = function(format) {
	// -- 格式化数字
	var _this = this;
	function trim(data, format, purePattern) {
		if (format) {
			if (pureFormat) {
				if (pureFormat.charAt() == '0') {
					data = data + pureFormat.substr(data.length);
				}
				if (pureFormat != format) {
					var format = new RegExp("(\\d{" + format.search(/[^\d#]/) + "})(\\d)");
					while (data.length < (data = data.replace(format, '$1,$2')).length);
				}
				data = '.' + data
			} else {
				var pureFormat = format.replace(/[^\d#]/g, '');
				if (pureFormat.charAt() == '0') {
					data = pureFormat.substr(data.length) + data;
				}
				if (pureFormat != format) {
					var format = new RegExp("(\\d)(\\d{" + (format.length - format.search(/[^\d#]/) - 1) + "})\\b");
					while (data.length < (data = data.replace(format, '$1,$2')).length);
				}
			}
			return data;
		} else {
			return '';
		}
	}
	return format.replace(/([#0,]*)?(?:\.([#0,]+))?/, function(param, intPattern, floatPattern) {
		var floatPurePattern = floatPattern.replace(/[^\d#]/g, '');
		_this = _this.toFixed(floatPurePattern.length).split('.');
		return trim(_this[0], intPattern) + trim(_this[1] || '', floatPattern, floatPurePattern);
	})
}