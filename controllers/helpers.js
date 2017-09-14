

const helpers = {
	footerYear: () => {
		const thisDate = new Date().getFullYear();
		console.log(thisDate);
		if(thisDate == 2017) {
			return thisDate;
		} else {
			return `2017-${thisDate}`;
		}
	}
}

module.exports = helpers;
