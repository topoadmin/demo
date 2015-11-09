$(function() {
	$("#load").remove();
})


var urlArr = [];
function getBackUrl(url) {
	var setUrl = url,
		strUrl = window.location.href,
		arrUrl = strUrl.split("/"),
		strPage = arrUrl[arrUrl.length - 1];
	urlArr.push(strPage);
	if (urlArr[0] == url) {
		$(".back").click();
		return false;
	} else {
		return true;
	}
}

function pageTouchFn(){
	var activePages = $("#toolbar-bottom").children("a.active");
	$(".page").touchEvents({
		"leftTouch":function(){
			console.log("left")
			var prev = activePages.prev();
			if(perv.length){
				prev.click();
			}
		},"rightTouch":function(){
			console.log("right")
			var next = activePages.next();
			if(next.length){
				next.click();
			}
		}
	})
}
