const express = require('express');

const router = new express.Router;

const controller = require('../controllers/get');

// one page router route
router.get('/', (req, res) => {
	controller.renderAbout(req, res, [
		"https://www.google.com/recaptcha/api.js",
		"/js/index.min.js"
	]);
});

router.get('/pay/:invoice', (req, res) => {
	controller.renderPayment(req, res, true, [
		"https://js.stripe.com/v3/",
		"/js/pay.min.js"
	]);
});

router.get('/view/:invoice', (req, res) => {
	controller.viewInvoice(req, res, true, [
		"https://js.stripe.com/v3/"
	]);
});

module.exports = router;
