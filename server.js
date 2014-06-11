// set up ======================================================================
var express  = require('express');
var app      = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
// var MongoClient = require('mongodb').MongoClient; // native driver
var port  	 = process.env.PORT || 8080; // set the port
var database = require('./config/database'); // load the database config
var chromelogger = require('chromelogger');

// configuration ===============================================================
// connect to mongoDB database with mongoose ORM
mongoose.connect(database.dbPath);

app.configure(function() {
	app.use(express.compress()); // gzip compression
	app.use(express.static(__dirname + '/public')); // set the static files location
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.bodyParser()); // pull information from html in POST
	app.use(express.methodOverride()); // simulate DELETE and PUT
	app.use(chromelogger.middleware); // log to chromelogger
});

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
// console.log(database.dbPath);