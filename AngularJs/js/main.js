require.config({
	paths: {
		"jquery": "http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min",
		"angular": "../assets/js/angular.min",
		"angularUiRouter": "../assets/js/angular-ui-router"
	},
	shim: {
		'angular': {
			"exports": 'angular'
		}
	}
});


require(['jquery', 'angular'], function($, angular) {
});