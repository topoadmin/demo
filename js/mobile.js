window.onload = function() {
	$("#load").remove();
}

function initTouchPage(){
	var toolbar_a = $("#toolbar-bottom").children("a.active");
	touchPage({
		"elem": ".touch-page",
		"rightTouch":function(position,elem){
			var rightEvent = document.getElementsByClassName("open-panel") || elem.data("types");
			console.log(rightEvent);
//			if(panel){
//				panel[0].click();
//			}
		},"leftTouch":function(position,elem){
			toolbar_a.next().click();
		}
	});
}


var urlArr = [];
function getBackUrl(url){
	var setUrl = url;
	if(urlArr.length > 0){
		
	}
	
	var strUrl = window.location.href,arrUrl = strUrl.split("/"),strPage = arrUrl[arrUrl.length - 1];
	urlArr.push(strPage);
}




