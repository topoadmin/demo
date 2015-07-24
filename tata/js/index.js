var loginInterval; //短信验证码定时器
/*插件初始化*/
$(function() {
	// 背景图轮播
	var slideshow = $("#slider4");
	var callbacks;
	$("#slider4").responsiveSlides({
		auto: true,
		pager: true,
		nav: false,
		speed: 500,
		fade: 1000,
		timeout: 4000, 
		pauseControls: true,
		pause: true,
		namespace: "callbacks",
		before: function() {
			if(!callbacks){
				callbacks =$(".callbacks_tabs");
			}
			var cbIndex = callbacks.find(".callbacks_here").index();
			var li = slideshow.find("li").eq(cbIndex);
			var logo = li.find(".caption-logo");
			var title = li.find(".caption-title");
			logo.addClass(logo.data("animate"));
			title.addClass(title.data("animate"));
		},
		after: function() {
		}
	});
	// 背景图自适应浏览器高度
	var winHeight = $(window).height();
	slideshow.children("li").height(winHeight)
	$(window).resize(function(){
		var winHeight = $(window).height();
		slideshow.children("li").height(winHeight)
	})
	
	// 客户留言自动播放
//	$("#owl-demo1").owlCarousel({
//		items: 1,
//		lazyLoad: true,
//		autoPlay: true,
//		navigation: false,
//		navigationText: false,
//		pagination: true,
//	});
	
	// 头像自动播放
	$("#owl-demo").owlCarousel({
		items: 1,
		lazyLoad: true,
//		autoPlay: true,
		navigation: false,
		navigationText: false,
		pagination: true,
		stopOnHover:true
	});
	
	var filterList = {
		init: function() {
			// MixItUp插件 无刷新排序
			$('#portfoliolist').mixitup({
				targetSelector: '.portfolio',
				filterSelector: '.filter',
				effects: ['fade'],
				easing: 'snap',
				// 悬浮效果
				onMixEnd: filterList.hoverEffect()
			});
		},
		hoverEffect: function() {
		}
	};
	filterList.init();
});

/*自定义事件和函数*/
$(function(){
	var login = $("#login-btn");
	var reg = $("#reg-btn");
	var dialog = $(".dialog");
	var msgBtn = $(".send_sms_code");
	login.on("click",function(){
		dialogChange(dialog,$("#login-dialog"))
	});
	reg.on("click",function(){
		dialogChange(dialog,$("#init-reg-dialog"))
	});
	$(".reg-btn").on("click",function(){
		reg.click();
	})
	$(".close").on("click",function(){
		dialogChange(dialog);
	});
	msgBtn.on("click",function(){
		// 进行ajax验证
		sendMsg($(this));
	}).css({"background":"#a2867c"});
	
	$("#reg-password").on("click",function(){
		dialogChange(dialog,$("#reset_password-dialog"))
	})
	// 绑定回车键按下时的效果
	$(document).bind("keydown",function(e){
		var k = e.keyCode || e.which;
		if (k === 13){
			// 获取当前弹出框
			var thisDl = $(".dialog.show").find(".login-btn");
			thisDl.click();
			return false;
		}else if(k == 27){
			dialogChange(dialog);
		}else if(k == 9){
			if(!dialog.hasClass("show")){
				return false;
			}
		}
		
	})
	
	// form确定按钮事件
	$(".login-btn").on("click",function(){
		clearTimeout(loginInterval);
		var thisForm = $(this).parents("form");
		var affirm= ifWhetherFn(thisForm);
		if(affirm.status == 1){
			if($(this).text() == "立即注册"){
				dialogChange(dialog,$("#middle-reg-dialog"))
			}else{
				dialogChange(dialog);
			}
		}else{
			alert(affirm.titles+"未填写");
		}
	})
	
	// 滑动特效
	$('#portfoliolist').find(".a-hover").mouseenter(function(){
		var info = $(this).next();
		info.fadeIn(555);
		info.mouseleave(function(){
			info.fadeOut(222);
		})
	});
	// 点击个人肖像打开个人资料
	$(".tata-man").find("img").on("click",function(){
		dialogChange(dialog,"#person-dialog");
	});
	
	addEventInput();	//绑定input输入事件
	
	
})

// 关闭其他弹窗，展示当前弹窗
function dialogChange(dialog,node){
//	$("body").css("overflow-y","hidden");
	clearTimeout(loginInterval);
	$(':input').not(':button, :submit, :reset, :hidden').css("border", "1px solid #d5d5d5").val("");
	$("input[type=text]").val("");
	$(dialog).removeClass("show").addClass("hide");
	$(node).addClass("show").removeClass("hide");
	$(node).find("input").eq(0).focus();
}

function keyupFn(node){
	node.value=node.value.replace(/\D/g,'');
}
function afterpasteFn(node){
	node.value=node.value.replace(/\D/g,'');
}

