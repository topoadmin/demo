require.config({
	paths: {
		  	"amazeui":"../assets/js/amazeui.min",	// 妹子Ui
		"jquery": "../assets/js/jquery.min",
		//		"jquery":"http://libs.baidu.com/jquery/2.0.0/jquery.min",	百度cdn搭配妹子会出BUG
//		"amazeui": "http://cdn.amazeui.org/amazeui/2.5.0/js/amazeui.min",
		"lazyload": "module/jquery.lazyload",
		"easing": "module/jquery.easing",
		"mixitup": "module/jquery.mixitup",
		"storage": "module/storage",
		"laytpl": "module/laytpl",
		"formValid": "module/jquery.formValid",
		"app": "page/app",
		"article":"page/article",
		"home": "page/home"
	}
});
require(["jquery", "amazeui", "app"], function($) {
	require([thisPage]);
});