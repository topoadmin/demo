/*
 * gaoshi-github 
 * QQ:465040621
 * version: "0.0.1"
 * 开始时间 : 2016年5月11日17:30:49
 * 支付页面
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
	$(function() {
		var cdata = {
			"totalPrice": "600.00", // 金额
			"totalNumber": 3, // 件数
			"favorablePrice": "0.00", // 优惠金额
			"favorableTotalPrice": "600.00", // 优惠后的总金额
			"favorable": "", // 优惠码
			"favorableStatus": false, // 优惠码是否正确
			"msg": "", // 留言
			"province": "北京", // 地址
			"city": "北京市",
			"district": "朝阳区",
			"houseaddress": "三里屯SOHO公寓17#2203", // 区域
			"userName": "小八", // 姓名
			"areaCode": "+86",
			"phone": "13701378834", // 手机
			"postcode": "100000", // 邮编
			"sites": [] // 地址集合
		};

		// 数据绑定
		var vueCData = new Vue({
			el: '#app',
			data: cdata,
			methods: {
				submit: function(event) {
					var payData = JSON.stringify(this.$data);
				},
				edit: function(index, event) {
					
				},
				change: function(index, event) {
					var changeSite = this.sites[index];
					for (var n in changeSite) {
						vueCData[n] = changeSite[n];
					}
					$paySiteModel.modal("close");
				},
				addSite: function() {
					$siteSlider.flexslider('next');
				}
			},
			computed: {
				msgLength: function() {
					return this.msg.length;
				}
			}
		});

	});
}));