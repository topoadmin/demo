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

var _path = "images/2016firsthalfresults_";
var imgArr = [
	_path + "bg.png", 
	_path + "music_play.png", 
	_path + "music_pause.png", 
	_path + "arr_down.png", 
	_path + "logo.png", 
	_path + "load_border.png", 
	_path + "load_img.png", 
	_path + "footer_logo.png", 
	_path + "footer_title.png", 
	_path + "footer_0.png", 
	_path + "logo.png",
	_path + "tzzdw_fbhxc_0.jpg",
	_path + "tzzdw_fbhxc_1.jpg",
	_path + "tzzdw_sds_title_0.png",
	_path + "tzzdw_sds_title_0.png",
	_path + "tzzdw_zq_title_0.png",
	_path + "tzzdw_zq_title_0.png",
	_path + "tzzdw_fhy_title_0.png",
	_path + "tzzdw_fhy_title_0.png",
	_path + "tzzdw_wk_title_0.png",
	_path + "tzzdw_wk_title_0.png",
	_path + "s0_bg.png", _path + "s0_logo.png", _path + "s0_right.png", _path + "s0_title.png", _path + "s1_0.png", _path + "s1_1.png", _path + "s1_2.png", _path + "s1_3.png", _path + "s1_4.png", _path + "s1_5.png", _path + "s1_6.png", _path + "s1_7.png", _path + "s1_title.png", _path + "s1_title_1.png", _path + "s2_0.png", _path + "s2_1.png", _path + "s2_2.png", _path + "s2_3.png", _path + "s2_title_1.png", _path + "s3_title_1.png", _path + "s3_title.png", _path + "s3_0.png", _path + "s3_1.png", _path + "s3_2.png", _path + "s4_0.png", _path + "s4_1.png", _path + "s4_2.png", _path + "s4_3.png", _path + "s4_4.png", _path + "s4_5.png", _path + "s4_title_1.png", _path + "s5_0.png", _path + "s5_1.png", _path + "s5_2.png", _path + "s5_3.png", _path + "s5_4.png", _path + "s5_5.png", _path + "s5_title_1.png", _path + "s6_0.png", _path + "s6_1.png", _path + "s6_2.png", _path + "s6_3.png", _path + "s6_title_1.png", _path + "s7_0.png", _path + "s7_1.png", _path + "s7_2.png", _path + "s7_3.png", _path + "s7_title_1.png", _path + "s8_0.png", _path + "s8_1.png", _path + "s8_2.png", _path + "s8_3.png", _path + "s8_4.png", _path + "s8_title.png", _path + "s8_title_1.png", _path + "s9_0.png", _path + "s9_1.png", _path + "s9_2.png", _path + "s9_3.png", _path + "s9_4.png", _path + "s9_5.png", _path + "s9_6.png", _path + "s9_7.png", _path + "s9_title_1.png", _path + "s10_0.png", _path + "s10_1.png", _path + "s10_2.png", _path + "s10_3.png", _path + "s10_4.png", _path + "s10_5.png", _path + "s10_6.png", _path + "s10_7.png", _path + "s10_8.png", _path + "s10_9.png", _path + "s10_title_1.png", _path + "s11_0.png", _path + "s11_1.png", _path + "s11_2.png", _path + "s11_3.png", _path + "s11_4.png", _path + "s11_5.png", _path + "s11_title_1.png", _path + "s12_0.png", _path + "s12_1.png", _path + "s12_2.png", _path + "s12_3.png", _path + "s12_4.png", _path + "s12_5.png", _path + "s10_title_1.png", _path + "s13_0.png", _path + "s13_1.png", _path + "s13_2.png", _path + "s13_title_1.png"];

$(function() {
	var bottom = document.getElementById("bottom");
	new LoadImg(imgArr, null, function(progress, totalnum) {
		document.getElementById("loadTxt").innerHTML = parseInt(progress / totalnum * 100) + "%";
	}, function() {
		document.getElementById("load").className = "hid";
		document.getElementById("body").className = "show";
	}, false);

	var audio_bg = document.getElementById("audio_bg");
	var btn_music = document.getElementById("btn_music");
	btn_music.addEventListener("touchstart", function(e) {
		if(btn_music.className != "pause") {
			btn_music.className = "pause";
			audio_bg.pause();
		} else {
			btn_music.className = "";
			audio_bg.play();
		}
	});

	window.addEventListener("touchstart", function(e) {
		if(btn_music.className != "pause") {
			audio_bg.play();
		}
	});

	var $logo = $("div.main").children("a.logo");
	var $happysummer = $("#happysummer");
	new Swiper($happysummer, {
		speed: 700,
		direction: "vertical",
		followFinger: false,
		cube: {
			shadow: false,
			slideShadows: true,
			shadowOffset: 20,
			shadowScale: 1
		},
		initialSlide: 0,
		mousewheelControl: true,
		onInit: function(swiper) {
			swiperAnimateCache(swiper); //隐藏动画元素 
			swiperAnimate(swiper); //初始化完成开始动画
		},
		onSlideChangeStart: function(swiper) {
			var activeIndex = swiper.activeIndex;
			if(activeIndex < 0 || activeIndex == swiper.slides.length - 1) {
				$logo.addClass("logo-hide").removeClass("logo-show");
				bottom.className = "";
			} else {
				$logo.addClass("logo-show");
				bottom.className = "show";
			}
		},
		onSlideChangeEnd: function(swiper) {
			swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
		}
	});
	$logo.on("webkitAnimationEnd", function() {
		$logo.removeClass("logo-hide")
	});

});