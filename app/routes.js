var Bill = require('./models/bill');

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

	// create bill and send back all bills after creation
	app.post('/v1/api/prices', function(req, res) {

		// create a bill, information comes from AJAX request from Angular
		Bill.create({
			bill : req.body.bill,
			used : req.body.used,
			rate : req.body.rate,
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