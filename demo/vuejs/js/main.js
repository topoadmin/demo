/*入口脚本*/
require.config({
	paths: { // -- 配置别名
		"vue": "vue.min"
	}
});
require(["vue", "myNav"], function(Vue, myNav) {
	new Vue({
		el: '#admin_nav'
	});
});