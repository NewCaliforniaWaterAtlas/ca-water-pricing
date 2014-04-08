'use strict';

app.directive('mapagency', [ '$window','mapService','geoService', function ($window, mapService, geoService) {
	return {
		restrict: 'A',
		// replace: true,
		scope:{
      points:"="
      // layerone:"="
    },
		link: function(scope, element, attrs) {

			mapService.map().then(function(data) {	

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


				//  Palmer DSI Data from NOAA rendered as tiles ======================================================================	


				var pdsiTiles = L.mapbox.tileLayer('chachasikes.hm7o3785').addTo(map);

				var pdsiGridLayer = L.mapbox.gridLayer('chachasikes.hm7o3785').addTo(map);
				
				pdsiGridLayer.on('click', function(data){
					console.log(data.data);	
				});
				
				// var pdsiGridControl = L.mapbox.gridControl(pdsiGridLayer).addTo(map);

        //  Markers ======================================================================

		    // create feature group
		   	var pointGroup = L.featureGroup();

				// watch for points changes and re-render
        scope.$watch('points', function (newData, oldData) {
          return scope.render(newData);
        }, true);

        scope.render = function(points) {
        	// remove all previous items before render
        	pointGroup.clearLayers();

			    // check to see if points exist
        	if (!points) return;

			    var renderer = (L.SVG && L.svg());
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
					    fillOpacity: 0.9,
					    renderer: renderer,
						};
					}
					
					var gjpoints;

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
					  var quantVal;
					  var quantProp = layer.feature.properties.quantity_rate;
					  
					  function trunc (data) {
					  	var val = Math.floor(data * 10) / 10;
					  	quantVal = val;		 
					  }
					  trunc(quantProp);
					  // console.log(layer.feature.geometry.coordinates[0]);	

			      geoService.addressForLatLng(lat, lng).then(function(data){
			      	// console.log(data);
			      
						  layer.bindPopup(
						  	"<p class='tt-title'>" + data.address[1].formatted_address + ": " + "</p>" +  "<span id='ctrmrate' class='tt-highlight counters pull-right'>$ " + quantVal + " /u" + "</span>"
						  ).openPopup();
					  
					  });
					}

					function resetHighlight(e) {
						var layer = e.target;
						gjpoints.resetStyle(layer);
						layer.closePopup();
					}

					function click(e) {
						var layer = e.target;
						console.log(layer);

					  document.getElementById('bill-panel-pday').innerHTML = layer.feature.properties.quantity_rate;
						// document.getElementById('bill-panel-streetaddr').innerHTML = layer.options.streetaddr;
						// document.getElementById('bill-panel-util').innerHTML = layer.options.util;
						// document.getElementById('bill-panel-bill').innerHTML = layer.options.bill;
						// document.getElementById('bill-panel-used').innerHTML = layer.options.used;
						// document.getElementById('bill-panel-units').innerHTML = layer.options.units;

					}

					function onEachFeature(feature, layer) {
						layer.on({
							mouseover: highlightFeature,
							mouseout: resetHighlight,
							click: click
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
					// add circle markers to map
					pointGroup.addTo(map);
					
					
				}// scope.render
			
			});//end mapService

			
		}//end link
	}//end return

}]);//end .directive