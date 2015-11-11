/*入口脚本*/
require.config({
    paths: {	// -- 配置别名
    	"jquery":"../assets/js/jquery.min",
    	"amazeui":"../assets/js/amazeui.min",
    	"app":"../assets/module/app",
    	"countUp":"../assets/module/countUp",
    	"autoexec":"../assets/module/autoexec"
    }
});
define(["amazeui"], function($) {　　　
	require(["autoexec","app"]);
});








