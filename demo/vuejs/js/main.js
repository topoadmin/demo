/*入口脚本*/
require.config({
	paths: { // -- 配置别名
		"vue": "vue.min",
		"navdata": "data/navdata",
		"myNav": "myNav"
	}
});
define(["vue","myNav"], function(Vue) {　　　　
//	require(["myNav"], function(navdata) {
//		var myNav = new Vue({
//			el: '#admin_nav'
//		});
//	});
	
	init(Vue);
});