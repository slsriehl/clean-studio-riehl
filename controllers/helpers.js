

const helpers = {
	footerYear: () => {
		const thisDate = new Date().getFullYear();
		return `${thisDate}`;
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
	}
}

module.exports = helpers;
