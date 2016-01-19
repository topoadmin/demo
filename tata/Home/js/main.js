require.config({
	paths: {
		 "amazeui":"../../assets/js/amazeui.min",	// 妹子Ui
		"jquery": "../../assets/js/jquery.min",
		"countUp": "../../assets/js/countUp", // 数字动态效果
//		"amazeui": "http://cdn.amazeui.org/amazeui/2.5.0/js/amazeui.min",
		"lazyload": "../../assets/js/jquery.lazyload",
		"easing": "../../assets/js/jquery.easing",
		"mixitup": "../../assets/js/jquery.mixitup",
		"storage": "module/storage",
		"laytpl": "../../assets/js/laytpl",
		"formValid": "../../assets/js/jquery.formValid",
		"app": "page/app",
		"article":"page/article",
		"home": "page/home",
		"allUser":"page/all-user"
	}
});
require(["jquery", "amazeui", "app"], function($) {
	if(typeof(thisPage) == "string"){
		require([thisPage]);
	}
});