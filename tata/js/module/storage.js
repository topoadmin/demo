/**
 * HTML5本地存储
 * @author gaoshi-github 
 * @version 1.0
 * @param storage.set {name,value,expires}		加本地存储数据，有效期是expries(单位秒)
 * @param storage.get  {name}        			获取本地存储数据
 * @param storage.remove  {name}        		删除本地数据
 */

;
(function(win, doc, undefined) {
	var userData = function() {
		var o;
		try {
			var htmlfile = new ActiveXObject('htmlfile'),
				doc, o;
			htmlfile.open();
			htmlfile.write('<iframe src="/favicon.ico"></iframe>');
			htmlfile.close();
			doc = htmlfile.frames[0].document;
			o = doc.createElement('div');
			doc.appendChild(o);
			o.addBehavior('#default#userData');
		} catch (e) {}

		return {
			get: function(name) {
				var value;
				o.load(name);

				value = o.getAttribute(name);
				try {
					value = JSON.parse(value)
				} catch (e) {}
				return value;
			},
			set: function(name, value, seconds) {
				if (seconds) {
					var d = new Date();
					d.setTime(d.getTime() + seconds * 1000);
					o.expires = d.toUTCString();
				}
				o.setAttribute(name, JSON.stringify(value));
				o.save(name);
			},
			remove: function(name) {
				o.removeAttribute(name);
				o.save(name);
			}
		}
	};

	var _localStorage = function() {
		var d = new Date().getTime();
		for (key in localStorage) {
			var v = localStorage.getItem(key);
			try {
				v = JSON.parse(v)
			} catch (e) {};
			if (Object.prototype.toString.call(v).toLowerCase().indexOf('array') > 0) {
				var expires = v[0].expires;
				if (expires && /^\d{13,}$/.test(expires) && expires <= d) localStorage.removeItem(key);
			}
		}
		return {
			get: function(name) {
				var v = localStorage.getItem(name);
				if (!v) return null;
				try {
					v = JSON.parse(v)
				} catch (e) {};
				if (typeof v != 'object') return v;
				var expires = v[0].expires;
				if (expires && /^\d{13,}$/.test(expires)) {
					var d = new Date().getTime();
					if (expires <= d) {
						localStorage.removeItem(name);
						return null;
					}
					v.shift();
				}
				return v[0];
			},
			set: function(name, value, seconds) {
				var v = [];
				if (seconds) {
					var d = new Date().getTime();
					v.push({
						"expires": (d + seconds * 1000)
					});
				}
				v.push(value);
				localStorage.setItem(name, JSON.stringify(v));
			},
			remove: function(name) {
				localStorage.removeItem(name);
			}
		}
	}

	var cookie = {
		get: function(name) {
			var v = document.cookie,
				result;
			var start = v.indexOf(name + '='),
				end = v.indexOf(';', start);
			if (end == -1) end = v.length;
			if (start > -1) {
				result = v.substring(start + name.length + 1, end);
				try {
					result = JSON.parse(result)
				} catch (e) {};
				return result;
			} else {
				return null;
			}
		},
		set: function(name, value, seconds, path, domain) {
			var path = path || '/',
				expires = '';
			if (seconds) {
				if (window.ActiveXObject) {
					var d = new Date();
					d.setTime(d.getTime() + seconds * 1000);
					expires = 'expires=' + d.toGMTString();
				} else {
					expires = 'max-age=' + seconds;
				}
			}
			document.cookie = name + '=' + JSON.stringify(value) + ';' + expires + ';path=' + path + ';' + (domain ? ('domain=' + domain) : '');
		},
		remove: function(name, path, domain) {
			this.set(name, '', -1, path, domain);
		}
	}

	var adapter;
	if (!window.localStorage) {
		adapter = userData();
	} else {
		adapter = _localStorage();
	}
	var entry = {
		get: adapter.get,
		set: adapter.set,
		remove: adapter.remove,
		cookie: cookie
	}

	if (typeof define === 'function' && (define.amd || define.cmd)) {
		define(function(require, exports, module) {
			module.exports = entry;
		});
	} else {
		win.storage = entry;
	}
})(window, document);