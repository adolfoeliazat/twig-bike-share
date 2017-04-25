'use strict';
// Instantiate config object -------------------------------------------------------------------
var config = {};

// Get server configurations
config.env = global.environment || process.env.NODE_ENV || 'development';
config.ipAddress = process.env.IP;
config.port = process.env.PORT;

// Get environemnt configurations -------------------------------------------------------------------
config.appDomain = process.env.APP_DOMAIN;
config.appSecret = process.env.SESSION_SECRET;
config.dbUrl = config.env === 'test' ? 'mongodb://localhost/openbike' : process.env.DB_URL;
config.mailgunPrivateApiKey = process.env.MAILGUN_PRIVATE_API_KEY;
config.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
config.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
config.twilioSendingNumber = process.env.TWILIO_NUMBER;

// Set composed configurations
config.mailgunDomain = 'wta-tma.org';
config.mailgunFromEmail = 'Bikeshare <bikeshare@wta-tma.org>';

config.siteTitle = 'Westside Bike Share';
config.supportSite = 'http://www.wta-tma.org/westside-bike-share-pilot-project/';
config.supportEmail = 'bikeshare@wta-tma.org';
config.supportTimeZone = 'America/Los_Angeles'
config.protocol = 'https://';

config.routes = {
	root: '/',
	admin: '/a',
	administrators: '/a/administrators',
	bikes: '/a/bikes',
	logout: '/a/logout',
	data: '/a/data',
	subscriberGroups: '/a/subscriber-groups',
	locations: '/a/locations',
	setup: '/setup',
	subscribers: '/subscribers',
	twilioApi: '/twilio',
	twilioApiIncomingMessage: '/msg',
	twilioApiIncomingVoice: '/voice',
	signUp: '/signup',
	legal: '/legal',
	newValidation: '/newValidation',
	checkouts: '/checkouts',
	subscriberEmailData: '/subscribers'
};

// Export module -------------------------------------------------------------------
module.exports = config;
