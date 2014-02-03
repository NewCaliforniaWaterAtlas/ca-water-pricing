(function () {
  'use strict';

	// angular.module('mapDirective',['leaflet-directive']);

}());


// angular.module('mapDirective', [])
//   .directive('sap', function () {
// 		return {
// 		  restrict: 'E',
// 		  replace: true,
// 		  template: '<div></div>',
// 		  link: function(scope, element, attrs) {
// 	      var map = L.map(attrs.id, {
// 	        center: [40, -86],
// 	        zoom: 10
// 	      });
// 	      //create a CloudMade tile layer and add it to the map
// 	      L.tileLayer('http://{s}.tile.cloudmade.com/57cbb6ca8cac418dbb1a402586df4528/997/256/{z}/{x}/{y}.png', {
// 	        maxZoom: 18
// 	      }).addTo(map);

// 	      //add markers dynamically
// 	      var points = [{lat: 40, lng: -86},{lat: 40.1, lng: -86.2}];
// 	      updatePoints(points);

// 	      function updatePoints(pts) {
// 					for (var p in pts) {
// 					  L.marker([pts[p].lat, pts[p].lng]).addTo(map);
// 					}
// 	      }

// 	      //add a watch on the scope to update your points.
// 	      // whatever scope property that is passed into
// 	      // the poinsource="" attribute will now update the points
// 	      scope.$watch(attrs.pointsource, function(value) {
// 	        updatePoints(value);
// 	      });
// 		  }
// 		};
// });



angular.module('mapDirective', [])
  .directive('map', function (Bills) {
		return {
			restrict: 'E',
			replace: true,
			template: '<div></div>',
			link: function(scope, element, attrs) {

		    var popup = L.popup();
		    // var southWest = new L.LatLng(40.60092,-74.173508);
		    // var northEast = new L.LatLng(40.874843,-73.825035);            
		    // var bounds = new L.LatLngBounds(southWest, northEast);
		    L.Icon.Default.imagePath = '../img/leaflet';

		    var map = L.map('map', {
	        center: new L.LatLng(37.166111,-119.449444),
	        zoom: 6,
	        // maxBounds: bounds,
	        maxZoom: 18,
	        minZoom: 4
		    });

		    // create the tile layer with correct attribution
		    var tilesURL='http://tile.stamen.com/terrain/{z}/{x}/{y}.png';
		    var tilesAttrib='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.';
		    var tiles = new L.TileLayer(tilesURL, {
	        attribution: tilesAttrib, 
	        opacity: 0.7,
	        detectRetina: true,
	        unloadInvisibleTiles: true,
	        updateWhenIdle: true,
	        reuseTiles: true
		    });
		    tiles.addTo(map);

				var circle = L.circle([], 500, {
				    color: 'red',
				    fillColor: '#f03',
				    fillOpacity: 0.5
				})


		    // Read in the Location/Events file 
		    Bills.get().success(function(data) {
		    	console.log(data);	
	        // Loop through the 'locations' and place markers on the map
	        angular.forEach(data, function(data, key){
	          // var marker = L.marker([data.lat, data.lng]).addTo(map);
	          var circle = L.circle([data.lat, data.lng], 500, {
					    color: 'red',
					    fillColor: '#f03',
					    fillOpacity: 0.5
	          }).addTo(map);

	        });
		    });
			
			}
		}
});