'use strict';

app.directive('mapagency', [ '$window','mapService', function ($window, mapService) {
	return {
		restrict: 'A',
		// replace: true,
		scope:{
      points:"="
      // layerone:"="
    },
		link: function(scope, element, attrs) {

			mapService.map().then(function(data) {	

		    // var southWest = new L.LatLng(24.7668,-125.0244);
		    // var northEast = new L.LatLng(49.6108,-66.6651);            
		    // var bounds = new L.LatLngBounds(southWest, northEast);
		    L.Icon.Default.imagePath = '../img/leaflet';

		    // setup map
		    // todo: set bounds: -125.0244,24.7668,-66.6651,49.6108
		    var map = L.map('map', {
	        center: new L.LatLng(37.166111,-119.449444),
	        zoom: 6,
	        // maxBounds: bounds,
	        maxZoom: 18,
	        minZoom: 4
		    });

		    // create the tile layer with correct attribution
		    var tilesURL='http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png';
		    var tilesAttrib='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.';
		    var tonerTiles = new L.TileLayer(tilesURL, {
	        // attribution: tilesAttrib, 
	        opacity: 1,
	        detectRetina: true,
	        unloadInvisibleTiles: true,
	        updateWhenIdle: true,
	        reuseTiles: true
		    });
		    // tonerTiles.addTo(map);

		    // google satellite base layer
	      var googleTiles = new L.Google('SATELLITE');
	      // map.addLayer(googleTiles);

		    // attribution config
		    map.attributionControl.setPrefix('');
		  	var infoControl = L.mapbox.infoControl()
		  		.addTo(map);
		  	infoControl.addInfo(tilesAttrib);
		  	var fullscreen = L.control.fullscreen()
		  		.addTo(map);

				// disable drag and zoom handlers
				map.touchZoom.disable();
				map.scrollWheelZoom.disable();
				// map.doubleClickZoom.disable();
				// map.dragging.disable();
				// disable tap handler, if present.
				// if (map.tap) map.tap.disable();

				// todo: add hashing to map
		  	// var hash = L.hash();
		  	// hash.init(map);


				//  Palmer DSI Data from NOAA rendered as tiles ======================================================================	

				var pdsiTiles = L.mapbox.tileLayer('chachasikes.hm7o3785')
					.addTo(map);
				var pdsiGridLayer = L.mapbox.gridLayer('chachasikes.hm7o3785')
					.addTo(map);
				// var pdsiGridControl = L.mapbox.gridControl(pdsiGridLayer).addTo(map);

				pdsiGridLayer.on('mouseover', function(e){
					// console.log(e.data);
					if (e.data == null) {
						return;
					} else {
						document.getElementById('preg').innerHTML = e.data.NAME.toLowerCase();
						document.getElementById('pval').innerHTML = e.data.PDSI;
					}
				});


				//  basemap layer switcher ======================================================================

				var overlaygroup1 = L.layerGroup([pdsiTiles, pdsiGridLayer]);

				var baseLayers = {
			    "Base Map": tonerTiles.addTo(map),
			    "Satelitte": googleTiles
				};

				var overlays = {
			    "Drought Index": overlaygroup1.addTo(map)
				};

				L.control.layers(baseLayers, overlays).addTo(map);


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
						
						var rad;

						if (feature.properties.quantity_rate !== ""){
							rad = feature.properties.quantity_rate;
						} else {
							rad = 2;
						}

						return {
					    radius: rad * 2,
					    // radius: feature.properties.quantity_rate != ""  ? feature.properties.quantity_rate*2 : 2,
					    fillColor: "#cc6633",
					    color: "#fff",
					    weight: 3,
					    opacity: 1,
					    fillOpacity: 0.9
						};
					}
					
					var gjpoints;

        	// hover
					function highlightFeature(e) {
					  var layer = e.target;
					  
					  var lat = layer.feature.geometry.coordinates[1];
					  var lng = layer.feature.geometry.coordinates[0];
					  var quantVal;
					  var notVal;
					  var quantProp = layer.feature.properties.quantity_rate;

					  layer.setStyle({
					    weight: 5,
					    color: "#1c75bc",
					    opacity: 1
					  });

					  // if (!L.Browser.ie && !L.Browser.opera) {
					  //   layer.bringToFront();
					  // }

					  function popupVals (data) {
					  	if (data !== "") {
						  	var val = Math.floor( data * 10 ) / 10;
						  	quantVal = val;
							  layer.bindPopup(
							  	"<p class='tt-title'>" + layer.feature.properties.city +  ", " + layer.feature.properties.state + ": " + "</p>" +  "<span class='ctrarate tt-highlight counters pull-right'>$ " + quantVal + " /ccf" + "</span>"
							  ).openPopup();
					  	}	else {
					  		notVal = "no data";
							  layer.bindPopup(
							  	"<p class='tt-title'>" + layer.feature.properties.city +  ", " + layer.feature.properties.state + ": " + "</p>" +  "<span class='ctrarate tt-highlight counters pull-right'>" + notVal + "</span>"
							  ).openPopup();
					  	}
					  }
					  popupVals(quantProp);
					  // console.log(layer.feature.geometry.coordinates[0]);
					}

					// hover reset
					function resetHighlight(e) {
						var layer = e.target;
						gjpoints.resetStyle(layer);
						layer.closePopup();
					}
					
					// on click
					function click(e) {
						var layer = e.target;
						// console.log(layer);

					  var lat = layer.feature.geometry.coordinates[1];
					  var lng = layer.feature.geometry.coordinates[0];
					  var quantVal;
					  var notVal;
					  var quantProp = layer.feature.properties.quantity_rate;

					  function panelVals (data) {
					  	if (data !== "") {
						  	var val = Math.floor(data * 10) / 10;
						  	quantVal = val;	
					  		document.getElementById('bill-panel-quantity-rate').innerHTML = "$ " + quantVal + " /ccf";
					  	} else {
					  		notVal = "no data";
					  		document.getElementById('bill-panel-quantity-rate').innerHTML = notVal;
					  	}
					  }
					  panelVals(quantProp);

					  if (layer.feature.properties.flat_rate !== "") {
					  	document.getElementById('bill-panel-flat-rate').innerHTML = "$ " + layer.feature.properties.flat_rate;
					  } else {
				  		notVal = "no data";
				  		document.getElementById('bill-panel-flat-rate').innerHTML = notVal;
					  }

					  if (layer.feature.properties.service_charge !== "") {
					  	document.getElementById('bill-panel-service-charge').innerHTML = "$ " + layer.feature.properties.service_charge;
					  } else {
				  		notVal = "no data";
				  		document.getElementById('bill-panel-service-charge').innerHTML = notVal;
					  }

			      document.getElementById('bill-panel-streetaddr').innerHTML = layer.feature.properties.streetaddr;
						document.getElementById('bill-panel-util').innerHTML = layer.feature.properties.utility_me;
						document.getElementById('bill-panel-service-area').innerHTML = layer.feature.properties.service_area_description;
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