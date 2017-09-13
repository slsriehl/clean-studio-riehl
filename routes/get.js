const express = require('express');

const router = new express.Router;

const controller = require('../controllers/get');

// one page router route
router.get('/', (req, res) => {
	controller.renderAbout(req, res);
});

router.get('/mail', (req, res) => {
	controller.renderMail(req, res);
});

router.get('/wordpress', (req, res) => {
	controller.renderWordpress(req, res);

});

router.get('/full-stack', (req, res) => {
	controller.renderFullStack(req, res);
});

module.exports = router;
