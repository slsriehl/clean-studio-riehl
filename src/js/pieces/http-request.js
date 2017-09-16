//xml http request class and make request promise method
var request = function(method, path, data) {
	new Promise(function(resolve, reject) {
		var req = new XMLHttpRequest();
		//req.setRequestHeader "Content-Type", "application/json;charset=UTF-8"
		req.open(method, path);
		req.onload = function() {
			if(req.status == 200) {
				resolve(req.responseText);
			} else {
				reject(new Error(req.statusText));
			}
		}
		req.onerror = function() {
			reject(new Error('unknown error'));
		}
		req.send(JSON.stringify(data));
	});
}
