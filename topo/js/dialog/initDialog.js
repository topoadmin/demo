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
	topofnDiv.append(newSaveTopo, updeteTopo,deleteTopo);
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