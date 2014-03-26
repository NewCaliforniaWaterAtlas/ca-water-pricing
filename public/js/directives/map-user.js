'use strict';

app.directive('mapuser', [ '$window','mapService', function ($window, mapService) {
	return {
		restrict: 'A',
		// replace: true,
		scope:{
      userdata:"=",
      layerone:"="
    },
		link: function(scope, element, attrs) {

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



				//  Palmer DSI Data from NOAA ======================================================================	

        scope.$watch('layerone', function (newVals, oldVals) {
					scope.load(newVals);
        }, true);

        scope.load = function(layerone) {
        	// console.log(layerone);

          // If we don't pass any data, return out of the element
          if (!layerone) return; 

					// control that shows state info on hover
					var InfoControl = L.Control.extend({

						onAdd: function (map) {
							this._div = L.DomUtil.create('div', 'info');
							this.update();
							return this._div;
						},

						update: function (props) {
							this._div.innerHTML = '<h4>Region: </h4>' + (props ? '<b>' + props.NAME + '</b><br /><h4>Drought Severity Index: </h4><b>' + props.PDSI + '<b>':'');
						}
					});

					var info = new InfoControl();
					info.addTo(map);

					function getColor(d) {
				    return d < -4     ? '#8c510a' :
				           d < -3     ? '#bf812d' :
				           d < -2     ? '#dfc27d' :
				           d < -1     ? '#f6e8c3' :
				           d > 1      ? '#c7eae5' :
				           d > 2      ? '#80cdc1' :
				           d > 3      ? '#35978f' :
				           d > 4      ? '#01665e' :
				           							'#f5f5f5' ;				                        
					}

					function style(feature) {
						return {
							weight: 2,
							opacity: 1,
							color: "#fff",
							dashArray: '4',
							fillOpacity: 0.7,
							fillColor: getColor(feature.properties.PDSI)
						};
					}        	

        	// highlight on hover
					function highlightFeature(e) {
					  var layer = e.target;

					  layer.setStyle({
					    weight: 5,
					    color: "#1c75bc",
					    dashArray: '',
					    fillOpacity: 0.7,
					    opacity: 0.5
					  });

					  if (!L.Browser.ie && !L.Browser.opera) {
					    layer.bringToFront();
					  }
					  info.update(layer.feature.properties);
					}
					
					var geojson;

					function resetHighlight(e) {
						geojson.resetStyle(e.target);
						info.update();
					}

					function zoomToFeature(e) {
						map.fitBounds(e.target.getBounds());
					}

					function onEachFeature(feature, layer) {
						layer.on({
							mouseover: highlightFeature,
							mouseout: resetHighlight,
							click: zoomToFeature
						});
					}
			
        	geojson = L.geoJson(layerone, {
						style: style,
						onEachFeature: onEachFeature
        	}).addTo(map);

					var legend = L.control({position: 'bottomright'});

					legend.onAdd = function (map) {

						var div = L.DomUtil.create('div', 'info legend');
						var grades = [-20, -4, -3, -2, 0, 2, 3, 4, 20];
						var labels = [];
						var from; 
						var to;

						for (var i = 0; i < grades.length; i++) {
							from = grades[i];
							to = grades[i + 1];

							labels.push(
								'<i style="background:' + getColor(from + 1) + '"></i> ' +
								from + (to ? '  &ndash;  ' + to : '+'));
						}

						div.innerHTML = labels.join('<br>');
						return div;
					};

					legend.addTo(map);

        } // end scope.load


        //  Markers ======================================================================
				
				// watch for points changes and re-render
        scope.$watch('userdata', function (newData, oldData) {
          scope.render(newData);
        }, true);

        scope.render = function(userdata) {

			    // if data isn't passed, return out of the element
        	if (!userdata) return;	

			    // create feature group
			    var pointGroup = L.featureGroup();	

			    // sort flat fees from metered fees
					var p = userdata;
					var frate = _.filter(p, { 'billtype': 'frate' });
					var mrate = _.filter(p, { 'billtype': 'mrate' });
					var f = _.extend({}, frate);
					var m = _.extend({}, mrate);			    

			    // loop through f points
	        angular.forEach(f, function(f, key){

	          //extend marker properties
						var customCircleMarker = L.CircleMarker.extend({
							options: { 
								bill: f.bill,
								rate: f.rate
							}
						});				

						var flatMarker = new customCircleMarker([f.lat, f.lng], { 
						  radius: f.rate * 3,
						  color: "#fff",
						  fillColor: "#e4aa46",
						  fillOpacity: 0.9,
						  opacity: 1,
						  weight: 3
						});
	          flatMarker.addTo(pointGroup);

	        });

			    // loop through m points
	        angular.forEach(m, function(m, key){

	          //extend marker properties
						var customCircleMarker = L.CircleMarker.extend({
							options: { 
								bill: m.bill,
								rate: m.rate
							}
						});

						var meterMarker = new customCircleMarker([m.lat, m.lng], { 
						  radius: m.rate * 3,
						  color: "#fff",
						  fillColor: "#be5e24",
						  fillOpacity: 0.9,
						  opacity: 1,
						  weight: 3
						});
	          meterMarker.addTo(pointGroup);

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