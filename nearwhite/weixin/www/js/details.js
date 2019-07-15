/*
 * gaoshi-github 
 * QQ:465040621
 * version: "0.0.4"
 * 开始时间 : 2016年4月28日10:26:33
 * 商品详情逻辑 - 后台互动版
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
	var amstore = $.AMUI.store;
	var nw = {
		id: gs.getUrlParam("id"), // 获取商品id
		storeKey: "nw_store", // 获取商品本地存储的key值
		storeVal: "", // 获取商品本地存储的value值
		cdata: false, // 当前商品数据
		isExist: false // 购物车是否存在此商品
	};
	var sizesStoreLack = []; // 记录库存不足的商品
	
	//  检查是否有存储购物车数据
	if (amstore.get(nw.storeKey)) {
		nw.storeVal = amstore.get(nw.storeKey);
	} else {
		nw.storeVal = amstore.set(nw.storeKey, {
			"cartPrice": "0",
			"cartNumber": 0,
			"items": []
		});
	}

	// 1、检查本地是否有储存数据
	if (nw.storeVal.items.length > 0) {
		for (var item = 0, items = nw.storeVal.items.length; item < items; item++) {
			var itemData = nw.storeVal.items[item];
			if (itemData.id && itemData.id == nw.id) {
				nw.isExist = true; // 状态改变，当前商品已加入购物车
				nw.cdata = $.extend(nw.cdata, itemData); // 本地存储数据替换后台数据
				break;
			}
		}
	}
	
	// 2、判断是否有数据
	if (nw.isExist) {
		// 2-有数据、渲染数据生成页面
		renduVue(nw, amstore);
		getNewData(true, function(data) {
			//	异步请求新数据来比较本地数据，替换旧图片，比较尺码数据，记录新值
			nw.cdata.imgs = data.imgs;
			var storeSizes = nw.cdata.sizes; // 记录本地尺码数据
			var newSizes = data.sizes; // 记录新尺码数据
			nw.cdata.sizes = [];
			var arrIterator = function(newSizes) {
				if (storeSizes.length > 0 && newSizes.length > 0) {
					var newSize = newSizes[0];
					for (var x = 0, y = storeSizes.length; x < y; x++) {
						var size = storeSizes[x];
						if (newSize.id == size.id) {
							size.sizeInventoryNum = newSize.sizeInventoryNum;
							if(size.sizeProvisionalNumber > size.sizeInventoryNum){	// 计算库存
								sizesStoreLack.push(size);	// 记录库存小于已选件数的商品
								size.sizeProvisionalNumber = size.sizeInventoryNum;
							}
							storeSizes.splice(x, 1); // 剔除已循环的值，提高性能
							newSizes.splice(0, 1);
							nw.cdata.sizes.push(size);
							arrIterator(newSizes); // 迭代
							break;
						}
					}
				} else {
					// 当存储的尺码数据已经读取完毕，这里开始生成新的数据
					for (var i = 0, j = newSizes.length; i < j; i++) {
						var size = newSizes[i];
						size.number = size.sizeProvisionalNumber = 0; // 尺码数量初始化
						size.totalPrice = "0.00"; // 尺码总价格初始化
						nw.cdata.sizes.push(size);
					}
				}
			}
			arrIterator(newSizes);
			if(sizesStoreLack.length){
				var $lackModal = $("#sizes_store_lack");
				var _li = "";
				for(var i=0,j=sizesStoreLack.length; i < j; i++){
					_li += "<li>"+sizesStoreLack[i].sizeName+" 仅剩 "+sizesStoreLack[i].sizeInventoryNum+" 件</li>";
				}
				$lackModal.find("ul.am-list").append(_li);
				$lackModal.modal();
			}
			confirmPrice(nw.cdata);
			console.log(JSON.stringify(nw.cdata));
		});
	} else {
		// 2-无数据、同步请求数据然后渲染
		getNewData(false, function(data) {
			nw.cdata = data;
			nw.cdata.id = nw.id; // 记录商品id
			nw.cdata.totalNumber = 0; // 总数量初始化
			nw.cdata.totalPrice = "0.00"; // 商品总价格
			// 初始化
			for (var i = 0, j = nw.cdata.sizes.length; i < j; i++) {
				var size = nw.cdata.sizes[i];
				size.number = size.sizeProvisionalNumber = 0; // 尺码数量初始化
				size.totalPrice = "0.00"; // 尺码总价格初始化
			}
			renduVue(nw, amstore);
		});
	}

	// 渲染数据
	function renduVue(nw, amstore) {
		// 数字取整
		Vue.filter('trunc', function(value) {
			return parseInt(value);
		});

		/* 记录购物车总价和总件数 */
		nw.cdata.cartNumber = nw.storeVal.cartNumber;
		nw.cdata.cartPrice = nw.storeVal.cartPrice;

		var vueCData = new Vue({
			el: '#app',
			data: nw.cdata,
			methods: {
				add: function(index, event) {
					var size = this.$data.sizes[index];
					if (size.sizeProvisionalNumber < size.sizeInventoryNum) {
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
					confirmPrice(this.$data);
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
			// iphone 点击蒙版时不触发下拉组件关闭事件,在这里手动触发
			$commodityChange.dropdown('close');
		});
		
		renduSwiper();
	}
	
	// 计算数据(总价之类)并写入本地存储
	function confirmPrice(data){
		// 点击确定按钮时  临时数据转为确认数据
		var addNumber = 0; // 记录尺码的总件数
		for (var i = 0, j = data.sizes.length; i < j; i++) {
			var sizeData = data.sizes[i];
			sizeData.number = sizeData.sizeProvisionalNumber;
			addNumber += sizeData.number;
			sizeData.totalPrice = gs.retainTwoNumber(gs.accMul(sizeData.number, data.price)); // 记录尺码总价
		}
		// 判断件数是否小于或等于0 并存储在本地，是就删除
		if (addNumber <= 0) {
			if (nw.id) {
				// 删除已保存的数据
				for (var i = 0, j = nw.storeVal.items.length; i < j; i++) {
					if (nw.id == nw.storeVal.items[i].id) {
						nw.storeVal.items.splice(i, 1);
						break;
					}
				}
				data.totalNumber = addNumber;
				// 初始化数据
				data.cartPrice = data.totalPrice = nw.storeVal.cartPrice = "0.00";
				data.cartNumber = nw.storeVal.cartNumber = gs.objectSum(nw.storeVal.items, "totalNumber");;
				nw.isExist = false;
				amstore.set(nw.storeKey, nw.storeVal);
			}
		} else {
			data.totalNumber = addNumber;
			data.totalPrice = gs.retainTwoNumber(gs.accMul(data.totalNumber, data.price));
			if (nw.isExist) {
				for (var item = 0, items = nw.storeVal.items.length; item < items; item++) {
					var itemData = nw.storeVal.items[item];
					if (itemData.id == nw.id) {
						nw.storeVal.items[item] = data;
					}
				}
			} else {
				nw.isExist = true;
				nw.storeVal.items.push(data);
			}
			// 计算购物车总价
			data.cartPrice = nw.storeVal.cartPrice = gs.retainTwoNumber(gs.objectSum(nw.storeVal.items, "totalPrice"));
			data.cartNumber = nw.storeVal.cartNumber = gs.objectSum(nw.storeVal.items, "totalNumber");
			// 修改本地数据
			amstore.set(nw.storeKey, nw.storeVal);
		}
	}
	
	//  渲染轮播
	function renduSwiper() {
		require(["swiper"], function(Swiper) {
			// 绑定内容弹层
			var $dContent = $("#details-content"),
				$dMoney = $dContent.find("div.details-money");

			// 开启上下触摸事件
			var mySwiper = new Swiper('#details-swiper', {
				pagination: '.swiper-pagination',
				paginationClickable: true,
				resistanceRatio: 0,
				direction: "vertical",
				onInit: function(swiper) {
					var $dSwiper = $("#details-swiper");
					var $swiperSlide = $dSwiper.find("div.swiper-slide");
					var $detailsInfoList = $("#details-info-list");
					$detailsInfoList.css("marginTop", ($dSwiper.height() - $detailsInfoList.height()) / 2);
					$swiperSlide.css("lineHeight", $swiperSlide.height() + "px"); // 详情图片上下居中
				},
				onSlideChangeStart: function(swiper) {
					// 判断是否到达底部
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
	}

	// 请求新数据
	function getNewData(async, callback) {
		$.ajax({
			type: "get",
			url: "js/data/details.json",
			dataType: "json",
			async: async,
			success: function(data) {
				if (callback) {
					callback(data);
				}
			}
		});
	}
}));