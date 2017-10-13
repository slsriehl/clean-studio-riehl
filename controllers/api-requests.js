const axios = require('axios');

const reqProm = require('request-promise');

const Promise = require('bluebird');

const http = require('http');

const zohoKey = process.env.ZOHO_AUTH_TOKEN;

const zohoId = process.env.ZOHO_ORG_ID;

const helpers = {
	getInvoiceJson: (invoice) => {
		return axios.get(`https://books.zoho.com/api/v3/invoices/${invoice}`, {
			headers: {
				"Authorization" : `Zoho-authtoken ${zohoKey}`,
				"Content-Type": "application/json;charset=UTF-8"
			},
			params: {
				organization_id: zohoId
			}
		})
	},
	getInvoicePdf: (res, invoice) => {
		let data = [];
		let newData;
		let options = {
			method: 'GET',
			hostname: 'books.zoho.com',
			path: `/api/v3/invoices/${invoice}?organization_id=${zohoId}&accept=pdf`,
			headers: {
				"Authorization" : `Zoho-authtoken ${zohoKey}`,
				"Content-Type": "application/json;charset=UTF-8"
			}
		}
		const request = http.request(options, (response) => {
			console.log(response);
			response.on('data', (chunk) => {
				data.push(chunk);
			});

			response.on('end', () => {
				console.log(data);
				data = Buffer.concat(data);
				res.setHeader('Content-Length', data.length);
				res.end(data);
			});
		})

		request.end();
	},
	getCustomer: (contactId) => {
		return axios.get(`https://books.zoho.com/api/v3/contacts/${contactId}`, {
			headers: {
				"Authorization" : `Zoho-authtoken ${zohoKey}`,
				"Content-Type": "application/json;charset=UTF-8"
			},
			params: {
				organization_id: zohoId
			}
		})
	},
	applyToInvoice: (dataObj) => {
		const uri = `https://books.zoho.com/api/v3/customerpayments?organization_id=${zohoId}`;
		return reqProm({
			method: 'POST',
			uri,
			formData: {
				JSONString: JSON.stringify(dataObj)
			},
			headers: {
				"Authorization" : `Zoho-authtoken ${zohoKey}`,
				"Content-Type": "application/json;charset=UTF-8"
			}
		})
	},
	addStripeToCustomer: (customerId, dataObj) => {
		const uri = `https://books.zoho.com/api/v3/contacts/${customerId}?organization_id=${zohoId}`;
		return reqProm({
			method: 'PUT',
			uri,
			formData: {
				JSONString: JSON.stringify(dataObj)
			},
			headers: {
				"Authorization" : `Zoho-authtoken ${zohoKey}`,
				"Content-Type": "application/json;charset=UTF-8"
			}
		})
	}
}

module.exports = helpers;
