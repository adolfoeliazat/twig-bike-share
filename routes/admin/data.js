'use strict';
var express = require('express');
var router = express.Router();

var stringify = require('csv-stringify');

var Checkout = require('../../models/Checkout');
var Subscriber = require('../../models/Subscriber');
var routes = require('../../config').routes;

// Data index route
router.get('/', function(req, res) {
	res.render('admin/data/index');
});

// Download bike checkouts route
router.get(routes.checkouts, function(req, res) {
	Checkout.find({})
		.populate('bike', 'bikeId')
		.populate('subscriber', 'email')
		.exec(function(err, checkouts) {
			if (err) {
				req.flash('error', err.message);
				res.redirect(routes.data);
			} else {
				var data = checkouts.map(function(checkout) {
					return {
						Timestamp: (new Date(checkout.timestamp)).toLocaleString(),
						BikeId: checkout.bike.bikeId,
						SubscriberEmail: checkout.subscriber.email
					}
				});
				stringify(data, { header: true }, function(err, output) {
					if (err) {
						req.flash('error', err.message);
						res.redirect(routes.data);
					} else {
						res.attachment('checkouts_' + Date.now() + '.csv');
						res.status(200).send(output);
					}
				});
			}
	});
});

// Download data route
router.get(routes.subscriberEmailData, function(req, res) {
	Subscriber.find({})
		.populate('subscriberGroup', 'groupName')
		.exec(function(err, subscribers) {
			if (err) {
				req.flash('error', err.message);
				res.redirect(routes.data);
			} else {
				var data = subscribers.map(function(subscriber) {
					return {
						GroupName: subscriber.subscriberGroup.groupName,
						SubscriberEmail: subscriber.email
					}
				});
				stringify(data, { header: true }, function(err, output) {
					if (err) {
						req.flash('error', err.message);
						res.redirect(routes.data);
					} else {
						res.attachment('subscriberEmails_' + Date.now() + '.csv');
						res.status(200).send(output);
					}
				});
			}
	});
});


module.exports = router;
