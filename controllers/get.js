const util = require('util');

const helpers = require('./helpers');

const wordpressData = require('../data/wordpress');
const fullStackData = require('../data/full-stack');

const controller = {
	renderAbout: (req, res) => {
		const footerYear = helpers.footerYear();
	  res.render('index.hbs', {
			footerYear: footerYear,
			brandSelect: true
		});
	},
	renderMail: (req, res) => {
		const footerYear = helpers.footerYear();
		res.render('mail.hbs', {
			footerYear: footerYear,
			mailSelect: true
		});
	},
	renderWordpress: (req, res) => {
		const footerYear = helpers.footerYear();
		res.render('wordpress.hbs', {
			sites: wordpressData,
			footerYear: footerYear,
			wordpressSelect: true
		});
	},
	renderFullStack: (req, res) => {
		const footerYear = helpers.footerYear();
		res.render('full-stack.hbs', {
			sites: fullStackData,
			footerYear: footerYear,
			fullStackSelect: true
		});
	},

}

module.exports = controller;
