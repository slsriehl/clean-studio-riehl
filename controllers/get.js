const util = require('util');

const controller = {
	renderAbout: (req, res) => {
		const footerYear = controller.footerYear();
	  res.render('index.hbs', {
			footerYear: footerYear,
			brandSelect: true
		});
	},
	renderMail: (req, res) => {
		res.render('mail.hbs');
	},
	renderWordpress: (req, res) => {
		res.render('wordpress.hbs');
	},
	renderFullStack: (req, res) => {
		res.render('full-stack.hbs');
	},
	footerYear: () => {

	}
}

module.exports = controller;
