require.config({
	paths: {
		"storage": "storage",
		"notification": "notification",
		"online": "online",
		"gsJsPlugs": "gsJsPlugs"
	}
});
require(["storage", "notification", "online", "gsJsPlugs"], function(storage, notification, online, gs) {
	console.log(gs("date","yyyy-MM-dd hh:mm:ss"));
	
	
	
	
	document.getElementById("openAlert").addEventListener("click", function() {
		notification({
			title: '提醒',
			body: '您的智商不足，请充值',
			icon: "./../build/img/javascript.jpg",
			tag: '1',
			timeout: 5
		});
	}, false);

	document.getElementById("saveStorage").addEventListener("click", function() {
		var text = document.getElementById("storage");
		storage.set("test", text.value);
		storage.set("testTime", new Date().format("yyyy-MM-dd hh:mm:ss"));
		console.dir("保存成功");
		console.log(storage.get("test"));
		console.log(storage.get("testTime"));
	}, false);

	document.getElementById("checkLine").addEventListener("click", function() {
		var status = online({
			"on": function(s) {
				notification({
					title: '温馨提示',
					body: '您的网络恢复了',
					tag: '1',
					timeout: 5
				});
			},
			"off": function(s) {
				notification({
					title: '温馨提示',
					body: '您的网络断开了',
					tag: '1',
					timeout: 5
				});
			}
		});
		console.log("目前连线状态:" + status.lineStatus);
		console.log("现在你可以断开网络和重连进行检测了。");
	}, false);
});