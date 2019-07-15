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
		module.exports = factory(require("jquery"), require("vue"), require("gs"), require("amazeui"));
	} else {
		factory(root.jQuery);
	}
}(this, function($, Vue, gs) {
	// 数组求和函数
	var amstore = $.AMUI.store;
	var nw = {
		storeKey: "nw_store",
		storeVal: ""
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

	// 数据绑定
	var vueCData = new Vue({
		el: '#app',
		data: nw.storeVal,
		methods: {
			add: function(index, sizeIndex, event) {
				var sizeData = this.$data.items[index].sizes[sizeIndex];
				if (sizeData.number < sizeData.sizeInventoryNum) {
					sizeData.number++;
				} else {
					// 大于库存时提醒
					var evt = event.target;
					var numberInput = "";
					if (evt.tagName == "SPAN") {
						numberInput = $(evt).parent().siblings(".cart-number").children("input");
					} else {
						numberInput = $(evt).siblings(".cart-number").children("input");
					}
					numberInput.popover("open");
					setTimeout(function() {
						numberInput.popover("close");
					}, 1000);
				}
			},
			minus: function(index, sizeIndex) {
				this.$data.items[index].sizes[sizeIndex].number--;
			},
			cart: function() {
				amstore.set(nw.storeKey, vueCData.$data);
			}
		}
	});

	// 监控衣服尺码数量变化
	for (var item = 0, itemsLength = vueCData.$data.items.length; item < itemsLength; item++) {
		var sizesData = vueCData.items[item];
		if (typeof sizesData == "string") {
			sizesData = JSON.parse(sizesData);
		}
		for (var i = 0, j = sizesData.sizes.length; i < j; i++) {
			(function(item, i) {
				vueCData.$watch("items[" + item + "].sizes[" + i + "].number", function() {
					var $data = this.$data; // 购物车数据
					var itemData = $data.items[item]; // 商品数据
					var sizeData = itemData.sizes[i]; // 尺码数据
					sizeData.sizeProvisionalNumber = sizeData.number;
					// 修改衣服尺寸的总价
					sizeData.totalPrice = gs.retainTwoNumber(gs.accMul(sizeData.number, itemData.price));
					// 修改衣服总件数和总价和按钮文本
					itemData.totalNumber = gs.objectSum(itemData.sizes, "number");
					itemData.totalPrice = gs.retainTwoNumber(gs.accMul(itemData.totalNumber, itemData.price));
					/*if (itemData.totalNumber == 0) {
						$data.items.splice(item, 1);
					}*/
					// 修改过购物车衣服总件数和总价
					$data.cartPrice = gs.retainTwoNumber(gs.objectSum(this.items, "totalPrice"));
					$data.cartNumber = gs.objectSum(this.items, "totalNumber");

					// 修改本地数据
					amstore.set(nw.storeKey, vueCData.$data);
					//console.info("修改后的数据：" + JSON.stringify(vueCData.$data));
				});
			}(item, i));
		}
	}

}));