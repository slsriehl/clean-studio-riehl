const nodemailer = require('nodemailer');

const apiHelpers = require('./api-requests');
const helpers = require('./helpers');

const Promise = require('bluebird');

const moment = require('moment');

const reCAPTCHA = require('recaptcha2');

const siteKey = process.env.RECAPTCHA_SITE_KEY;
const secretKey = process.env.RECAPTCHA_SECRET_KEY;
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripePublic = process.env.STRIPE_PUB_KEY;

const stripe = require('stripe')(stripeSecret);

const receiveAddr = process.env.RECEIVE_ADDR;
const sendAddr = process.env.SEND_ADDR;
const sendPwd = process.env.SEND_PWD;
const sendHost = process.env.SEND_HOST;
const sendPort = parseInt(process.env.SEND_PORT);

let sslEmail;
if(process.env.SSL_EMAIL == '1') {
	sslEmail = true;
} else {
	sslEmail = false;
}

//create smtp obj for transport
const smtpAuth = {
	host: sendHost,
	port: sendPort,
	secure: sslEmail,
	auth: {
		user: sendAddr,
		pass: sendPwd
	}
}
//create smtp transport
const transporter = Promise.promisifyAll(nodemailer.createTransport(smtpAuth));

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
		//smtp authentication object above
		console.log(smtpAuth);

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
		console.log(req.body);
		let amount = Math.round(parseFloat(req.body.amount) * 100);
		let invoiceId = req.body.invoiceId;
		let invoiceNo = req.body.invoiceNo;
		let customerId = req.body.customerId;
		let chargedAmt, chargedCard;
		console.log(amount);
		stripe.customers.create({
			email: req.body.email,
			source: req.body.stripeToken
		})
		.then((customer) => {
			console.log(customer);
			return stripe.charges.create({
				amount,
				currency: 'usd',
				customer: customer.id
			});
		})
		.then((charge) => {
			console.log(charge);
			if(charge.status == "succeeded") {
				chargedAmt = parseFloat((parseInt(charge.amount) / 100).toFixed(2));
				cardCharged = charge.source.last4;
				let data = {
					customer_id: customerId,
					payment_mode: 'stripe',
					amount: chargedAmt,
					date: moment().format('YYYY-MM-DD'),
					invoices: [{
						invoice_id: invoiceId,
						amount_applied: chargedAmt
					}]
				}
				console.log(data);
				return Promise.resolve(apiHelpers.applyToInvoice(data));
			} else {
				return Promise.reject({Error: charge.status});
			}
		})
		.then((data) => {
			let payment = data.data;
			let balance = payment.payment.payment.invoices[0].balance_amount;
			console.log(payment);
			let balanceDue;
			if(balance) {
				balanceDue = addZeroes(balance);
			} else {
				balanceDue = balance;
			}
			if(payment.message == "The payment has been created.") {
				res.render('confirm-payment.hbs', {
					balanceDue,
					invoiceNo,
					invoiceId,
					chargedAmt,
					cardCharged
				});
			} else {
				return Promise.reject({Error: payment.message});
			}
		})
		.catch((error) => {
			console.log(error);
			res.render('confirm-payment.hbs', {
				fail: true,
				invoiceNo,
				invoiceId
			});
		});
	}
}

module.exports = controller;
