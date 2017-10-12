const axios = require('axios');

const reqProm = require('request-promise');

const Promise = require('bluebird');

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
	getInvoicePdf: (invoice) => {
		return axios.get(`https://books.zoho.com/api/v3/invoices/${invoice}`, {
			headers: {
				"Authorization" : `Zoho-authtoken ${zohoKey}`,
				"Content-Type": "application/json;charset=UTF-8"
			},
			params: {
				organization_id: zohoId,
				accept: "pdf"
			}
		})
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
