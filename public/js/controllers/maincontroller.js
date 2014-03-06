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
		})
		.error(function (data,status,headers,config){
       console.log('API CALL ERROR'+status);
    });

	// CREATE ==================================================================
	// when submitting the add form, send the text to the node API
	$scope.createBill = function() {

		// todo: validate the formData to make sure that something is there
		if ($scope.formData.$valid) {
			alert('Thank You!');
			$scope.formData.addr = $scope.result;
			$scope.formData.lat = $scope.details.geometry.location.d;
			$scope.formData.lng = $scope.details.geometry.location.e;
			// call the create function from our service (returns a promise object)
			billService.create($scope.formData)

				// if successful creation, call our get function to get all the new entries
				.success(function(data) {
					$scope.formData = {}; // clear the form so our user is ready to enter another
					$scope.entries = data; // assign our new list of entries
				});
		}
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


		// Date Picker ==================================================================

	  $scope.today = function() {
	    $scope.formData.sdate = new Date();
	  };
	  $scope.today();

	  $scope.showWeeks = true;
	  $scope.toggleWeeks = function () {
	    $scope.showWeeks = ! $scope.showWeeks;
	  };

	  $scope.clear = function () {
	    $scope.formData.sdate = null;
	    $scope.formData.edate = null;
	  };

	  // Disable weekend selection
	  $scope.disabled = function(date, mode) {
	    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	  };

	  $scope.toggleMin = function() {
	    $scope.minDate = ( $scope.minDate ) ? null : new Date();
	  };
	  $scope.toggleMin();

	  $scope.open1 = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened1 = true;
	  };

	  $scope.open2 = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened2 = true;
	  };

	  $scope.dateOptions = {
	    'year-format': "'yy'",
	    'starting-day': 1
	  };

	  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
	  $scope.format = $scope.formats[0];



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