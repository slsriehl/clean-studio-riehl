const util = require('util');

const helpers = require('./helpers');

const wordpressData = require('../data/wordpress');
const fullStackData = require('../data/full-stack');

let siteKey;
if(process.env.SITE_KEY) {
	siteKey = process.env.SITE_KEY;
} else {
	siteKey = require('../config/config').siteKey;
}

const controller = {
	renderAbout: (req, res) => {
		const footerYear = helpers.footerYear();
	  res.render('index.hbs', {
			footerYear: footerYear,
			fullStackSites: fullStackData,
			wordpressSites: wordpressData,
			recaptchaSiteKey: siteKey
		});
	},

}

module.exports = controller;
