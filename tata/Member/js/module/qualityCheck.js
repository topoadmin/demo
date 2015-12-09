/***
 * 插件名称: 中国省市信息联动插件
 */
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require, exports, module);
	} else {
		factory();
	}
}(this, function(require, exports, module) {

	$.fn.addCheckbox = function(settings) {
		if (this.length < 1) {
			return;
		};

		var qdata = {
			character: [
				"温柔贤惠、懂生活、会持家长的顺眼就行。",
				"你要是能力强，愿意养家，我做家庭煮夫也是可以的。",
				"漂亮大方、懂事、健康、对生活充满热情的人。",
				"美女、个高、腿长、肤白、上得厅堂、入得厨房。",
				"懂事能撒娇，又能孝顺父母的姑娘就OK了。",
				"有爱心，喜欢孩子，能烧一手好菜。",
				"懂得给男人空间，做事得体大方，有气质，有学识，有一定社交能力的女孩。",
				"爱旅行爱运动，善于与人沟通，不人云亦云，有自己的主见。",
				"对婆媳关系处理上有耐心，懂得忍让，知晓吃亏是福的道理。"
			]
		}
		var $this = this;

		$this.on("click", function() {
			var $this = $(this),name = $this.attr("name"),
				$md = $("#my-quality-popup");
			
			addCheckbox(qdata[name],$md.find(".my-modal-content"),name);
			$md.data("input",$this).modal();
		})
		
		function addCheckbox(data, elm, name) {
			var _html = "",
				$elm = $(elm);
				
			for (var i = 0; i < data.length; i++) {
				_html += "<label class='am-checkbox-inline'><input name='"+name+"' type='checkbox' value='" + data[i] + "' data-am-ucheck>" + data[i] + "</label>";
			}
			$elm.html(_html)
		}

	};
}));