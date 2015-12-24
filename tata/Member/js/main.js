/*入口脚本*/
require.config({
	paths: { // -- 配置别名
		//  	"amazeui":"../../assets/js/amazeui.min",	// 妹子Ui
		"jquery": "../../assets/js/jquery.min",
		//		"jquery":"http://libs.baidu.com/jquery/2.0.0/jquery.min",
		"amazeui": "http://cdn.amazeui.org/amazeui/2.5.0/js/amazeui.min",
		"countUp": "module/countUp", // 数字动态效果
		"chosen": "module/amazeui.chosen", // 下拉组件
		"datetime": "module/amazeui.datetimepicker", // 日历组件
		"formValid": "module/formValid", // form验证
		"citySelect": "module/jquery.cityselect", // 城市选择
		"quality": "module/qualityCheck", // 城市选择
		"hammer": "module/hammer", // 移动端滑动事件
		"iscroll": "module/iscroll-zoom", // pc滚轮事件
		"photoClip": "module/jquery.photoClip", // 头像截取
		"autoexec": "page/autoexec", // 组件初始化
		"app": "page/app", // 公共的js
		"user": "page/user"
	}
});
require(["jquery", "amazeui"], function($) {
	require(["app"]);
	require([thisPage]);
});