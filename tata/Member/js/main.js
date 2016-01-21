/*入口脚本*/
require.config({
	paths: { // -- 配置别名
		//  	"amazeui":"../../assets/js/amazeui.min",	// 妹子Ui
		"jquery": "../../assets/js/jquery.min",
		//		"jquery":"http://libs.baidu.com/jquery/2.0.0/jquery.min",
		"amazeui": "http://cdn.amazeui.org/amazeui/2.5.0/js/amazeui.min",
		"countUp": "../../assets/js/countUp", // 数字动态效果
		"chosen": "../../assets/js/amazeui.chosen", // 下拉组件
		"datetime": "../../assets/js/amazeui.datetimepicker", // 日历组件
		"formValidator": "../../assets/js/formValidator", // form验证
		"citySelect": "../../assets/js/jquery.cityselect", // 城市选择
		"quality": "../../assets/js/qualityCheck", // 城市选择
		"hammer": "../../assets/js/hammer", // 移动端滑动事件
		"iscroll": "../../assets/js/iscroll-zoom", // pc滚轮事件
		"photoClip": "../../assets/js/jquery.photoClip", // 头像截取
		"webuploader": "page/webuploader.html5only.min", // 组件初始化
		"batchUpload": "page/batchUpload", // 组件初始化
		"app": "page/app", // 公共的js
		"user": "page/user", 
		"uploadPhoto": "page/uploadPhoto"
	}
});
require(["jquery", "amazeui","app"], function($) {
	if (typeof(thisPage) == "string") {
		require([thisPage]);
	}
});