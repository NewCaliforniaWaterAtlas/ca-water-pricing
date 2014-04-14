var Bill = require('./models/bill');
var Agency = require('./models/agency');

var apicache = require('apicache').options({ debug: true }).middleware;
var request = require('request');
var schedule = require('node-schedule');

var jsonConv = require('../config/jsonConverters').esriConverter();
var topojson = require("topojson");
var simplify = require('simplify-geojson');

var database = require('../config/database');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

// connect to native mongo client ---------------------------------------------------------------------
var db;

MongoClient.connect(database.dbPath, function(err, database) {
  db = database;
})


module.exports = function(app) {

	// api ---------------------------------------------------------------------
	
	// get all user submitted entries
	app.get('/v1/api/bills', function(req, res) {
		// use mongoose to get all entries in the database
		Bill.find(function(err, bills) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err) {
				res.send(err);
			} else {
				res.json(bills); // return all bills in JSON format
			}
		});
	});

	
	// get all agency data
	app.get('/v1/api/agency', apicache('5 minutes'), function(req, res, next) {
		// use mongoose to get all records in the database
		Agency.find(function(err, agencies) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err) {
				res.send(err);
			} else {
				res.json(agencies); // return agency data in JSON format
			}
			
		});
	});


	// create bill and send back all bills after creation
	app.post('/v1/api/bills', function(req, res) {

		// create a bill, information comes from AJAX request from Angular
		Bill.create({
			userloc : req.body.userloc,
			streetaddr : req.body.streetaddr,
			city : req.body.city,
			county : req.body.county,
			state : req.body.state,
			country : req.body.country,
			postal : req.body.postal,
			hsize : req.body.hsize,
			util : req.body.util,
			bill : req.body.bill,
			sdate : req.body.sdate,
			edate : req.body.edate,
			billtype : req.body.billtype,
			used : req.body.used,
			units : req.body.units,
			lat : req.body.lat,
			lng : req.body.lng,
			rate : req.body.rate,
			tstamp : req.body.tstamp,
			pday : req.body.pday,
			done : false
		}, function(err, bill) {
			if (err)
				res.send(err);

			// get and return all the bills after you create another
			Bill.find(function(err, bills) {
				if (err) {
					res.send(err);
				} else {
					res.json(bills);
				}
			});
		
		});

	});


	// delete a bill
	app.delete('/v1/api/bills/:bill_id', function(req, res) {
		Bill.remove({
			_id : req.params.bill_id
		}, function(err, bill) {
			if (err) {
				res.send(err);
			}

			// get and return all the bills after you create another
			Bill.find(function(err, bills) {
				if (err) {
					res.send(err);
				} else {
				res.json(bills);
				}
			});
		
		});
	});


	// feature layers -------------------------------------------------------------
	
	// get NOAA Palmer Drought Severity Index data
	app.get('/v1/api/features/palmerdrought', apicache('5 minutes'), function(req, res) {

		var stream = db.collection('noaapalmerdsi').find().stream();
		
		stream.on("error", function(err) {
			console.error("Error: " + err);	
		});

		var items = [];
		stream.on("data", function(data) {
			items.push(data);			
		});

		stream.on("end", function() {
			console.log("stream end");
			res.json(items);
		});

		// db.collection('noaapalmerdsi').find({}).toArray(function(err, data) {
		// 	res.json(data);
		// });

	});
	

	// application -------------------------------------------------------------
	// app.get('*', function(req, res) {
	// 	res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	// });


	app.get('*', function(req, res) {
	     res.sendfile('index.html', { root: './public' });
	});

	// schedule request to NOAA REST API & return Palmer Drought Serverity Index
	// get JSON & convert to geoJSON and store in mongo collection
	// todo: parse JSON and pull "."s out of field names and return "outFields=*", query latest record in where=YEARMONTH
	
	// var j = schedule.scheduleJob({hour: 15, minute: 0, dayOfWeek: 4}, function(){
	// // (function() {

	//   request.get({ 
	//     // url: 'http://gis.ncdc.noaa.gov/arcgis/rest/services/cdo/indices/MapServer/1/query?where=YEARMONTH%3D201402&spatialRel=esriSpatialRelIntersects&returnDistinctValues=false&f=json&outFields=*&returnGeometry=true'
	//     url: 'http://gis.ncdc.noaa.gov/arcgis/rest/services/cdo/indices/MapServer/2/query?where=YEARMONTH%3D201402&spatialRel=esriSpatialRelIntersects&returnDistinctValues=false&f=json&outFields=PDSI,NAME,DIV_CODE&returnGeometry=true'
	//     }, function(err,resp,body){
	  		
	//   		if (!err && resp.statusCode == 200) {

	// 	      var outjson = JSON.parse(body);
	// 	      var geojson = jsonConv.toGeoJson(outjson);
	// 	      // var simplified = simplify(geojson, 0.001);

	// 				// var collection = {type: "FeatureCollection", features: [geojson]}; // GeoJSON
	// 				// var topology = topojson.topology({collection: collection}); // convert to TopoJSON
	// 				// console.log(topology.objects.collection); // inspect TopoJSON

	// 		    // var objects, options;
	// 		    // options = {
	// 		    //   verbose: true,
	// 		    //   "coordinate-system": "auto",
	// 		    //   quantization: 1e4,
	// 		    //   "stich-poles": true,
	// 		    //   "property-transform": function(o, k, v) {
	// 		    //     o[k] = v;
	// 		    //     return true;
	// 		    //   }
	// 		    // };
	// 		    // objects = {
	// 		    //   features: geojson
	// 		    // };
			    
	// 		    // var outputjson = topojson.topology(objects, options);

	// 				db.createCollection('noaapalmerdsi', function(err, collection) {});
				
	// 			  db.collection('noaapalmerdsi').save(geojson, function(err, records) {
	// 			    if (err) throw err;
	// 			    console.log("record added");
	// 			  });

	//   		} else {
	//   			console.error("Error: " + err);
	//   		}

	//   });
	// 	var date = new Date();
	// 	console.log('retrieved NOAA Palmer DSI JSON: ' + date);

	// // })();		
	// });



};

