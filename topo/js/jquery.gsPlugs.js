(function(a, b) {
	if(typeof define === "function" && define.amd) {
		define(["jquery", "amazeui", "Tdrag", "layer"], b)
	} else {
		if(typeof exports === "object") {
			module.exports = b(require("jquery"), require("amazeui"), require("Tdrag"), require("layer"))
		} else {
			b(jQuery)
		}
	}
}(this, function(c) {
	c.gsPlugs = {
		openBlank: function(f) {
			if(f) {
				var d = c("<a href='" + f + "' target='_blank'>Apple</a>").get(0);
				var g = document.createEvent("MouseEvents");
				g.initEvent("click", true, true);
				d.dispatchEvent(g)
			} else {
				return "没指定链接哦!"
			}
		},
		getUrlParam: function(j, g) {
			var k = g || window.location;
			k = decodeURI(k);
			var m = {};
			var d = k.split("?");
			if(d.length <= 1) {
				return null
			}
			d = d[1].split("&");
			for(var h = 0, f = d.length; h < f; h++) {
				var e = d[h].split("=");
				m[e[0]] = e[1]
			}
			return j ? m[j] : m
		},
		getRandom: function(e, d) {
			if(!e && !d) {
				return Math.ceil(Math.random() * (new Date).getTime())
			}
			return parseInt(Math.random() * (d - e + 1) + e)
		},
		pageAjaxError: function(f, e, g) {
			var d = this;
			layer.confirm("<span class='am-text-danger'>" + e + "</span> 请求出错，请联系管理员！", {
				title: "系统提示：<span class='am-text-danger'>" + f.status + "</span>",
				closeBtn: 0,
				skin: "layui-layer-ajax-error",
				btn: ["重新请求"]
			}, function(h) {
				if(c.isFunction(g)) {
					g()
				}
			})
		}
	};
	c.fn.extend({
		animateCss: function(f, g) {
			var e = this;
			var d = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
			e.addClass("animated " + f).one(d, function() {
				e.removeClass("animated " + f);
				if(c.isFunction(g)) {
					g()
				}
			});
			return e
		},
		topoDialog: function(d) {
			var e = c.extend(true, {
				status: true,
				dialogAnimateEnd: true,
				Tdrag: {
					scope: "#topo-main",
					handle: ".am-panel-hd"
				}
			}, d);
			return new b(this, e)
		}
	});

	function b(f, e) {
		var d = this;
		d.$element = f;
		d.options = e;
		if(d.$element.is(":hidden")) {
			d.options.status = false
		}
		d.$element.find(".am-close").click(function() {
			d.dialogHide()
		});
		d.init()
	}
	b.prototype = {
		init: function() {
			var d = this;
			d.$element.Tdrag({
				scope: "#topo-main",
				handle: ".am-panel-hd"
			});
			return d
		},
		change: function() {
			var d = this;
			if(d.options.dialogAnimateEnd) {
				if(d.options.status) {
					d.dialogHide()
				} else {
					d.dialogShow()
				}
			}
			return d
		},
		dialogShow: function() {
			var d = this;
			d.options.status = true;
			d.options.dialogAnimateEnd = false;
			d.$element.removeClass("am-hide").animateCss("zoomIn", function() {
				d.$element.addClass("am-show");
				d.options.dialogAnimateEnd = true
			});
			return d
		},
		dialogHide: function() {
			var d = this;
			d.options.status = false;
			d.options.dialogAnimateEnd = false;
			d.$element.removeClass("am-show").animateCss("zoomOut", function() {
				d.$element.addClass("am-hide");
				d.options.dialogAnimateEnd = true
			});
			return d
		},
		modelReady: function(e) {
			var d = this;
			d.topo = e;
			var f = c("body");
			var g = c(document);
			d.options.modelMouseDown = false;
			d.$element.find("img.t-model-icon").on("mousedown", function(k) {
				if(k.preventDefault) {
					k.preventDefault()
				} else {
					k.returnvalue = false
				}
				var j = c(this);
				var h = j.clone();
				h.addClass("t-model-icon-clone");
				h.css({
					width: j.width(),
					height: j.height()
				});
				f.append(h);
				d.options.modelMouseDown = true;
				var i = {
					width: h.width(),
					height: h.height()
				};
				h.css({
					left: k.clientX - (i.width / 2),
					top: k.clientY - (i.height / 2)
				});
				g.on("mousemove", function(l) {
					h.css({
						left: l.clientX - (i.width / 2),
						top: l.clientY - (i.height / 2)
					})
				});
				g.on("mouseup", function(p) {
					var q = {
						top: d.$element.offset().top,
						bottom: d.$element.offset().top + d.$element.height()
					};
					var l = {
						left: d.$element.offset().left,
						right: d.$element.offset().left + d.$element.width()
					};
					var o = h.offset().left;
					var n = h.offset().top;
					if(o > l.left && o < l.right && n > q.top && n < q.bottom) {
						layer.msg("请把节点拖拽出窗口", {
							icon: 5,
							time: 2000
						})
					} else {
						i.x = o - d.topo.scene.translateX;
						i.y = n - d.topo.scene.translateY;
						i.text = h.data("name");
						i.nodeImage = h.attr("src");
						var m = d.topo.newNode(i);
						d.$element.trigger("addNode", [m]);
						h.remove()
						
					}
					g.unbind("mousemove");
					g.unbind("mouseup");
					h.remove();
					d.options.modelMouseDown = false
				})
			});
			return d
		},
		linkReady: function(e) {
			var d = this;
			d.topo = e;
			d.$element.find("#stop-link").on("click", function() {
				d.topo.stopLink(true)
			});
			d.$element.find("#clear-all").on("click", function() {
				d.topo.stage.childs.forEach(function(f) {
					f.clear()
				})
			});
			d.$element.find("#save-topo").on("click", function() {
				var f = d.topo.getJson(true);
				if(f) {
					console.log(f)
				} else {
					layer.alert("请绘制节点", {
						title: "系统提示",
						time: 1500
					})
				}
			});
			d.$element.find("img.t-link-icon").on("click", function(j) {
				var i = c(this);
				var h = i.data("class");
				var f = i.data("type");
				var g = {
					linkClass: h,
					linkType: f
				};
				i.addClass("active").siblings("img").removeClass("active");
				d.topo.linkObj = g
			});
			return d
		}
	};
	var a = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	String.prototype.colorHex = function() {
		var h = this;
		var g = h.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
		var d = "#";
		if(g) {
			for(var e = 0; e < g.length; e++) {
				var f = Number(g[e]).toString(16);
				if(f === "0") {
					f += f
				}
				d += f
			}
			if(d.length !== 7) {
				d = h
			}
		}
		return d
	};
	String.prototype.colorRgb = function(g) {
		var f = this.toLowerCase();
		if(f && a.test(f)) {
			if(f.length === 4) {
				var h = "#";
				for(var e = 1; e < 4; e += 1) {
					h += f.slice(e, e + 1).concat(f.slice(e, e + 1))
				}
				f = h
			}
			var d = [];
			for(var e = 1; e < 7; e += 2) {
				d.push(parseInt("0x" + f.slice(e, e + 2)))
			}
			if(g) {
				return "RGB(" + d.join(",") + ")"
			} else {
				return d.join(",")
			}
		} else {
			return f
		}
	};
	return c
}));