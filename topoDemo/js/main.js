/*入口脚本*/
require.config({
	paths: { // -- 配置别名
		"jquery": ["http://libs.baidu.com/jquery/2.0.0/jquery.min", "../assets/js/jquery.min"],
		"amazeui": ["http://cdn.amazeui.org/amazeui/2.7.2/js/amazeui.min", "../assets/js/amazeui.min"],
		"vue": "../assets/js/vue.min",
		"layer": "../assets/layer/layer",
		"Tdrag": "../assets/js/Tdrag",
		"gsPlugs": "./jquery.gsPlugs",
		"topo": "./topo",
		"jscolor": "../assets/js/jscolor.min",
	},
	shim: {
		"layer": {
			deps: ["jquery"]
		}
	}
});
require(["topo", "vue", "jquery", "amazeui", "layer", "gsPlugs", "jscolor"], function(TOPO, Vue, $) {
	/*window._layerLoad = layer.msg('拓扑生成中...', {
		icon: 16,
		time: 2000000,
		opacity: 0.3,
		scrollbar: false,
		skin: "layer-my-load",
		shade: [0.7]
	}); 
	setTimeout(function(){
		layer.close(_layerLoad);
		window._layerLoad = null;
	},1000);*/

	var toolbars = [{
		title: "取消任务",
		type: "normal",
		status: false
	}, {
		title: "框选模式",
		type: "select",
		status: false
	}, {
		title: "编辑节点",
		type: "edit",
		status: false
	}, {
		title: "缩放模式",
		type: "zoom",
		status: true
	}, {
		title: "居中对齐",
		type: "centent",
		status: true
	}, {
		title: "刷新",
		type: "refresh",
		status: false
	}, {
		title: "全屏显示",
		type: "full",
		status: true
	}, {
		title: "模型框",
		type: "show-model",
		status: false
	}, {
		title: "操作框",
		type: "show-link",
		status: false
	}];

	var topoRightConfig = {
		textPosition: {
			selected: "Top_Right",
			options: [{
				value: "Bottom_Center",
				text: "底部居中"
			}, {
				value: "Top_Center",
				text: "顶部居中"
			}, {
				value: "Top_Right",
				text: "右上偏移"
			}, {
				value: "Middle_Left",
				text: "左中偏移"
			}, {
				value: "Middle_Center",
				text: "居中显示"
			}, {
				value: "Middle_Right",
				text: "右中偏移"
			}, {
				value: "Bottom_Left",
				text: "左下偏移"
			}, {
				value: "Top_Left",
				text: "左上偏移"
			}, {
				value: "Bottom_Right",
				text: "右下偏移"
			}]
		},
		font: {
			selected: "18px Microsoft YaHei",
			options: ["40", "35", "30", "25", "20", "18", "16", "14", "12", "10"]
		},
		alpha: {
			selected: 1,
			options: [1, 0.9, 0.8, 0.7, 0.6, 0.5]
		}
	}

	var linkData = [{
		"class": "直线",
		"type": "link",
		"src": "1.png"
	}, {
		"class": "虚直线",
		"type": "link",
		"src": "2.png"
	}, {
		"class": "直线带箭头",
		"type": "link",
		"src": "3.png"
	}, {
		"class": "虚直线箭头",
		"type": "link",
		"src": "4.png"
	}, {
		"class": "折线",
		"type": "foldLink",
		"src": "5.png"
	}, {
		"class": "虚折线",
		"type": "foldLink",
		"src": "6.png"
	}, {
		"class": "折线带箭头",
		"type": "foldLink",
		"src": "7.png"
	}, {
		"class": "虚折线箭头",
		"type": "foldLink",
		"src": "8.png"
	}, {
		"class": "二次折线",
		"type": "flexionalLink",
		"src": "9.png"
	}, {
		"class": "虚二次折线",
		"type": "flexionalLink",
		"src": "10.png"
	}, {
		"class": "二次折线带箭头",
		"type": "flexionalLink",
		"src": "11.png"
	}, {
		"class": "虚二次折线箭头",
		"type": "flexionalLink",
		"src": "12.png"
	}]

	Vue.filter("topo-node-font", function(value) {
		return value + "px Microsoft YaHei";
	});
	Vue.filter("model-icon-src", function(value) {
		return "./images/node/" + value;
		//return "http://localhost:8080/FHORACLE/uploadFiles/uploadImgs/" + value;
	});
	Vue.filter("link-icon-src", function(value) {
		return "./images/link/" + value;
	});
	Vue.config.debug = true;

	var topo = new TOPO();

	var ModelDialog, LinkDialog; // 记录弹窗对象

	// 绑定 Vue,Vue 在本页面只做页面渲染和部分dom处理
	window.VUEMODEL = new Vue({
		el: "body",
		data: {
			toolbars,
			linkData,
			topoRightConfig,
			relevanceDevice: null
		}
	});

	// 监控 关联设备属性,每次弹窗确定关联后都会触发此函数
	VUEMODEL.$watch("relevanceDevice", function() {
		var relevanceDevice = VUEMODEL.$data.relevanceDevice;
		var node = topo.currentRightNode;
		node.text = relevanceDevice.name;
		// 如果节点是第一次关联设备，就追加序列化属性
		if(!node._rdid && !node._rdname) {
			TOPO.pushSerializedProperties(node, ["_rdid", "_rdname"]);
		}
		node._rdid = relevanceDevice.id;
		node._rdname = relevanceDevice.name;
	});

	$(function() { // 总体内容
		var $main = $("#topo-main");
		var $win = $(window);
		// 渲染jtopo
		topo.init({
			box: "#topo-main",
			background: "./images/bg.png"
		});
		// 开启自适应
		$win.resize(function() {
			topoResize();
		});
		topoResize();

		// 根据参数，改变 jtopo 
		var topoParam = $.gsPlugs.getUrlParam();
//		console.log(topoParam)
//		if(!topoParam || topoParam.type == "save") {
//			VUEMODEL.toolbars[5].status = true;
//			loadModelData();
//			loadLinkDialog();
//		} else 
		if(topoParam.type == "edit") {
			loadTopoData(topoParam.topoId);
			loadModelData();
			loadLinkDialog();
		} else if(topoParam.type == "view") {
			VUEMODEL.toolbars[3].status = false;
			VUEMODEL.toolbars[4].status = false;
			VUEMODEL.toolbars[2].status = true;
			VUEMODEL.toolbars[7].status = true;
			VUEMODEL.toolbars[8].status = true;
			$("#topo-right").addClass("am-hide");
			loadTopoData(topoParam.topoId);
		}else {
			VUEMODEL.toolbars[5].status = true;
			loadModelData();
			loadLinkDialog();
		}

		// 按钮栏操作方法
		$("#jtopo-toolbar>div").on("click", function() {
			var $this = $(this);
			var dataType = $this.data("type");
			if(dataType) {
				topo.stage.wheelZoom = null;
				if(dataType == "zoom") {
					topo.stage.wheelZoom = 0.8;
				} else if(dataType == "centent") {
					topo.stage.centerAndZoom();
				} else if(dataType == "show-model") {
					ModelDialog.change();
				} else if(dataType == "show-link") {
					LinkDialog.change();
				} else if(dataType == "refresh") {
					loadTopoData(topoParam.topoId);
				} else {
					topo.stage.mode = dataType;
				}
			}
		})

		// 实例化 jscolor 组件到 input 的 data 缓存
		var $topoLinkStrokeColor = $("#topo-link-strokeColor");
		$topoLinkStrokeColor.on("change", function(e) {
			var picker = $topoLinkStrokeColor.data("picker");
			var strokeColor = Math.round(picker.rgb[0]) + ', ' + Math.round(picker.rgb[1]) + ', ' + Math.round(picker.rgb[2]);
			if(topo.currentRightNode instanceof JTopo.Link) {
				topo.currentRightNode.strokeColor = strokeColor;
			}
		});
		$topoLinkStrokeColor.data("picker", new jscolor($topoLinkStrokeColor[0], {
			closable: true,
			hash: true,
			zIndex: 9e10,
			closeText: '确定颜色'
		}));

	});

	$(function() { // 右击菜单事件
		/*
		 * @methods	右击菜单事件
		 * @function rightNode 拓扑图右击节点时回调函数，返回 Node 对象
		 * */
		var $topoRight = $("#topo-right");
		// 每次点击都会隐藏右击菜单
		$(document).on("click", function() {
			$("#topo-right").hide();
		});

		// 右击菜单事件
		$topoRight.on("click", "li", function() {
			var self = $(this);
			var type = self.data("type");
			var $dragable = $topoRight.find("li.topo-right-dragable");
			$topoRight.hide();

			// 判断是否锚定
			if(topo.currentRightNode.dragable) {
				$dragable.text($dragable.data("dragable-true"));
			} else {
				$dragable.text($dragable.data("dragable-false"));
			}

			if(type == "alige") { //上下左右对齐
				var selectNodes = topo.scene.selectedElements;
				$.each(selectNodes, function(i, node) {
					node[self.data("alige")] = selectNodes[selectNodes.length - 1][self.data("alige")];
				});
			} else if(type == "dragable") { //锚定节点
				if(topo.currentRightNode.dragable) {
					$dragable.text($dragable.data("dragable-false"));
					topo.currentRightNode.dragable = false;
				} else {
					$dragable.text($dragable.data("dragable-true"));
					topo.currentRightNode.dragable = true;
				}
			} else if(type == "remove") { //删除节点
				if(topo.currentRightNode instanceof JTopo.Link) {
					topo.removeLink(topo.currentRightNode);
				} else {
					topo.removeNode(topo.currentRightNode)
				}
				topo.currentRightNode = null;
			} else if(type == "style") { // 打开样式设置
				topoStyleConfigDialog();
			} else if(type == "hole") { // 下钻
				$.gsPlugs.openBlank("index_2.html");
			} else if(type == "device-relate") {
				layer.open({
					type: 2,
					title: "关联设备",
					shadeClose: true,
					area: ['280px', '400px'],
					content: self.data("url") + "?deviceId=" + topo.currentRightNode._rdid
				});
			}
		});

		$("#topo-text-position").on("change", function() {
			// 拓扑节点文本定位设置
			topo.currentRightNode.textPosition = $(this).val();
		});
		$("#topo-font-size").on("change", function() {
			// 拓扑节点文本大小设置
			topo.currentRightNode.font = $(this).val() + "px Microsoft YaHei";
		});
		$("#topo-node-alpha").on("change", function() {
			// 拓扑节点透明度设置
			topo.currentRightNode.alpha = $(this).val();
		});
		$("#topo-node-name").on("blur", function() {
			// 拓扑名称修改
			var $this = $(this);
			// 输入为空时，设置为初始值
			if($this.val().trim().length <= 0) {
				topo.currentRightNode.text = $this.data("val");
			} else {
				topo.currentRightNode.text = $(this).val();
			}
		}).on("input", function() {
			var $this = $(this);
			topo.currentRightNode.text = $this.val();
		}).on("focus", function() {
			var $this = $(this);
			$this.data("val", $this.val());
		});
		$("#topo-link-textOffsetY,#topo-link-textOffsetX").on("input", function() {
			var $this = $(this),
				maxVal = 20,
				minVal = -20;
			// 拓扑线条文本 Y 轴偏移量
			if($this.val() > maxVal) {
				$this.val(maxVal)
			} else if($this.val() < minVal) {
				$this.val(minVal)
			}
			$this.val($this.val().trim())
			if($this.val()) {
				topo.currentRightNode[$this.data("coord")] = parseInt($this.val());
			}
		}).on("focus", function() {
			var $this = $(this);
			if($this.val() == 0) {
				$this.val("");
			}
		}).on("blur", function() {
			var $this = $(this);
			if($this.val() == "") {
				$this.val(0);
			}
		});
	})

	$(function() { // 搜索框
		var $jtopoSearch = $("#jtopo-search");
		$jtopoSearch.on("mouseenter", ".open-search", function() {
			$jtopoSearch.children("input.search-input").addClass("active");
		}).on("mouseleave", function() {
			$jtopoSearch.children("input.search-input").removeClass("active").blur().val("");
		}).on("keydown", "input.search-input", function(event) {
			if(event.keyCode == "13") {
				var node = topo.search($(this).val());
				if(!node.elementType) {
					layer.msg(node, {
						skin: "layui-layer-search-error",
						shift: 0,
						time: 1200
					});
				}
			}
		})
	});

	// 右击拓扑节点触发 rightNodeEvent， 此函数自定义
	topo.rightNodeEvent = function(event, node) {
		var $topoRight = $("#topo-right");
		var self = this;
		var node = self.currentRightNode;
		// 获取 菜单 高度
		var rightHeight = $topoRight.height();
		// 获取文档高度减去鼠标位置剩余的高度
		var overHeight = $(self.canvas).height() - (event.pageY + 20);
		var top = event.pageY;
		var left = event.pageX;

		//当剩余的高度小于350时,调整top值
		if(overHeight < rightHeight) {
			top = top - rightHeight;
		}

		$topoRight.css({
			top: top,
			left: event.pageX
		}).show();

		var $dragable = $topoRight.find("li.topo-right-dragable");
		// 判断是 node 节点还是 link 节点,分别显示不同的 选项
		if(node instanceof JTopo.Node) {
			$topoRight.find("li.topo-right-node").addClass("am-show").removeClass("am-hide");
			var selectNodes = topo.scene.selectedElements;
			if(selectNodes.length > 1) { // 是否显示 对齐 选项
				$topoRight.find("li.topo-right-alige").addClass("am-show").removeClass("am-hide");
			} else {
				$topoRight.find("li.topo-right-alige").addClass("am-hide").removeClass("am-show");
			}
			if(node.dragable) { // 判断是否锚定
				$dragable.text($dragable.data("dragable-true"));
			} else {
				$dragable.text($dragable.data("dragable-false"));
			}
		} else if(topo.currentRightNode instanceof JTopo.Link) {
			$topoRight.find("li.topo-right-node").addClass("am-hide").removeClass("am-show");
		}

	}

	// 停止连线事件 触发 stopLinkEvent， 此函数自定义
	topo.stopLinkEvent = function() {
		$("#link-dialog").find("img.t-link-icon").removeClass("active");
	}

	// 打开拓扑节点设置窗口
	function topoStyleConfigDialog() {
		var node = topo.currentRightNode;
		var $topoStyleConfigBox = $("#topo-style-config-box");
		for(var topoCfg in VUEMODEL.$data.topoRightConfig) {
			VUEMODEL.$data.topoRightConfig[topoCfg].selected = node[topoCfg];
		}
		if(node instanceof JTopo.Link) {
			$topoStyleConfigBox.find("div.topo-style-node").addClass("am-hide").removeClass("am-show");
			$topoStyleConfigBox.find("div.topo-style-link").addClass("am-show").removeClass("am-hide");
			$("#topo-link-textOffsetY").val(node.textOffsetY);
			$("#topo-link-textOffsetX").val(node.textOffsetX);
			// 获取线条节点 16进制颜色值,并修改 jscolor 组件
			$("#topo-link-strokeColor").data("picker").fromString(node.strokeColor.colorHex());
		} else {
			$topoStyleConfigBox.find("div.topo-style-node").addClass("am-show").removeClass("am-hide");
			$topoStyleConfigBox.find("div.topo-style-link").addClass("am-hide").removeClass("am-show");
		}
		// 如果节点已经关联设备，就设置text值不可修改
		if(node._rdname && node._rdid) {
			$("#topo-node-name").val(node.text).prop("disabled", true);
		} else {
			$("#topo-node-name").val(node.text).prop("disabled", false);
		}

		layer.open({
			type: 1,
			title: "样式设置",
			skin: "layui-layer-topo",
			area: ["400px", "380px"], //宽高
			shift: 0,
			shadeClose: false, //开启遮罩关闭
			success: function(layero, index) { // 打开窗口时把 vue 双向绑定的dom放置layer内
				$topoStyleConfigBox.children("#topo-style-config").appendTo($(layero).find("div.layui-layer-content"));
				$("#topo-style-submit").one("click", function() {
					$("#layui-layer" + index).find("a.layui-layer-close").trigger("click");
				})
			},
			cancel: function(index) { // 关闭窗口时 dom 还原
				$("#layui-layer" + index).find("#topo-style-config").appendTo($topoStyleConfigBox);
			}
		});
	}

	// 加载拓扑线条操作弹窗,并对内部事件进行绑定
	function loadLinkDialog() {
		var $linkDialog = $("#link-dialog");
		LinkDialog = $linkDialog.topoDialog().linkReady(topo).dialogShow();
		$linkDialog.find("img").each(function() {
			var $this = $(this);
			$this.popover({
				content: $this.data("class"),
				trigger: "hover"
			});
		})
	}

	//	pictures/getListData.do
	// 加载拓扑操作弹窗,并对内部事件进行绑定
	function loadModelData() {
		console.log(1111111111)
		$.ajax({
			type: "get",
			url: "js/data/model.json",
		}).done(function(data) {
			if(typeof data == "string") {
				data = JSON.parse(data);
			}
			VUEMODEL.$set("modelData", data);
			// vue 下一次渲染回调
			VUEMODEL.$nextTick(function() {
				var $modelDialog = $("#model-dialog");
				ModelDialog = $modelDialog.topoDialog().modelReady(topo).dialogShow();
				//$.AMUI.accordion.init();
				$modelDialog.find("img.t-model-icon").each(function() {
					var $this = $(this);
					$this.popover({
						content: $this.data("name"),
						trigger: "hover"
					});
				})
			});
		}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
			$.gsPlugs.pageAjaxError.call(this, XMLHttpRequest, "拓扑模型数据", function() {
				loadModelData();
			});
		});
	}

	// 加载拓扑数据
	function loadTopoData(topoId) {
		$.ajax({
			type: "get",
			url: "js/data/topo.json",
			data: {
				topoId: topoId || 1
			}
		}).done(function(data) {
			if(typeof data == "string") {
				data = JSON.parse(data);
			}
			topo.setJson(data);
			topoResize();
		}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
			$.gsPlugs.pageAjaxError.call(this, XMLHttpRequest, "拓扑图数据", function() {
				loadTopoData(topoId);
			});
		});
	}

	// 适配宽高
	function topoResize() {
		var $main = $("#topo-main"),
			$win = $(window);
		$main.width($win.width()).height($win.height());
		if($win.width() > 1000) { // 窗口大于1000
			topo.canvas.width = $main.width();
			topo.canvas.height = $main.height();
		}
	}
});