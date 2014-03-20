var Bill = require('./models/bill');
var Agency = require('./models/agency.js')
var apicache = require('apicache').options({ debug: true }).middleware;
var request = require('request');

var geoservices = require('geoservices');
var gs = new geoservices();

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all user submitted entries
	app.get('/v1/api/prices', function(req, res) {
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


	// // get NOAA Palmer Drought Severity Index data
	// app.get('/v1/api/features/palmerdrought', apicache('5 minutes'), function(req, res, next) {

	//   var url = "http://gis.ncdc.noaa.gov/arcgis/rest/services/cdo/indices/MapServer/2?f=pjson";

	//   request(url, function(err, resp, body) {
 //      body = JSON.parse(body);
	//     // pass back the results to client side
	//     res.send(body);
	//   });

	// });


	// get NOAA Palmer Drought Severity Index data
	app.get('/v1/api/features/palmerdrought', apicache('5 minutes'), function(req, res, next) {

		var params = {
		  url: 'http://gis.ncdc.noaa.gov/arcgis/rest/services/cdo/indices/MapServer/2'
		};

		var query_params = {
		  f: 'json',
		  returnGeometry: true,
		  where: '1=1',
		  outSR: '4326'
		};

		var fs = new gs.featureservice( params , function(err, data){
		  fs.query(query_params, function( err, result ){
		    if (err) {
		      console.error("Error: " + err);
		    } else {
		      console.log("Features: ", result );
		      res.json(result);
		    }
		  });
		});

	});


	// create bill and send back all bills after creation
	app.post('/v1/api/prices', function(req, res) {

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
			done : false
		}, function(err, bill) {
			if (err)
				res.send(err);

			// get and return all the bills after you create another
			Bill.find(function(err, bills) {
				if (err)
					res.send(err)
				res.json(bills);
			});
		});

	});


	// delete a bill
	app.delete('/v1/api/prices/:bill_id', function(req, res) {
		Bill.remove({
			_id : req.params.bill_id
		}, function(err, bill) {
			if (err)
				res.send(err);

			// get and return all the bills after you create another
			Bill.find(function(err, bills) {
				if (err)
					res.send(err)
				res.json(bills);
			});
		});
	});


	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};