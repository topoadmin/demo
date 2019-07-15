/*入口脚本*/
require.config({
	paths: { // -- 配置别名
		"amazeui" : "http://cdn.amazeui.org/amazeui/2.6.2/js/amazeui.min",
		"jquery" : "http://libs.cdnjs.net/jquery/2.1.4/jquery.min",
		"vue" : "http://cdnjs.cloudflare.com/ajax/libs/vue/1.0.24/vue.min",
		"lazyload" : "http://libs.cdnjs.net/jquery.lazyload/1.9.1/jquery.lazyload.min",
		"fastclick" : "http://apps.bdimg.com/libs/fastclick/1.0.0/fastclick.min",
//		"jquery": "plugs/jquery.min",
//		"amazeui": "plugs/amazeui.min",
//		"vue": "plugs/vue.min",
//		"lazyload": "plugs/jquery.lazyload.min",
		"circliful": "plugs/jquery.circliful.min",
		"swiper": "plugs/swiper-3.3.1.jquery.min",
		"gsJsPlugs": "plugs/gsJsPlugs.min",
		"details": "details",
		"cart": "cart"
	}
});
require(["jquery", "amazeui"], function($) {
	$(function() {
		require(["fastclick"],function(attachFastClick){
			attachFastClick.attach(document.body);
		})
		if (typeof requireJs == "string") {
			if (requireJs) {
				indexInit();
			}
		} else if (typeof(requireJs) == "object") {
			require(requireJs);
		}
	});

	// 首页初始化
	function indexInit() {
		require(["swiper"], function(Swiper) {
			var $homeSwiper = $("#nw-home-swiper");
			var $swiperPage = $homeSwiper.children("ol.swiper-pagination");
			new Swiper($homeSwiper, {
		        pagination: '.swiper-pagination',
		        paginationClickable: true,
		        paginationElement : 'li',
		        speed:400,
		        resistanceRatio : 0
		    });
		});
		
		
		// 获取购物车数据
		var nwFooter = $("#nw-footer");
		var nwStoreVal = $.AMUI.store.get("nw_store");
		if (nwStoreVal) {
			if (nwStoreVal.cartNumber > 0) {
				nwFooter.find("div.footer-shopping-basket").addClass("have").children("span.basket-icon").text(nwStoreVal.cartNumber);
			}
		}
		require(["lazyload"], function() {
			var $window = $(window);
			var _windowH = $window.height();
			var $commodity = $("#nw-commodity-show");
			var $lazyImg = $commodity.find("img.lazy-img");
			var $zc = $commodity.find("div.zhongchou-box");
			var _zcH = $zc.offset().top;
			var _isScrollZc = false;
			$lazyImg.lazyload({threshold : 600});
			$window.on("scroll", function() {
				if (($window.scrollTop() + _windowH) > _zcH && !_isScrollZc) {
					_isScrollZc = true;
					require(["circliful"], function() {
						$zc.find("div.circliful").circliful({
							dimension: 100, // 圆形宽高
							width: 5, // 厚度
							animationStep: 1, // 动画速度
							text: "众筹中", // 文本
							fgcolor: "#FFCC33", // 前景颜色
							bgcolor: "#999999" // 背景颜色
						});
					});
				}
			});
			$window.trigger("scroll");
		});
	}
});