/*入口脚本*/
require.config({
    paths: {	// -- 配置别名
    	"amazeui":"../assets/js/amazeui.min",
    	"app":"module/app",
    	"user":"user",
    	"countUp":"module/countUp",
    	"autoexec":"module/autoexec",
    	"datetime":"module/amazeui.datetimepicker",
    	"chosen":"module/amazeui.chosen"
    }
});
require(["amazeui"],function(){
	require(["autoexec","app"]);
});













