var express = require("express"),
	app     = express(),
	mongoClient = require("mongodb").MongoClient,
	bodyParser = require('body-parser'); // Need to parse data of form

	app.use(express.static(__dirname + '/public')); // specify the views directory
	app.use('/bootstrapCSS', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
	app.use('/angular', express.static(__dirname + '/node_modules/angular/'));

var url = 'mongodb://101PublicBu10:27017/coffeeshop2';	
mongoClient.connect(url, function(err, db){
	console.log('Connection to mongodb established...');	
	app.get('/coffeeshop/foods', function(req, res){
		db.collection('food').find().toArray(function(err, docs){
			res.send(docs);
		});
	});
	
	/*app.post('/insert', function(req, res){
		db.collection('food').insert({req.body},function(err, result){
			
			
		});
	});*/
});

app.listen(3000, function(){
	console.log('Server listenning on port 3000...');
});