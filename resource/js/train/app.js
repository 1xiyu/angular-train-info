var app = angular.module('MyApp', ['ui.router']);

// 路由
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/index/1");
	$stateProvider.state('list', {
		url: '/index/:page',
		templateUrl: 'resource/tpl/train/list.html',
		controller: 'ListController'
	}).state('detail', {
		url: '/detail/:id',
		templateUrl: 'resource/tpl/train/detail.html',
		controller: 'DetailController'
	});
}]);

// 数据工厂
app.factory('DataService', ['$rootScope', function($rootScope) {
	return {
		// 获取分页数据
		getPage: function(page, size) {
			var data = $rootScope.trains;
			var result = {};
			if(size) {
				result.totalCount = data.length;
				result.content = data.slice((page - 1)*size, page * size);
				result.totalPage = (data.length - data.length % size) / size + 1;
				result.first = page == 1;
				result.last = page == result.totalPage;
				result.page = page;
				result.next = page - 0 + 1;
				result.pre = page - 1;
			}
			return result;
		},
		// 根据Id或详情
		getById: function(id) {
			var data = $rootScope.trains;
			var result = {};
			if(data.length){
				angular.forEach(data, function(value){
					if(value.id == id) {
						result = value;
					}
				});
			}
			return result;
		}
	};
}]);

// 初始化模块
app.run(['$rootScope', '$http', function($rootScope, $http) {
	$http.get('resource/data/train.json').success(function(d) {
		$rootScope.trains = d;
	}).error(function(response) {
		console.log(response);
	});
}]);

// 列表
app.controller('ListController', ['$scope', '$rootScope', 'DataService', '$stateParams', function($scope, $rootScope, DataService, $stateParams) {
	$scope.pageOption = {
		size: 5
	};
	$scope.pageOption.page = $stateParams.page;// 页码
	$scope.data = DataService.getPage($scope.pageOption.page, $scope.pageOption.size);
}]);

// 详情
app.controller('DetailController', ['$scope', '$rootScope', '$stateParams', 'DataService', function($scope, $rootScope, $stateParams, DataService) {
	$scope.data = DataService.getById($stateParams.id);
	$scope.newPrice = $scope.data.price;// 价格副本
	
	// 点击修改
	$scope.edit = function() {
		$scope.editing = true;
	};
	
	// 点击取消
	$scope.cancle = function() {
		$scope.editing = false;
		$scope.newPrice = $scope.data.price;
	};
	
	// 点击保存
	$scope.save = function() {
		$scope.editing = false;
		$scope.data.price = $scope.newPrice;
	};
}]);