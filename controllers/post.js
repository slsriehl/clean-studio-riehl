const util = require('util');

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
const zohoStripeClearing = process.env.ZOHO_STRIPE_CLEARING;

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

const footerYear = helpers.footerYear();

const controller = {
	emailAboutPayment: (req, message, customerName, invoiceNo, chargedAmtDisplay, balanceDue) => {
		console.log(message);
		let parsedMessage;
		if(message == "Contact information has been saved." || message == "The payment from the customer has been recorded") {
			parsedMessage = `Payment successful!  ${customerName} paid you ${chargedAmtDisplay} on ${invoiceNo} today.`
			if(balanceDue) {
				parsedMessage += `Their remaining balance due is ${balanceDue}.`;
			}
		} else {
			parsedMessage = `${customerName} tried to pay you ${chargedAmtDisplay} on ${invoiceNo} today, but the promise chain failed.  Check the logs and take appropriate action.`;
		}
		const mailOptions = {
			from: `"studioriehl.com" <${sendAddr}>`,
			to: receiveAddr,
			subject: 'payment initiated on studioriehl.com',
			html: `<p>${parsedMessage}</p><p>date: ${moment().utc().format('YYYY-MM-DD HH:mm:ss UTC')}</p>`
		}
		transporter.sendMailAsync(mailOptions)
		.then((success) => {
			return Promise.resolve(true);
		})
		.catch((failure) => {
			helpers.writeToErrorLog(req, failure)
			return Promise.resolve(true);
		})
	},
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
			helpers.writeToErrorLog(req, error);
			res.send(false);
		});
	},
	takePayment: (req, res, isPayment, specificScripts) => {
		console.log(req.body);
		let amount = Math.round(parseFloat(req.body.amount) * 100);
		let invoiceId = req.body.invoiceId;
		let invoiceNo = req.body.invoiceNo;
		let customerId = req.body.customerId;
		let customerName = req.body.customerName;
		let stripeEmail, chargedAmt, chargedAmtDisplay, stripeConfirm, zohoCustomStripeId, existingStripeCustomer, balanceDue;
		console.log(amount);
		apiHelpers.getCustomer(customerId)
		.then((data) => {
			console.log(data.data);
			let customer = data.data.contact;
			if(data.data.message == 'success') {
				for(let i in customer.contact_persons) {
					if(customer.contact_persons[i].is_primary_contact) {
						stripeEmail = customer.contact_persons[i].email;
					}
				}
				if(customer.custom_fields.length) {
					for(let i in customer.custom_fields) {
						if(customer.custom_fields[i].label == "Stripe ID") {
							zohoCustomStripeId = customer.custom_fields[i].value;
						}
					}
				}
				if(zohoCustomStripeId) {
					existingStripeCustomer = true;
					return stripe.customers.createSource(zohoCustomStripeId, {
						source: req.body.stripeToken
					})
				} else {
					existingStripeCustomer = false;
					return stripe.customers.create({
						email: stripeEmail,
						source: req.body.stripeToken
					})
				}
			} else {
				return Promise.reject(data);
			}
		})
		.then((customer) => {
			console.log(customer);
			if(!existingStripeCustomer) {
				zohoCustomStripeId = customer.id;
			}
			return stripe.charges.create({
				amount,
				currency: 'usd',
				customer: zohoCustomStripeId,
				description: `Studio Riehl - ${invoiceNo}`
			});
		})
		.then((charge) => {
			console.log(charge);
			if(charge.status == "succeeded") {
				stripeReceiptNo = charge.receipt_number;
				chargedAmt = parseFloat(parseInt(charge.amount) / 100);
				bankCharges = (chargedAmt * 0.029) + 0.30;
				chargedAmtDisplay = `$${helpers.addZeroes(chargedAmt)}`;
				cardCharged = charge.source.last4;
				let data = {
					customer_id: customerId,
					account_id: zohoStripeClearing,
					invoice_id: invoiceId,
					bank_charges: bankCharges,
					payment_mode: 'Stripe',
					reference_number: stripeReceiptNo,
					amount: chargedAmt,
					date: moment().format('YYYY-MM-DD'),
					invoices: [{
						invoice_id: invoiceId,
						amount_applied: chargedAmt
					}],
				}
				console.log(data);
				return Promise.resolve(apiHelpers.applyToInvoice(data));
			} else {
				return Promise.reject({Error: charge.status});
			}
		})
		.then((rawData) => {
			console.log(rawData);
			let data = JSON.parse(rawData);
			console.log(data.message);
			if(data.message == "The payment from the customer has been recorded") {
				console.log('customer payment recorded');
				let payment = data.payment;
				let balance = payment.invoices[0].balance;
				if(balance) {
					balanceDue = `$${helpers.addZeroes(balance)}`;
				} else {
					balanceDue = balance;
				}
			 if(existingStripeCustomer) {
				 console.log('existingStripeCustomer, should render success');
				 controller.emailAboutPayment(req, data.message, customerName, invoiceNo, chargedAmtDisplay, balanceDue);
					res.render('confirm-payment.hbs', {
						balanceDue,
						invoiceNo,
						invoiceId,
						chargedAmtDisplay,
						cardCharged,
						stripeReceiptNo,
						isPayment,
						specificScripts,
						footerYear
					});
					return Promise.resolve(false);
				} else {
					console.log('not existingStripeCustomer, call addStripeToCustomer');
					const dataObj = {
						customer_name: customerName,
						custom_fields: [{
							value: zohoCustomStripeId,
							label: "Stripe ID"
						}]
					}
					return Promise.resolve(apiHelpers.addStripeToCustomer(customerId, dataObj));
				}
			} else {
				console.log('data.message didnt match');
				return Promise.reject({Error: data.message});
			}
		})
		.then((rawData) => {
			console.log(rawData);
			if(rawData) {
				let data = JSON.parse(rawData);
				if(data.message == 'Contact information has been saved.') {
					controller.emailAboutPayment(req, data.message, customerName, invoiceNo, chargedAmtDisplay, balanceDue);
					console.log('contact successfully updated, should render success');
					res.render('confirm-payment.hbs', {
						balanceDue,
						invoiceNo,
						invoiceId,
						chargedAmtDisplay,
						cardCharged,
						stripeReceiptNo,
						isPayment,
						specificScripts,
						footerYear
					});
					return Promise.resolve(true);
				} else {
					return Promise.reject({Error: data.message});
				}
			} else {
				return Promise.resolve(true);
			}
		})
		.catch((error) => {
			console.log(error);
			helpers.writeToErrorLog(req, error);
			controller.emailAboutPayment(req, 'Payment promise failed.', customerName, invoiceNo, chargedAmtDisplay, balanceDue);
			res.render('confirm-payment.hbs', {
				fail: true,
				invoiceNo,
				invoiceId,
				isPayment,
				specificScripts,
				footerYear
			});
		});
	},
}

module.exports = controller;
