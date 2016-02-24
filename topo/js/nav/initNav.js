function navEvent() {
	$("#navControl").click(function() {
		var nc = $(this);
		var nav = $("#nav");
		if (nav.attr("class") == "navHide") {
			nav.css("display","block");
			nav.animate({height:"70px"},500,function(){autoAdaptation("canvas")});
			nav.removeClass("navHide");
			nc.removeClass("navClickHide");
		} else {
			nav.animate({height:"0px"},500,function(){nav.css("display","none");autoAdaptation("canvas")});
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
	$("#navControl").css({"left":$("#nav").width()/2});
	$(window).resize(function() {
		main.width($(window).width()).height($(window).height() - header.height());
		canvas.width = header.width();
		canvas.height = main.height();
		$("#navControl").css({"left":$("#nav").width()/2});
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