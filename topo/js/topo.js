"use strict";
(function(a, b) {
	if(typeof define === "function" && define.amd) {
		define(["jquery"], b)
	} else {
		if(typeof exports === "object") {
			module.exports = b(require("jquery"))
		} else {
			a.TOPO = b(a.jQuery)
		}
	}
}(this, function(b) {
	var a = function() {
		this.canvas = null;
		this.stage = null;
		this.scene = null;
		this.mouseStartNode = null;
		this.currentRightNode = null;
		this.mouseTempNode = null;
		this.options = {
			box: "body",
			canvasId: "topo-canvas-" + Math.ceil(Math.random() * (new Date).getTime()),
			backgroundColor: null,
			background: null
		}
	};
	a.prototype.init = function(d) {
		var c = this;
		b.extend(true, c.options, d);
		c.mouseTempNode = new JTopo.Node("temp");
		c.mouseTempNode.setSize(1, 1);
		c.mouseLink = null;
		c.newTopo()
	};
	a.prototype.getJson = function(e) {
		var d = this;
		var c = d.scene.childs;
		if(c.length == 0) {
			return c.length
		}
		var f = d.stage.toJson();
		if(!e) {
			return JSON.parse(f)
		}
		return f
	};
	a.prototype.setJson = function(c) {
		if(typeof c == "string") {
			c = JSON.parse(c)
		}
		if(c.childs[0].elementType !== "scene") {
			console.info("Topo提示：json数据错误");
			return "json数据错误"
		}
		this.newTopo(c)
	};
	a.prototype.createStageFromJson = function(g) {
		var e = this;
		var f = new JTopo.Stage(e.canvas);
		for(var d in g) {
			if("childs" != d) {
				f[d] = g[d]
			}
		}
		var c = g.childs;
		c.forEach(function(h) {
			var i = new JTopo.Scene(f);
			for(var k in h) {
				if("childs" != k) {
					i[k] = h[k]
				}
			}
			var j = h.childs;
			j.forEach(function(l) {
				var n = null,
					m = l.elementType;
				if("node" == m) {
					n = e.newNode(l, true)
				} else {
					if("CircleNode" == m) {
						n = new JTopo.CircleNode
					}
				}
				if("link" == m) {
					n = e.newLink(l, true, i)
				}
				i.add(n)
			})
		});
		return f
	};
	a.prototype.sceneEvent = function() {
		var c = this;
		c.scene.addEventListener("mouseup", function(f) {
			var e = f.target;
			c.currentRightNode = null;
			if(f.button == 2) {
				c.stopLink();
				if(e) {
					c.currentRightNode = e;
					if(b.isFunction(c.rightNodeEvent)) {
						c.rightNodeEvent(f, e)
					}
				}
			} else {
				if(f.button == 0) {
					if(e) {
						if(b.isFunction(c.leftNodeEvent)) {
							c.leftNodeEvent(f, e)
						}
					}
					if(e instanceof JTopo.Node) {
						if(c.linkObj) {
							if(c.mouseLink && c.mouseLink.fromNodeId) {
								var g = c.mouseStartNode;
								if(g.sameLinkNodeIds) {
									var d = false;
									b.each(g.sameLinkNodeIds.split(","), function(h, i) {
										if(i == e._id) {
											d = true
										}
									});
									if(d) {
										layer.msg("不可重复连线", {
											icon: 5,
											time: 1200
										});
										g = null;
										c.scene.remove(c.mouseLink);
										c.mouseLink = null;
										return false
									}
								}
								if(e._id == g._id) {
									c.scene.remove(c.mouseLink)
								} else {
									if(e.sameLinkNodeIds) {
										e.sameLinkNodeIds += "," + g._id
									} else {
										e.sameLinkNodeIds += g._id
									}
									if(g.sameLinkNodeIds) {
										g.sameLinkNodeIds += "," + e._id
									} else {
										g.sameLinkNodeIds += e._id
									}
									c.mouseLink.nodeZ = e;
									c.mouseLink.toNodeId = e._id
								}
								c.mouseLink = null;
								c.mouseStartNode = null
							} else {
								c.mouseStartNode = e;
								c.mouseLink = c.newLink(c.linkObj);
								c.mouseLink.fromNodeId = c.mouseStartNode._id;
								c.scene.add(c.mouseLink)
							}
						}
					} else {
						c.stopLink()
					}
				} else {
					console.info("Topo提示：鼠标其他按键暂时无效！！！")
				}
			}
		}, false);
		c.scene.addEventListener("mousemove", function(d) {
			if(b.isFunction(c.mousemoveEvent)) {
				c.mousemoveEvent(d)
			}
			if(c.mouseLink) {
				c.mouseTempNode.setLocation(d.x, d.y)
			}
		});
		c.stage.addEventListener("mouseout", function(d) {
			if(b.isFunction(c.mouseoutEvent)) {
				c.mouseoutEvent(d)
			}
			c.stopLink()
		})
	};
	a.prototype.newTopo = function(e) {
		var d = this;
		var c = d.options;
		var h = c.canvasId;
		var g = b(c.box);
		b("#" + h).remove();
		var f = b('<canvas id="' + h + '" width="' + g.width() + '" height="' + g.height() + '"></canvas>');
		g.append(f);
		d.canvas = f[0];
		if(e) {
			d.stage = d.createStageFromJson(e, d.canvas);
			d.scene = d.stage.childs[0]
		} else {
			d.stage = new JTopo.Stage(d.canvas);
			d.scene = new JTopo.Scene(d.stage);
			if(c.backgroundColor) {
				d.scene.alpha = 1;
				d.scene.backgroundColor = c.backgroundColor
			}
			if(c.background) {
				d.scene.background = c.background
			}
			d.scene.lastTranslatedX = null;
			d.scene.lastTranslatedY = null;
			d.stage.add(d.scene)
		}
		d.sceneEvent()
	};
	a.prototype.newNode = function(i, d) {
		var c = this;
		var g = b.extend(true, {
			x: 0,
			y: 0,
			width: 20,
			height: 20,
			zIndex: 13,
			fillColor: "0,255,0",
			borderColor: "255,0,0",
			borderWidth: 0,
			borderRadius: 30,
			textOffsetY: 0,
			textOffsetX: 0,
			alpha: 1,
			text: "node",
			font: "18px Microsoft YaHei",
			fontColor: "255,255,255",
			nodeImage: null,
			dragable: true,
			textPosition: "Bottom_Center",
			alarmValue: "告警",
			sameLinkNodeIds: ""
		}, i);
		var h = new JTopo.Node;
		var e = ["_id"];
		for(var f in g) {
			h[f] = g[f];
			e.push(f)
		}
		a.pushSerializedProperties(h, e);
		h.setImage(g.nodeImage);
		h.serializedProperties = a.unique(h.serializedProperties);
		if(d) {
			return h
		}
		c.scene.add(h);
		return h
	};
	a.prototype.removeNode = function(d) {
		var c = this;
		if(d.sameLinkNodeIds) {
			b.each(d.sameLinkNodeIds.split(","), function(f, g) {
				var e = c.search(g, "_id", true);
				a.sameLinkNodeIdsRemove(e, d._id)
			})
		}
		c.scene.remove(d)
	};
	a.unique = function(d) {
		var c = [],
			g = {};
		for(var e = 0, f;
			(f = d[e]) != null; e++) {
			if(!g[f]) {
				c.push(f);
				g[f] = true
			}
		}
		return c
	};
	a.sameLinkNodeIdsRemove = function(e, f) {
		if(e.sameLinkNodeIds) {
			var c = e.sameLinkNodeIds;
			if(typeof(c) == "string") {
				c = c.split(",")
			}
			var d = c.indexOf(f);
			if(d > -1) {
				c.splice(d, 1)
			}
			e.sameLinkNodeIds = c.join(",")
		}
		return e
	};
	a.prototype.newLink = function(c, e, f) {
		var l = this;
		var d = b.extend(true, {
			linkClass: "直线",
			linkType: "link",
			zIndex: 12,
			lineWidth: 3,
			bundleGap: 0,
			textOffsetY: 0,
			textOffsetX: 0,
			alpha: 1,
			font: "18px Microsoft YaHei",
			text: "连线",
			fillColor: "0,255,0",
			fontColor: "255,255,255",
			borderColor: "255,0,0",
			strokeColor: "0,200,255",
			alarmValue: "告警",
			offsetGap: 0,
			arrowsRadius: 0,
			bundleOffset: 20,
			dashedPattern: null,
			fromNodeId: null,
			toNodeId: null
		}, c);
		var h = null;
		var k = null;
		var i = null;
		if(e) {
			k = f.find('node[_id="' + d.fromNodeId + '"]')[0];
			i = f.find('node[_id="' + d.toNodeId + '"]')[0]
		} else {
			k = l.mouseStartNode;
			i = l.mouseTempNode
		}
		if(d.linkType == "link" || d.linkClass == "直线") {
			h = new JTopo.Link(k, i)
		} else {
			if(d.linkType == "foldLink" || d.linkClass == "折线") {
				h = new JTopo.FoldLink(k, i)
			} else {
				if(d.linkType == "flexionalLink" || d.linkClass == "二次折线") {
					h = new JTopo.FlexionalLink(k, i);
					d.offsetGap = 40
				}
			}
		}
		if(d.linkClass == "虚直线" || d.linkClass == "虚折线" || d.linkClass == "虚二次折线") {
			d.dashedPattern = 10
		} else {
			if(d.linkClass == "直线带箭头" || d.linkClass == "折线带箭头" || d.linkClass == "二次折线带箭头") {
				d.arrowsRadius = 15
			} else {
				if(d.linkClass == "虚直线箭头" || d.linkClass == "虚折线箭头" || d.linkClass == "虚二次折线箭头") {
					d.dashedPattern = 10;
					d.arrowsRadius = 15
				}
			}
		}
		var g = ["_id"];
		for(var j in d) {
			h[j] = d[j];
			g.push(j)
		}
		a.pushSerializedProperties(h, g);
		h.serializedProperties = a.unique(h.serializedProperties);
		return h
	};
	a.prototype.removeLink = function(e) {
		var c = this;
		var f = c.search(e.fromNodeId, "_id", true);
		var d = c.search(e.toNodeId, "_id", true);
		a.sameLinkNodeIdsRemove(f, e.toNodeId);
		a.sameLinkNodeIdsRemove(d, e.fromNodeId);
		return e
	};
	a.prototype.stopLink = function(d) {
		var c = this;
		if(c.mouseLink) {
			c.mouseStartNode = null;
			c.scene.remove(c.mouseLink);
			c.mouseLink = null
		}
		if(d) {
			if(b.isFunction(c.stopLinkEvent)) {
				c.stopLinkEvent()
			}
			c.linkObj = null
		}
	};
	a.prototype.search = function(d, j, g) {
		var k = this;
		var h = d.trim();
		var c = k.scene.childs.filter(function(l) {
			return l instanceof JTopo.Node
		});
		c = c.filter(function(l) {
			if(l.text == null) {
				return false
			}
			if(j) {
				if(l[j] == h) {
					return l
				}
			} else {
				return l.text.indexOf(h) != -1
			}
		});
		if(g) {
			return c[0]
		} else {
			if(c.length > 0 && !g) {
				var f = c[0];
				f.selected = true;
				var i = f.getCenterLocation();
				k.scene.setCenter(i.x, i.y);

				function e(l, m) {
					if(m == 0) {
						l.selected = false;
						return
					}
					l.selected = !l.selected;
					setTimeout(function() {
						e(l, m - 1)
					}, 300)
				}
				e(f, 4);
				return f
			} else {
				return "未找到相关节点"
			}
		}
	};
	a.pushSerializedProperties = function(d, c) {
		if(b.isArray(c)) {
			b.each(c, function(f, e) {
				d.serializedProperties.push(e)
			})
		} else {
			d.serializedProperties.push(c)
		}
	};
	return a
}));