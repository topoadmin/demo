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
				container.setLocation(parseInt(cloneDiv.position().left), parseInt(cloneDiv.position().top-navHeight));
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
			}else{
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
						line.dashedPattern =null;
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
					line.lineWidth = 3; 	// 线宽
					line.bundleGap = 0;	//间隔
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
	var operateDiv = $("#operateDiv").html('' 
	+ '<label>业务系统：<select id="getBsName"><option>网银系统</option></select></label></br>' 
	+ '<label>拓扑名称：<input type="text" name="topoName" id="topoName"/></label></br>' 
	+ '<div class="straight"><div class="straightLine" title="直线" name="link"></div>' 
	+ '<div class="straightLineArrow" title="虚直线" name="link"></div>' 
	+ '<div class="virtualStraightLine" title="直线带箭头" name="link"></div>' 
	+ '<div class="virtualStraightLineArrow" title="虚直线箭头" name="link"></div></div>'
	+ '<div class="broken"><div class="brokenLine" title="折线" name="foldLink"></div>' 
	+ '<div class="brokenLineArrow" title="虚折线" name="foldLink"></div>' 
	+ '<div class="virtualBrokenLine" title="折线带箭头" name="foldLink"></div>' 
	+ '<div class="virtualBrokenLineArrow" title="虚折线箭头" name="foldLink"></div></div>'
	+ '<div class="twoBroken"><div class="twoBrokenLine" title="二次折线" name="flexionalLink"></div>' 
	+ '<div class="twoBrokenLineArrow" title="虚二次折线" name="flexionalLink"></div>' 
	+ '<div class="virtualTwoBrokenLine" title="二次折线带箭头" name="flexionalLink"></div>' 
	+ '<div class="virtualTwoBrokenLineArrow" title="虚二次折线箭头" name="flexionalLink"></div></div>' 
	+ '<div title="停止连线" id="stopLink" class="stopLink" name="stopLink" ></div><br />' 
	+ '<div id="savaDragTopo" title="保存" ></div>' + '<div id="clear" title="清除全部" ></div>');
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
	var size=0;
    var k = scene.childs;	//获取画布上所有可见节点，包括线条 k[];
    if(k.length==0){
    	$("#stopLink").click();
		$("#dialog,#full").remove();
		alert("没有节点！");
    	return false;
    }
    sb = "{";
    if($("#operateTopo input[name=bsName]").val()==""){
		alert("业务系统名称未设置！");
		return false;
    }
    /*if($("#topoName").val()==""){
		alert("拓扑名称未设置！");
		return false;
    }*/
    sb+='"bsName":"'+$("#getBsName").find("option:selected").val()+'",';
    sb+='"topoSceneName":"'+$("#topoName").val()+'",';
    var nodeJson = '"node":[';
    var linkJson = '"link":[';
    var containerJson = '"container":[';
   	for (var i = k.length - 1; i >= 0; i--) {
        var node = k[i];
        if (node != undefined) {
            var subNodeImage = "";
            try {
                var nodeImage = node['image'] && node['image']['src'];	//获取图片路径
                if (nodeImage != undefined) {
                	//截取图片路径image开始往后的路径
                    subNodeImage = nodeImage.substr(nodeImage.lastIndexOf("image"), nodeImage.length);	
                    subNodeImage =subNodeImage.substring(14);
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
            	if(node.title=="拉抻节点"){
					console.log("拉伸节点不保存"+i);
				}else{
					nodeJson = nodeJson + '{"x":'+node.x+',"y":'+node.y+',"width":'+node.width+',"height":'+node.height+',"mapId":'+node._id+
						',"zIndex":'+node.zIndex+',"borderWidth":'+node.borderWidth+',"borderRadius":'+node.borderRadius+
						',"textOffsetY":'+node.textOffsetY+',"textOffsetX":'+node.textOffsetX+',"alpha":'+node.alpha+
						',"nodeType":"'+node.elementType+'","font":"'+node.font+'","text":"'+node.text+'","fontColor":"'+node.fontColor+
						'","nodeImg":"'+subNodeImage+'","dragable":"'+node.dragable+'","textPosition":"'+node.textPosition+
						'","borderColor":"'+node.borderColor+'","fillColor":"'+node.fillColor+'","alarmValue":"'+node.alarmValue+
						'","ip":"'+node.ip+'","geographic":"'+node.geographic+'","firm":"'+node.firm+'","agent":"'+node.agent+
						'","port":"'+node.port+'","userName":"'+node.userName+'","passWord":"'+node.passWord+'","info":"'+node.info+'"}';
					if (i != 0) {
						nodeJson = nodeJson + ",";
					}
				}
            } else if (node.elementType == 'link') {
                if (node.nodeA != null && node.nodeZ != null) {
                   linkJson = linkJson+'{"bundleOffset":'+node.bundleOffset+',"zIndex":'+node.zIndex+',"lineWidth":'+node.lineWidth+
                   ',"bundleGap":'+node.bundleGap+',"offsetGap":'+node.offsetGap+',"textOffsetY":'+node.textOffsetY+
                   ',"textOffsetX":'+node.textOffsetX+',"alpha":'+node.alpha+',"arrowsRadius":'+node.arrowsRadius+
                   ',"dashedPattern":'+node.dashedPattern+',"nodeType":"'+node.elementType+'","font":"'+node.font+
                   '","text":"'+node.text+'","fontColor":"'+node.fontColor+'","linkClass":"'+node.linkClass+
                   '","strokeColor":"'+node.strokeColor+'","alarmValue":"'+'","fromNodeIp":"'+node.nodeA.ip +
                   '","toNodeIp":"'+node.nodeZ.ip+'","fromNodeMapId":"'+node.nodeA._id+'","toNodeMapId":"'+node.nodeZ._id +
                   '","ip":"'+node.ip+'","geographic":"'+node.geographic+'","firm":"'+node.firm+'","agent":"'+node.agent+
				   '","port":"'+node.port+'","userName":"'+node.userName+'","passWord":"'+node.passWord+'","info":"'+node.info+'"}';
					 if (i != 0) {
	                    linkJson = linkJson + ",";
	                }
                }
            }else if (node.elementType == 'container'){
            	var childsNode = new Array();
            	for(var cn = 0;cn < node.childs.length;cn++){
            		if(node.childs[cn].title=="拉抻节点"){
    					console.log("拉伸节点不保存"+cn);
    				}else{
    					childsNode.push('"'+node.childs[cn]._id+'"');
    				}
            	}
            	containerJson = containerJson + '{"nodeType":"' + node.elementType + '","text":"' + node.text +'","width":"' +
                node.width +'","zIndex":' + node.zIndex + ',"alpha":'+node.alpha+
                ',"textPosition":"' + node.textPosition +'","dragable":"'+node.dragable+
                '","textOffsetY":' + node.textOffsetY + ',"font":"' + node.font + '","fontColor":"' + node.fontColor + 
                '","fillColor":"' + node.fillColor + '","borderColor":"' + node.borderColor + '","borderWidth":' + node.borderWidth +
                ',"x":' + node.x + ',"y":' + node.y + ',"height":' + node.height +',"layout":"网格布局"'+
                ',"borderRadius":' + node.borderRadius +',"childs":[' + childsNode + ']}';
				 if (i != 0) {
					 containerJson = containerJson + ",";
                }
            }
        }
    }
	var reg = /,$/gi;
	nodeJson = nodeJson.replace(reg, "");
	linkJson = linkJson.replace(reg, "");
	containerJson = containerJson.replace(reg,"");
    sb = sb +nodeJson+"],"+linkJson + "],"+containerJson+"]}";
    
	if(method == "修改"){
//		var saveTopoJson = $("#topoName").attr("data_id")+"/"+$("#topoName").val()+"/"+$("#getBsName").attr("data_id")+"/"+123321+"/"+sb;
	}else{		//添加
		console.log(sb);
		$("#stopLink").click();
//		var saveTopoJson = $("#topoName").val()+"/"+$("#getBsName").val()+"/"+123321+"/"+sb;
		var data = eval('(' + sb + ')');
		$.topo.newScene(scene,data);
		$("#showFunc,#showModel").hide();
		$("#modelDialog,#operateDialog").remove();
		initRightButton();
	}
}
