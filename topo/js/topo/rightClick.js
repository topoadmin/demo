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
		var scrollHeight = $(document).height();　　			//获取文档高度
		var overHeight = scrollHeight-(event.pageY+20);		//获取文档高度减去鼠标位置剩余的高度
		ctm.css({
			top: event.pageY-10,
			left: event.pageX-10,
			height:overHeight+"px"
		}).show();
		
		//当右击菜单大于浏览器最大高度时，提高150像素
		if(ctm.height()<150){
			ctm.css({
				top: event.pageY - 160,
				left: event.pageX - 10,
				height: overHeight+150
			});
		}
		
		ctm.find("li a").show();		
		if(currentNode.elementType == "node"){
			ctm.show();
		}
	}else{
		ctm.hide();
	}
	 //对齐事件
	$("#XAlign").unbind('click').click(function() {
		var seSize = scene.selectedElements;
		if(currentNode.elementType == "container"){
			for (var i = 0; i < seSize.length; i++) {
				if(seSize[i].childs==undefined){
					alert("设备不能和业务系统对齐");
				}else{
					seSize[i].childs[0].x=currentNode.childs[0].x;
					seSize[i].childs[1].x=currentNode.childs[1].x;
				}
			}
		}else{
			for (var i = 0; i < seSize.length; i++) {
				if(seSize[i].childs){
					alert("设备不能和业务系统对齐");
				}else{
					seSize[i].x = currentNode.x;
				}
			}
		}
		scene.removeAllEventListener();
		return false;
	});
	$("#YAlign").unbind('click').click(function() {
		var seSize = scene.selectedElements;
		if(currentNode.elementType == "container"){
			for (var i = 0; i < seSize.length; i++) {
				if(seSize[i].childs==undefined){
					alert("设备不能和业务系统对齐");
				}else{
					seSize[i].childs[0].y=currentNode.childs[0].y;
					seSize[i].childs[1].y=currentNode.childs[1].y;
				}
			}
		}else{
			for (var i = 0; i < seSize.length; i++) {
				if(seSize[i].childs){
					alert("设备不能和业务系统对齐");
				}else{
					seSize[i].y = currentNode.y;
				}
			}
		}
		scene.removeAllEventListener();
		return false;
	});

	ctm.find("a").unbind('click').on("click",function () {
        var text = $(this).text();
        if(text=='设备配置'){
        	alert("demo不开放此功能");
//      	addDialogFn(currentNode);
        }else if(text == '删除节点') {
            scene.remove(currentNode);
            currentNode = null;
            ctm.hide();
        }else if (text == '顺时针旋转') {
            currentNode.rotate += 0.5;
        }else if (text == '逆时针旋转') {
            currentNode.rotate -= 0.5;
        }else if(text == '锚定'){
        	currentNode.dragable = false;
        }else if(text == '放开'){
        	currentNode.dragable = true;
        }else if(text == '样式设置'){
        	addNodeTextFn(currentNode);
        }else if(text == '加大'){
        	currentNode.lineWidth ++;
        	return false;
        }else if(text == '缩小'){
        	currentNode.lineWidth --;
        	return false;
        }else if(text == '拐角加大'){
        	currentNode.offsetGap += 10;
        	return false;
        }else if(text == '拐角缩小'){
        	currentNode.offsetGap -= 10;
        	return false;
        }else if(text == '性能概览'){
        	location.href = "alarm.html?ip="+currentNode.ip;
        }
        ctm.hide();
    });
	
	ctm.unbind('click').on("click",function () {
        ctm.hide();
        return false;
    });
	
	scene.click(function (event) {
        if (event.button == 0) {// 左击
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
    for(var i=0;i<nodeSize.length;i++){
    	var node = nodeSize[i];
        if (node != undefined) {	
            node.addEventListener('mouseup', function (event) {
                currentNode = this;
                handler(event);
            });
            node.addEventListener('mousedrag', function (event) {
            });
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
	var topDiv=("<div id='dialog_top_title' class='dialog_top_title'>设备配置</div>");
	topDiv+=("<div id='closeDialogTwo'>X&nbsp;</div>");
	if(currentNode.elementType=='container'){
		var nodeName = ("<label>主&nbsp;机&nbsp;名&nbsp;:<input type='text' value='"+currentNode.text+"' id='nodeName'/></label></br>");
	}else{
		var nodeName = ("<label>主&nbsp;机&nbsp;名&nbsp;:<input type='text' value='"+currentNode.text+"' id='nodeName' /></label></br>");
		nodeName += ("<label>设&nbsp;备&nbsp;I&nbsp;P:<select id='nodeIp'></select></label></br>");
		nodeName += ("<label>设备信息:<input type='text' value='"+currentNode.info+"' id='nodeInfo' readonly='readonly'/></label></br>");
		nodeName += ("<label>地理位置:<input type='text' value='"+currentNode.geographic+"' id='nodeGeographic' readonly='readonly'/></label></br>");
		nodeName += ("<label>厂&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;商:<input type='text' value='"+currentNode.firm+"' id='nodeFirm' readonly='readonly'/></label></br>");
		nodeName += ("<label>代理端口:<input type='text' value='"+currentNode.port+"' id='nodePort' readonly='readonly'/></label></br>");
		nodeName += ("<label>代理用户:<input type='text' value='"+currentNode.userName+"' id='nodeUserName' readonly='readonly'/></label></br>");
		nodeName += ("<label>代理密码:<input type='text' value='"+currentNode.passWord+"' id='nodePassWord' readonly='readonly'/></label></br>");
	}
	
	nodeName += ("<input type='button' value='确定' id='confirmTwo'/><input type='button' value='取消' id='cancelTwo'/>");
	dialogDiv.append(topDiv,nodeName);
	$("body").append(fullDiv, dialogDiv);
	
	$("#confirmTwo").on('click',function(){
		currentNode.text=$("#nodeName").val();
		currentNode.ip=$("#nodeIp").find("option:selected").val();
		currentNode.info=$("#nodeInfo").val();
		currentNode.geographic=$("#nodeGeographic").val();
		currentNode.firm=$("#nodeFirm").val();
		//currentNode.agent=$('input[name="nodeAgent"]:checked').val();
		currentNode.port=$("#nodePort").val();
		currentNode.userName=$("#nodeUserName").val();
		currentNode.passWord=$("#nodePassWord").val();
		$("#fullTwo,#dialogTwo,#pickerTwo").remove();
		$("#contextmenu").hide();
	});
	
	// 判断节点是否存在IP
	if(currentNode.ip == ""){
		getDeviceIpAjax(currentNode);
		$("#nodeName").val(currentNode.text);
		$("#nodeIp").val(currentNode.ip);
		$("#nodeInfo").val(currentNode.info);
		$("#nodeGeographic").val(currentNode.geographic);
		$("#nodeFirm").val(currentNode.firm);
		$("#nodePort").val(currentNode.port);
		$("#nodeUserName").val(currentNode.userName);
		$("#nodePassWord").val(currentNode.passWord);
	}else{
		getDeviceIpAjax(currentNode);
	}
	
	$("#cancelTwo").on('click',function(){
		$("#fullTwo,#dialogTwo,#pickerTwo").remove();
		$("#contextmenu").hide();
	});
	
	$("#closeDialogTwo").on("click",function(){
		$("#fullTwo,#dialogTwo,#pickerTwo").remove();
		$("#contextmenu").hide();
	});
	dragDom("dialog_top_title","dialogTwo");
}

/**@method 	addNodeTextFn
 * @param 	当前节点容器
 * @this 	右击菜单改变设备名称文本信息
 */	
function addNodeTextFn(currentNode) {
	$("#contextmenu").hide();
	$("#fullThree,#dialogThree").remove();
	
	var ps = ['下面居中', '上面居中', '右上偏移', '左中偏移', '居中显示'
                , '右中偏移', '左下偏移', '左上偏移', '右下偏移'];
    var fontSize = ['70','65','60','52','46','40','36','32','28','24','22','20','19','18','17','16','15','14','13','12','11','10','9','8','7','6','5','4','3','2','1','0'];
	var fullDiv = $('<div id="fullThree"></div>');
	var dialogDiv = $('<div id="dialogThree"></div>');
	var topDiv=("<div id='dialog_top_title_three' class='dialog_top_title'>文本配置</div>");
	topDiv+=("<div id='closeDialogThree'>X&nbsp;</div>");
	var nodeTextSpan = ("<span>&nbsp;文本位置：</span>");
	var nodeTextSelect = $("<select id='nodeTextPs'></select></br>");		// 节点位置选择栏
	for(var i=0;i<ps.length;i++){
		var nodeTextOption = ("<option>"+ps[i]+"</option>");
		nodeTextSelect.append(nodeTextOption);
	}
	var confirmText =("<label class='textLabel'>&nbsp;程序位置：</label><input type='text' id='textPosition' disabled='disabled' value='"+currentNode.textPosition+"'/></br>");
	
	var fontOffsetInput = ("<label>&nbsp;文本偏移：<input type='text' id='fontOffset' value='"+currentNode.textOffsetY+"'/></label></br>");
	fontOffsetInput += ("<label>&nbsp;字体颜色：<input type='text' id='fontColor' value='"+currentNode.fontColor+"'/></label></br>");
	fontOffsetInput += ("<label>&nbsp;背景颜色：<input type='text' id='backColor' value='"+currentNode.fillColor+"'/></label></br>");
	fontOffsetInput += ("<label>&nbsp;边框颜色：<input type='text' id='borderColor' value='"+currentNode.borderColor+"'/></label></br>");
	
	var borderSizeText = ("<span>&nbsp;边框大小：</span>");
	var bdSizeSelect = $("<select id='bdSizeSlc'></select></br>");		// 节点位置选择栏
	for(var i=0;i<fontSize.length;i++){
		var bdSizeOption = ("<option>"+fontSize[i]+"</option>");
		bdSizeSelect.append(bdSizeOption);
	}
	
	var fontSizeText = ("<span>&nbsp;文本大小：</span>");
	var fontSizeSelect = $("<select id='fontSizeSlc'></select></br>");		// 节点位置选择栏
	for(var i=0;i<fontSize.length;i++){
		var fontSizeOption = ("<option>"+fontSize[i]+"</option>");
		fontSizeSelect.append(fontSizeOption);
	}
	var confirmT = ("<input type='button' value='确定' id='confirmThree'/><input type='button' value='取消' id='cancelThree'/>");
	dialogDiv.append(topDiv,nodeTextSpan,nodeTextSelect,confirmText,fontSizeText,fontSizeSelect,fontOffsetInput,borderSizeText,bdSizeSelect,confirmT);
	$("body").append(fullDiv, dialogDiv);
	
	selectColr("backColor");
	selectColr("fontColor");
	selectColr("borderColor");
	
	switch (currentNode.textPosition){ 
			case "Top_Left" :  $("#nodeTextPs").val("左上偏移");
			break; 
			case "Top_Center" :  $("#nodeTextPs").val("上面居中");
			break; 
			case "Top_Right" : $("#nodeTextPs").val("右上偏移");
			break; 
			case "Middle_Left" : $("#nodeTextPs").val("左中偏移");
			break; 
			case "Middle_Center" : $("#nodeTextPs").val("居中显示");
			break; 
			case "Middle_Right" : $("#nodeTextPs").val("右中偏移");
			break; 
			case "Bottom_Left" : $("#nodeTextPs").val("左下偏移"); 
			break; 
			case "Bottom_Center" : $("#nodeTextPs").val("下面居中");
			break; 
			case "Bottom_Right" : $("#nodeTextPs").val("右下偏移");
			break; 
		}
	var fontSize = currentNode.font.substr(0,2);
	$("#fontSizeSlc").val(fontSize);
	$("#bdSizeSlc").val(currentNode.borderWidth);
	
	//点击确定
	$("#confirmThree").on('click',function(){
		currentNode.font = $("#fontSizeSlc").val()+"px Microsoft YaHei";
		currentNode.textPosition =$("#textPosition").val();
		currentNode.textOffsetY = parseInt($("#fontOffset").val());
		currentNode.fontColor = $("#fontColor").val();
		currentNode.fillColor = $("#backColor").val();
		currentNode.borderWidth = parseInt($("#bdSizeSlc").val());
		if(currentNode.elementType=="link"){
			currentNode.strokeColor  = $("#borderColor").val();
		}else{
			currentNode.borderColor = $("#borderColor").val();
		}
		$("#fullThree,#dialogThree,#pickerTwo").remove();
		$("#contextmenu").hide();
	});
	$("#cancelThree").on('click',function(){
		$("#fullThree,#dialogThree").remove();
		$("#contextmenu").hide();
	});
	
	$("#closeDialogThree").on("click",function(){
		$("#fullThree,#dialogThree").remove();
		$("#contextmenu").hide();
	});
	$("#nodeTextPs").on("change",function(){
		var nodeTextPs = $(this).val();
		switch (nodeTextPs){ 
			case "左上偏移" : $("#textPosition").val("Top_Left"); 
			break; 
			case "上面居中" : $("#textPosition").val("Top_Center"); 
			break; 
			case "右上偏移" : $("#textPosition").val("Top_Right"); 
			break; 
			case "左中偏移" : $("#textPosition").val("Middle_Left"); 
			break; 
			case "居中显示" : $("#textPosition").val("Middle_Center"); 
			break; 
			case "右中偏移" : $("#textPosition").val("Middle_Right"); 
			break; 
			case "左下偏移" : $("#textPosition").val("Bottom_Left"); 
			break; 
			case "下面居中" : $("#textPosition").val("Bottom_Center"); 
			break; 
			case "右下偏移" : $("#textPosition").val("Bottom_Right"); 
			break; 
		}
	});
	dragDom("dialog_top_title_three","dialogThree");
}

/**@method 	bsNameSelectShow
 * @param 	目标ID
 * @this 	创建颜色版
 */	
function selectColr(targetId){
	$("#"+targetId).unbind('click').on("click", function() {
		var pickerDiv = $("<div id='pickerTwo'><div>");
		$("body").append(pickerDiv);
		$('#pickerTwo').farbtastic('#'+targetId);
	   	if($('#pickerTwo').is(':hidden')){
	   		var pickerWidth = $('#pickerTwo').width();
	   		var pickerHeight = $('#pickerTwo').height();
			$('#pickerTwo').css({
				top: $(this).offset().top-pickerHeight,
				left: $(this).offset().left
			}).show();
		}else{
			var sHex = $("#"+targetId).val();
			var sRgbColor = sHex.colorRgb();
			$("#"+targetId).val(sRgbColor);
			$('#pickerTwo').remove();
		}
		$("#pickerTwo").on("mouseleave",function(){
			var sHex = $("#"+targetId).val();
			var sRgbColor = sHex.colorRgb();
			$("#"+targetId).val(sRgbColor);
			$('#pickerTwo').remove();
		});
		return false;
	});
}

/* 16进制颜色转为RGB格式 */  
var topoReg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;  
String.prototype.colorRgb = function(){  
    var sColor = this.toLowerCase();  
    if(sColor && topoReg.test(sColor)){  
        if(sColor.length === 4){  
            var sColorNew = "#";  
            for(var i=1; i<4; i+=1){  
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
            }  
            sColor = sColorNew;  
        }  
        // 处理六位的颜色值
        var sColorChange = [];  
        for(var i=1; i<7; i+=2){  
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
        }  
        return sColorChange.join(",");  
    }else{  
        return sColor;    
    }  
}
