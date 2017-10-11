const express = require('express');

const router = new express.Router;

const controller = require('../controllers/post');

router.post('/mail', (req, res) => {
	controller.dispatchMail(req, res);
});

router.post('/pay/result', (req, res) => {
	controller.takePayment(req, res);
});


module.exports = router;
