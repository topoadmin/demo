(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.dateData = factory();
	}
}(this, function(root, undefined) {
	var dateData = {
		title:"时间操作集",
		items:[{
			title: '获取当前时间',
			code:['gs.date() // 返回object','gs.date(true) // 返回字符串']
		},{
			title: '自定义格式',
			code:'gs.date({timeFormat:"yyyy-MM-dd hh:mm:ss"}) // 连接符随意定'
		},{
			title: '传入时间戳获取',
			code: ['gs.date({timestamp:1458977810777})','gs.date({timeFormat:"yyyy-MM-dd hh:mm:ss",timestamp:1458977810777})']
		},{
			title:'获取当月最后一天(可传入年月)',
			code:['gs.getLastDay()','gs.getLastDay(2016,4)']
		},{
			title:'获取日期是全年第几周',
			code:['// 未传参数将以当前日期自动替补','gs.getWeekOfYear(2016,3,27)','gs.getWeekOfYear()']
		}
	]};
	var numberData = {
		title:"数字操作集",
		items:[{
			title: '数字格式化',
			code:['gs(123.125).number(".000"); // 输出  .125 ','gs(1234.567).number("#,###.###"); // 输出  1,234.567','// 更多使用方式见源码解释']
		}]
	};
	var stringData = {
		title:"字符串操作集",
		items:[{
			title: '替换字符串',
			code:'gs("替换掉我").replaceAll("我","你")'
		},{
			title: '去除指定空格',
			code:['gs(" 去掉空格 ").trim()','gs(" 去掉左边空格 ").trim("left")','gs(" 去掉右边空格 ").trim("right")']
		},{
			title: '获取字符串真实长度',
			code:'gs("我的长度?").strLength()'
		}]
	};
	var windowData = {
		title:"其他操作集",
		items:[{
				title: '获取域名',
				code:['gs.getDomainName("https://www.baidu.com/sadas")','gs.getDomainName()']
			},{
				title:'获取范围内的随机数',
				code:'gs.getRandom(3,5)'
			}
		]
	};
	return {
		dateData:dateData,
		numberData:numberData,
		stringData:stringData,
		windowData:windowData
	};
}));