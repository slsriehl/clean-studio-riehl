const util = require('util');

const helpers = require('./helpers');

const axios = require('axios');
const moment = require('moment');
const Promise = require('bluebird');

const wordpressData = require('../data/wordpress');
const fullStackData = require('../data/full-stack');

let siteKey;
if(process.env.SITE_KEY) {
	siteKey = process.env.SITE_KEY;
} else {
	siteKey = require('../config/config').siteKey;
}

let zohoKey;
if(process.env.ZOHO_KEY) {
	zohoKey = process.env.ZOHO_KEY;
} else {
	zohoKey = require('../config/config').zohoAuthToken;
}

let zohoId;
if(process.env.ZOHO_ID) {
	zohoId = process.env.ZOHO_ID;
} else {
	zohoId = require('../config/config').zohoOrgId;
}

let stripePubKey;
if(process.env.STRIPE_PUB_KEY) {
	stripePubKey = process.env.STRIPE_PUB_KEY;
} else {
	stripePubKey = require('../config/config').stripePublishableKey;
}

const controller = {
	renderAbout: (req, res) => {
		const footerYear = helpers.footerYear();
	  res.render('index.hbs', {
			footerYear: footerYear,
			fullStackSites: fullStackData,
			wordpressSites: wordpressData,
			recaptchaSiteKey: siteKey
		});
	},
	renderPayment: (req, res) => {
		console.log(req.params);
		const footerYear = helpers.footerYear();
		//hit zoho api with invoice number and get amount of invoice, name of client
		const zohoReq = `https://books.zoho.com/api/v3/invoices/${req.params.invoice}`;
		console.log(zohoReq, zohoKey);
		axios.get(zohoReq, {
			headers: {
				"Authorization" : `Zoho-authtoken ${zohoKey}`,
				"Content-Type": "application/json;charset=UTF-8"
			}
		})
		.then((data) => {
			const invoice = data.data;
			console.log(invoice);
			if(invoice.message === "success") {
				const dueDate = moment(invoice.invoice.due_date);
				let latePayment, paymentInterval;
				if(dueDate.isBefore()) {
					latePayment = true;
					paymentInterval = dueDate.fromNow();
				} else {
					latePayment = false;
					paymentInterval = dueDate.toNow();
				}
				const items = invoice.invoice.line_items;
				let lineItems = [];
				for(var i in items) {
					let lineItemObj = {
						name, description
					} = items[i];
					lineItems.push(lineItemObj);
				}
				let paymentMade;
				if(invoice.invoice.payment_made) {
					paymentMade = helpers.addZeroes(invoice.invoice.payment_made);
				} else {
					paymentMade = 0;
				}
				let balanceDue;
				if(invoice.invoice.balance) {
					balanceDue = helpers.addZeroes(invoice.invoice.balance);
				} else {
					balanceDue = 0;
				}
				const invoiceId = req.params.invoice;
				const invoiceNo = invoice.invoice.invoice_number;
				const clientName = invoice.invoice.customer_name;
				const subtotal = helpers.addZeroes(invoice.invoice.sub_total);
				const taxAmt = helpers.addZeroes(invoice.invoice.tax_total);
				const invoiceTotal = helpers.addZeroes(invoice.invoice.total);
				const invoiceObj = {
					invoiceId,
					invoiceNo,
					footerYear,
					clientName,
					latePayment,
					paymentInterval,
					subtotal,
					taxAmt,
					invoiceTotal,
					paymentMade,
					balanceDue,
					stripePubKey,
					lineItems,
					specificScripts: [
						"https://js.stripe.com/v3/",
						"/js/payment.js"
					]
				}
				console.log(invoiceObj);
				res.render('take-payment.hbs', invoiceObj);
			} else {
				res.send(invoice);
				return Promise.reject(invoice.message);
			}
		})
		.catch((error) => {
			console.log(error);
			res.send(error);
		});
	},
	getInvoicePdf: (req, res) => {
		axios.get(`https://books.zoho.com/api/v3/invoices/${req.params.invoice}?accept=pdf`, {
			headers: {
				"Authorization" : `Zoho-authtoken ${zohoKey}`,
				"Content-Type": "application/json;charset=UTF-8"
			}
		})
	}
}

module.exports = controller;
