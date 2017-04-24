'use strict';
// User SubscriberGroup model
// Stores groups of subscribers
var mongoose = require('mongoose');

var config = require('../config');

var Subscriber = require('./Subscriber');

var SubscriberGroupSchema = new mongoose.Schema({
	groupName: {
		type: String,
		required: [true, 'Group Name required']
	},
	emailDomain: {
		type: String,
		required: [true, 'Email Domain required']
	},
	signUpSlug: {
		type: String,
		unique: [true, 'Sign Up Slug must be unique'],
		required: [true, 'Sign Up Slug required'],
		match: [/^[a-z\-]+$/, 'Sign Up Slug must be composed of lowercase letters and hyphens.']
	},
	repairEmail: {
		type: String,
		required: [true, 'Repair Requests Email required']
	},
	logoSrc: {
		type: String
	},
	legalText: {
		type: String
	},
	subscribers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Subscriber'
	}],
	hidden: {
		type: Boolean,
		required: [true, 'Hidden field is required']
	}
});

// addNew
// add new subscriber and make visible
SubscriberGroupSchema.statics.addNew = function(subscriberGroup, callback) {
	subscriberGroup.hidden = false;
	return this.create(subscriberGroup, function(err, subscriberGroup) { callback(err, subscriberGroup) });
}

// findBySlug
// creates a query by signUpSlug and returns a callback function with a potentially-null single document
SubscriberGroupSchema.statics.findBySlug = function(slug, callback) {
	return this.findOne({
		'signUpSlug': slug
	}, function(err, subscriberGroup) { callback(err, subscriberGroup) });
};

// findBySlugAndAddSubscriber
// looks for subscriberGroup by singUpSlug and adds the passed subscriber
SubscriberGroupSchema.statics.findBySlugAndAddSubscriber = function(slug, subscriber, callback) {
	return this.findBySlug(slug, function(err, subscriberGroup) {
		if (err) {
			callback(err);
		} else {
			var re = new RegExp(subscriberGroup.emailDomain + '$');
		  var match = re.test(subscriber.email);
		  console.log(match);

		  if (match) {
				Subscriber.addNew(subscriber, subscriberGroup, function(err, subscriber) {
					if (err) {
						callback(err);
					} else {
						subscriberGroup.subscribers.push(subscriber);
						subscriberGroup.save();
						callback(null, subscriberGroup, subscriber);
					}
				});
			} else {
				callback({ message: 'Email does not match domain: ' + subscriberGroup.emailDomain });
			}
		}
	});
};

// findBySlug
// creates a query by signUpSlug and returns a callback function with a potentially-null single document
SubscriberGroupSchema.statics.findByIdAndRemoveWithSubscribers = function(id, callback) {
	return this.findByIdAndRemove(id, function(err, subscriberGroup) {
		if (err) {
			callback(err);
		} else {
			subscriberGroup.subscribers.forEach(function(subscriber) {
				Subscriber.findByIdAndRemove(subscriber, function(err) {
					if (err) {
						callback(err);
					}
				});
			});
			callback(null, subscriberGroup);
		}
	});
};

// getPublicGroups
// Returns array of visible group data for index route
SubscriberGroupSchema.statics.getPublicGroups = function(callback) {
	this.find({}, function(err, subscriberGroups) {
		if (err) {
			callback(err);
		} else {
			var publicGroups = subscriberGroups.reduce(function(publicGroups, group) {
				if (!group.hidden) {
					publicGroups.push({
						groupName: group.groupName,
						signUpSlug: group.signUpSlug,
						logoSrc: group.logoSrc
					});
				}
				return publicGroups;
			}, []);
			callback(null, publicGroups);
		}
	});
}

// export
module.exports = mongoose.model('SubscriberGroup', SubscriberGroupSchema);
