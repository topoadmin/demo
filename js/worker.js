//worker.js
onmessage = function(evt) {
	var data = {
		title : "HTML5桌面提醒",
		msg : "提示信息",
		ic : "https://www.baidu.com/img/bd_logo1.png"
	}
	postMessage(data); //将获取到的数据发送会主线程
}