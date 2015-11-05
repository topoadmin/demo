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
