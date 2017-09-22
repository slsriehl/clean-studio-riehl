const express = require('express');

const router = new express.Router;

const controller = require('../controllers/post');

router.post('/mail', (req, res) => {
	controller.dispatchMail(req, res);
});


module.exports = router;
