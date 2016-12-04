var express = require("express"),
	app     = express(),
	MongoClient = require('mongodb').MongoClient;
	
	// Setup
	app.use(express.static(__dirname + '/public')); // specify the views directory
	app.use('/bootstrapCSS', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
	app.use('/angular', express.static(__dirname + '/node_modules/angular/'));
	app.use('/controller', express.static(__dirname + './public/controller'));
	
	// configuration
	var config = require('./configuration/conf');

	console.log(config.db);
	// Need to parse body of request
	var	bodyParser = require('body-parser');
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	// Accounting
	/*var requestIp = require('request-ip');
	app.use(requestIp.mw())

	app.use(function(req, res) {
		var ip = req.clientIp;
		console.log(ip)
		res.end(ip);
	});*/
		
MongoClient.connect(config.db.DB_URL, function(err, db){
	console.log('Connection to mongodb established...');

	// Make our db accessible to our router
	app.use(function(req,res,next){
		req.db = db;
		next();
	});
	
	app.get('/coffeeshop/foods', function(req, res){
		db.collection('food').find().toArray(function(err, docs){
			res.send(docs);
		});
	});
	
	// Accounting
	var accounting = require('./accounting/accounting');
	app.use('/', accounting);
	
	// Entities
	var entity = require('./entities/entities');
	app.use('/', entity);
	
	// If no api matches
	app.use(function(req, res){
		res.send('URL not found!');
	});
});	

app.listen(3000, function(){
	console.log('Server listenning on port 3000...');
});