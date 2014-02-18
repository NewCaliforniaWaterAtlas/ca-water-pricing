'use strict';

var app = angular.module('app', ['ui.router', 'ui.bootstrap']);

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
			templateUrl: 'views/templates/submit.html', 
			controller: 'mainController'
		});
		// .otherwise({redirectTo: '/'});

		// use the HTML5 History API
		// $locationProvider.html5Mode(true);

}]);