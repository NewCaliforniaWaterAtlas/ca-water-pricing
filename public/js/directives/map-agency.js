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

				// watch for points changes and re-render
        scope.$watch('points', function (newData) {
          scope.render(newData);
        }, true);

        scope.render = function(points) {

			    // check to see if points exist
        	if (!points) return;

			    // create feature group
			    var pointGroup = L.featureGroup();

			    var agencyMarkerOptions = {};

					L.geoJson(points, {

				    pointToLayer: function (feature, latlng) {
				      // console.log(feature);	
				      return L.circleMarker(latlng, 
				      	agencyMarkerOptions = {
							    // radius: feature.properties.flat_rate * 0.15,
							    radius: 8,
							    fillColor: "#1C75BC",
							    color: "#fff",
							    weight: 1,
							    opacity: 1,
							    fillOpacity: 0.9
				      	}
				      )
				    },

				    onEachFeature: function (feature, layer) {
				      // layer.bindPopup(feature.properties.flat_rate);
				    }

					}).addTo(pointGroup);

					pointGroup.addTo(map);

	        //setup popups to trigger on mouseovers
					pointGroup.on('mouseover', function(e) {
						// console.log(e.layer.feature.properties.agency);	
					  var popup = L.popup()
							.setLatLng(e.latlng) 
							.setContent("Flat Rate: " + "$ " + e.layer.feature.properties.flat_rate);
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