'use strict';

app.directive('mapuser', [ '$window','mapService', function ($window, mapService) {
	return {
		restrict: 'A',
		// replace: true,
		scope:{
      userdata:"="
    },
		link: function(	scope, element, attrs) {

			mapService.map().then(function(map) {

				// var g = scope.userdata;
				
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

		    map.attributionControl.setPrefix('');

		    // create the tile layer with correct attribution
		    var tilesURL='http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png';
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

				// watch for points changes and re-render
        scope.$watch('userdata', function (newData) {
          scope.render(newData);
        }, true);

        scope.render = function(userdata) {

        	// g = [];	

			    // if data isn't passed, return out of the element
        	if (!userdata) return;	

			    // create feature group
			    var pointGroup = L.featureGroup();	

			    // loop through points
	        angular.forEach(userdata, function(point, key){
	          //extend marker properties
						var customCircleMarker = L.CircleMarker.extend({
							options: { 
								bill: point.bill,
								rate: point.rate
							}
						});

						var myMarker = new customCircleMarker([point.lat, point.lng], { 
						  radius: point.rate * 3,
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
							.setContent("Rate: " + "$ " + e.layer.options.rate + "/gal.");	
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