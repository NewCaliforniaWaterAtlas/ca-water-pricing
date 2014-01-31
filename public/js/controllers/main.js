angular.module('billController', [])

	// inject the Bills service factory into our controller
	.controller('mainController', function($scope, Bills) {
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