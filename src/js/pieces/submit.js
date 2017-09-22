//function to call on submit form
var submitForm = function(event, el, replaceMe) {
	event.preventDefault();
	var message;
	var data = formToJson(event.target.elements);
	console.log(data);
	//call make request method promise
	return request('POST', '/mail', data)
	.then(function(result) {
		console.log(result);
		if(result == 'true') {
			message = 'Your message was successfully sent.  ';
		} else {
			message = "Sorry, we couldn't send your message.  Try again later.  ";
		}
		renderMessage(el, replaceMe, message);
	})
	.catch(function(error) {
		message = "Sorry, we couldn't send your message.  Try again later.  ";
		renderMessage(el, replaceMe, message);
	});
}
//render a message
var renderMessage = function(el, replaceMe, message) {
	replaceMe.innerHTML = message;
	if(message == 'Your message was successfully sent.  ') {
		console.log('success message');
		el.style.display = 'none';
	} else {
		console.log('failed message');
		replaceMe.style.color = '#C70039';
	}
	resetJump();
	window.location.hash = "\u0023mail";
}

//menu item reset jump helper/remove event
var resetJump = function() {
	console.log('reset jump');
	history.pushState ("", document.title, (window.location.pathname + window.location.search));
}

// //menu item onclick event callback
//
// var goToMenuItems = function(parentEl, overlay, toggle, jumpName) {
// 	console.log('go to menu items');
// 	resetJump();
// 	//toggleMenu parentEl, overlay, toggle
// 	window.location.hash = "\u0023" + jumpName;
// }
