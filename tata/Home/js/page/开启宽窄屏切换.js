/*
 	<li class="am-active">
		<a href="javascript:;" class="min80 fixed-widtn am-show-lg-only">
			<span class="am-icon-tv"></span>
			<span class="fixed-txt">宽屏</span>
		</a>
	</li>
	html加到head里
 * */
var $body = $("body"),
	$headerFixed = $(".header-fixed");
// -- 宽窄屏切换
require(["storage"], function(storage) {
	$(".fixed-widtn").on("click", function() {
		var $this = $(this),
			fixedTxt = $this.children(".fixed-txt"),
			txt = fixedTxt.text().trim();
		$this.parent("li").addClass("am-active").siblings("li").removeClass("am-active");
		fixedTxt.text((txt == "宽屏") ? "窄屏" : "宽屏")
		$body.toggleClass("am-g-fixed-min");
		$headerFixed.toggleClass("am-g-fixed-min");
		$(window).trigger("resize"); // 触发resize事件,轮播重设宽度
		if ($body.hasClass("am-g-fixed-min")) {
			storage.set("am-g-fixed-min", true);
			// 加载下一轮用户头像,防止页面加宽出现load图
			$("#user-box").find(".lazyload").trigger("sporty");
		} else {
			storage.set("am-g-fixed-min", false);
		}
	});
	var afmStorage = storage.get("am-g-fixed-min");
	if (afmStorage) {
		$(".fixed-widtn").trigger("click");
	}
});