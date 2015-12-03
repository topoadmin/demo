/*入口脚本*/
require.config({
    paths: {	// -- 配置别名
    	"amazeui":"../assets/js/amazeui.min",
    	"countUp":"module/countUp",
    	"chosen":"module/amazeui.chosen",
    	"datetime":"module/amazeui.datetimepicker",
    	"citiesChange":"module/jquery.citiesChange",
    	"autoexec":"page/autoexec",
    	"app":"page/app",
    	"user":"page/user",
    }
});
require(["amazeui"],function(){
	require(["autoexec","app"]);
});













