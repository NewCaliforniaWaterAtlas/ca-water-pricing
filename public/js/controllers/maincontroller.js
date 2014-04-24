	

app.controller('mainController', [ '$scope', 'billService', 'timeService', '$state', '$rootScope', function ($scope, billService, timeService, $state, $rootScope) {
	
	// General Stuff ==================================================================

	// make sure form is clear on scope
	$scope.formData = {};

	// show or hide sample bill
	$scope.billHelp = false;
  
  // expose $state to scope
	$rootScope.$state = $state;

	$scope.navType = 'tabs';

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


	// CREATE ==================================================================
	// when submitting the add form, send the text to the node API
	$scope.createBill = function() {

		// todo: validate the formData to make sure that something is there
		if ($scope.formData.$valid) {

			var components = $scope.details.address_components;
			var city = null;
			var county = null;
			var state = null;
			var country = null;
			var postal = null;

			timeService.time().then(function () {
				var start = $scope.formData.sdate;
				var end = $scope.formData.edate;
				var e = moment(end, "MM-DD-YYYY");
				var s = moment(start, "MM-DD-YYYY");
				var tdiff = moment.utc(moment(e).diff(moment(s))).format('D');
				var pday = ($scope.formData.bill/tdiff).toFixed();
				var pcappday = (pday/$scope.formData.hsize).toFixed();
				$scope.formData.pday = pday;
				$scope.formData.pcappday = pcappday;
			});

			for (var i = 0, component; component = components[i]; i++) {
        
        if (component.types[0] == 'locality') {
          city = component['long_name'];
        }
        if (component.types[0] == 'administrative_area_level_2') {
          county = component['short_name'];
        }
        if (component.types[0] == 'administrative_area_level_1') {
          state = component['short_name'];
        }
        if (component.types[0] == 'country') {
          country = component['short_name'];
        }
        if (component.types[0] == 'postal_code') {
          postal = component['short_name'];
        }
			}

			$scope.formData.streetaddr = $scope.details.formatted_address;
			$scope.formData.city = city;
			$scope.formData.county = county;
			$scope.formData.state = state;
			$scope.formData.country = country;
			$scope.formData.postal = postal;
			$scope.formData.lat = $scope.details.geometry.location.lat();
			$scope.formData.lng = $scope.details.geometry.location.lng();


			// call the create function from our service (returns a promise object)
			billService.create($scope.formData)

				// if successful creation, call our get function to get all the new entries
				.success(function(data) {
					$scope.formData = {}; // clear the form so our user is ready to enter another
					$scope.entries = data; // assign our new list of entries
				});
		}
		alert('Thank You!');
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

}]); // end mainController


app.controller('billsController', ['$scope', 'billService', function ($scope, billService){

	// GET =====================================================================
	// when landing on the page, get all entries and show them
	// use the service to get all the entries
	billService.get()
		.success(function(data) {
			$scope.entries = data;
		});	

}]);


app.controller('agencyController', ['$scope', 'agencyService', function ($scope, agencyService){

	// GET =====================================================================
	// when landing on the page, get all records and show them
	// use the service to get all the records
	agencyService.get()
		.success(function(data) {
			$scope.records = data;

			var agencyArr = [];

		  // loop through scope.data
		  angular.forEach(data, function(d, key){

		  	angular.forEach(d.features, function(entry, key){
		  		agencyArr.push(entry.properties);	
		  	});
		  
		  });
		  $scope.records_parsed = agencyArr;

		})
		.error(function (data, status, headers, config){
       console.log('API CALL ERROR ' +status);
    });

}]);


// app.controller('palmerController', ['$scope','palmerFeature', function ($scope, palmerFeature){

// 	palmerFeature.get()
// 		.success(function(data) {
// 			$scope.palmer = data;		
// 		})
// 		.error(function (data, status, headers, config){
//        console.log('API CALL ERROR ' +status);
//     });

// }]);


// app.controller('palmerCache', ['$scope', '$http', 'featureCache', function ($scope, $http, featureCache) {
		
// 	var cache = featureCache.get('palmerdata');
// 	if (cache) {
// 	 	$scope.palmercache = cache;
// 	}
// 	else {
// 		$http.get('/v1/api/features/palmerdrought')
// 		.success(function(data) {
// 			$scope.palmercache = data;
// 			featureCache.put('palmerdata', data);
// 		});
// 	}

// }]);


app.controller('barsController1', ['$scope', function ($scope){

  $scope.onClick = function(item) {
    $scope.$apply(function() {
      if (!$scope.showDetailPanel)
        $scope.showDetailPanel = true;
      $scope.detailItem = item;
    });
  };

}]);


app.controller('submitCounter1', ['$scope', 'billService', function ($scope, billService){
	
	billService.get()
		.success(function(data) {
			// $scope.entries = data;

		  $scope.frate = 0;
		  $scope.mrate = 0;
		  
		  // loop through scope.data
		  angular.forEach(data, function(entry, key){
		    // console.log(entry.billtype);
		    if (entry.properties.billtype === "frate"){
		      $scope.frate++;
		    }
		    else if (entry.properties.billtype === "mrate"){
		      $scope.mrate++;
		    }
		    else {
		      return;
		    }
		  });	

		});

}]);


app.controller('submitCounter2', ['$scope', 'agencyService', function ($scope, agencyService){
	
	agencyService.get()
		.success(function(data) {

			var d = data[0].features;	
		  $scope.record = 0;
		  
		  // loop through scope.data
		  angular.forEach(d, function(entry, key){
		  	// console.log(entry);	
		    if (entry) {	
		      $scope.record++;
		    } else {
		      return;
		    }
		  });	

		});

}]);


// app.controller('test', ['$scope', function ($scope){
	
// 	$scope.searchentries = {};



// }]);


app.controller('myModal', ['$scope', function ($scope) {
  
  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };

}]);


// app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
  
//   $scope.ok = function () {
//     $modalInstance.close();
//   };

//   $scope.cancel = function () {
//     $modalInstance.dismiss('cancel');
//   };

// }]);

// app.controller('teamModal', ['$scope', '$modal', function ($scope, $modal) {
  
// 	$scope.open = function () {
// 	  var modalInstance = $modal.open({
//       templateUrl: 'team-modal.html',
//       controller: ModalInstanceCtrl
//     });
//   }

// }]);

var involvedModal = function($scope, $modal) {
	
	$scope.open = function () {
	  var modalInstance = $modal.open({
      templateUrl: 'involved-modal.html',
      controller: ModalInstanceCtrl
    });
  };

};

var sponsorModal = function($scope, $modal) {
	
	$scope.open = function () {
	  var modalInstance = $modal.open({
      templateUrl: 'sponsor-modal.html',
      controller: ModalInstanceCtrl
    });
  };

};

var donateModal = function($scope, $modal) {
	
	$scope.open = function () {
	  var modalInstance = $modal.open({
      templateUrl: 'donate-modal.html',
      controller: ModalInstanceCtrl
    });
  };

};

var supportersModal = function($scope, $modal) {
	
	$scope.open = function () {
	  var modalInstance = $modal.open({
      templateUrl: 'supporters-modal.html',
      controller: ModalInstanceCtrl
    });
  };

};

var teamModal = function($scope, $modal) {
	
	$scope.open = function () {
	  var modalInstance = $modal.open({
      templateUrl: 'team-modal.html',
      controller: ModalInstanceCtrl
    });
  };

};

var ModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

// search accordions


var searchAccordion = function ($scope) {
  $scope.oneAtATime = true;
}


