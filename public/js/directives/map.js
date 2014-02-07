'use strict';

// angular.module('mapDirective',['leaflet-directive']);

app.directive('map', [ '$window','mapService', function ($window, mapService) {
	return {
		restrict: 'A',
		replace: true,
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
			    
        	if (!points) return; 	

			    var popup = L.popup();
			    // var southWest = new L.LatLng(40.60092,-74.173508);
			    // var northEast = new L.LatLng(40.874843,-73.825035);            
			    // var bounds = new L.LatLngBounds(southWest, northEast);
			    // L.Icon.Default.imagePath = '../img/leaflet';

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

			    var group = L.featureGroup();
						
	        angular.forEach(points, function(p, key){
	          // var marker = L.marker([d.lat, d.lng]).addTo(group);
	          var circle = L.circle([p.lat, p.lng], 500, {
					    color: 'red',
					    fillColor: '#f03',
					    fillOpacity: 0.5
	          }).addTo(group);
	        });
	        group.addTo(map);

				}// scope.render
			
			});//end mapService

			
		}//end link
	}//end return
}]);//end .directive