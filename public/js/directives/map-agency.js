'use strict';

app.directive('mapagency', [ '$window','mapService', function ($window, mapService) {
	return {
		restrict: 'A',
		// replace: true,
		scope:{
      points:"="
    },
		link: function(scope, element, attrs) {

			mapService.map().then(function(map) {	

				// watch for points changes and re-render
        scope.$watch('points', function (newData) {
          scope.render(newData);
        }, true);

        scope.render = function(points) {

			    // check to see if points exist
        	if (!points) return;

			    var popup = L.popup();
			    // var southWest = new L.LatLng(40.60092,-74.173508);
			    // var northEast = new L.LatLng(40.874843,-73.825035);            
			    // var bounds = new L.LatLngBounds(southWest, northEast);
			    // L.Icon.Default.imagePath = '../img/leaflet';

			    // setup map
			    // todo: set bounds
			    var map = L.map('map', {
		        center: new L.LatLng(37.166111,-119.449444),
		        zoom: 6,
		        // maxBounds: bounds,
		        maxZoom: 18,
		        minZoom: 4
			    });

			    // create the tile layer with correct attribution
			    var tilesURL='http://tile.stamen.com/terrain/{z}/{x}/{y}.png';
			    var tilesAttrib='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. points by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.';
			    var tiles = new L.TileLayer(tilesURL, {
		        attribution: tilesAttrib, 
		        opacity: 0.7,
		        detectRetina: true,
		        unloadInvisibleTiles: true,
		        updateWhenIdle: true,
		        reuseTiles: true
			    });
			    tiles.addTo(map);

			    // create feature group
			    var pointGroup = L.featureGroup();

			    // loop through points
	        angular.forEach(points, function(point, key){
	          //extend marker properties
						var customCircleMarker = L.CircleMarker.extend({
							options: { 
								agency: point.agency,
								quantity_rate: point.quantity_rate,
								service_charge: point.service_charge,
								flat_rate: point.flat_rate
							}
						});

						var myMarker = new customCircleMarker([point.lat, point.lng], { 
						  radius: point.flat_rate * 0.15,
						  color: "#fff",
						  fillColor: "#1C75BC",
						  fillOpacity: 0.9,
						  opacity: 0.35
						});

	          myMarker.addTo(pointGroup);	

	        });
	     		// add circle markers to map
	        pointGroup.addTo(map);
	        //setup popups to trigger on mouseovers
					pointGroup.on('mouseover', function(e) {
					  var popup = L.popup()
							.setLatLng(e.latlng) 
							.setContent("Flat Rate: " + "$ " + e.layer.options.flat_rate);
						map.openPopup(popup);
					})
					.on('mouseout', function(e){
						map.closePopup();
					});

				}// scope.render
			
			});//end mapService

			
		}//end link
	}//end return

}]);//end .directive