define(["angular", "angularUiRouter"], function(angular) {
	var gs = require(["gsJsPlugs"], function(gs) {});

	var app = angular.module("admin", ["ui.router", "nav-module", "array-module"]);

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
						templateUrl: 'tpls/array.html',
						controller: "my-array"
					}
				}
			})
			.state('index.string', {
				url: '/string',
				views: {
					'main@index': {
						templateUrl: 'tpls/string.html'
					}
				}
			})
	});

	// --生成导航
	var navModule = angular.module("nav-module", []);
	navModule.controller('my-nav', ["$scope", "getUsersService", function($scope, $getUsersService) {
		$getUsersService.userList("data/nav.json").success(function(data) {
			$scope.items = data
		});
	}]);

	// 数组操作
	var mainModule = angular.module("array-module", []);
	mainModule.controller('my-array', ["$scope", "getUsersService", function($scope, $getUsersService) {
		$getUsersService.userList("data/array.json").success(function(data) {
//			console.log(data[0].info.replace(/\r/gi, "<br/>"));
			$scope.items = data
		});

	}]);

	// GET ajax 接口
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