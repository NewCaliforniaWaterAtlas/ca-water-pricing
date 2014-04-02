'use strict';

app.controller("mapController", [ '$scope', 'billService', function ($scope, billService) {
  angular.extend($scope, {
    
  	cacenter: {
  		lat: 37.166111,
  		lng: -119.449444,
  		zoom: 6
  	},

    defaults: {
      scrollWheelZoom: false
    }
  
  });

  $scope.markers = {};

	billService.get()
		.success(function (data, status) {
		
			angular.forEach(data, function(point, key){
				console.log(data);	
				$scope.markers.userMarkers = {
			    lat: point.lat,
			    lng: point.lng,
			    message: "test",
			    focus: true,
				};
				
			});
			
		});

}]);


// angular.forEach(userdata, function(point, key){
//   //extend marker properties
// 	var customCircleMarker = L.CircleMarker.extend({
// 		options: { 
// 			bill: point.bill,
// 			rate: point.rate
// 		}
// 	});

// 	var myMarker = new customCircleMarker([point.lat, point.lng], { 
// 	  radius: point.rate * 3,
// 	  color: "#fff",
// 	  fillColor: "#1C75BC",
// 	  fillOpacity: 0.9,
// 	  opacity: 0.35
// 	});

//   myMarker.addTo(pointGroup);	

// });