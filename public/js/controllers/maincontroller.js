'use strict';

	
// inject the Bills service factory into our controller
app.controller('mainController', function ($scope, billService, agencyService) {
	$scope.formData = {};

	// GET =====================================================================
	// when landing on the page, get all entries and show them
	// use the service to get all the entries
	billService.get()
		.success(function(data) {
			$scope.entries = data;
		});

	agencyService.get()
		.success(function(data) {
			$scope.records = data;
		});

	// CREATE ==================================================================
	// when submitting the add form, send the text to the node API
	$scope.createBill = function() {

		// todo: validate the formData to make sure that something is there
		
		// call the create function from our service (returns a promise object)
		billService.create($scope.formData)

			// if successful creation, call our get function to get all the new entries
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.entries = data; // assign our new list of entries
			});
		
	};

	// DELETE ==================================================================
	// delete a entry after checking it
	$scope.deleteBill = function(id) {
		billService.delete(id)
			// if successful creation, call our get function to get all the new entries
			.success(function(data) {
				$scope.entries = data; // assign our new list of entries
			});
	};

}); // end mainController


app.controller('chartController', ['$scope', function($scope){

  $scope.onClick = function(item) {
    $scope.$apply(function() {
      if (!$scope.showDetailPanel)
        $scope.showDetailPanel = true;
      $scope.detailItem = item;
    });
  };

}]);


// app.controller("TestCtrl",function ($scope) {

//   $scope.result = '';
//   $scope.options = null;
//   $scope.details = '';

// });