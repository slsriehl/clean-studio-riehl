const express = require('express');

const router = new express.Router;

const controller = require('../controllers/get');

// one page router route
router.get('/', (req, res) => {
	controller.renderAbout(req, res);
});

router.get('/pay/:invoice', (req, res) => {
	controller.renderPayment(req, res);
})

module.exports = router;
