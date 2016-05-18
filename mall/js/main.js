require.config({
	paths: {
		"angular": "../../build/js/angular/angular.min",
		"angularUiRouter": "../../build/js/angular/angular-ui-router.min",
		"gsJsPlugs": "gsJsPlugs",
		"app": "app"
	},
	shim: {
		"angular": {
			exports: "angular"
		},
		'angularUiRouter': {
			deps: ["angular"],
			exports: 'angularUiRouter'
		},

	}
});
require(["angular", "angularUiRouter", "app"], function(angulara) {
	angular.bootstrap(document, ['admin']);
});