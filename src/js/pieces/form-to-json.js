
//++++++ use these functions to convert the form input to json so the xhr request can send it ++++++

//validate the fields sent to form to JSON so they're excluded if blank
var isValidElement = function(element) {
	return element.name && element.value;
};

//check if a checkbox is checked and include in formToJSON
var isValidValue = function(element) {
	return (!['checkbox', 'radio'].includes(element.type) || element.checked);
}

//convert the input in the form inputs into a json object
var formToJson = function(elements) {
	return [].reduce.call(elements, function(data, element) {
		if(isValidElement(element) && isValidValue(element)) {
			data[element.name] = element.value;
		}
		return data;
	}, {});
}
