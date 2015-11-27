(function webpackUniversalModuleDefinition(root, factory) {
	if (typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if (typeof define === 'function' && define.amd)
		define([], factory);
	else if (typeof exports === 'object')
		factory();
	else
		factory();
})(this, function() {
	var nav = [{
		url: "入门.html",
		txt: "入门"
	},{
		url: "列表.html",
		txt: "列表"
	},{
		url: "表格.html",
		txt: "表格"
	},{
		url: "表单控件.html",
		txt: "表单控件"
	},{
		url: "计算属性.html",
		txt: "计算属性"
	},{
		url: "条件判断.html",
		txt: "条件判断"
	},{
		url: "动画过渡.html",
		txt: "动画过渡"
	},{
		url: "指令事件.html",
		txt: "指令事件"
	},{
		url: "自定义指令.html",
		txt: "自定义指令"
	},{
		url: "class与style绑定.html",
		txt: "class与style绑定"
	},{
		url: "组件.html",
		txt: "组件"
	},{
		url: "自定义过滤器.html",
		txt: "自定义过滤器"
	}];
	return nav;
});