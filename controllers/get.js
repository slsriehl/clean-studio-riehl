const util = require('util');

const path = require('path');

const helpers = require('./helpers');
const apiHelpers = require('./api-requests');

const moment = require('moment');
const Promise = require('bluebird');

const wordpressData = require('../data/wordpress');
const fullStackData = require('../data/full-stack');

const siteKey = process.env.RECAPTCHA_SITE_KEY;

const footerYear = helpers.footerYear();

const controller = {
	renderAbout: (req, res, specificScripts) => {
	  res.render('index.hbs', {
			footerYear: footerYear,
			fullStackSites: fullStackData,
			wordpressSites: wordpressData,
			recaptchaSiteKey: siteKey,
			specificScripts
		});
	},
	renderPayment: (req, res, isPayment, specificScripts) => {
		console.log(util.inspect(req.params.invoice));
		console.log(req.params.invoice);
		console.log(req.params.invoice.toString());
		//hit zoho api with invoice number and get amount of invoice, name of client, etc
		apiHelpers.getInvoiceJson(req.params.invoice)
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
						name: items[i].name,
						description: items[i].description
					}
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
				const customerId = invoice.invoice.customer_id;
				const invoiceNo = invoice.invoice.invoice_number;
				const clientName = invoice.invoice.customer_name;
				const subtotal = helpers.addZeroes(invoice.invoice.sub_total);
				const taxAmt = helpers.addZeroes(invoice.invoice.tax_total);
				const invoiceTotal = helpers.addZeroes(invoice.invoice.total);
				const invoiceObj = {
					invoiceId,
					customerId,
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
					lineItems,
					isPayment,
					specificScripts
				}
				console.log(invoiceObj);
				res.render('take-payment.hbs', invoiceObj);
			} else {
				console.log('message isnt success');
				return Promise.reject(data);
			}
		})
		.catch((error) => {
			console.log(error);
			//res.send(error);
		});
	},
	viewInvoice: (req, res) => {
		const filename = `inv-studio-riehl.pdf`;
		res.setHeader('Content-Type', `application/pdf; name="${filename}"`);
		res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
		//res.setHeader('Content-Transfer-Encoding', 'binary');
		apiHelpers.getInvoicePdf(res, req.params.invoice)
	},
}

module.exports = controller;
