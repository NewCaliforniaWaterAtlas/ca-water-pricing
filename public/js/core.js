'use strict';

// var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngAutocomplete', 'ngStorage', 'leaflet-directive']);
var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngAutocomplete', 'ngStorage']);

app.config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider){
	$stateProvider
		.state('index', {
			url: '',
			templateUrl: 'views/templates/home.html', 
			controller: 'myModal'
		})

		.state('explore', {
			url: '/explore',
			templateUrl: 'views/templates/explore.html', 
			controller: 'agencyController'
		})

		.state('participate', {
			url: '/participate',
			templateUrl: 'views/templates/participate.html', 
			controller: 'billsController'
		});

		// .state('test', {
		// 	url: '/test',
		// 	templateUrl: 'views/templates/test.html', 
		// 	controller: 'mapController'
		// });
		// .otherwise({redirectTo: '/'});

		// use the HTML5 History API
		// $locationProvider.html5Mode(true);

}]);