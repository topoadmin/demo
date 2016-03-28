require.config({
	paths: {
		"storage": "storage",
		"notification": "notification",
		"online": "online",
		"laytpl": "laytpl",
		"api": "../data/api",
		"gsJsPlugs": "gsJsPlugs"
	}
});
require(["gsJsPlugs"], function(gs) {
	/*
	console.log(gs.date()); // 获取时间集合
	console.log(gs.date(true));	//获取时间字符串
	console.log(gs.date({timeFormat:"yyyy-MM-dd hh:mm:ss"}));	//指定格式
	console.log(gs.date({timestamp:1458977810777}));	// 传入时间戳
	console.log(gs.date({timeFormat:"yyyy-MM-dd hh:mm:ss",timestamp:1458977810777}));
	
	console.log(gs.getLastDay(2016,2));		// 获取指定月最后一天
	console.log(gs.getLastDay());		// 获取当月最后一天
	console.log(gs.getWeekOfYear(2016,3,27));  // 获取指定日期是今年第几周
	console.log(gs.getWeekOfYear());	// 获取今天是今年第几周
	
	console.log(gs.number(1234.15, "####.#"));	 //数字格式
	console.log(gs.number(123.125, ".000"));
	
	console.log(gs("替换掉我").replaceAll("我","你"));	// 替换字符串
	console.log(gs(" 去掉空格 ").trim());	// 去除两端空格
	console.log(gs(" 去掉空格 ").trim("left"));	//去除左边
	console.log(gs(" 去掉空格 ").trim("right"));	//去除右边
	console.log(gs("我的长度?").strLength());*/
	
//	console.log(gs.getDomainName("https://www.tt.com/sadas"));
//	console.log(gs.getDomainName());
	
	
	require(["laytpl", "api"], function(laytpl, api) {
		var dateTpl = document.getElementById('api-tpl').innerHTML;
		laytpl(dateTpl).render(api.dateData, function(html) {
			document.getElementById('date-box').innerHTML = html;
		});
		var numberTpl = document.getElementById('api-tpl').innerHTML;
		laytpl(numberTpl).render(api.numberData, function(html) {
			document.getElementById('number-box').innerHTML = html;
		});
		var stringTpl = document.getElementById('api-tpl').innerHTML;
		laytpl(numberTpl).render(api.stringData, function(html) {
			document.getElementById('string-box').innerHTML = html;
		});
	})

	require(["storage", "notification", "online"], function(storage, notification, online) {
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
});