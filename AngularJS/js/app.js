var app = angular.module("app", []);
app.controller("ceshi", ['$scope', function hello($scope) {
	$scope.greeting = {
		text: 'Hello'
	};
}]);

app.directive("nav",function(){
	return {
		restrict:"E",
		template:"<div>测试</div>",
		replace:true
	}
});



