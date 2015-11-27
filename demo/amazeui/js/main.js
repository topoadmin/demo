/*入口脚本*/
require.config({
    paths: {	// -- 配置别名
    	"jquery":"../assets/js/jquery.min",
    	"amazeui":"../assets/js/amazeui.min",
    	"app":"module/app",
    	"user":"user",
    	"countUp":"module/countUp",
    	"autoexec":"module/autoexec"
    }
});
require(["amazeui"],function(){
	require(["autoexec","app"]);
});













