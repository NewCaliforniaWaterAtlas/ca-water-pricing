'use strict';

app.directive('mapuser', [ '$window','mapService', 'timeService', function ($window, mapService, timeService) {
	return {
		restrict: 'A',
		// replace: true,
		scope:{
      userdata:"="
      // layerone:"="
    },
		link: function(scope, element, attrs) {

			mapService.map().then(function() {
					
		    // var southWest = new L.LatLng(40.60092,-74.173508);
		    // var northEast = new L.LatLng(40.874843,-73.825035);            
		    // var bounds = new L.LatLngBounds(southWest, northEast);
		    L.Icon.Default.imagePath = '../img/leaflet';

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
				// var pdsiGridControl = L.mapbox.gridControl(pdsiGridLayer).addTo(map);

				pdsiGridLayer.on('mouseover', function(e){
					// console.log(e.data);
					document.getElementById('preg').innerHTML = e.data.NAME.toLowerCase();
					document.getElementById('pval').innerHTML = e.data.PDSI;	
				});

        //  Markers ======================================================================

		    // create feature group
		   	var pointGroup = L.featureGroup();

				// watch for points changes and re-render
        scope.$watch('userdata', function (newvals, oldvals) {
          return scope.render(newvals);
        }, true);

        scope.render = function(data) {
        	// remove all previous items before render
        	pointGroup.clearLayers();

        	if (data) {

				    // sort flat fees from metered fees
						var p = data;
						var frate = _.filter(p, { 'billtype': 'frate' });
						var mrate = _.filter(p, { 'billtype': 'mrate' });
						var f = _.extend({}, frate);
						var m = _.extend({}, mrate);

						// var cPane = map.createPane('circlePane');
						// cPane.style.zIndex = 11;
						var renderer = (L.SVG && L.svg());
						// renderer.options.cPane = 'circlePane';		    
						
				    // loop through f points
		        angular.forEach(f, function(f, key){
								
		          //extend marker properties
							var customCircleMarker = L.CircleMarker.extend({
								options: { 
									streetaddr: f.streetaddr,
									city: f.city,
									county: f.county,
									state: f.state,
									country: f.country,
									postal: f.postal,
									hsize: f.hsize,
									util: f.util,
									bill: f.bill,
									sdate: f.sdate,
									edate: f.edate,
									billtype: f.billtype,
									used: f.used,
									units: f.units,
									rate: f.rate,
									tstamp: f.tstamp,
									pday: f.pday
								}
							});				

							var flatMarker = new customCircleMarker([f.lat, f.lng], { 
							  radius: f.pday * 1.5,
							  color: "#fff",
							  fillColor: "#a4ad50",
							  fillOpacity: 0.95,
							  opacity: 1,
							  weight: 3,
							  renderer: renderer
							});
		          flatMarker.addTo(pointGroup);
		     
		        });
						
				    // loop through m points
		        angular.forEach(m, function(m, key){

		          //extend marker properties
							var customCircleMarker = L.CircleMarker.extend({
								options: { 
									streetaddr: m.streetaddr,
									city: m.city,
									county: m.county,
									state: m.state,
									country: m.country,
									postal: m.postal,
									hsize: m.hsize,
									util: m.util,
									bill: m.bill,
									sdate: m.sdate,
									edate: m.edate,
									billtype: m.billtype,
									used: m.used,
									units: m.units,
									rate: m.rate,
									tstamp: m.tstamp,
									pday: m.pday
								}
							});

							var meterMarker = new customCircleMarker([m.lat, m.lng], { 
							  radius: m.pday * 1.5,
							  color: "#fff",
							  fillColor: "#9abab4",
							  fillOpacity: 0.95,
							  opacity: 1,
							  weight: 3,
							  renderer: renderer
							});
		          meterMarker.addTo(pointGroup);

		        });

		        //setup popups to trigger on mouseovers
						pointGroup.on('mouseover', function(e) {
						  var layer = e.layer;
						  layer.setStyle({
						    weight: 5,
						    color: "#1c75bc",
						    opacity: 1
						  });

							if (layer.options.billtype == "frate") {
							  var popup = L.popup()
									.setLatLng(e.latlng)
									.setContent("<p class='tt-title'>" + layer.options.streetaddr + ": " + "</p>" +  "<span id='ctrfrate' class='tt-highlight counters pull-right'>$ " + layer.options.pday + " /day" + "</span>");	
								map.openPopup(popup);
							}	else {
							  var popup = L.popup()
									.setLatLng(e.latlng)
									.setContent("<p class='tt-title'>" + layer.options.streetaddr + ": " + "</p>" +  "<span id='ctrmrate' class='tt-highlight counters pull-right'>$ " + layer.options.pday + " /day" + "</span>");	
								map.openPopup(popup);
							}
						})
						.on('mouseout', function(e){
						  var layer = e.layer;
						  layer.setStyle({
						    weight: 3,
						    color: "#fff"
						  });
							map.closePopup();
						})
						.on('click', function(e){
							
							var layer = e.layer;

						  if (layer.options.used == undefined){
						  	layer.options.used = "not metered";
						  	layer.options.units = "";
						  }

						  // document.getElementById('bill-panel-pday').innerHTML = layer.options.pday;
							document.getElementById('bill-panel-streetaddr').innerHTML = layer.options.streetaddr;
							document.getElementById('bill-panel-util').innerHTML = layer.options.util;
							document.getElementById('bill-panel-bill').innerHTML = layer.options.bill;
							document.getElementById('bill-panel-used').innerHTML = layer.options.used;
							document.getElementById('bill-panel-units').innerHTML = layer.options.units;

						  timeService.time().then(function () {
						  	var submit = moment.utc(layer.options.tstamp).format('MM/DD/YYYY');
						  	document.getElementById('bill-panel-submit').innerHTML = submit;
						  });

						});
						// add circle markers to map
						pointGroup.addTo(map);
					
					} else {return;} // if data isn't passed, return out of the element
				}// scope.render
        
			});//end mapService

			
		}//end link
	}//end return

}]);//end .directive