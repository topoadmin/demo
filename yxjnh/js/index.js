/**
 * 图片load
 * @param imgArr : 图片数组
 * @param startCallback : 开始请求调用
 * @param progressCallback : 每次load图调用
 * @param finishCallback : 结束之后调用
 * @param returnImg : 是否返回图片对象
 */
function LoadImg(imgArr, startCallback, progressCallback, finishCallback, returnImg) {
	this.imgArr = imgArr; //图片数组
	this.startCallback = startCallback; //开始请求回发
	this.progressCallback = progressCallback; //每次load图回发
	this.finishCallback = finishCallback; //结束之后回发
	this.totalNum = 0; //总图片数量
	this.progressNum = 0; //已load数量
	this.resultImg = new Array(); //总已load图片集合
	this.returnImg = returnImg ? returnImg : false;
	this.Init();
}
LoadImg.prototype = {
	Init: function() {
		var self = this;
		if(!self.isArray(self.imgArr)) {
			return
		};
		self.totalNum = self.imgArr.length;
		if(self.isFunction(self.startCallback)) {
			// 开始请求回调
			self.startCallback()
		};
		for(var i = 0; i < self.imgArr.length; i++) {
			var img = new Image();
			img.onload = function(e) {
				self.progressNum++;
				if(self.returnImg) {
					self.resultImg[this.getAttribute("src")] = this;
				}
				if(self.isFunction(self.progressCallback)) {
					// 加载中回调
					self.progressCallback(self.progressNum, self.totalNum)
				};
				if(self.progressNum == self.totalNum && self.isFunction(self.finishCallback)) {
					// 加载完毕回调
					self.finishCallback(self.resultImg)
				};
			}
			img.src = self.imgArr[i];
		}
	},
	isArray: function(s) {
		return Object.prototype.toString.call(s) === "[object Array]"
	},
	isFunction: function(s) {
		return Object.prototype.toString.call(s) === "[object Function]"
	}
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