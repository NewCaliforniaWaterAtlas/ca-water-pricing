'use strict';

// var app = angular.module('app', ["leaflet-directive"]);
var app = angular.module('app', ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){
	$routeProvider
		.when('/', 
			{
				templateUrl: 'views/templates/home.html', 
				controller: 'mainController'
			})

			.when('/search', 
				{
					templateUrl: 'views/templates/search.html', 
					controller: 'mainController'
				})

			.when('/submit', 
				{
					templateUrl: 'views/templates/submit.html', 
					controller: 'mainController'
				});
			// .otherwise({redirectTo: '/'});

		// use the HTML5 History API
		$locationProvider.html5Mode(true);

}]);
