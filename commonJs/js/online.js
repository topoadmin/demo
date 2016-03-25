/**
 * HTML5 网络检测
 * @author gaoshi-github 
 * @version 1.0
 * @param config {Object}
 * config.on  {Function}        监控网络从离线变为在线时的回调
 * config.off {Function}        监控网络从在线变为离线时的回调
 * @returns {status}   			网络状态 
 * @type {Boolean}			
 */
(function(win, doc, undefined) {
	'use strict';
	var checkOnline = function() {
		this.defaults = {
			"on": "",
			"off": "",
			status: false
		};
	};
	checkOnline.prototype.init = function(config) {
		config = config || {};
		// 合并参数
		var _this = this,
			defaults = _this.defaults;
		for (var i in defaults) defaults.hasOwnProperty(i) && !config.hasOwnProperty(i) && (config[i] = defaults[i]);
		_this.config = config;
		// end
		
		_this.check();
		
		// 监控网络状态
		_this.addHandler(window, "online", function() {
			_this.config.status = true;
			if (_this.config.on) {
				_this.config.on(_this.config.status);
			}
		});
		_this.addHandler(window, "offline", function() {
			_this.config.status = false;
			if (_this.config.off) {
				_this.config.off(_this.config.status);
			}
		});
		return _this;
	};

	// 检测是否在线
	checkOnline.prototype.check = function() {
		if (navigator.onLine) {
			this.config.status = true;
		} else {
			this.config.status = false;
		}
		this.lineStatus = this.config.status;	// 记录第一次检测结果
		return this;
	};
	
	// 自动检测网络事件
	checkOnline.prototype.addHandler = function(element, type, handler) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	}

	var entry = function() {
		var onlines = new checkOnline();
		return onlines.init.apply(onlines, arguments);
	};

	if (typeof define === 'function' && (define.amd || define.cmd)) {
		define(function(require, exports, module) {
			module.exports = entry;
		});
	} else {
		win.online = entry;
	}

})(window, document);