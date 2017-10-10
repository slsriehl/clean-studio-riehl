const nodemailer = require('nodemailer');

const Promise = require('bluebird');

const moment = require('moment');

const reCAPTCHA = require('recaptcha2');

let config;
if(!process.env.CONFIG) {
	config = require('../config/config');
}

let receiveAddr;
if(process.env.RECEIVE_ADDR) {
	receiveAddr = process.env.RECEIVE_ADDR;
} else {
	receiveAddr = config.receiveAddr;
}

let sendAddr;
if(process.env.SEND_ADDR) {
	sendAddr = process.env.SEND_ADDR;
} else {
	sendAddr = config.sendAddr;
}

let sendPwd;
if(process.env.SEND_PWD) {
	sendPwd = process.env.SEND_PWD;
} else {
	sendPwd = config.sendPwd;
}

let sendHost;
if(process.env.SEND_HOST) {
	sendHost = process.env.SEND_HOST;
} else {
	sendHost = config.sendHost;
}

let sendPort;
if(process.env.SEND_PORT) {
	sendPort = parseInt(process.env.SEND_PORT);
} else {
	sendPort = config.sendPort;
}

let siteKey;
if(process.env.SITE_KEY) {
	siteKey = process.env.SITE_KEY;
} else {
	siteKey = config.siteKey;
}

let secretKey;
if(process.env.SECRET_KEY) {
	secretKey = process.env.SECRET_KEY;
} else {
	secretKey = config.secretKey;
}

let sslEmail;
if(process.env.SSL_EMAIL) {
	if(process.env.SSL_EMAIL == '1') {
		sslEmail = true;
	}
} else {
	sslEmail = config.sslEmail;
}

const controller = {
	dispatchMail: (req, res) => {
		//req.body
		console.log(req.body);
		//create the message
		let message = '';
		const messageArr = req.body.message.split("\n");
		for(let i = 0; i < messageArr.length; i++) {
			message += `<p>${messageArr[i]}</p>`;
		}
		//create the mail object
		const mailOptions = {
			from: `"studioriehl.com" <${sendAddr}>`,
			to: receiveAddr,
			subject: 'new message from studioriehl.com',
			html: `<h2>name: ${req.body.name}</h2><h2>email: ${req.body.email} </h2><h2>phone: ${req.body.tel}</h2><h2>message</h2>${message}<p>IP address: ${req.ip}</p><p>date: ${moment().utc().format('YYYY-MM-DD HH:mm:ss UTC')}</p>`
		}
		console.log(mailOptions);
		//smtp authentication object
		const smtpAuth = {
			host: sendHost,
			port: sendPort,
			secure: sslEmail,
			auth: {
				user: sendAddr,
				pass: sendPwd
			}
		}
		console.log(smtpAuth);
		//create the smtp transport
		const transporter = Promise.promisifyAll(nodemailer.createTransport(smtpAuth));
		//create the recaptcha object
		const recaptcha = new reCAPTCHA({
		  siteKey: siteKey,
		  secretKey: secretKey
		});
		//check the captcha and send the mail
		return recaptcha.validateRequest(req)
		.then((success) => {
			return transporter.sendMailAsync(mailOptions);
		})
		.then((success) => {
			console.log(success);
			res.send(true);
		})
		.catch((failure) => {
			console.log(failure);
			res.send(false);
		});
	},
	takePayment: (req, res) => {
		
	}
}

module.exports = controller;
