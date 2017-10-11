//++++++ xml http request class and make request promise method ++++++

//pass the method, path, and object to be sent
var request = function(method, path, data) {
	//create a promise
	return new Promise(function(resolve, reject) {
		//create an xhr request
		var req = new XMLHttpRequest();
		//open the connection
		req.open(method, path);
		//tell the server to expect a json string
		req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		//once you get the response back
		req.onload = function() {
			//if the data reached the server, fulfill the promise with the string returned from the server
			if(req.status == 200) {
				resolve(req.responseText);
			} else {
				//otherwise the data didn't reach the server so reject the promise with an error
				reject(new Error(req.statusText));
			}
		}
		//if there's a different error, reject the promise with an error
		req.onerror = function() {
			reject(new Error('unknown error'));
		}
		//return the result of the promise based on sending the json string of data to the server
		return req.send(JSON.stringify(data));
	});
}
