/*
 * gaoshi-github 
 * 13701379934@163.com
 * 2016年3月25日 15:21:24
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
	var gsJsPlugs, _api;
	_api = {
		get: function(key, val) {
			return "ss";
		}
	};
	gsJsPlugs = function(key,data) {
		var argm = arguments,
			_init = function(key,data) {
				if(key == "date"){
					return new Date().format(data);
				}
				return null;
			};
		return _init(key,data);
	};

	// api 导入
	for (var a in _api) {
		gsJsPlugs[a] = _api[a];
	}
	return gsJsPlugs;
}));


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