//xml http request class and make request promise method
var request = function(method, path, data) {
	return new Promise(function(resolve, reject) {
		var req = new XMLHttpRequest();
		//req.setRequestHeader "Content-Type", "application/json;charset=UTF-8"
		req.open(method, path);
		req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
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
		return req.send(JSON.stringify(data));
	});
}
