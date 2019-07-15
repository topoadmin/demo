/* 热加载 , 自动刷新浏览器 */
//引入插件
var gulp = require('gulp');
var connect = require('gulp-connect');

//创建watch任务去检测html文件,其定义了当html改动之后，去调用一个Gulp的Task
gulp.task('watch', function() {
	gulp.watch(['./www/**/*.*'], ['html']);
});

//使用connect启动一个Web服务器
gulp.task('connect', function() {
	connect.server({
		root: 'www',
		livereload: true
	});
});

gulp.task('html', function() {
	gulp.src('./www/**/*.*')
		.pipe(connect.reload());
});

//运行Gulp时，默认的Task
gulp.task('default', ['connect', 'watch']);