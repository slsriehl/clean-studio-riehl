const moment = require('moment');

const Promise = require('bluebird');

const mime = require('mime');

const fs = Promise.promisifyAll(require('fs'));

const helpers = {
	footerYear: () => {
		const thisDate = new Date().getFullYear();
		return `${thisDate}`;
	},
	mimeLookup: (file) => {
		return mime.lookup(file);
	},
	addZeroes: (num) => {
		var value = parseFloat(num);
		let str = num.toString();
		var res = str.split(".");
		if(str.indexOf('.') === -1) {
			value = value.toFixed(2);
			num = value.toString();
		} else if (res[1].length < 3) {
			value = value.toFixed(2);
			num = value.toString();
		}
		return num;
	},
	writeToErrorLog:  (req, error) => {
		let loggableError;
		if(typeof(error) === "object") {
			loggableError = JSON.stringify(error);
		} else {
			loggableError = error;
		}

		const errorText = `****** NEW ERROR WITH PROMISE ******\n\n\
		#date: \n			${moment().utc().format('YYYY-MM-DD HH:mm:ss UTC')} \n\n\
		#user IP: \n			${req.ip} \n\n\
		#protocol: \n			${req.protocol} \n\n\
		#secure connection?: \n			${req.secure} \n\n\
		#headers: \n			${JSON.stringify(req.headers)} \n\n\
		#original url: \n			${req.originalUrl} \n\n\
		#request url: \n			${req.path} \n\n\
		#ajax request?: \n			${req.xhr} \n\n\
		#promise error: \n			${loggableError} \n\n\
		****** END ERROR ******\n\n\n\n`;
		fs.appendFileAsync('./errors/error-log.md', errorText)
		.then((e) => {
			if(e) {
				console.log('error was not appended to log because ' + e);
			}
		});
	},
	pipePdf: (res, pdfObj) => {
		const Transform = require('stream').Transform;
	  const pdf_stream = require('pdf-stream');
	  const PDFReadable = pdf_stream.PDFReadable;
	  const PDFStringifyTransform = pdf_stream.PDFStringifyTransform;

		class ReplaceTransform extends Transform {
			constructor(options) {
				super({
					writableObjectMode: true,
					readableObjectMode: true
				});
				this.from = options.from;
				this.to = options.to;
			}
			// For every object
			_transform(obj, encoding, cb) {
				// Get text content items
				if (typeof obj.textContent !== 'undefined'
					&& Array.isArray(obj.textContent.items)) {
					obj.textContent.items.forEach((item, i) => {
						// Working with the PDF.js `textContent` object
						// Replace substring to another
						obj.textContent.items[i].str = item.str.replace(this.from, this.to);
					});
				}

				this.push(obj);
				cb();
			}
		}
		new PDFReadable(pdfObj)
    .pipe(new ReplaceTransform({
      from: /trace/gi,
      to: ':-)'
    }))
    .pipe(new PDFStringifyTransform()) // Convert stream from object to string
    .pipe(res);

	}
}

module.exports = helpers;
