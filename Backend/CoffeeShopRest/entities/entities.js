var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
// configuration
var config = require('../configuration/conf');
	
router.use(function(req, res, next){
	console.log('entities router.');
	next();
})
// get all records of a entity
.get('/:entity', function(req, res){
	var entityName = '';
	switch(req.params.entity){
		case 'users':
		case 'foods':
		case 'tables':
		case 'orders':
			entityName = req.params.entity;
			break;
		default:
			console.log('Invalid entity name!');
			
			res.send('INVALID ENTITY!');
			return;
	}
	
	var db = req.db;
	console.log(entityName.substring(0, entityName.length-2));
	db.collection(entityName.substring(0, entityName.length-1)).find().toArray( function(err, docs){
		res.send(docs);
	});
})
// get entity by its id
.get('/:entity/id/:id', function(req, res){
	var entityName = '';
	switch(req.params.entity){
		case 'user':
		case 'food':
		case config.db.COLLECTION_TABLE:
		case 'order':
			entityName = req.params.entity;
			break;
		default:
			console.log('Invalid entity name!');
			
			res.send('INVALID ENTITY!');
			return;
	}
	var id = req.params.id;
	var objectId = new ObjectID(id);
	var db = req.db;
	console.log('id: ', id);
	db.collection(entityName).findOne({'_id':objectId},{'_id':0}, function(err, docs){
		res.send(docs);
	});
})
// add new entity
.post('/:entity', function(req, res){
	var entity = req.params.entity;
	switch(entity){
	case 'food':
		addFood(req, res);
		break;
	case config.db.COLLECTION_TABLE:
		addTable(req, res);
		break;
	case 'order':
		addOrder(req, res);
		break;
	default:
		res.send('INVALID ENTITY!');
		break;
	}
})
// update entity
.put('/:entity', function(req, res){
	var entity = req.params.entity;
	var object = {};
	var entityName = '';
	switch(entity){
	case 'food':
		entityName = 'food';
		object = extractFoodFromReq(req);
		break;
	case 'table':
		entityName = config.db.COLLECTION_TABLE;
		object = extractTableFromReq(req);
		break;
	case 'order':
		entityName = 'Order';
		object = extractOrderFromReq(req);
		break;
	default:
		res.send('INVALID ENTITY!');
		break;
	}
	updateEntity(req, res, entityName, object);
})
// delete a entity by its _id
.delete('/:entity/id/:id', function(req, res){
	var entityName = req.params.entity;
	var id = req.params.id;//req.body._id;
	console.log('id: ', id);
	req.db.collection(entityName).deleteOne({_id: new ObjectID(id)}, {}, function(err, docs){
		if( err ){
			res.send('Fail to DELETE entity');
		}
		else{
			res.send('DELETE entity successfully');
		}
	});
});

// update entity by its _id
var updateEntity = function(req, res, entity, object){	
	var objectId = new ObjectID(object._id);
	var db = req.db;
	delete object['_id']; // do not update the _id field
	db.collection(entity).update({_id:objectId},{$set: object}, function(err, result){
		if( err ){
			res.send('FAIL to update the entity');
			return;
		}
		res.send('Update entity successfully!');
	});
	// Wait for a second then fetch the document
    /*setTimeout(function() {

      // Fetch the document that we modified
      collection.findOne({a:1}).then(function(item) {
        if( !result ){
			res.send('FAIL to update the entity');
			return;
		}
		res.send('Update entity successfully!');
      });
    }, 1000);*/
};

// add new order
var addOrder = function(req, res){
	var object = extractOrderFromReq(req);
	// insert to db
	req.db.collection('order').insertOne(object,function(err, result){
			if( err == null ){
				res.send('New order added successfully!');
			}
			else{
				res.send('Fail to add new order!');
			}
	});
};

var extractOrderFromReq = function(req){
	var object = {};
	if( req.body._id ) object['_id'] = req.body._id;
	if( req.body.createTime ) object['createTime'] = req.body.createTime;
	if( req.body.waitingTime ) object['waitingTime'] = req.body.waitingTime;
	if( req.body.paidTime ) object['paidTime'] = req.body.paidTime;
	if( req.body.paidMoney ) object['paidMoney'] = req.body.paidMoney;
	if( req.body.table_id ) object['table_id'] = req.body.table_id;
	if( req.body.note ) object['note'] = req.body.note;
	if( req.body.state ) object['state'] = req.body.state;
	
	// order detail list
	//var details = [];
	//console.log(req.body.orderDetails);
	//for( odd in req.body.orderDetails ){
	//	details.push({'food_id':odd.food_id, 'quantity':odd.quantity});
	//}
	if( req.body.orderDetails ){
		object['orderDetails'] = req.body.orderDetails;
	}
	
	return object;
};

// add new food
var addFood = function(req, res){	
	var object = extractFoodFromReq(req);
	
	var db = req.db;
	db.collection('food').insertOne(object,function(err, result){
			if( err == null ){
				res.send('New food added successfully!');
			}
			else{
				res.send('Fail to add new food!');
			}
	});
};

var extractFoodFromReq = function(req){
	var object = {};
	if( req.body._id ) object['_id'] = req.body._id;
	if( req.body.name ) object['name'] = req.body.name;
	if( req.body.category ) object['category'] = req.body.category;
	if( req.body.image ) object['image'] = req.body.image;
	if( req.body.price ) object['price'] = req.body.price;
	
	return object;
};

// add new table
var addTable = function(req, res){
	var object = extractTableFromReq(req);
	
	var db = req.db;
	db.collection(config.db.COLLECTION_TABLE).insertOne(object,function(err, result){
			if( err == null ){
				res.send('New table added successfully!');
			}
			else{
				res.send('Fail to add new table!');
			}
	});
};

var extractTableFromReq = function(req){
	var object = {};
	if( req.body._id ) object['_id'] = req.body._id;
	if( req.body.name ) object['name'] = req.body.name;
	if( req.body.floor ) object['floor'] = req.body.floor;
	if( req.body.order_id ) object['order_id'] = req.body.order_id;
	if( req.body.state ) object['state'] = req.body.state;
	
	return object;
}
// to transfer the check url down
router.use(function(req, res, next){
	next();
});
	
module.exports = router;