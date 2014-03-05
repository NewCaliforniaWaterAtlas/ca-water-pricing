var Bill = require('./models/bill');
var Agency = require('./models/agency.js')

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all bills
	app.get('/v1/api/prices', function(req, res) {

		// use mongoose to get all bills in the database
		Bill.find(function(err, bills) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(bills); // return all bills in JSON format
		});
	});
	
	// get all agency data
	app.get('/v1/api/agency', function(req, res) {

		// use mongoose to get all bills in the database
		Agency.find(function(err, agencies) {
			var output = [];
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err) {
				// res.send(err)
				return next(err)
			} else {
				agencies.forEach (function(a){
					// console.log(a);
					output.push(a);
				})			
			}
			res.json(output)// return all bills in JSON format
		});
	});


	// create bill and send back all bills after creation
	app.post('/v1/api/prices', function(req, res) {

		// create a bill, information comes from AJAX request from Angular
		Bill.create({
			addr : req.body.addr,
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