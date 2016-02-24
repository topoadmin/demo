var scene, stage;
var line = null; //线条存放变量
var fNode = null; //开始节点存放变量
var currentNode = null; // 当前右击节点容器
var tempNode = new JTopo.Node('temp'); //建立一个节点
tempNode.setSize(1, 1); //线条连接鼠标附带移动节点

function addModel(data) {
	$("#modelDialog").remove();
	var modelDialog = $("<div id='modelDialog' style='height:0px;'></div>").hide().html("" + "<div id='modelDialogTitle'>模型库</div>" + "<div id='modelDialogClose'>X&nbsp;</div>" + "<div id='modelDiv'></div>");
	$("body").append(modelDialog);
	var modelD = $("#modelDialog");
	//添加拖动事件
	dragDom("modelDialogTitle", "modelDialog");
	//绑定关闭事件
	$("#modelDialogClose").on("click", function() {
		modelD.animate({
			"height": 0,
			"opacity": 0.1,
			"top": "10%"
		}, 1000, function() {
			$(this).hide();
		});
	});

	var surplusHeight = $("#modelDialog").height() - $("#modelDialogTitle").height();
	var modelDiv = $("#modelDiv");
	modelDiv.css({
		"height": surplusHeight,
		"margin-top": $("#modelDialogTitle").height()
	})

	modelDiv.html("");
	for (var i = 0; i < data.length; i++) {
		var iconTitle = $("<div class='iconTitle'><div class='title'>" + data[i].title + "</div>" +
			"<div class='img'></div></div>");
		var iconConten = $("<div class='iconConten' title='" + data[i].title + "'></div>")
		if (data[i].icon) {
			for (var j = 0; j < data[i].icon.length; j++) {
				var icon = $("<div class='icon' ></div>");
				icon.css({
					"width": "60px",
					"height": "60px",
					"cursor": "move",
					"background-image": "url(image/nodeImg/" + data[i].icon[j].modelImg + ")",
					"background-size": "100% 100%",
					"float": "left"
				});
				icon.attr({
					"title": "" + data[i].icon[j].title + "",
					"name": "" + data[i].icon[j].modelImg + "",
					"id": "drag_node_" + j + ""
				});
				iconConten.append(icon);
			}
		}
		modelDiv.append(iconTitle, iconConten);
	}
	var iconTitle = $(".iconTitle");
	iconTitle.on("click", function() {
		var title = $(this).find(".title").html();
		$(".iconConten").fadeOut(500);
		$(".iconConten[title='" + title + "']").fadeIn(500);
	});
	//默认第一个分类点击
	iconTitle.first().click();
	//绑定模型拖动事件
	$(".icon").bind("mousedown", function(e) {
		var dragNode = $(this);
		var nodeTitleImg = dragNode.attr("name"); //获取拖动模型的name
		var cloneDiv = dragNode.clone(true) //克隆一个模型,并带有事件
		$("body").append(cloneDiv);
		cloneDiv.hide();

		$(document).mousemove(function(e) {
			cloneDiv.show();
			cloneDiv.css({
				"z-index": 100,
				"position": "absolute",
				"left": e.clientX - (cloneDiv.width() / 2),
				"top": e.clientY - (cloneDiv.height() / 2)
			});
		});
		$(document).mouseup(function(e) {
			cloneDiv.show();
			$(document).unbind('mousemove');
			$(document).unbind('mouseup');
			if (cloneDiv.attr("title") == "业务系统") {
				var navHeight = $("#nav").height();
				var container = new JTopo.Container();
				container.setLocation(parseInt(cloneDiv.position().left), parseInt(cloneDiv.position().top - navHeight));
				container.zIndex = 11;
				container.borderWidth = 5;
				container.textOffsetY = 0;
				container.textOffsetX = 0;
				container.borderRadius = 0;
				container.alpha = 1;
				container.text = cloneDiv.attr("title"); //名称
				container.font = '18px Microsoft YaHei';
				container.fontColor = '255,255,255';
				container.fillColor = '10,10,100';
				container.borderColor = '255,0,0';
				container.textPosition = 'Bottom_Center';
				container.dragable = true;
				container.childNodes = "";
				scene.add(container);
				cloneDiv.remove();
				for (var i = 0; i < 2; i++) {
					var node = new JTopo.Node();
					node.title = "拉抻节点";
					node.textPosition = "Middle_Center";
					node.setBound(container.x + i * 200, container.y + i * 200, 10, 10);
					node.zIndex = 13;
					scene.add(node);
					container.add(node);
				}
			} else {
				var nodeWidth = cloneDiv.width();
				var nodeHeight = cloneDiv.height();
				var navHeight = $("#nav").height();
				var node = new JTopo.Node();
				node.setBound(cloneDiv.position().left, cloneDiv.position().top - navHeight, nodeWidth, nodeHeight);
				node.zIndex = 13;
				node.borderWidth = 0;
				node.borderRadius = 30;
				node.textOffsetY = 0;
				node.textOffsetX = 0;
				node.alpha = 1;
				node.text = cloneDiv.attr("title");
				node.font = "18px Microsoft YaHei";
				node.fontColor = '255,255,255';
				node.setImage("image/nodeImg/" + nodeTitleImg);
				node.dragable = true;
				node.textPosition = 'Bottom_Center';
				node.borderColor = '255,0,0';
				node.fillColor = '0,255,0';
				node.alarmValue = "";
				node.ip = "";
				node.geographic = "";
				node.firm = "";
				node.agent = "是";
				node.port = "";
				node.userName = "";
				node.passWord = "";
				node.info = "";
				scene.add(node);
				cloneDiv.remove();
				var k = scene.childs; //获取画布上所有节点，包括线条 k[];
				for (var i = k.length - 1; i >= 0; i--) {
					var containerNode = k[i];
					if (containerNode.elementType == 'container') {
						//判断节点的位置是不是在容器的上方，是则加入容器
						if (node.x > containerNode.x && node.x < containerNode.x + containerNode.width && node.y > containerNode.y && node.y < containerNode.y + containerNode.height) {
							containerNode.add(node);
							node.containerText = containerNode.text;
						}
					}
				}
			}
			initRightButton();
		});
	});
}

/**@method 	openLink
 * @param 	线条类型，线条类型的虚实
 * @this 	绘制线条
 */
function openLink(linkName, linkValue) {
	line = null;
	scene.removeEventListener('mouseup');
	scene.removeEventListener('mousedown');
	scene.removeEventListener('mousemove'); /*清除画布监听*/
	scene.mouseup(function(e) { //绑定鼠标松开事件
		if (e.button == 2) { //判断是不是右击
			fNode = null; // 初始化节点
			if (line) {
				scene.remove(line);
				line = null;
			}
		}
		var k = scene.childs; //获取画布中全部节点
		var kLength = k.length;
		if (e.target != null && e.target instanceof JTopo.Node) { // 判断点击的是否是节点
			if (fNode) { // 判断点击的节点是否存在
				if (line) { // 判断线条是否存在
					if (e.target.info == "背景" || e.target.text == undefined || e.target.text == "undefined") { // 判断点击的节点类型
						scene.remove(line); //清除线条
						line = null;
					} else {
						line.nodeZ = e.target; //落点节点为线条的toNode
						line = null;
					}
				}
				fNode = null;
			} else { // 开始判断线条类型
				fNode = e.target;
				if (fNode.info == "背景") {
					//落点为背景，不响应连线
				} else {
					tempNode.setLocation(e.x, e.y); //临时节点跟随鼠标拖动
					if (linkName == "link" || linkValue == "直线") {
						line = new JTopo.Link(fNode, tempNode);
						line.offsetGap = 0; // 拐点宽
						line.arrowsRadius = 0;
						line.bundleOffset = 0;
						line.dashedPattern = null;
						if (linkValue == "虚直线") {
							line.dashedPattern = 10;
						} else if (linkValue == "直线带箭头") {
							line.arrowsRadius = 15;
						} else if (linkValue == "虚直线箭头") {
							line.dashedPattern = 10;
							line.arrowsRadius = 15;
						}
						line.bundleOffset = 20;
					} else if (linkName == "foldLink" || linkValue == "折线") {
						line = new JTopo.FoldLink(fNode, tempNode);
						line.offsetGap = 0; // 拐点宽
						line.arrowsRadius = 0;
						line.bundleOffset = 0;
						line.dashedPattern = null;
						if (linkValue == "虚折线") {
							line.dashedPattern = 10;
						} else if (linkValue == "折线带箭头") {
							line.arrowsRadius = 15;
						} else if (linkValue == "虚折线箭头") {
							line.dashedPattern = 10;
							line.arrowsRadius = 15;
						}
						line.bundleOffset = 20;
					} else if (linkName == "flexionalLink" || linkValue == "二次折线") {
						line = new JTopo.FlexionalLink(fNode, tempNode);
						line.offsetGap = 0; // 拐点宽
						line.arrowsRadius = 0;
						line.bundleOffset = 0;
						line.dashedPattern = null;
						if (linkValue == "虚二次折线") {
							line.dashedPattern = 10;
						} else if (linkValue == "二次折线带箭头") {
							line.arrowsRadius = 15;
						} else if (linkValue == "虚二次折线箭头") {
							line.dashedPattern = 10;
							line.arrowsRadius = 15;
						}
						line.offsetGap = 40; // 拐点宽
					} else if (linkName == "stopLink") {
						fNode = null;
						scene.removeEventListener('mouseup');
						scene.removeEventListener('mousedown');
						scene.removeEventListener('mousemove');
						return;
					}
					line.zIndex = 12;
					line.lineWidth = 3; // 线宽
					line.bundleGap = 0; //间隔
					line.textOffsetY = 0;
					line.textOffsetX = 0;
					line.alpha = 1;
					line.font = "18px Microsoft YaHei";
					line.text = "未定义";
					line.fontColor = '255,255,255';
					line.linkClass = linkValue;
					line.strokeColor = JTopo.util.randomColor(); // 线条颜色随机
					line.alarmValue = "";
					/*关联属性*/
					line.ip = "0";
					line.geographic = "";
					line.firm = "";
					line.info = "";
					line.agent = "是";
					line.port = "";
					line.userName = "";
					line.passWord = "";
					scene.add(line);
					initRightButton();
				}
			}
		} else {
			fNode = null;
			if (line) {
				scene.remove(line);
			}
			line = null;
		}
	});
	scene.mousemove(function(e) {
		tempNode.setLocation(e.x, e.y);
	});
}

/**@method 	addJtopoMenu
 * @param
 * @this 	添加拓扑操作框
 */
function addJtopoMenu() {
	$("#operateDialog").remove();
	var operateDialog = $("<div id='operateDialog' style='height:0px;'></div>").hide().html("" + "<div id='operateDialogTitle'>拓扑操作</div>" + "<div id='operateDialogClose'>X&nbsp;</div>" + "<div id='operateDiv'></div>");
	$("body").append(operateDialog);

	$("#operateDialogClose").on("click", function() {
		$("#operateDialog").animate({
			"height": 0,
			"opacity": 0.1,
			"top": "10%"
		}, 1000, function() {
			$(this).hide();
		});
	});
	dragDom("operateDialogTitle", "operateDialog");
	var operateDiv = $("#operateDiv").html('' + '<label>业务系统：<select id="getBsName"><option>网银系统</option></select></label></br>' + '<label>拓扑名称：<input type="text" name="topoName" id="topoName"/></label></br>' + '<div class="straight"><div class="straightLine" title="直线" name="link"></div>' + '<div class="straightLineArrow" title="虚直线" name="link"></div>' + '<div class="virtualStraightLine" title="直线带箭头" name="link"></div>' + '<div class="virtualStraightLineArrow" title="虚直线箭头" name="link"></div></div>' + '<div class="broken"><div class="brokenLine" title="折线" name="foldLink"></div>' + '<div class="brokenLineArrow" title="虚折线" name="foldLink"></div>' + '<div class="virtualBrokenLine" title="折线带箭头" name="foldLink"></div>' + '<div class="virtualBrokenLineArrow" title="虚折线箭头" name="foldLink"></div></div>' + '<div class="twoBroken"><div class="twoBrokenLine" title="二次折线" name="flexionalLink"></div>' + '<div class="twoBrokenLineArrow" title="虚二次折线" name="flexionalLink"></div>' + '<div class="virtualTwoBrokenLine" title="二次折线带箭头" name="flexionalLink"></div>' + '<div class="virtualTwoBrokenLineArrow" title="虚二次折线箭头" name="flexionalLink"></div></div>' + '<div title="停止连线" id="stopLink" class="stopLink" name="stopLink" ></div><br />' + '<div id="savaDragTopo" title="保存" ></div>' + '<div id="clear" title="清除全部" ></div>');
	//      +'<div id="goIndex" title="前往首页" ></div>');

	$("#operateDiv").find("div").on("click", function(event) {
		var name = $(this).attr("name");
		var title = $(this).attr("title");
		if (name == "link" || name == "foldLink" || name == "flexionalLink") {
			openLink(name, title);
			if ($(this).width() < 51) {
				$("#operateDiv").find("div").removeClass("opms");
				$(this).addClass("opms");
				$("#stopLink").removeClass("stopLink").addClass("opmsStop");
			}
		} else if (title == "停止连线") {
			$("#operateDiv").find("div").removeClass("opms");
			$("#stopLink").removeClass("opmsStop").addClass("stopLink");
			fNode = null;
			scene.removeEventListener('mouseup');
			scene.removeEventListener('mousedown');
			scene.removeEventListener('mousemove');
		} else if (title == "保存") {
			serializeJson(title);
		} else if (title == "清除全部") {
			$("#stopLink").click();
			if ($("#showFunc").is(':hidden')) {
				alert("错误信息！");
			} else {
				scene.clear();
			}
		}
	})
}

/**@method	serializeJson
 * @param  	method
 * @this 	读取画布中的图片并转换为json数据
 */
function serializeJson(method) {
	var size = 0;
	var k = scene.childs; //获取画布上所有可见节点，包括线条 k[];
	if (k.length == 0) {
		$("#stopLink").click();
		$("#dialog,#full").remove();
		alert("没有节点！");
		return false;
	}
	sb = "{";
	if ($("#operateTopo input[name=bsName]").val() == "") {
		alert("业务系统名称未设置！");
		return false;
	}
	/*if($("#topoName").val()==""){
		alert("拓扑名称未设置！");
		return false;
    }*/
	sb += '"bsName":"' + $("#getBsName").find("option:selected").val() + '",';
	sb += '"topoSceneName":"' + $("#topoName").val() + '",';
	var nodeJson = '"node":[';
	var linkJson = '"link":[';
	var containerJson = '"container":[';
	for (var i = k.length - 1; i >= 0; i--) {
		var node = k[i];
		if (node != undefined) {
			var subNodeImage = "";
			try {
				var nodeImage = node['image'] && node['image']['src']; //获取图片路径
				if (nodeImage != undefined) {
					//截取图片路径image开始往后的路径
					subNodeImage = nodeImage.substr(nodeImage.lastIndexOf("image"), nodeImage.length);
					subNodeImage = subNodeImage.substring(14);
				} else {
					subNodeImage = "";
				}
			} catch (e) {
				subNodeImage = "";
			}
			if (node.elementType == 'node' || node.elementType == 'TextNode') {
				/*if (node.ip == null || node.ip == "") {
            		if(node.title=="拉抻节点"){
            		}else{
            			alert(node.text + "未设定IP");
    					$("#findText").val(node.text);
    					$("#findButton").click();
    					return false;
            		}
				}*/
				if (node.title == "拉抻节点") {
					console.log("拉伸节点不保存" + i);
				} else {
					nodeJson = nodeJson + '{"x":' + node.x + ',"y":' + node.y + ',"width":' + node.width + ',"height":' + node.height + ',"mapId":' + node._id +
						',"zIndex":' + node.zIndex + ',"borderWidth":' + node.borderWidth + ',"borderRadius":' + node.borderRadius +
						',"textOffsetY":' + node.textOffsetY + ',"textOffsetX":' + node.textOffsetX + ',"alpha":' + node.alpha +
						',"nodeType":"' + node.elementType + '","font":"' + node.font + '","text":"' + node.text + '","fontColor":"' + node.fontColor +
						'","nodeImg":"' + subNodeImage + '","dragable":"' + node.dragable + '","textPosition":"' + node.textPosition +
						'","borderColor":"' + node.borderColor + '","fillColor":"' + node.fillColor + '","alarmValue":"' + node.alarmValue +
						'","ip":"' + node.ip + '","geographic":"' + node.geographic + '","firm":"' + node.firm + '","agent":"' + node.agent +
						'","port":"' + node.port + '","userName":"' + node.userName + '","passWord":"' + node.passWord + '","info":"' + node.info + '"}';
					if (i != 0) {
						nodeJson = nodeJson + ",";
					}
				}
			} else if (node.elementType == 'link') {
				if (node.nodeA != null && node.nodeZ != null) {
					linkJson = linkJson + '{"bundleOffset":' + node.bundleOffset + ',"zIndex":' + node.zIndex + ',"lineWidth":' + node.lineWidth +
						',"bundleGap":' + node.bundleGap + ',"offsetGap":' + node.offsetGap + ',"textOffsetY":' + node.textOffsetY +
						',"textOffsetX":' + node.textOffsetX + ',"alpha":' + node.alpha + ',"arrowsRadius":' + node.arrowsRadius +
						',"dashedPattern":' + node.dashedPattern + ',"nodeType":"' + node.elementType + '","font":"' + node.font +
						'","text":"' + node.text + '","fontColor":"' + node.fontColor + '","linkClass":"' + node.linkClass +
						'","strokeColor":"' + node.strokeColor + '","alarmValue":"' + '","fromNodeIp":"' + node.nodeA.ip +
						'","toNodeIp":"' + node.nodeZ.ip + '","fromNodeMapId":"' + node.nodeA._id + '","toNodeMapId":"' + node.nodeZ._id +
						'","ip":"' + node.ip + '","geographic":"' + node.geographic + '","firm":"' + node.firm + '","agent":"' + node.agent +
						'","port":"' + node.port + '","userName":"' + node.userName + '","passWord":"' + node.passWord + '","info":"' + node.info + '"}';
					if (i != 0) {
						linkJson = linkJson + ",";
					}
				}
			} else if (node.elementType == 'container') {
				var childsNode = new Array();
				for (var cn = 0; cn < node.childs.length; cn++) {
					if (node.childs[cn].title == "拉抻节点") {
						console.log("拉伸节点不保存" + cn);
					} else {
						childsNode.push('"' + node.childs[cn]._id + '"');
					}
				}
				containerJson = containerJson + '{"nodeType":"' + node.elementType + '","text":"' + node.text + '","width":"' +
					node.width + '","zIndex":' + node.zIndex + ',"alpha":' + node.alpha +
					',"textPosition":"' + node.textPosition + '","dragable":"' + node.dragable +
					'","textOffsetY":' + node.textOffsetY + ',"font":"' + node.font + '","fontColor":"' + node.fontColor +
					'","fillColor":"' + node.fillColor + '","borderColor":"' + node.borderColor + '","borderWidth":' + node.borderWidth +
					',"x":' + node.x + ',"y":' + node.y + ',"height":' + node.height + ',"layout":"网格布局"' +
					',"borderRadius":' + node.borderRadius + ',"childs":[' + childsNode + ']}';
				if (i != 0) {
					containerJson = containerJson + ",";
				}
			}
		}
	}
	var reg = /,$/gi;
	nodeJson = nodeJson.replace(reg, "");
	linkJson = linkJson.replace(reg, "");
	containerJson = containerJson.replace(reg, "");
	sb = sb + nodeJson + "]," + linkJson + "]," + containerJson + "]}";

	if (method == "修改") {
		//		var saveTopoJson = $("#topoName").attr("data_id")+"/"+$("#topoName").val()+"/"+$("#getBsName").attr("data_id")+"/"+123321+"/"+sb;
	} else { //添加
		console.log(sb);
		$("#stopLink").click();
		//		var saveTopoJson = $("#topoName").val()+"/"+$("#getBsName").val()+"/"+123321+"/"+sb;
		var data = eval('(' + sb + ')');
		$.topo.newScene(scene, data);
		$("#showFunc,#showModel").hide();
		$("#modelDialog,#operateDialog").remove();
		initRightButton();
	}
}

/*!
 * handler    			鼠标当前位置显示右击菜单
 * initRightButton    	节点右击事件
 * addDialogFn			右击菜单的设备配置
 * addNodeTextFn		右击菜单改变设备名称文本信息
 * selectColr			创建颜色版
 * colorRgb				16进制颜色转为RGB格式
 * */
/**@method 	handler
 * @param 	鼠标指针
 * @this 	鼠标当前位置显示右击菜单
 */
function handler(event) {
	var ctm = $("#contextmenu");
	if (event.button == 2) {
		$("#stopLink").click();
		var scrollHeight = $(document).height();　　 //获取文档高度
		var overHeight = scrollHeight - (event.pageY + 20); //获取文档高度减去鼠标位置剩余的高度
		ctm.css({
			top: event.pageY - 10,
			left: event.pageX - 10,
			height: overHeight + "px"
		}).show();

		//当右击菜单大于浏览器最大高度时，提高150像素
		if (ctm.height() < 150) {
			ctm.css({
				top: event.pageY - 160,
				left: event.pageX - 10,
				height: overHeight + 150
			});
		}

		ctm.find("li a").show();
		if (currentNode.elementType == "node") {
			ctm.show();
		}
	} else {
		ctm.hide();
	}
	//对齐事件
	$("#XAlign").unbind('click').click(function() {
		var seSize = scene.selectedElements;
		if (currentNode.elementType == "container") {
			for (var i = 0; i < seSize.length; i++) {
				if (seSize[i].childs == undefined) {
					alert("设备不能和业务系统对齐");
				} else {
					seSize[i].childs[0].x = currentNode.childs[0].x;
					seSize[i].childs[1].x = currentNode.childs[1].x;
				}
			}
		} else {
			for (var i = 0; i < seSize.length; i++) {
				if (seSize[i].childs) {
					alert("设备不能和业务系统对齐");
				} else {
					seSize[i].x = currentNode.x;
				}
			}
		}
		scene.removeAllEventListener();
		return false;
	});
	$("#YAlign").unbind('click').click(function() {
		var seSize = scene.selectedElements;
		if (currentNode.elementType == "container") {
			for (var i = 0; i < seSize.length; i++) {
				if (seSize[i].childs == undefined) {
					alert("设备不能和业务系统对齐");
				} else {
					seSize[i].childs[0].y = currentNode.childs[0].y;
					seSize[i].childs[1].y = currentNode.childs[1].y;
				}
			}
		} else {
			for (var i = 0; i < seSize.length; i++) {
				if (seSize[i].childs) {
					alert("设备不能和业务系统对齐");
				} else {
					seSize[i].y = currentNode.y;
				}
			}
		}
		scene.removeAllEventListener();
		return false;
	});

	ctm.find("a").unbind('click').on("click", function() {
		var text = $(this).text();
		if (text == '设备配置') {
			alert("demo不开放此功能");
			//      	addDialogFn(currentNode);
		} else if (text == '删除节点') {
			scene.remove(currentNode);
			currentNode = null;
			ctm.hide();
		} else if (text == '顺时针旋转') {
			currentNode.rotate += 0.5;
		} else if (text == '逆时针旋转') {
			currentNode.rotate -= 0.5;
		} else if (text == '锚定') {
			currentNode.dragable = false;
		} else if (text == '放开') {
			currentNode.dragable = true;
		} else if (text == '样式设置') {
			addNodeTextFn(currentNode);
		} else if (text == '加大') {
			currentNode.lineWidth++;
			return false;
		} else if (text == '缩小') {
			currentNode.lineWidth--;
			return false;
		} else if (text == '拐角加大') {
			currentNode.offsetGap += 10;
			return false;
		} else if (text == '拐角缩小') {
			currentNode.offsetGap -= 10;
			return false;
		} else if (text == '性能概览') {
			location.href = "alarm.html?ip=" + currentNode.ip;
		}
		ctm.hide();
	});

	ctm.unbind('click').on("click", function() {
		ctm.hide();
		return false;
	});

	scene.click(function(event) {
		if (event.button == 0) { // 左击
			ctm.hide();
			$('#picker').hide();
		}
	});
}

/**@method 	initRightButton
 * @this 	节点右击事件
 */
function initRightButton() {
	/*遍历节点，绑定事件*/
	var nodeSize = scene.getDisplayedElements();
	for (var i = 0; i < nodeSize.length; i++) {
		var node = nodeSize[i];
		if (node != undefined) {
			node.addEventListener('mouseup', function(event) {
				currentNode = this;
				handler(event);
			});
			node.addEventListener('mousedrag', function(event) {});
		}
	}
}

/**@method 	addDialogFn
 * @param 	当前节点容器
 * @this 	右击菜单的设备配置
 */
function addDialogFn(currentNode) {
	$("#contextmenu").hide();
	$("#fullTwo,#dialogTwo").remove();
	var fullDiv = $('<div id="fullTwo"></div>');
	var dialogDiv = $('<div id="dialogTwo"></div>');
	var topDiv = ("<div id='dialog_top_title' class='dialog_top_title'>设备配置</div>");
	topDiv += ("<div id='closeDialogTwo'>X&nbsp;</div>");
	if (currentNode.elementType == 'container') {
		var nodeName = ("<label>主&nbsp;机&nbsp;名&nbsp;:<input type='text' value='" + currentNode.text + "' id='nodeName'/></label></br>");
	} else {
		var nodeName = ("<label>主&nbsp;机&nbsp;名&nbsp;:<input type='text' value='" + currentNode.text + "' id='nodeName' /></label></br>");
		nodeName += ("<label>设&nbsp;备&nbsp;I&nbsp;P:<select id='nodeIp'></select></label></br>");
		nodeName += ("<label>设备信息:<input type='text' value='" + currentNode.info + "' id='nodeInfo' readonly='readonly'/></label></br>");
		nodeName += ("<label>地理位置:<input type='text' value='" + currentNode.geographic + "' id='nodeGeographic' readonly='readonly'/></label></br>");
		nodeName += ("<label>厂&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;商:<input type='text' value='" + currentNode.firm + "' id='nodeFirm' readonly='readonly'/></label></br>");
		nodeName += ("<label>代理端口:<input type='text' value='" + currentNode.port + "' id='nodePort' readonly='readonly'/></label></br>");
		nodeName += ("<label>代理用户:<input type='text' value='" + currentNode.userName + "' id='nodeUserName' readonly='readonly'/></label></br>");
		nodeName += ("<label>代理密码:<input type='text' value='" + currentNode.passWord + "' id='nodePassWord' readonly='readonly'/></label></br>");
	}

	nodeName += ("<input type='button' value='确定' id='confirmTwo'/><input type='button' value='取消' id='cancelTwo'/>");
	dialogDiv.append(topDiv, nodeName);
	$("body").append(fullDiv, dialogDiv);

	$("#confirmTwo").on('click', function() {
		currentNode.text = $("#nodeName").val();
		currentNode.ip = $("#nodeIp").find("option:selected").val();
		currentNode.info = $("#nodeInfo").val();
		currentNode.geographic = $("#nodeGeographic").val();
		currentNode.firm = $("#nodeFirm").val();
		//currentNode.agent=$('input[name="nodeAgent"]:checked').val();
		currentNode.port = $("#nodePort").val();
		currentNode.userName = $("#nodeUserName").val();
		currentNode.passWord = $("#nodePassWord").val();
		$("#fullTwo,#dialogTwo,#pickerTwo").remove();
		$("#contextmenu").hide();
	});

	// 判断节点是否存在IP
	if (currentNode.ip == "") {
		getDeviceIpAjax(currentNode);
		$("#nodeName").val(currentNode.text);
		$("#nodeIp").val(currentNode.ip);
		$("#nodeInfo").val(currentNode.info);
		$("#nodeGeographic").val(currentNode.geographic);
		$("#nodeFirm").val(currentNode.firm);
		$("#nodePort").val(currentNode.port);
		$("#nodeUserName").val(currentNode.userName);
		$("#nodePassWord").val(currentNode.passWord);
	} else {
		getDeviceIpAjax(currentNode);
	}

	$("#cancelTwo").on('click', function() {
		$("#fullTwo,#dialogTwo,#pickerTwo").remove();
		$("#contextmenu").hide();
	});

	$("#closeDialogTwo").on("click", function() {
		$("#fullTwo,#dialogTwo,#pickerTwo").remove();
		$("#contextmenu").hide();
	});
	dragDom("dialog_top_title", "dialogTwo");
}

/**@method 	addNodeTextFn
 * @param 	当前节点容器
 * @this 	右击菜单改变设备名称文本信息
 */
function addNodeTextFn(currentNode) {
	$("#contextmenu").hide();
	$("#fullThree,#dialogThree").remove();

	var ps = ['下面居中', '上面居中', '右上偏移', '左中偏移', '居中显示', '右中偏移', '左下偏移', '左上偏移', '右下偏移'];
	var fontSize = ['70', '65', '60', '52', '46', '40', '36', '32', '28', '24', '22', '20', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0'];
	var fullDiv = $('<div id="fullThree"></div>');
	var dialogDiv = $('<div id="dialogThree"></div>');
	var topDiv = ("<div id='dialog_top_title_three' class='dialog_top_title'>文本配置</div>");
	topDiv += ("<div id='closeDialogThree'>X&nbsp;</div>");
	var nodeTextSpan = ("<span>&nbsp;文本位置：</span>");
	var nodeTextSelect = $("<select id='nodeTextPs'></select></br>"); // 节点位置选择栏
	for (var i = 0; i < ps.length; i++) {
		var nodeTextOption = ("<option>" + ps[i] + "</option>");
		nodeTextSelect.append(nodeTextOption);
	}
	var confirmText = ("<label class='textLabel'>&nbsp;程序位置：</label><input type='text' id='textPosition' disabled='disabled' value='" + currentNode.textPosition + "'/></br>");

	var fontOffsetInput = ("<label>&nbsp;文本偏移：<input type='text' id='fontOffset' value='" + currentNode.textOffsetY + "'/></label></br>");
	fontOffsetInput += ("<label>&nbsp;字体颜色：<input type='text' id='fontColor' value='" + currentNode.fontColor + "'/></label></br>");
	fontOffsetInput += ("<label>&nbsp;背景颜色：<input type='text' id='backColor' value='" + currentNode.fillColor + "'/></label></br>");
	fontOffsetInput += ("<label>&nbsp;边框颜色：<input type='text' id='borderColor' value='" + currentNode.borderColor + "'/></label></br>");

	var borderSizeText = ("<span>&nbsp;边框大小：</span>");
	var bdSizeSelect = $("<select id='bdSizeSlc'></select></br>"); // 节点位置选择栏
	for (var i = 0; i < fontSize.length; i++) {
		var bdSizeOption = ("<option>" + fontSize[i] + "</option>");
		bdSizeSelect.append(bdSizeOption);
	}

	var fontSizeText = ("<span>&nbsp;文本大小：</span>");
	var fontSizeSelect = $("<select id='fontSizeSlc'></select></br>"); // 节点位置选择栏
	for (var i = 0; i < fontSize.length; i++) {
		var fontSizeOption = ("<option>" + fontSize[i] + "</option>");
		fontSizeSelect.append(fontSizeOption);
	}
	var confirmT = ("<input type='button' value='确定' id='confirmThree'/><input type='button' value='取消' id='cancelThree'/>");
	dialogDiv.append(topDiv, nodeTextSpan, nodeTextSelect, confirmText, fontSizeText, fontSizeSelect, fontOffsetInput, borderSizeText, bdSizeSelect, confirmT);
	$("body").append(fullDiv, dialogDiv);

	selectColr("backColor");
	selectColr("fontColor");
	selectColr("borderColor");

	switch (currentNode.textPosition) {
		case "Top_Left":
			$("#nodeTextPs").val("左上偏移");
			break;
		case "Top_Center":
			$("#nodeTextPs").val("上面居中");
			break;
		case "Top_Right":
			$("#nodeTextPs").val("右上偏移");
			break;
		case "Middle_Left":
			$("#nodeTextPs").val("左中偏移");
			break;
		case "Middle_Center":
			$("#nodeTextPs").val("居中显示");
			break;
		case "Middle_Right":
			$("#nodeTextPs").val("右中偏移");
			break;
		case "Bottom_Left":
			$("#nodeTextPs").val("左下偏移");
			break;
		case "Bottom_Center":
			$("#nodeTextPs").val("下面居中");
			break;
		case "Bottom_Right":
			$("#nodeTextPs").val("右下偏移");
			break;
	}
	var fontSize = currentNode.font.substr(0, 2);
	$("#fontSizeSlc").val(fontSize);
	$("#bdSizeSlc").val(currentNode.borderWidth);

	//点击确定
	$("#confirmThree").on('click', function() {
		currentNode.font = $("#fontSizeSlc").val() + "px Microsoft YaHei";
		currentNode.textPosition = $("#textPosition").val();
		currentNode.textOffsetY = parseInt($("#fontOffset").val());
		currentNode.fontColor = $("#fontColor").val();
		currentNode.fillColor = $("#backColor").val();
		currentNode.borderWidth = parseInt($("#bdSizeSlc").val());
		if (currentNode.elementType == "link") {
			currentNode.strokeColor = $("#borderColor").val();
		} else {
			currentNode.borderColor = $("#borderColor").val();
		}
		$("#fullThree,#dialogThree,#pickerTwo").remove();
		$("#contextmenu").hide();
	});
	$("#cancelThree").on('click', function() {
		$("#fullThree,#dialogThree").remove();
		$("#contextmenu").hide();
	});

	$("#closeDialogThree").on("click", function() {
		$("#fullThree,#dialogThree").remove();
		$("#contextmenu").hide();
	});
	$("#nodeTextPs").on("change", function() {
		var nodeTextPs = $(this).val();
		switch (nodeTextPs) {
			case "左上偏移":
				$("#textPosition").val("Top_Left");
				break;
			case "上面居中":
				$("#textPosition").val("Top_Center");
				break;
			case "右上偏移":
				$("#textPosition").val("Top_Right");
				break;
			case "左中偏移":
				$("#textPosition").val("Middle_Left");
				break;
			case "居中显示":
				$("#textPosition").val("Middle_Center");
				break;
			case "右中偏移":
				$("#textPosition").val("Middle_Right");
				break;
			case "左下偏移":
				$("#textPosition").val("Bottom_Left");
				break;
			case "下面居中":
				$("#textPosition").val("Bottom_Center");
				break;
			case "右下偏移":
				$("#textPosition").val("Bottom_Right");
				break;
		}
	});
	dragDom("dialog_top_title_three", "dialogThree");
}

/**@method 	bsNameSelectShow
 * @param 	目标ID
 * @this 	创建颜色版
 */
function selectColr(targetId) {
	$("#" + targetId).unbind('click').on("click", function() {
		var pickerDiv = $("<div id='pickerTwo'><div>");
		$("body").append(pickerDiv);
		$('#pickerTwo').farbtastic('#' + targetId);
		if ($('#pickerTwo').is(':hidden')) {
			var pickerWidth = $('#pickerTwo').width();
			var pickerHeight = $('#pickerTwo').height();
			$('#pickerTwo').css({
				top: $(this).offset().top - pickerHeight,
				left: $(this).offset().left
			}).show();
		} else {
			var sHex = $("#" + targetId).val();
			var sRgbColor = sHex.colorRgb();
			$("#" + targetId).val(sRgbColor);
			$('#pickerTwo').remove();
		}
		$("#pickerTwo").on("mouseleave", function() {
			var sHex = $("#" + targetId).val();
			var sRgbColor = sHex.colorRgb();
			$("#" + targetId).val(sRgbColor);
			$('#pickerTwo').remove();
		});
		return false;
	});
}

/* 16进制颜色转为RGB格式 */
var topoReg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
String.prototype.colorRgb = function() {
	var sColor = this.toLowerCase();
	if (sColor && topoReg.test(sColor)) {
		if (sColor.length === 4) {
			var sColorNew = "#";
			for (var i = 1; i < 4; i += 1) {
				sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
			}
			sColor = sColorNew;
		}
		// 处理六位的颜色值
		var sColorChange = [];
		for (var i = 1; i < 7; i += 2) {
			sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
		}
		return sColorChange.join(",");
	} else {
		return sColor;
	}
}

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
	var toobarDiv = $('<div class="jtopo_toolbar">').html('' + '<div id="r0" class="modeRadio" title="取消任务" name="normal"></div>' + '<div id="r1" class="modeRadio" title="框选模式" name="select"></div>' + '<div id="r2" class="modeRadio" title="编辑模式" name="edit"></div>' + '<div id="r3" class="modeRadio" title="缩放模式" name="zoom"></div>' + '<div id="r4" class="modeRadio" title="居中对齐" name="centent"></div>' + '<div id="showModel" title="模型库"></div>' + '<div id="showFunc" title="更多"></div>');
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
		} else if ($(this).attr("name") == "centent") {
			stage.centerAndZoom();
		} else {
			stage.mode = $(this).attr("name");
		}
	});

}

function navEvent() {
	$("#navControl").click(function() {
		var nc = $(this);
		var nav = $("#nav");
		if (nav.attr("class") == "navHide") {
			nav.css("display", "block");
			nav.animate({
				height: "70px"
			}, 500, function() {
				autoAdaptation("canvas")
			});
			nav.removeClass("navHide");
			nc.removeClass("navClickHide");
		} else {
			nav.animate({
				height: "0px"
			}, 500, function() {
				nav.css("display", "none");
				autoAdaptation("canvas")
			});
			nav.addClass("navHide");
			nc.addClass("navClickHide");
		}
	});
};

/**@method	autoAdaptation
 * @param  	canvas的ID
 * @this 	适应分辨率
 */
function autoAdaptation(canvasId) {
	var main = $("#main");
	var header = $("header");
	var canvas = document.getElementById(canvasId);
	main.width($(window).width()).height($(window).height() - header.height());
	canvas.width = header.width();
	canvas.height = main.height();
	$("#navControl").css({
		"left": $("#nav").width() / 2
	});
	$(window).resize(function() {
		main.width($(window).width()).height($(window).height() - header.height());
		canvas.width = header.width();
		canvas.height = main.height();
		$("#navControl").css({
			"left": $("#nav").width() / 2
		});
	});
}

/**@method	addTopoNameOption
 * @param  	data
 * @this 	生成导航
 */
(function($) {
	$.fn.addTopoNameOption = function(data) {
		var sel = $('<select id="nav_select"></select>');
		for (var i = 0; i < data.length; i++) {
			var opt = ('<option data_id="' + data[i].id + '">' + data[i].name + '</option>')
			sel.append(opt);
		}
		var updeteDiv = $("<div title='刷新' class='nav_img' id='updeteDiv'></div>");
		var fullDiv = $("<div id='fullMax' class='nav_img' title='全屏'></div>");
		var deployDiv = $("<div id='deploy' class='nav_img' title='设置'></div>")
		$("#nav").html('').append(sel, fullDiv, deployDiv, updeteDiv);

		$("#deploy").on("click", function() {
			topoTableAjax();
		});

		//刷新拓扑图
		$("#updeteDiv").on("click", function() {
			selDom = $("#nav_select").find("option:selected");
			getTopoAjax(selDom, "查询")
		});

		/* 拓扑全屏 */
		$("#fullMax").on("click", function() {
			runPrefixMethod(stage.canvas, "RequestFullScreen")
		});

		/*下拉框选择事件*/
		$("#nav_select").on("change", function() {
			$("#showFunc,#showModel").hide();
			$("#modelDialog,#operateDialog").remove();
			selDom = $("#nav_select").find("option:selected");
			if (scene) {
				getTopoAjax(selDom, "查询")
			}
		});

		//初始化拓扑图
		var selDom = $("#nav_select").find("option:selected");
		getTopoAjax(selDom, "初始化");

	}
})(jQuery);

function addGetDialogFn(data) {
	$("#dialogGet,#fullGet").remove(); //防止缓存
	var fullDiv = $('<div id="fullGet"></div>');
	var dialogDiv = $('<div id="dialogGet"></div>');
	var topDiv = ("<div id='dialogTitleGet' class='dialogTitleGet'>拓扑配置</div>");
	topDiv += ("<div id='closeDialogGet'>X&nbsp;</div>");
	var contenDiv = $("<div id='contenDiv'></div>");
	var topofnDiv = $("<div id='topoFn'></div>");
	var newSaveTopo = $("<div id='newSaveTopo' title='新建'></div>");
	var updeteTopo = $("<div id='updeteTopo' title='刷新'></div>")
	var deleteTopo = $("<div id='deleteTopo' title='删除已选'></div>")
	topofnDiv.append(newSaveTopo, updeteTopo, deleteTopo);
	var buttomTable = newButtomTable(data);
	contenDiv.append(topofnDiv, buttomTable); //添加拓扑配置表格

	dialogDiv.append(topDiv, contenDiv);
	$("body").append(fullDiv, dialogDiv);

	/*拖动改变位置,拖动的ID，改变位置的ID*/
	dragDom("dialogTitleGet", "dialogGet");

	//隔行变色
	$("#buttomTbody table tr:nth-child(odd)").addClass("altow");

	/*关闭会话窗口*/
	$("#closeDialogGet").on("click", function() {
		$("#dialogGet,#fullGet").remove();
	});

	/*新建拓扑图*/
	$("#newSaveTopo").on("click", function() {
		$("#dialogGet,#fullGet").remove();
		scene.clear(); //清理画布

		getModelAjax(); //获取模型库
		addJtopoMenu(); //添加拓扑操作方法
		$("#showModel,#showFunc").show();

	});

	/*刷新表格*/
	$("#updeteTopo").on("click", function() {
		topoTableAjax();
	});

	//删除已选
	$("#deleteTopo").on("click", function() {
		alert("未添加功能!");
	});

	/*拓扑数据操作*/
	$("#buttomTbody table tr td div").on("click", function() {
		if ($(this).attr("title") == "删除") {
			deleteTopoAjax($(this).attr("data_id"));
			$(this).parent().parent('tr').remove();
		} else {
			updeteTopoAjax($(this).attr("data_id"));
		}
	});
}

/**@method	newButtomTable
 * @param 	data
 * @return 	table
 * @this 	拓扑业务系统配置表格
 */
function newButtomTable(data) {
	var butDiv = $("<div id='tableFn'></div>");
	var div = $("<div id='buttomTable'></div>");
	var table = $("<table></table>");
	var tr = $("<tr><td style='min-width:50px;max-width:50px;'><input type='checkbox' id='chk_all'/></td><td style='min-width:220px;max-width:220px;'>名称</td><td style='min-width:220px;max-width:220px;'>操作</td><td style='min-width:18px;'></td></tr>");
	table.append(tr);
	div.append(table)
	var divTwo = $("<div id='buttomTbody'></div>");
	var tableTwo = $("<table></table>");
	for (var i = 0; i < data.length; i++) {
		var tr = $("<tr></tr>");
		var td = ("<td style='min-width:50px;max-width:50px;'><input type='checkbox' name='chk_list'/></td>");
		td += ("<td style='min-width:220px;max-width:220px;' >" + data[i].name + "</td>");
		td += ("<td style='min-width:220px;max-width:220px;'><div data_name='" + data[i].name + "' data_id='" + data[i].id + "' class='tableUpdete'></div><div data_id='" + data[i].id + "' class='tableDetele' title='删除'></div></td>");
		tr.append(td);
		tableTwo.append(tr);
	}
	if (data.length < 12) {
		var max = 12 - data.length;
		for (var j = 0; j < max; j++) {
			var tr = $("<tr></tr>");
			var td = ("<td style='min-width:50px;'></td>");
			td += ("<td style='min-width:220px;' ></td>");
			td += ("<td style='min-width:220px;'></td>");
			tr.append(td);
			tableTwo.append(tr);
		}
	}

	divTwo.append(tableTwo)
	butDiv.append(div, divTwo)
	return butDiv;
}

/**@method	dragDom
 * @param  	拖动div的id,改变位置的id
 * @this 	对话框拖动功能
 */
function dragDom(dragObj, changeObj) {
	var $dragObj = $("#" + dragObj);
	var $changeObj = $("#" + changeObj);
	$dragObj.bind("mousedown", function(e) {
		$changeObj.css({
			'opacity': 0.4,
		});
		$(document).mousemove(function(e) {
			$changeObj.css({
				"left": e.clientX - ($dragObj.width() / 2),
				"top": e.clientY - ($dragObj.height() / 2)
			});
			$("body").css({
				"overflow": "hidden"
			});
		});
		$(document).mouseup(function(e) {
			$changeObj.css({
				'opacity': 1,
			});
			$(document).unbind('mousemove');
			$(document).unbind('mouseup');
		});
	});
}

function topoSelectAjax() {
	$.ajax({
		async: false,
		cache: false,
		type: 'GET',
		dataType: "json",
		url: "js/jsonData/topoSelect.json",
		error: function() {
			alert("拓扑名称查询失败");
		},
		success: function(data) {
			$("#nav").addTopoNameOption(data);
		}
	});
}

function getTopoAjax(dom, method) {
	$.ajax({
		async: false,
		cache: false,
		type: 'GET',
		dataType: "json",
		url: "js/jsonData/topo.json",
		error: function() {
			alert("业务系统查询失败");
		},
		success: function(data) {
			if (method == "查询") {
				$.topo.newScene(scene, data);
			} else if (method == "初始化") {
				$.topo.newCanvas("canvas", data);
			}
			initRightButton();
		}
	});
}

function deleteTopoAjax(data_id) {
	$.ajax({
		async: false,
		cache: false,
		type: 'GET',
		dataType: "json",
		url: "js/jsonData/topoSelect.json",
		error: function() {
			alert("拓扑名称查询失败");
		},
		success: function(data) {
			alert("id为" + data_id + "删除成功");
			initRightButton();
		}
	});
}

function updeteTopoAjax(data_id) {
	$.ajax({
		async: false,
		cache: false,
		type: 'GET',
		dataType: "json",
		url: "js/jsonData/topo.json",
		error: function() {
			alert("拓扑名称查询失败");
		},
		success: function(data) {
			//			alert("id为"+data_id+"需要修改");
			$("#closeDialogGet").click();
			$.topo.newScene(scene, data)
			initRightButton();
		}
	});
}

function topoTableAjax() {
	$.ajax({
		async: false,
		cache: false,
		type: 'GET',
		dataType: "json",
		url: "js/jsonData/topoSelect.json",
		error: function() {
			alert("拓扑名称查询失败");
		},
		success: function(data) {
			addGetDialogFn(data);
		}
	});
}

//获取模型库的Json
function getModelAjax() {
	$.ajax({
		async: false,
		cache: false,
		type: 'GET',
		dataType: "json",
		url: "js/jsonData/model.json",
		error: function() {
			alert("拓扑名称查询失败");
		},
		success: function(data) {
			addModel(data);
		}
	});
}

/**
 * @method getDeviceIpAjax
 * @param
 * @this 读取设备IP列表
 */
function getDeviceIpAjax(currentNode) {
	$.ajax({
		async: true, // 异步
		cache: false,
		type: 'GET',
		dataType: "json",
		//		url : "../../rest/computer/ajax/query/all/1",
		url: "js/jsonData/ipSelect.json",
		error: function() {
			alert("设备IP查询失败");
		}, // error
		success: function(data) {
				console.log(JSON.stringify(data));
				if (data == "null" || data == null) {
					alert("请添加设备!");
					return false;
				} else {
					for (var i = 0; i < data.length; i++) {
						var options = $("<option value='" + data[i].ip + "' data-index='" + i + "'>" + data[i].ip + "</option>")
						$("#nodeIp").append(options);
					}
					//如果当前节点的IP不存在，默认设置为第一个
					if (!currentNode.ip) {
						$("#nodeIp").val(data[0].ip);
						$("#nodeName").val(data[0].host_name);
						$("#nodeInfo").val(data[0].isCollect);
						$("#nodeGeographic").val(data[0].location);
						$("#nodeFirm").val(data[0].id);
						$("#nodePort").val(data[0].patrol_port);
						$("#nodeUserName").val(data[0].patrol_username);
						$("#nodePassWord").val(data[0].patrol_password);
					} else {
						$("#nodeIp").val(currentNode.ip);
					}
					// 获取选择的数据
					$("#nodeIp").on("change", function() {
						var indexJson = $(this).find("option:selected").data("index");
						$("#nodeName").val(data[indexJson].host_name);
						$("#nodeInfo").val(data[indexJson].isCollect);
						$("#nodeGeographic").val(data[indexJson].location);
						$("#nodeFirm").val(data[indexJson].id);
						$("#nodePort").val(data[indexJson].patrol_port);
						$("#nodeUserName").val(data[indexJson].patrol_username);
						$("#nodePassWord").val(data[indexJson].patrol_password);
					})
				}
			} // success
	}); // $.ajax
}