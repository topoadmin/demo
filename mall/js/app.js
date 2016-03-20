define(["angular", "angularUiRouter"], function(angular) {
	var gs = require(["gsJsPlugs"], function(gs) {});

	var app = angular.module("admin", ["ui.router", "nav-module", "home-module"]);

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
						templateUrl: 'tpls/home.html',
						controller: "my-home"
					}
				}
			})
			.state('index.user', {
				url: '/user',
				views: {
					'main@index': {
						templateUrl: 'tpls/user.html'
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
	var mainModule = angular.module("home-module", []);
	mainModule.controller('my-home', ["$scope","$filter", "getUsersService", function($scope,$filter, $getUsersService) {
		$getUsersService.userList("data/array.json").success(function(data) {
			$scope.items = data;
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
	
	// \r 转换 <br/> 过滤器
	app.filter('bejson', function() {
		return function(str) {
			var beArr = str.split("\r"),beElement = "";
			for (i=0,j=beArr.length;i<j;i++ ) {
				beElement += '<span>'+beArr[i]+'</span><br/>';
			} 
			return beElement;
		}
	});
});