'use strict';
// api routes
// contains routes for sending an receiving text messages from the messaging client
// contains most of the logic that allows a subscriber to activate their account and use the system

var express = require('express');
var router = express.Router();
var middleware = require('../../middleware');
var regEx = require('../../modules/regExParser');
var twilio = require('../../modules/twilio');

var Subscriber = require('../../models/Subscriber');
var Bike = require('../../models/Bike');
var Checkout = require('../../models/Checkout');

var routes = require('../../config').routes;
var siteTitle = require('../../config').siteTitle;


// incoming voice route
// rejects all voice calls
router.post(routes.twilioApiIncomingVoice, function(req, res) {
	twilio.rejectCall(res);
	console.log('Call Rejected!');
});

// incoming sms route
// this does a number of check to see if the sms is valid
router.post(routes.twilioApiIncomingMessage, function(req, res) {

	// validate the http request is from twilio
	if (twilio.validate(req)) {

		// get message data from request body
		var message = twilio.getMessageData(req);

		// compare body regEx parsers
		var bikeId = regEx.getBikeId(message.body);
		var validationCode = regEx.getValidationCode(message.body);
		var bikeToRepair = regEx.getBikeIdFromRepairRequest(message.body);
		var repairMessage = regEx.getMessageFromRepairRequest(message.body);

		// look up subscriber by phone number
		Subscriber.findByPhoneNumber(message.from, function(err, subscriber) {

			// if the query returns a valid subscriber and the account is active, look for bike id
			if (subscriber && subscriber.active) {
				if (bikeToRepair) {
					Bike.findByBikeId(bikeToRepair, function(err, bike) {
						if (bike) {
							// REPAIR REQUEST --------------------------------------------------------------------------
							bike.addRepairRequest(subscriber, repairMessage);
							var composedMessage = 'Thank you. A service request has been submitted for bike number ' + bike.bikeId + '.';
							if (repairMessage) {
								composedMessage = composedMessage + ' Repair message: ' + repairMessage;
							}
							twilio.sendSms(subscriber.phoneNumber, composedMessage);
						} else {
							twilio.sendSms(subscriber.phoneNumber, 'Sorry, we couldn\'t find a bike with ID: ' + bikeToRepair + ' to request service.');
						}
					});
				} else if (bikeId) {
					Bike.findByBikeId(bikeId, function(err, bike) {
						if (bike) {
							// BIKE CHECKOUT --------------------------------------------------------------------------
							twilio.sendSms(subscriber.phoneNumber, 'The code for bike number ' + bike.bikeId + ' is: ' + bike.code);
							Checkout.addNew(subscriber, bike, function(err, checkout) {
								if (err) {
									console.error('Creating a new checkout failed!');
								} else {
									console.log('User ' + checkout.subscriber.email + ' just checked out bike #' + checkout.bike.bikeId + ' at ' + checkout.timestamp);
								}
							})
						} else {
							twilio.sendSms(subscriber.phoneNumber, 'Sorry, we couldn\'t find a bike with ID: ' + bikeId);
						}
					});
				} else {
					twilio.sendSms(subscriber.phoneNumber, 'Sorry, we could not understand your request.')
				}
			} else if (subscriber && !subscriber.active) {
				twilio.sendSms(subscriber.phoneNumber, 'Sorry, your number has been deactivated.');
			} else if (validationCode) {
				Subscriber.findByValidationCode(validationCode, function(err, subscriber) {
					// VALIDATION CODE --------------------------------------------------------------------------
					if (subscriber) {
						subscriber.phoneNumber = message.from;
						subscriber.active = true;
						subscriber.validationCode = '';
						subscriber.save();
						twilio.sendSms(subscriber.phoneNumber, 'Welcome to the ' + siteTitle + ' ' + subscriber.firstName + '. Your number is now active.');
					} else {
						twilio.sendSms(message.from, 'Sorry you are not authorized to use this application.');
					}
				});
			} else {
				twilio.sendSms(message.from, 'Sorry you are not authorized to use this application.');
			}
		});

		res.status(200).send();
	} else {
		// if not from twilio reject request
		res.status(403).send('Authorization Required!');
	}
});

module.exports = router;
