const express = require('express');

const router = new express.Router;

const controller = require('../controllers/get');

// one page router route
router.get('/', function(req, res) {
	controller.renderAbout(req, res);
});

router.get('/mail', function(req, res) => {
	controller.renderMail(req, res);
});

router.get('/wordpress', function(req, res) => {
	controller.renderWordpress(req, res);

});

router.get('/full-stack', function(req, res) => {
	controller.renderFullStack(req, res);
});

module.exports = router;
