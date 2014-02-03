(function () {
  'use strict';

	var app = angular.module('appControllers', []);

		// inject the Bills service factory into our controller
		app.controller('mainController', function ($scope, Bills) {
			$scope.formData = {};

			// GET =====================================================================
			// when landing on the page, get all records and show them
			// use the service to get all the records
			Bills.get()
				.success(function(data) {
					$scope.records = data;
				});

			// CREATE ==================================================================
			// when submitting the add form, send the text to the node API
			$scope.createBill = function() {

				// validate the formData to make sure that something is there
				// if form is empty, nothing will happen
				if (!$.isEmptyObject($scope.formData)) {

					// call the create function from our service (returns a promise object)
					Bills.create($scope.formData)

						// if successful creation, call our get function to get all the new records
						.success(function(data) {
							$scope.formData = {}; // clear the form so our user is ready to enter another
							$scope.records = data; // assign our new list of records
						});
				}
			};

			// DELETE ==================================================================
			// delete a record after checking it
			$scope.deleteBill = function(id) {
				Bills.delete(id)
					// if successful creation, call our get function to get all the new records
					.success(function(data) {
						$scope.records = data; // assign our new list of records
					});
			};

		});


		app.controller('chartController', function ($scope, Bills) {
			
			Bills.get()
				.success(function(data) {

					var newArray = []
					
					for (var key in data) {
					    if (data.hasOwnProperty(key)) {
					      newArray.push(data[key].bill);  
					    }
					}
					$scope.chartData = newArray;
					return $scope.chartData;
					// console.log($scope.chartData);

				});

			$scope.chartData = [10,20,30,40,60];
			// $scope.chartData = [];
		});


		// app.controller("mapController", [ '$scope', function($scope) {    
		// 	angular.extend($scope, {
	 //      cairo: {
	 //          lat: 37.166111,
	 //          lng: -119.449444,
	 //          zoom: 6
	 //      },
	 //      tiles: {
	 //          url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
	 //          // url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
	 //      },
	 //      defaults: {
	 //          scrollWheelZoom: false
	 //      }
		//   });

	 //    // $scope.$watch("cairo.zoom", function(zoom) {
	 //    //   $scope.tiles.url = (zoom > 12) ? "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
	 //    //   : "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
	 //    // });
		
		// }]);


	// app.controller("mapController", function ($scope, Bills) {
	// 	//here's the property you can just update.
	// 	$scope.pointsFromController = [{lat: 40, lng: -86},{lat: 40.1, lng: -86.2}];

	// 	//here's some contrived controller method to demo updating the property.
	// 	$scope.getPointsFromSomewhere = function() {
	// 		$http.get('/Get/Points/From/Somewhere').success(function(somepoints) {
	// 		   $scope.pointsFromController = somepoints;
	// 		});
	// 	}

	// 	Bills.get()
	// 		.success(function(data) {
	// 			$scope.pointsFromController = data;
	// 		});

	// });





}());

	