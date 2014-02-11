'use strict';

	
// inject the Bills service factory into our controller
app.controller('mainController', function ($scope, billService) {
	$scope.formData = {};

	// GET =====================================================================
	// when landing on the page, get all records and show them
	// use the service to get all the records
	billService.get()
		.success(function(data) {
			$scope.records = data;
			$scope.data = data;
			$scope.points = data;
		});

	// CREATE ==================================================================
	// when submitting the add form, send the text to the node API
	$scope.createBill = function() {

		// validate the formData to make sure that something is there
		// if form is empty, nothing will happen
		if (!$.isEmptyObject($scope.formData)) {

			// call the create function from our service (returns a promise object)
			billService.create($scope.formData)

				// if successful creation, call our get function to get all the new records
				.success(function(data) {
					$scope.formData = {}; // clear the form so our user is ready to enter another
					$scope.records = data; // assign our new list of records
					$scope.data = data;
					$scope.points = data;
				});
		}
	};

	// DELETE ==================================================================
	// delete a record after checking it
	$scope.deleteBill = function(id) {
		billService.delete(id)
			// if successful creation, call our get function to get all the new records
			.success(function(data) {
				$scope.records = data; // assign our new list of records
				$scope.data = data;
				$scope.points = data;
			});
	};

// Bootstrap Modal ======================================================================	





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


