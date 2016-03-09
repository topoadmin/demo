require.config({
	baseUrl: "../",
	paths: {
		"angular": "build/js/angular.min",
		"angularUiRouter": "build/js/angular-ui-router.min",
		"gsJsPlugs": "common/js/gsJsPlugs",
		"app": "common/js/app"
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