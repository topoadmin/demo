window.onload = function() {
	//loading：全部加载
	var iosAgent = getUserAgent().ios;
	var app = document.getElementById("app");
	var load = document.getElementById("load");
	var loadNum = document.getElementById("load_num");
	var music = document.getElementById("music");
	var audio = document.getElementsByTagName("audio")[0];
	var page1 = document.getElementById("page1");
	var page2 = document.getElementById("page2");
	var getSource = function() {
		/* 注意这里路径,否则会报错 */
		var imgPath = "http://127.0.0.1:8020/gaoshi-github.github.com/imoocOne/img/";
//		var imgPath = "http://gaoshi-github.github.io/imoocOne/img/";
		var sourceArr = [
			"loading_bg.jpg",
			"music_disc.png",
			"music_pointer.png",
			"p1_bg.jpg",
			"p1_imooc.png",
			"p1_lantern.png",
			"p2_2016.png",
			"p2_bg.jpg",
			"p2_circle_inner.png",
			"p2_circle_middle.png",
			"p2_circle_outer.png",
			"p3_bg.jpg",
			"p3_blessing.png",
			"p3_couplet_first.png",
			"p3_couplet_second.png",
			"p3_logo.png",
			"p3_title.png"
		];
		for (var i = 0; i < sourceArr.length; i++) {
			sourceArr[i] = imgPath + sourceArr[i];
		};
		var res = [];
		res = res.concat(sourceArr);
		return res;
	}
	new mo.Loader(getSource(), {
		onLoading: function(cur, total) {
			// 加载中
//			console.log(parseInt(cur / total * 100) + '%');
			loadNum.innerText = parseInt(cur / total * 100) + '%';
		},
		onComplete: function() {
			// 加载完成
			load.className += " fadeOut";
			app.className += " fadeIn";
			app.style.opacity = "1";
			setTimeout(function() {
				load.remove();
			}, 1000);
			audio.play();
		},
		loadType: 1,
		minTime: 100	// 轮询时间
	});

	/* 换屏 */
	page1.addEventListener("touchstart", function(e) {
		page1.className += " slideOut";
		page2.className += " slideIn";
		setTimeout(function() {
			page2.className += " slideOut";
			page3.className += " slideIn";
		}, 4000);
	}, false);

	music.addEventListener("touchstart", function(e) {
		if (audio.paused) {
			if (iosAgent) {
				music.style.animationPlayState = "running";
				music.style.webkitAnimationPlayState = "running";
			} else {
				music.className = "play";
			}
			audio.play();
		} else {
			if (iosAgent) {
				music.style.animationPlayState = "paused";
				music.style.webkitAnimationPlayState = "paused";
			} else {
				music.className = "";
			}
			audio.pause();
		}
	}, false)

	audio.addEventListener("ended", function() {
		if (iosAgent) {
			music.style.animationPlayState = "paused";
			music.style.webkitAnimationPlayState = "paused";
		}
		music.className = "";
	}, false);
}

/* 获取设备系统  */
function getUserAgent() {
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	return {
		"android": isAndroid,
		"ios": isiOS
	}
}

