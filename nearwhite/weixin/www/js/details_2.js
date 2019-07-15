/*
 * gaoshi-github 
 * QQ:465040621
 * version: "0.0.3"
 * 开始时间 : 2016年4月28日10:26:33
 * 商品详情逻辑
 * */
(function(root, factory) {
	if (typeof define === "function" && define.amd) {
		define(["jquery", "vue", "gsJsPlugs", "amazeui"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"), require("vue"), require("gsJsPlugs"), require("amazeui"));
	} else {
		factory(root.jQuery);
	}
}(this, function($, Vue, gs) {
	// 数组求和函数
	var amstore = $.AMUI.store;
	var nw = {
		id: gs.getUrlParam("id"), // 获取商品id
		storeKey: "nw_store", // 获取商品本地存储的key值
		storeVal: "", // 获取商品本地存储的value值
		cdata: false, // 当前商品数据
		isExist: false // 购物车是否存在此商品
	};
	if (!nw.id) {
		alert("找不到商品[ID]，即将返回首页!");
		window.location.href = "index.html";
		return;
	}

	//  判断是否有存储数据
	if (amstore.get(nw.storeKey)) {
		nw.storeVal = amstore.get(nw.storeKey);
	} else {
		nw.storeVal = amstore.set(nw.storeKey, {
			"cartPrice": "0",
			"cartNumber": 0,
			"items": []
		});
	}

	// 读取数据判断有没有已存储的的数据
	if (nw.storeVal.items.length > 0) {
		for (var item = 0, items = nw.storeVal.items.length; item < items; item++) {
			var itemData = nw.storeVal.items[item];
			if (itemData.id) {
				if (itemData.id == nw.id) {
					nw.isExist = true;
					nw.cdata = itemData;
					break;
				}
			}
		}
	}

	// 如果没有数据就去读取数据
	if (!nw.cdata) {
		nw.cdata = {
			"id": "1",
			"sizes": [{
				"storeNumber": 2,
				"sizeTitle": "XS(160/80A)"
			}, {
				"storeNumber": 3,
				"sizeTitle": "S (165/84A)"
			}, {
				"storeNumber": 4,
				"sizeTitle": "M (170/88A)"
			}, {
				"storeNumber": 5,
				"sizeTitle": "L (175/96A)"
			}],
			"imgs": [
				"img/img1.jpg",
				"img/img2.jpg",
				"img/img3.jpg",
				"img/img4.jpg",
				"img/img5.jpg"
			],
			"price": "100.00",
			"title": "白衬衫限量版"
		}
		nw.cdata.id = nw.id;
		nw.cdata.totalNumber = nw.cdata.totalNumber = 0;
		for (var i = 0, j = nw.cdata.sizes.length; i < j; i++) {
			var size = nw.cdata.sizes[i];
			size.number = size.sizeProvisionalNumber = 0;
			size.totalPrice = "0.00";
		}
		nw.cdata.buttonTitle = nw.cdata.sizes[0].sizeTitle;
	}

	/* 记录购物车总价和总件数 */
	nw.cdata.cartNumber = nw.storeVal.cartNumber;
	nw.cdata.cartPrice = nw.storeVal.cartPrice;
	
	console.log(JSON.stringify(nw.cdata));
	// 数据绑定
	var vueCData = new Vue({
		el: '#app',
		data: nw.cdata,
		methods: {
			add: function(index, event) {
				var size = this.$data.sizes[index];
				if (size.sizeProvisionalNumber < size.storeNumber) {
					size.sizeProvisionalNumber++;
				} else {
					// 大于库存时提醒
					var evt = event.target;
					var numberInput = "";
					if (evt.tagName == "SPAN") {
						numberInput = $(evt).parent().siblings(".details-number").children("input");
					} else {
						numberInput = $(event.target).siblings(".details-number").children("input");
					}
					numberInput.popover("open");
					setTimeout(function() {
						numberInput.popover("close");
					}, 1000);
				}
			},
			minus: function(index) {
				this.$data.sizes[index].sizeProvisionalNumber--;
			},
			confirmPrice: function() {
				var _data = this.$data;
				// 点击确定按钮时  临时数据转为确认数据
				var addNumber = 0; // 记录尺码的总件数
				for (var i = 0, j = _data.sizes.length; i < j; i++) {
					var sizeData = _data.sizes[i];
					sizeData.number = sizeData.sizeProvisionalNumber;
					addNumber += sizeData.number;
					sizeData.totalPrice = gs.retainTwoNumber(gs.accMul(sizeData.number, _data.price)); // 记录尺码总价
				}

				// 判断件数是否小于或等于0 并存储在本地，是就删除
				if (addNumber <= 0) {
					if (typeof nw.id != "undefined") {
						// 删除已保存的数据
						for (var i = 0, j = nw.storeVal.items.length; i < j; i++) {
							if (nw.id == nw.storeVal.items[i].id) {
								nw.storeVal.items.splice(i, 1);
								break;
							}
						}
						// 初始化数据
						_data.cartPrice = nw.storeVal.cartPrice = "0.00";
						_data.cartNumber = nw.storeVal.cartNumber = gs.objectSum(nw.storeVal.items, "totalNumber");;
						_data.buttonTitle = _data.sizes[0].sizeTitle;
						nw.isExist = false;
						amstore.set(nw.storeKey, nw.storeVal);
					} else {
						console.info("什么都不用做，测试用！");
					}
				} else {
					_data.totalNumber = addNumber;
					_data.totalPrice = gs.retainTwoNumber(gs.accMul(_data.totalNumber, _data.price));
					_data.buttonTitle = "￥" + _data.totalPrice;
					if (nw.isExist) {
						for (var item = 0, items = nw.storeVal.items.length; item < items; item++) {
							var itemData = nw.storeVal.items[item];
							if (itemData.id == nw.id) {
								nw.storeVal.items[item] = _data;
							}
						}
					} else {
						nw.isExist = true;
						nw.storeVal.items.push(_data);
					}
					_data.cartPrice = nw.storeVal.cartPrice = gs.retainTwoNumber(gs.objectSum(nw.storeVal.items, "totalPrice"));
					_data.cartNumber = nw.storeVal.cartNumber = gs.objectSum(nw.storeVal.items, "totalNumber");

					// 修改本地数据
					amstore.set(nw.storeKey, nw.storeVal);
					//console.info("修改后的数据：" + JSON.stringify(nw.storeVal));
				}
			}
		}
	});

	/* DOM 操作  */
	var $commodityChange = $("#commodity-change");
	var $dropdownBg = $("#dropdown-bg");
	/* 上拉框监控事件  */
	$commodityChange.on("open.dropdown.amui", function() {
		$dropdownBg.addClass("am-active");
		$commodityChange.find(".clothes-change-ok").removeClass("am-hide");
	}).on("closed.dropdown.amui", function() {
		if ($dropdownBg.hasClass("am-active")) {
			$commodityChange.find(".clothes-change-ok").addClass("am-hide");
			if (vueCData) {
				var sizes = vueCData.$data.sizes;
				for (var i = 0, j = sizes.length; i < j; i++) {
					sizes[i].sizeProvisionalNumber = sizes[i].number;
				}
			}
			$dropdownBg.removeClass("am-active");
		}
	});

	$dropdownBg.click(function() {
		// iphone 点击蒙版时不触发下拉组件关闭事件
		$commodityChange.dropdown('close');
	});

	require(["swiper"], function(Swiper) {
		// 绑定内容弹层
		var $dContent = $("#details-content"),
			$dMoney = $dContent.find("div.details-money");

		// 开启上下触摸事件
		var mySwiper = new Swiper('#details-swiper', {
			pagination: '.swiper-pagination',
			paginationClickable: true,
			direction: "vertical",
			onInit: function(swiper) {
				var $dSwiper = $("#details-swiper");
				var $swiperSlide = $dSwiper.find("div.swiper-slide");
				var $detailsInfoList = $("#details-info-list");
				$detailsInfoList.css("margin-top", ($dSwiper.height() - $detailsInfoList.height()) / 2);
				$swiperSlide.css("lineHeight", $swiperSlide.height() + "px"); // 详情图片上下居中
			},
			onSlideChangeStart: function(swiper) {
				// 滑动一次判断是否到达底部
				if (swiper.activeIndex + 1 != swiper.slides.length) {
					$dMoney.removeClass("am-hide");
				} else {
					$dMoney.addClass("am-hide");
				}
			}
		});

		// 设计师寄语等等
		var $dModel = $dContent.find("div.d-model"),
			$dModelContent = $dModel.find("div.d-model-content>div"),
			$detailsList = $dContent.find("ul.details-info-list");
		$detailsList.on("click", "li>p", function(e) {
			$dModelContent.html($(this).next().html());
			$dModel.removeClass("am-hide");
		});
		$dModel.on("click", "a.d-model-remove", function(e) {
			$dModel.addClass("am-hide");
		});
	});

}));