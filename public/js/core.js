'use strict';

// var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'leaflet-directive', 'ngAutocomplete']);
var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngAutocomplete']);

app.config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider){
	$stateProvider
		.state('index', {
			url: '',
			templateUrl: 'views/templates/home.html', 
			controller: 'mainController'
		})

		.state('explore', {
			url: '/explore',
			templateUrl: 'views/templates/search.html', 
			controller: 'mainController'
		})

		.state('participate', {
			url: '/participate',
			templateUrl: 'views/templates/participate.html', 
			controller: 'mainController'
		})

		.state('test', {
			url: '/test',
			templateUrl: 'views/templates/test.html', 
			controller: 'mapController'
		});
		// .otherwise({redirectTo: '/'});

		// use the HTML5 History API
		// $locationProvider.html5Mode(true);

}]);