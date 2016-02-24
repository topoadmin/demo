var scene, stage;
var line = null; //线条存放变量
var fNode = null; //开始节点存放变量
var currentNode = null; // 当前右击节点容器
var tempNode = new JTopo.Node('temp'); //建立一个节点
tempNode.setSize(1, 1); //线条连接鼠标附带移动节点

jQuery.topo = {
	newCanvas: function(canvasId, data) {
		var main = $("#main");
		var canvass = ('<canvas id="' + canvasId + '" width="800" height="510"></canvas>');
		main.html('').append(canvass);
		var canvas = document.getElementById(canvasId);
		stage = new JTopo.Stage(canvas);
		scene = new JTopo.Scene(stage);
		scene.background = "image/bg.png";
		stage.add(scene);
		if (data) {
			$.topo.newScene(scene, data);
		}
		autoAdaptation(canvasId);
		showJTopoToobar(stage, scene, canvasId);
	},
	newScene: function(scene, data) {
		scene.clear();
		for (var i = 0; i < data.node.length; i++) {
			var fromNode = $.topo.newNode(data.node[i], "image/nodeImg/");
			scene.add(fromNode);
			//			nodeFlash(fromNode,5);
		}
		if (data.link) {
			for (var i = 0; i < data.link.length; i++) {
				var jsonLink = data.link[i];
				var fromNodeT = scene.find('node[mapId="' + jsonLink.fromNodeMapId + '"]');
				var fromNode = fromNodeT[0];
				var toNodeT = scene.find('node[mapId="' + jsonLink.toNodeMapId + '"]');
				var toNode = toNodeT[0];
				var line = $.topo.newLink(fromNode, toNode, jsonLink);
				scene.add(line);
			}
		}
		if (data.container) {
			for (var i = 0; i < data.container.length; i++) {
				var jsonContainer = data.container[i];
				var container = $.topo.newContainer(jsonContainer);
				for (var io = 0; io < 2; io++) {
					var node = new JTopo.Node();
					node.textPosition = "Middle_Center";
					node.setBound(container.x + io * 200, container.y + io * 200, 10, 10);
					node.zIndex = 13;
					node.visible = false;
					scene.add(node);
					container.add(node);
				}
				scene.add(container);

				for (var cn = 0; cn < jsonContainer.childs.length; cn++) {
					var containerNodeT = scene.find('node[mapId="' + jsonContainer.childs[cn] + '"]');
					var containerNode = containerNodeT[0];
					container.add(containerNode);
				}
			}
		}
	},
	newNode: function(jsonNode, imgUrl) {
		var node = new JTopo.Node();
		node.topoId = jsonNode.topoId; //拓扑图ID
		node.id = jsonNode.id; //ID
		node.mapId = jsonNode.mapId;
		node.setLocation(parseInt(jsonNode.x), parseInt(jsonNode.y)); //坐标
		node.setSize(parseInt(jsonNode.width), parseInt(jsonNode.height)); //大小
		node.zIndex = parseInt(jsonNode.zIndex); //图层
		node.borderWidth = parseInt(jsonNode.borderWidth); //边框宽度
		node.borderRadius = parseInt(jsonNode.borderRadius); //边框圆角
		node.textOffsetY = parseFloat(jsonNode.textOffsetY); //文本Y轴偏移
		node.textOffsetX = parseFloat(jsonNode.textOffsetX); //文本X轴偏移
		node.alpha = parseFloat(jsonNode.alpha); //透明度
		node.text = jsonNode.text; //文本
		node.font = jsonNode.font; //字体
		node.fontColor = jsonNode.fontColor; //文本颜色
		node.setImage(imgUrl + jsonNode.nodeImg, false); //设置图片
		node.textPosition = jsonNode.textPosition; //文本定位
		node.borderColor = jsonNode.borderColor; //边框颜色
		node.fillColor = jsonNode.fillColor; //填充颜色(保留)
		node.alarmVlaue = jsonNode.alarmVlaue; //告警
		/*锚定*/
		if (jsonNode.dragable == "true") {
			node.dragable = true;
		} else {
			node.dragable = false;
		}
		/*关联设备属性*/
		node.ip = jsonNode.ip;
		node.info = jsonNode.info;
		node.geographic = jsonNode.geographic;
		node.firm = jsonNode.firm;
		node.agent = jsonNode.agent;
		node.port = jsonNode.port;
		node.userName = jsonNode.userName;
		node.passWord = jsonNode.passWord;
		return node;
	},
	newContainer: function(jsonContainer) {
		var container = new JTopo.Container();
		container.topoId = jsonContainer.topoId;
		container.id = jsonContainer.id;
		container.setLocation(parseInt(jsonContainer.x), parseInt(jsonContainer.y));
		container.textOffsetY = parseFloat(jsonContainer.textOffsetY);
		container.textOffsetX = parseFloat(jsonContainer.textOffsetX);
		container.zIndex = parseInt(jsonContainer.zIndex);
		container.borderWidth = parseInt(jsonContainer.borderWidth);
		container.borderRadius = parseInt(jsonContainer.borderRadius); //边框圆角
		container.alpha = parseFloat(jsonContainer.alpha); //透明度
		container.text = jsonContainer.text;
		container.font = jsonContainer.font;
		container.fontColor = jsonContainer.fontColor;
		container.borderColor = jsonContainer.borderColor;
		container.fillColor = jsonContainer.fillColor;
		container.textPosition = jsonContainer.textPosition;
		container.childNodes = jsonContainer.childs; //子集
		if (jsonContainer.dragable == "true") {
			container.dragable = true;
		} else {
			container.dragable = false;
		}
		return container;
	},
	newLink: function(fromNode, toNode, jsonLink) {
		if (jsonLink.nodeType == "link") {
			var line;
			if (jsonLink.linkClass == "直线") {
				line = new JTopo.Link(fromNode, toNode);
			} else if (jsonLink.linkClass == "虚直线") {
				line = new JTopo.Link(fromNode, toNode);
				line.dashedPattern = jsonLink.dashedPattern;
			} else if (jsonLink.linkClass == "直线带箭头") {
				line = new JTopo.Link(fromNode, toNode);
				line.arrowsRadius = jsonLink.arrowsRadius;
			} else if (jsonLink.linkClass == "虚直线箭头") {
				line = new JTopo.Link(fromNode, toNode);
				line.dashedPattern = jsonLink.dashedPattern;
				line.arrowsRadius = jsonLink.arrowsRadius;
			} else if (jsonLink.linkClass == "折线") {
				line = new JTopo.FoldLink(fromNode, toNode);
			} else if (jsonLink.linkClass == "虚折线") {
				line = new JTopo.FoldLink(fromNode, toNode);
				line.dashedPattern = jsonLink.dashedPattern;
			} else if (jsonLink.linkClass == "折线带箭头") {
				line = new JTopo.FoldLink(fromNode, toNode);
				line.arrowsRadius = jsonLink.arrowsRadius;
			} else if (jsonLink.linkClass == "虚折线箭头") {
				line = new JTopo.FoldLink(fromNode, toNode);
				line.dashedPattern = jsonLink.dashedPattern;
				line.arrowsRadius = jsonLink.arrowsRadius;
			} else if (jsonLink.linkClass == "二次折线") {
				line = new JTopo.FlexionalLink(fromNode, toNode);
			} else if (jsonLink.linkClass == "虚二次折线") {
				line = new JTopo.FlexionalLink(fromNode, toNode);
				line.dashedPattern = jsonLink.dashedPattern;
			} else if (jsonLink.linkClass == "二次折线带箭头") {
				line = new JTopo.FlexionalLink(fromNode, toNode);
				line.arrowsRadius = jsonLink.arrowsRadius;
			} else if (jsonLink.linkClass == "虚二次折线箭头") {
				line = new JTopo.FlexionalLink(fromNode, toNode);
				line.dashedPattern = jsonLink.dashedPattern;
				line.arrowsRadius = jsonLink.arrowsRadius;
			} else if (jsonLink.linkClass == "曲线") {
				line = new JTopo.CurveLink(fromNode, toNode);
				line.dashedPattern = jsonLink.dashedPattern;
				line.arrowsRadius = jsonLink.arrowsRadius;
			}
			line.bundleOffset = parseFloat(jsonLink.bundleOffset);
			line.zIndex = parseFloat(jsonLink.zIndex);
			line.lineWidth = parseFloat(jsonLink.lineWidth);
			line.bundleGap = parseFloat(jsonLink.bundleGap);
			line.offsetGap = parseFloat(jsonLink.offsetGap);
			line.textOffsetY = parseFloat(jsonLink.textOffsetY);
			line.textOffsetX = parseFloat(jsonLink.textOffsetX);
			line.alpha = parseFloat(jsonLink.alpha);
			line.font = jsonLink.font;
			line.text = jsonLink.text;
			line.fontColor = jsonLink.fontColor;
			line.linkClass = jsonLink.linkClass;
			line.strokeColor = jsonLink.strokeColor;
			line.alarmValue = jsonLink.alarmValue;
			line.fromNodeMapId = jsonLink.fromNodeName;
			line.fromNodeIp = jsonLink.fromNodeIp;
			line.toNodeMapId = jsonLink.toNodeName;
			line.toNodeIp = jsonLink.toNodeIp;
			/*关联设备属性*/
			line.ip = jsonLink.ip;
			line.info = jsonLink.info;
			line.geographic = jsonLink.geographic;
			line.firm = jsonLink.firm;
			line.agent = jsonLink.agent;
			line.port = jsonLink.port;
			line.userName = jsonLink.userName;
			line.passWord = jsonLink.passWord;
			return line;
		}
	}
};

/**@method	runPrefixMethod
 * @param  	舞台，method
 * @this 	全屏功能
 */
var runPrefixMethod = function(element, method) {
	var usablePrefixMethod;
	["webkit", "moz", "ms", "o", ""].forEach(function(prefix) {
		if (usablePrefixMethod)
			return;
		if (prefix === "") {
			// 无前缀，方法首字母小写
			method = method.slice(0, 1).toLowerCase() + method.slice(1);
		}
		var typePrefixMethod = typeof element[prefix + method];
		if (typePrefixMethod + "" !== "undefined") {
			if (typePrefixMethod === "function") {
				usablePrefixMethod = element[prefix + method]();
			} else {
				usablePrefixMethod = element[prefix + method];
			}
		}
	});
	return usablePrefixMethod;
}

/**@method 	showJTopoToobar
 * @param 	舞台，画布，canvas
 * @this 	拓扑功能栏
 */
function showJTopoToobar(stage, scene, canvasId) {
	$(".jtopo_toolbar").remove();
	var toobarDiv = $('<div class="jtopo_toolbar">').html('' 
	+ '<div id="r0" class="modeRadio" title="取消任务" name="normal"></div>' 
	+ '<div id="r1" class="modeRadio" title="框选模式" name="select"></div>' 
	+ '<div id="r2" class="modeRadio" title="编辑模式" name="edit"></div>' 
	+ '<div id="r3" class="modeRadio" title="缩放模式" name="zoom"></div>' 
	+ '<div id="r4" class="modeRadio" title="居中对齐" name="centent"></div>' 
	+ '<div id="showModel" title="模型库"></div>' 
	+ '<div id="showFunc" title="更多"></div>');
	$("#" + canvasId).before(toobarDiv);
	$("#showModel").hide().on("click", function() {
		var modelD = $("#modelDialog");
		if (modelD.is(':hidden')) {
			modelD.animate({
				"height": "80%",
				"opacity": 1,
				"top": "10%"
			}, 1000).show();
		} else {
			modelD.animate({
				"height": 0,
				"opacity": 0.1,
				"top": "10%"
			}, 1000, function() {
				$(this).hide();
			});
		}
	});
	$("#showFunc").hide().on("click", function() {
		var operateD = $("#operateDialog");
		if (operateD.is(':hidden')) {
			operateD.animate({
				"height": "80%",
				"opacity": 1,
				"top": "10%"
			}, 1000).show();
		} else {
			operateD.animate({
				"height": 0,
				"opacity": 0.1,
				"top": "10%"
			}, 1000, function() {
				$(this).hide();
			});
		}
	});

	$(".jtopo_toolbar .modeRadio").on("click", function() {
		stage.wheelZoom = null;
		if ($(this).attr("name") == "zoom") {
			stage.wheelZoom = 0.8;
		}else if($(this).attr("name")=="centent"){
			stage.centerAndZoom();
		}else{
			stage.mode = $(this).attr("name");
		}
	});

}