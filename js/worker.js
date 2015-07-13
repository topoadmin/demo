//worker.js
onmessage = function(evt) {
	//var d = "收到了你的信息，现在返回'"+evt.data+"'";//通过evt.data获得发送来的数据
//	evt.data = "剩菜";
	//evt.msg = "煞笔";
	//evt.ic = "https://www.baidu.com/img/bd_logo1.png";
	var data = {
		title : "圣菜",
		msg : "煞笔小儿",
		ic : "https://www.baidu.com/img/bd_logo1.png"
	}
	postMessage(data); //将获取到的数据发送会主线程
}