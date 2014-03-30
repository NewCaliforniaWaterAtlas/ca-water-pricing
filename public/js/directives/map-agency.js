'use strict';

app.directive('mapagency', [ '$window','mapService','placeService', function ($window, mapService, placeService ) {
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
		    var tilesURL='http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png';
		    var tilesAttrib='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.';
		    var tiles = new L.TileLayer(tilesURL, {
	        attribution: tilesAttrib, 
	        opacity: 1,
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
	        // placeService.then(function() {
				    
				    // check to see if points exist
	        	if (!points) return;

				    // create feature group
				    var pointGroup = L.featureGroup();
				  //   var agencyMarkerOptions = {};
						
						// var p = points;
						// var quantArr = [];
						
						// var i, j, k;
				  //   for (i = 0; i < p.length; i++) {
				  //   	var features = 	p[i].features;
				  //   	for (j =0; j < features.length; j++) {
				  //   		var properties = features[j].properties;	
				  //   		quantArr.push(properties.quantity_rate);
				  //   	}
				  //   }
				  //   console.log(quantArr);

						function style(feature) {
							return {
						    radius: (feature.properties.quantity_rate * 2),
						    // radius: feature.properties.quantity_rate != ""  ? feature.properties.quantity_rate*2 : 2,
						    fillColor: "#9abab4",
						    color: "#fff",
						    weight: 3,
						    opacity: 1,
						    fillOpacity: 0.9
							};
						}
						
						var gjpoints;
						
						// function gmApi (lat, lng) {
						// 	var geocoder = new google.maps.Geocoder();
						//   var coords = new google.maps.LatLng(lat,lng);	

						//   geocoder.geocode({ 'latLng': coords }, function (results, status) {
						//     if (status !== google.maps.GeocoderStatus.OK) {
						//       console.log(status);
						//     }
						//     // This is checking to see if the Geoeode Status is OK before proceeding
						//     if (status == google.maps.GeocoderStatus.OK) {
						//       // console.log(results);
						//       var address = (results[0].formatted_address);
						//       console.log(address);
						//     }
						//   });
					 //  }

	        	// hover
						function highlightFeature(e) {
						  var layer = e.target;
						  
						  layer.setStyle({
						    weight: 5,
						    color: "#1c75bc",
						    opacity: 1
						  });

						  // if (!L.Browser.ie && !L.Browser.opera) {
						  //   layer.bringToFront();
						  // }

						  var lat = layer.feature.geometry.coordinates[1];
						  var lng = layer.feature.geometry.coordinates[0];
						  
						  // gmApi(lat, lng);
						  
				      placeService.addressForLatLng(lat, lng).then(function(data){
				      	console.log(data);
				      })

						  var quantVal;
						  var quantProp = layer.feature.properties.quantity_rate;
						  
						  function trunc (data) {
						  	var val = Math.floor(data * 10) / 10;
						  	quantVal = val;		 
						  }
						  trunc(quantProp);
						  // console.log(layer.feature.geometry.coordinates[0]);		
						  layer.bindPopup(
						  	"<span class='tt-title'>" + layer.feature.properties.utility_me + ": " + "</span>" +  "<span id='ctrmrate' class='tt-highlight counters'>$ " + quantVal + " /unit" + "</span>"
						  ).openPopup();
						}

						function resetHighlight(e) {
							var layer = e.target;
							gjpoints.resetStyle(layer);
							layer.closePopup();
						}

						function onEachFeature(feature, layer) {
							layer.on({
								mouseover: highlightFeature,
								mouseout: resetHighlight
								// click: zoomToFeature
							});
						}

						gjpoints = L.geoJson(points, {

					    pointToLayer: function (feature, latlng) {
					      // console.log(feature);
					      return L.circleMarker(latlng,{})
					    },
					    style: style,
					    onEachFeature: onEachFeature

						}).addTo(pointGroup);

						pointGroup.addTo(map);
					
					// });// end placeService
				
				}// scope.render
			
			});//end mapService

			
		}//end link
	}//end return

}]);//end .directive