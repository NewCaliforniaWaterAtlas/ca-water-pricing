

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

		    // create the tile layer with correct attribution
		    var tilesURL = 'http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png';
		    var tilesAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.';
		    var tiles = new L.TileLayer(tilesURL, {
	        // attribution: tilesAttrib, 
	        opacity: 1,
	        detectRetina: true,
	        unloadInvisibleTiles: true,
	        updateWhenIdle: true,
	        reuseTiles: true
		    });
		    tiles.addTo(map);

		    	
		    // attribution config
		    map.attributionControl.setPrefix('');
		  	
		  	var infoControl = L.mapbox.infoControl()
		  		.addTo(map);
		  	infoControl.addInfo(tilesAttrib);
		  	
		  	var fullscreen = L.control.fullscreen()
		  		.addTo(map);

				// disable drag and zoom handlers
				// map.dragging.disable();
				map.touchZoom.disable();
				// map.doubleClickZoom.disable();
				map.scrollWheelZoom.disable();
				// disable tap handler, if present.
				// if (map.tap) map.tap.disable();

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
						
						var points = data;
						// var propsArr = [];
						
						// var i;
						// for (i=0; i < points.length; i++) {
						// 	var props = points[i].properties;
						// 	propsArr.push(props);
						// }

						// var frate = _.filter(propsArr, { 'billtype': 'frate' });
						// var mrate = _.filter(propsArr, { 'billtype': 'mrate' });
						// var f = _.extend({}, frate);
						// var m = _.extend({}, mrate);

						var billType = _.groupBy(points, function(obj) {
						  return obj.properties.billtype;
						});

						var bts = _.sortBy(billType, function(v, k) { return k; });
						
						var frate = bts[0];
						var mrate = bts[1];

						var fpoints;
						var mpoints;

						function styleFlat(frate) {
							return {
						    radius: (frate.properties.pcappday * 4),
							  color: "#fff",
							  fillColor: "#a4ad50",
							  fillOpacity: 0.95,
							  opacity: 1,
							  weight: 3
							};
						}

						function styleMeter(mrate) {
							return {
						    radius: (mrate.properties.pcappday * 4),
							  color: "#fff",
							  fillColor: "#9abab4",
							  fillOpacity: 0.95,
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

						  // document.getElementById('bill-panel-pday').innerHTML = layer.options.pday;
							document.getElementById('bill-panel-streetaddr').innerHTML = layer.feature.properties.streetaddr;
							document.getElementById('bill-panel-util').innerHTML = layer.feature.properties.util;
							document.getElementById('bill-panel-bill').innerHTML = layer.feature.properties.bill;
							document.getElementById('bill-panel-used').innerHTML = layer.feature.properties.used;
							document.getElementById('bill-panel-units').innerHTML = layer.feature.properties.units;
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
						
					} else {return;} // if data isn't passed, return out of the element
				}// scope.render
        
			});//end mapService

			
		}//end link
	}//end return

}]);//end .directive