var app = angular.module("admin", ["ui.router", "nav-module"]);
app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/input-magnify");
	$stateProvider.state('input-magnify', {
		url: "/input-magnify",
		templateUrl: "tpls/input-magnify.html",
		views: {
			"nav": {
				templateUrl: "tpls/nav.html",
				controller: "my-nav"
			},
			"page": {
				templateUrl: "tpls/input-magnify.html"
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