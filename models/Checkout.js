'use strict';
// Checkout model
// Stores bike checkout
var mongoose = require('mongoose');

var CheckoutSchema = new mongoose.Schema({
	subscriber: {
		type: mongoose.Schema.Types.ObjectId,
		required: [true, 'Subscriber is required'],
		ref: 'Subscriber'
	},
	bike: {
		type: mongoose.Schema.Types.ObjectId,
		required: [true, 'Bike is required'],
		ref: 'Bike'
	},
	location: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Location'
	},
	timestamp: {
		type: Date,
		default: Date.now
	}
});

CheckoutSchema.statics.addNew = function(subscriber, bike, location, callback) {
	var newCheckout = {
		subscriber: subscriber,
		bike: bike,
		location: location
	};
	return this.create(newCheckout, function(err, checkout) { callback(err, checkout) });
}

// export
module.exports = mongoose.model('Checkout', CheckoutSchema);
