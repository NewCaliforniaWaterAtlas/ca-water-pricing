'use strict';

app.directive('mapuser', [ '$window','mapService','timeService', function ($window, mapService, timeService) {
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

				// var ui = document.getElementById('map-ui');

		    // create the tile layer with correct attribution
		    var tilesURL = 'http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png';
		    var tilesAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.';
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

				var pdsiTiles = L.mapbox.tileLayer('chachasikes.hm7o3785');
					// .addTo(map);
				var pdsiGridLayer = L.mapbox.gridLayer('chachasikes.hm7o3785');
					// .addTo(map);	
				// var pdsiGridControl = L.mapbox.gridControl(pdsiGridLayer).addTo(map);

				pdsiGridLayer.on('mouseover', function(e){
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
			    "Satellite": googleTiles
				};

				var overlays = {
			    "Drought Index": overlaygroup1.addTo(map)
				};

				L.control.layers(baseLayers, overlays).addTo(map);


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

        	// check to see if points exist
        	if (!data) return;
			    
			    // sort flat fees from metered fees
					var points = data;

					var billType = _.groupBy(points, function(obj) {
					  return obj.properties.billtype;
					});

					var frate = billType.frate;
					var mrate = billType.mrate;

					var fpoints;
					var mpoints;

					function styleFlat(frate) {
						return {
					    radius: (frate.properties.pcappday * 10),
						  color: "#fff",
						  fillColor: "#e4da56",
						  fillOpacity: 0.85,
						  opacity: 1,
						  weight: 3
						};
					}

					function styleMeter(mrate) {
						return {
					    radius: (mrate.properties.pcappday * 10),
						  color: "#fff",
						  fillColor: "#a4ad50",
						  fillOpacity: 0.85,
						  opacity: 1,
						  weight: 3
						};
					}

	        //setup popups to trigger on mouseovers
					pointGroup.on('mouseover', function(e) {
					  var layer = e.layer;
					  layer.setStyle({
					    weight: 5,
					    color: "#1c75bc",
					    opacity: 1
					  });
					  // console.log(layer.feature.properties);	

						if (layer.feature.properties.billtype == "frate") {
						  var popup = L.popup()
								.setLatLng(e.latlng)
								.setContent("<p class='tt-title'>" + layer.feature.properties.streetaddr + ": " + "</p>" +  "<span class='ctrfrate tt-highlight counters pull-right'>$ " + layer.feature.properties.pcappday + " /<i class='fa fa-user'></i> /day" + "</span>");	
							map.openPopup(popup);
						}	else {
						  var popup = L.popup()
								.setLatLng(e.latlng)
								.setContent("<p class='tt-title'>" + layer.feature.properties.streetaddr + ": " + "</p>" +  "<span class='ctrmrate tt-highlight counters pull-right'>$ " + layer.feature.properties.pcappday + " /<i class='fa fa-user'></i> /day" + "</span>");	
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

					  if (layer.feature.properties.used == undefined){
					  	layer.feature.properties.used = "not metered";
					  	layer.feature.properties.units = "";
					  }

					  // layer.setStyle({
					  //   weight: 5,
					  //   color: "red"
					  // });

					  // document.getElementById('bill-panel-pday').innerHTML = layer.options.pday;
						document.getElementById('bill-panel-streetaddr').innerHTML = layer.feature.properties.streetaddr;
						document.getElementById('bill-panel-util').innerHTML = layer.feature.properties.util;
						document.getElementById('bill-panel-bill').innerHTML = layer.feature.properties.bill;
						document.getElementById('bill-panel-used').innerHTML = layer.feature.properties.used;
						document.getElementById('bill-panel-units').innerHTML = layer.feature.properties.units;
						document.getElementById('bill-panel-billperiod').innerHTML = layer.feature.properties.billperiod;
						document.getElementById('bill-panel-hsize').innerHTML = layer.feature.properties.hsize;

					  timeService.time().then(function () {
					  	var submit = moment.utc(layer.feature.properties.tstamp).format('MM/DD/YYYY');
					  	document.getElementById('bill-panel-submit').innerHTML = submit;
					  });
					});


					fpoints = L.geoJson(frate, {
				    pointToLayer: function (feature, latlng) {
				      return L.circleMarker(latlng,{})
				    },
				    style: styleFlat
					}).addTo(pointGroup);
		
					
					mpoints = L.geoJson(mrate, {
				    pointToLayer: function (feature, latlng) {
				      return L.circleMarker(latlng,{})
				    },
				    style: styleMeter
					}).addTo(pointGroup);
					
					// add circle markers to map
					pointGroup.addTo(map);
						
					
				}// scope.render
        
			});//end mapService
			
		}//end link
	}//end return

}]);//end .directive