var express = require('express');
var router = express.Router();

const COL_USER = "user"; 
// middleware specific for this route
// then add rest api
router.use(function timelog(req, res, next){
	console.log('accounting router...');
	console.log('Time: ', Date.now());
	next();
})
.post('/user', function(req, res){
	var name = req.body.name;
	var username = req.body.username;
	var password = req.body.password;
	var gender = req.body.gender;
	var dob = req.body.dob;
	var address = req.body.address;
	var phone = req.body.phone;
	
	// First check if username exist or not
	var db = req.db;
	var collection = db.collection(COL_USER);
	collection.find({'username':username}).count(function(err, number){
		console.log('err: ', err);
		console.log('number', number);
		if(err != null || number != 0){
			console.log('username is already used!');
			res.send("USER_REGISTRATION_FAIL");
			return;
		}
		
		// ok, insert new user
		collection.insertOne({
			'name':name,
			'username':username,
			'password':password,
			'gender':gender,
			'dob':dob,
			'address':address,
			'phone':phone			
		}, function(err, result){
			console.log('result:', result);
			if( err != null ){
				console.log(result);
				res.send("USER_REGISTRATION_FAIL");
				return;
			}
			
			// check again the registration
			var id = result.insertedId;
			var cursor = collection.find({_id:id});
			cursor.count(function(err, number){
				if( number != 1){
					console.log('cannot find the just inserted user!');
					res.send("USER_REGISTRATION_FAIL");
				}
				else{
					res.send('REGISTRATION OK');
				}
			});
		})
	});
})
.post('/login', function(req, res){
	console.log('do login...');
	// do login
	var username = req.body.username;
	var password = req.body.password;
	
	//console.log(req.body);
	var db = req.db;
	var cursor = db.collection(COL_USER).find({'username':username, 'password':password});
	cursor.count(function(err, count){
		var ok = true;
		if( count == 1 ){
			console.log('Login success!');
		}
		else{
			ok = false;
			console.log('Invalid username or password!');
		}
		
		// res.send('server answer: ' + ok);
		// res.redirect('/UserHomePage');
		// db.close(); // do not close here because we want to reuse the connection
	});
	
	//cursor.each(function(err, item){
	//	console.log(item);
	//});

	//res.send('do login, username = '+username+', password = ' + password);
});	

// to transfer the check url down
router.use(function(req, res, next){
	next();
});
	
module.exports = router;