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
		const footerYear = controller.footerYear();
		res.render('mail.hbs', {
			footerYear: footerYear,
			mailSelect: true
		});
	},
	renderWordpress: (req, res) => {
		const footerYear = controller.footerYear();
		res.render('wordpress.hbs', {
			footerYear: footerYear,
			wordpressSelect: true
		});
	},
	renderFullStack: (req, res) => {
		const footerYear = controller.footerYear();
		res.render('full-stack.hbs', {
			footerYear: footerYear,
			fullStackSelect: true
		});
	},
	footerYear: () => {
		const thisDate = new Date().getFullYear();
		console.log(thisDate);
		if(thisDate == 2017) {
			return thisDate;
		} else {
			return `2017-${thisDate}`;
		}
	}
}

module.exports = controller;
