/*
 *	导航生成 options 参数配置
 * 	
 * */
Handlebars.registerHelper('list', function(items, options) {
	var out = "<ul>";
	console.log(JSON.stringify(items));
	for (var i = 0, l = items.length; i < l; i++) {
		out = out + "<li>" + options.fn(items[i]) + "</li> ";
	}
	return out + "</ul>";
});