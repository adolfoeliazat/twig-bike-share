'use strict';
// Bike model
// Has a two-digit bike ID and a 4 digit unlock code for a tumbler U-lock bike lock
var mongoose = require('mongoose');
var supportTimeZone = require('../config').supportTimeZone;

var mailer = require('../modules/mailgun');

var BikeSchema = new mongoose.Schema({
	bikeId: {
		type: Number,
		required: [true, 'Bike ID required'],
		min: [1, 'Bike ID must be between 1 and 999'],
		max: [999, 'Bike ID must be between 1 and 999'],
		unique: [true, 'Bike ID must be unique']
	},
	code: {
		type: String,
		required: [true, 'Bike code is required'],
		match: [/^\d{4}$/, 'Code must be a 4-digit number.']
	},
	active: {
		type: Boolean,
		required: [true, 'Active field is required']
	},
	repairRequests: []
});

// addNew
// creates new bike and sets active to true
BikeSchema.statics.addNew = function(bike, callback) {
	bike.active = true;
	return this.create(bike, function(err, bike) { callback(err, bike); });
};

// findByBikeID
// creates a query by bikeId, and returns a callback function with a potentially-null single document
// bikeId's are unique, this should return only one result
BikeSchema.statics.findByBikeId = function(bikeId, callback) {
	return this.findOne({
		'bikeId': bikeId
	}, function(err, bike) { callback(err, bike); });
};


// addRepairRequest
// adds a repair request to the bike
BikeSchema.methods.addRepairRequest = function(subscriber, message) {
	var timestamp = Date.now();

	this.repairRequests.push({
		timestamp: timestamp,
		subscriber: subscriber.email,
		message: message
	});

	this.active = false;

	this.save(function(err, bike) {
		if (err) {
			console.error(err);
		} else {
			console.log('Repair request sent to ' + subscriber.subscriberGroup.repairEmail);
			mailer.sendOne({
				to: subscriber.subscriberGroup.repairEmail,
				subject: 'Repair Request for bike #' + bike.bikeId,
				text: 'A repair was requested for bike ' + bike.bikeId + '\nAt ' + (new Date(timestamp)).toLocaleString('en-US', { timeZone: supportTimeZone }) + '\nThey said: \n' + message
			});
		}
	});
};

// clearRepairRequests
// removes all repair requests from a bike
BikeSchema.methods.clearRepairRequests = function(callback) {
	this.repairRequests = [];
	this.active = true;
	this.save(function(err) { callback(err); });
};

//export
module.exports = mongoose.model('Bike', BikeSchema);
