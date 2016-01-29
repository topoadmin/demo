/*入口脚本*/
require.config({
	paths: { // -- 配置别名
		//  	"amazeui":"../../assets/js/amazeui.min",	// 妹子Ui
		"jquery": "../../assets/js/jquery.min",
		"amazeui": "http://cdn.amazeui.org/amazeui/2.5.0/js/amazeui.min",
		"countUp": "../../assets/js/countUp.min", // 数字动态效果
		"chosen": "../../assets/js/amazeui.chosen", // 下拉组件
		"datetime": "../../assets/js/amazeui.datetimepicker", // 日历组件
		"citySelect": "../../assets/js/jquery.cityselect.min", // 城市选择
//		"photoClip": "../../assets/js/jquery.photoClip.min", // 头像截取
		"photoClip": "../../assets/js/源码/jquery.photoClip", // 头像截取
		"hammer": "../../assets/js/hammer.min", // 图片裁剪移动端滑动事件
		"iscroll": "../../assets/js/iscroll-zoom.min", // 图片裁剪pc滚轮事件
		"webuploader": "../../assets/js/webuploader.html5only.min", // 图片批量上传
		"touch": "../../assets/js/touch", // form验证
		"formValidator": "page/member.formValidator", // form验证
		"app": "page/app", // 公共的js
		"user": "page/user",
		"msg": "page/msg",
		"changepwd": "page/changepwd",
		"uploadPhoto": "page/uploadPhoto"
	}
});
require(["jquery", "amazeui", "app"], function($) {
	if (typeof(thisPage) == "string") {
		require([thisPage]);
	}
});