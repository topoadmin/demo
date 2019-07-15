require.config({
	paths: {
		//  	"amazeui":"../../assets/js/amazeui.min",	// 妹子Ui
		"jquery": "//cdn.bootcss.com/jquery/3.4.1/jquery.min",
		"amazeui": "//cdn.bootcss.com/amazeui/2.7.2/js/amazeui.min",
		"countUp": "../../assets/js/countUp.min", // 数字动态效果
		"lazyload": "../../assets/js/jquery.lazyload.min",	// 图片赖加载
		"easing": "../../assets/js/jquery.easing.min",		// jquery 动画
		"mixitup": "../../assets/js/jquery.mixitup.min",	// jquery 排序分类
		"laytpl": "../../assets/js/laytpl",		// 模版引擎
		"formValidator": "page/home.formValidator",	// Home模块的form验证
		"app": "page/app",	
		"article":"page/article",
		"home": "page/home",
		"allUser":"page/all-user",
		"photoWall":"page/photoWall"
	}
});
require(["jquery", "amazeui", "app"], function($) {
	if(typeof(thisPage) == "string"){
		require([thisPage]);
	}
});