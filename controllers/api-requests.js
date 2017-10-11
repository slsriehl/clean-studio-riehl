const axios = require('axios');

const zohoKey = process.env.ZOHO_AUTH_TOKEN;

const zohoId = process.env.ZOHO_ORG_ID;

const helpers = {
	getInvoiceJson: (req) => {
		return axios.get(`https://books.zoho.com/api/v3/invoices/${req.params.invoice.toString()}`, {
			headers: {
				"Authorization" : `Zoho-authtoken ${zohoKey}`,
				"Content-Type": "application/json;charset=UTF-8",
				"Host": "books.zoho.com"
			},
			params: {
				organization_id: zohoId
			}
		})
	},
	getInvoicePdf: (req) => {
		return axios.get(`https://books.zoho.com/api/v3/invoices/${req.params.invoice.toString()}`, {
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
	applyToInvoice: (data) => {
		return axios({
			method: 'post',
			url: `https://books.zoho.com/api/v3/customerpayments?organization_id=${zohoId}`,
			data: {
				JSONString: data
			},
			headers: {
				"Authorization" : `Zoho-authtoken ${zohoKey}`,
				"Content-Type": "application/json;charset=UTF-8"
			}
		})
	}
}

module.exports = helpers;
