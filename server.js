// set up ======================================================================
var express  = require('express');
var app      = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
// var MongoClient = require('mongodb').MongoClient; // native driver
var port  	 = process.env.PORT || 8080; // set the port
var database = require('./config/database'); // load the database config

// configuration ===============================================================
// connect to mongoDB database with mongoose ORM
mongoose.connect(database.dbPath);

// conecct to mongoDB with native driver
// MongoClient.connect(database.dbPath, function(err, db) {
//   if(err) { return console.dir(err); }
// 	db.createCollection('noaapalmerdsi', function(err, collection) {});
// });

app.configure(function() {
	app.use(express.compress()); // gzip compression
	app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.bodyParser()); // pull information from html in POST
	app.use(express.methodOverride()); // simulate DELETE and PUT
});

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
// console.log(database.dbPath);