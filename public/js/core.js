'use strict';

// var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngAutocomplete', 'ngStorage', 'leaflet-directive']);
var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngAutocomplete', 'ngStorage']);

app.config( ['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
	
	$locationProvider.html5Mode(true).hashPrefix('!');

	$stateProvider
		.state('index', {
			url: '/',
			templateUrl: 'views/templates/home.html', 
			controller: 'myModal'
		})

		.state('agency', {
			url: '/agency',
			templateUrl: 'views/templates/agency.html', 
			controller: 'agencyController'
		})

		.state('user', {
			url: '/user',
			templateUrl: 'views/templates/user.html', 
			controller: 'billsController'
		});

		// .state('test', {
		// 	url: '/test',
		// 	templateUrl: 'views/templates/test.html', 
		// 	controller: 'mapController'
		// });

		$urlRouterProvider.otherwise('/');

}]);