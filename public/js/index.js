/*!
 * Studio Riehl Portfolio - 2.0 - studioriehl.com

 * MIT License
 * Copyright 2016-2017 Sarah Schieffer Riehl
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
//adapted from https://codepen.io/zchee/pen/ogzvZZ

(function() {
	'use strict';

	var sections = {};

	var sectionSites = [].slice.call(document.getElementsByClassName("section__sites"));
	for(var i = 0; i < sectionSites.length; i++) {
		sections[sectionSites[i].id] = sectionSites[i].offsetTop;
	}

	window.onscroll = function() {
		var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

		var i = 0;
		for (i in sections) {
			if (sections[i] <= (scrollPosition + 40)) {
				document.querySelector('.header--inverse').classList.remove('header--inverse');
				document.querySelector('a[href*=' + i + ']').classList.add('header--inverse');
			}
		}
	};
})();

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

document.addEventListener('DOMContentLoaded', function() {
	var menuToggle = document.getElementById('menuToggle');
	var headerMenu = document.getElementById('headerMenu');
	var menuOverlay = document.getElementById('menuOverlay');
	var toggleMenu = function() {
		if(window.getComputedStyle(headerMenu, null).getPropertyValue('visibility') == 'hidden') {
			//console.log('toggle menu');
			headerMenu.style.visibility = 'unset';
			menuOverlay.style.visibility = 'unset';
			menuToggle.style.visibility = 'hidden';
			headerMenu.style.zIndex = '150';
			menuOverlay.style.zIndex = '105';
		} else {
			//console.log('toggle no menu');
			headerMenu.style.visibility = 'hidden';
			menuOverlay.style.visibility = 'hidden';
			menuToggle.style.visibility = 'unset';
			headerMenu.style.zIndex = '-1';
			menuOverlay.style.zIndex = '-1';
		}
	}
	menuToggle.addEventListener('click', function(event) {
		toggleMenu();
	});
	menuOverlay.addEventListener('click', function(event) {
		toggleMenu();
	});
	// var siteImgs = [].slice.call(document.getElementsByClassName('site__img--img'));
	// //console.log(siteImgs);
	// for(var i = 0; i < siteImgs.length; i++) {
	// 	//console.log(siteImgs[i]);
	// 	siteImgs[i].addEventListener('mouseenter', function() {
	// 		this.parentNode.childNodes[3].style.visibility = 'visible';
	// 	});
	// 	siteImgs[i].addEventListener('mouseleave', function() {
	// 		this.parentNode.childNodes[3].style.visibility = 'hidden';
	// 	});
	// }

	var inputs = [].slice.call(document.getElementsByClassName('contact__input'));
	//console.log(inputs);
	for(var i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('blur', function() {
			if(this.value) {
				this.classList.add('contact__input--filled');
			} else if(this.classList.contains('contact__input--filled')) {
				this.classList.remove('contact__input--filled');
			}
		});
	}

	var emailForm = document.getElementById('emailStudioRiehl');
	var replaceMe = document.getElementById('replaceOnSubmit');

	emailForm.addEventListener('submit', function(event) {
		submitForm(event, emailForm, replaceMe);
	});

});

//function to call on submit form
var submitForm = function(event, el, replaceMe) {
	event.preventDefault();
	var message;
	var data = formToJson(event.target.elements);
	//console.log(data);
	//call make request method promise
	return request('POST', '/mail', data)
	.then(function(result) {
		//console.log(result);
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
		//console.log('success message');
		el.style.display = 'none';
	} else {
		//console.log('failed message');
		replaceMe.style.color = '#C70039';
	}
	resetJump();
	window.location.hash = "\u0023mail";
}

//menu item reset jump helper/remove event
var resetJump = function() {
	//console.log('reset jump');
	history.pushState ("", document.title, (window.location.pathname + window.location.search));
}

// //menu item onclick event callback
//
// var goToMenuItems = function(parentEl, overlay, toggle, jumpName) {
// 	//console.log('go to menu items');
// 	resetJump();
// 	//toggleMenu parentEl, overlay, toggle
// 	window.location.hash = "\u0023" + jumpName;
// }
