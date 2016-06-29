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
	console.log("【获取时间集合】---"+gs.date());
	console.log("【获取时间字符串】---"+gs.date(true));	
	console.log("【指定格式】---"+gs.date({timeFormat:"yyyy-MM-dd hh:mm:ss"}));
	console.log("【传入时间戳】---"+gs.date({timestamp:1458977810777})); 
	console.log("【完整】---"+gs.date({timeFormat:"yyyy-MM-dd hh:mm:ss",timestamp:1458977810777}));
	console.log("【获取指定日期是今年第几周】---"+gs.getWeekOfYear(2016,3,27));  // 
	console.log("【获取今天是今年第几周】---"+gs.getWeekOfYear());	 
	console.log("【获取指定月最后一天】---"+gs.getLastDay(2016,2));		
	console.log("【获取当月最后一天】---"+gs.getLastDay());		
	console.log("【数字格式化】---"+gs(1234.15).number("####.#"));
	console.log("【数字格式化】---"+gs(123.125).number(".000"));
	console.log("【替换字符串】---"+gs("替换掉我").replaceAll("我","你"));
	console.log("【去除两端空格】---"+gs(" 去掉空格 ").trim());
	console.log("【去除左边】---"+gs(" 去掉左空格 ").trim("left"));
	console.log("【去除右边】---"+gs(" 去掉右空格 ").trim("right"));
	console.log("【获取真实长度】---"+gs("我的长度?").strLength());
	console.log("【获取路径域名】---"+gs.getDomainName("https://www.baidu.com/sadas"));
	console.log("【获取当前域名】---"+gs.getDomainName());
	console.log("【范围内随机数】---"+gs.getRandom(3,5));
	

	require(["laytpl", "api"], function(laytpl, api) {
		var apiTpl = document.getElementById('api-tpl').innerHTML;
		laytpl(apiTpl).render(api.dateData, function(html) {
			document.getElementById('date-box').innerHTML = html;
		});
		laytpl(apiTpl).render(api.numberData, function(html) {
			document.getElementById('number-box').innerHTML = html;
		});
		laytpl(apiTpl).render(api.stringData, function(html) {
			document.getElementById('string-box').innerHTML = html;
		});
		laytpl(apiTpl).render(api.windowData, function(html) {
			document.getElementById('window-box').innerHTML = html;
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
			storage.set("testTime", new Date().getYear());
			console.dir("保存成功");
			console.log(storage.get("test"));
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