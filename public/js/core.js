'use strict';

var app = angular.module('app', ['ui.router', 'ui.bootstrap']);

app.config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider){
	$stateProvider
		.state('index', 
			{
				url: '',
				templateUrl: 'views/templates/home.html', 
				controller: 'mainController'
			})

			.state('search', 
				{
					url: '/search',
					templateUrl: 'views/templates/search.html', 
					controller: 'mainController'
				})

			.state('submit', 
				{
					url: '/submit',
					templateUrl: 'views/templates/submit.html', 
					controller: 'mainController'
				});
			// .otherwise({redirectTo: '/'});

		// use the HTML5 History API
		// $locationProvider.html5Mode(true);

}]);