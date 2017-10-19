'use strict';
// admin routes
// contains routes for the main admin page
// requires admin to be logged in

var express = require('express'),
	passport = require('passport'),
	router = express.Router(),
	routes = require('../../config').routes;

// Administrator panel
router.get('/', function(req, res) {
	if (!req.isAuthenticated()) {
		res.render('admin/login');
	} else {
		res.render('admin/panel');
	}
});

router.post('/', passport.authenticate('local', {
	successRedirect: routes.admin,
	successFlash: 'Welcome!',
	failureRedirect: routes.admin,
	failureFlash: true
}), function() {});

// logout route
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'You are logged out!');
	res.redirect(routes.admin);
});

module.exports = router;
