/*入口脚本*/
require.config({
    paths: {	// -- 配置别名
//  	"amazeui":"../../assets/js/amazeui.min",	// 妹子Ui
    	"jquery":"../assets/js/jquery.min",
//		"jquery":"http://libs.baidu.com/jquery/2.0.0/jquery.min",
    	"amazeui":"http://cdn.amazeui.org/amazeui/2.5.0/js/amazeui.min",
    	"app":"page/app",
    	"home":"page/home"
    }
});
require(["amazeui","app"],function(){
	moduleLoad();
});













