require.config({
	baseUrl:"../",
	paths: {
		"angular": "build/js/angular.min",
		"angularUiRouter":"build/js/angular-ui-router.min",
		"app" : "common/js/app"
	},
	shim: {
		"angular": {
			exports: "angular"
		},
		'angularUiRouter':{
          deps: ["angular"],
          exports: 'angularUiRouter'
       },
		
	}
});
require(["angular","angularUiRouter","app"], function(angular) {
	angular.bootstrap(document, ['admin']);
});
