define(["angular", "angularUiRouter"], function(angular) {
	require(["gsJsPlugs"], function(gs) {
	});

	var app = angular.module("admin", ["ui.router", "nav-module", "main-module"]);
	app.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/index");
		$stateProvider
			.state('index', {
				url: '/index',
				views: {
					'': {
						templateUrl: 'tpls/index.html'
					},
					'nav@index': {
						templateUrl: 'tpls/nav.html',
						controller: "my-nav"
					},
					'main@index': {
						templateUrl: 'tpls/commonFn.html',
						controller: "my-main"
					}
				}
			})
			.state('index.demo', {
				url: '/demo',
				views: {
					'main@index': {
						templateUrl: 'tpls/demo.html'
					}
				}
			})
	});

	// --生成导航
	var navModule = angular.module("nav-module", []);
	navModule.controller('my-nav', function($scope) {
		$scope.items = [{
			title: "常用函数",
			url: "index"
		}, {
			title: "测试多层次路由",
			url: "index.demo"
		}];
	});

	var mainModule = angular.module("main-module", []);
	mainModule.controller('my-main', ["$scope", "getUsersService", function($scope, $getUsersService) {
		$getUsersService.userList("data/commonFn.json").success(function(data) {
			console.log(data);
			$scope.items = data
		});
	}]);

	app.factory("getUsersService", ["$http", function($http) {
		if ($http) {
			var request = function(url) {
				return $http({
					method: "GET",
					url: url
				})
			}
			return {
				userList: function(url) {
					return request(url);
				}
			}
		}
	}]);

});