var app = angular.module("admin", ["ui.router", "nav-module"]);

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/magnify");
	$stateProvider.state('magnify', {
		url: "/magnify",
		templateUrl: "tpls/magnify.html",
		views: {
			"nav": {
				templateUrl: "tpls/nav.html",
				controller: "my-nav"
			},
			"page": {
				templateUrl: "tpls/magnify.html"
			}
		}
	}).state('page2', {
		url: "/page2",
		templateUrl: "tpls/page2.html",
		views: {
			"nav": {
				templateUrl: "tpls/nav.html",
				controller: "my-nav"
			},
			"page": {
				templateUrl: "tpls/page2.html"
			}
		}
	});
});

var navModule = angular.module("nav-module", []);
navModule.controller('my-nav', function($scope) {
	$scope.items = [{
		title: "input放大镜",
		url: "magnify"
	}];
});