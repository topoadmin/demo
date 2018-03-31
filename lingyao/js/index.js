;
(function() {
	if(typeof(WeixinJSBridge) == "undefined") {
		document.addEventListener("WeixinJSBridgeReady", function(e) {
			setTimeout(function() {
				WeixinJSBridge.invoke('setFontSizeCallback', {
					"fontSize": 0
				}, function(res) {
				});
			}, 0);
		});
	} else {
		setTimeout(function() {
			WeixinJSBridge.invoke('setFontSizeCallback', {
				"fontSize": 0
			}, function(res) {
			});
		}, 0);
	}
})();
// 微信分享
function wxShare(shareData) {
	if(!wx) {
		console.error('请先获取微信 JS 接口');
		return false;
	}
	shareData = $.extend(true, {
		title: '小鹿寻城',
		desc: '小鹿寻城',
		link: window.location.href, // 分享链接
		imgUrl: 'http://m.xunchengweidao.com/xuncheng/assets/images/favicon.png',
		type: 'link',
		dataUrl: '',
		success: function() {
			alert('分享成功')
		},
		cancel: function() {
			alert('取消分享')
		},
		fail: function() {
			alert('分享失败')
		}
	}, shareData);

	wx.onMenuShareTimeline({ // 分享到朋友圈
		title: shareData.title,
		link: shareData.link,
		imgUrl: shareData.imgUrl,
		success: shareData.success,
		cancel: shareData.cancel,
		fail: shareData.fail
	});

	wx.onMenuShareAppMessage({ // 分享给朋友
		title: shareData.title, // 分享标题
		desc: shareData.desc, // 分享描述
		link: shareData.link, // 分享链接
		imgUrl: shareData.imgUrl, // 分享图标
		type: shareData.type, // 分享类型,music、video或link，不填默认为link
		dataUrl: shareData.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
		success: shareData.success,
		cancel: shareData.cancel,
		fail: shareData.fail
	});

	wx.onMenuShareQQ({ // 分享到QQ
		title: shareData.title, // 分享标题
		desc: shareData.desc, // 分享描述
		link: shareData.link, // 分享链接
		imgUrl: shareData.imgUrl, // 分享图标
		success: shareData.success,
		cancel: shareData.cancel,
		fail: shareData.fail
	});
	wx.onMenuShareQZone({ // 分享到QQ空间
		title: shareData.title, // 分享标题
		desc: shareData.desc, // 分享描述
		link: shareData.link, // 分享链接
		imgUrl: shareData.imgUrl, // 分享图标
		success: shareData.success,
		cancel: shareData.cancel,
		fail: shareData.fail
	});
	wx.onMenuShareWeibo({ // 分享到腾讯微博
		title: shareData.title, // 分享标题
		desc: shareData.desc, // 分享描述
		link: shareData.link, // 分享链接
		imgUrl: shareData.imgUrl, // 分享图标
		success: shareData.success,
		cancel: shareData.cancel,
		fail: shareData.fail
	});
}

function onResize($el) { // 窗口适应
	$('.box').css({
		width: $el.width(),
		height: $el.height() + 1
	})
}

function isWeixn() { // 判断是否属于微信浏览器
	var ua = navigator.userAgent.toLowerCase()
	return ua.match(/MicroMessenger/i) == 'micromessenger' ? true : false
}