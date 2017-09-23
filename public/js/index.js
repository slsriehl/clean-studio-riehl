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


//++++++ bind and unbind the window scroll with this function ++++++
var onScrollFunction = function(event) {
	//empty object to push section ids to
	var sections = {};
	//pick out the sections of the site that correspond to menu items
	var sectionSites = [].slice.call(document.getElementsByClassName("section__sites"));
	//loop the sections of the site
	for(var i = 0; i < sectionSites.length; i++) {
		// in the sections object, create a sub obj for each section and give it an id pair and an offsetTop pair
		console.log(sectionSites[i].id + ' -- ' + sectionSites[i].offsetTop);
		sections[sectionSites[i].id] = sectionSites[i].offsetTop;
	}
	//the scroll position is where you are on the page vertically
	var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

	var i = 0;
	//loop the sections object
	for (i in sections) {
		//if you're past the section, remove the highlight class from the old section and add the highlight class to the next section
		if (sections[i] <= scrollPosition) {
			document.querySelector('.header--inverse').classList.remove('header--inverse');
			document.querySelector('a[href*="' + i + '"]').classList.add('header--inverse');
		}
	}
	window.location.hash = document.querySelector('.header--inverse').getAttribute('href');
}

var removeHighlighting = function() {
	if(document.querySelector('.header--inverse')) {
		document.querySelector('.header--inverse').classList.remove('header--inverse');
	}
}

var addHighlighting = function() {
	if(window.location.hash) {
		document.querySelector('a[href*="' + window.location.hash + '"]').classList.add('header--inverse');
	} else {
		document.querySelector('a[href*="#about"]').classList.add('header--inverse');
	}


}


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

document.addEventListener('DOMContentLoaded', function() {
	//+++++ mobile menu toggle section +++++

	//pick out most elements for menu toggle
	var menuToggle = document.getElementById('menuToggle');
	var headerMenu = document.getElementById('headerMenu');
	var menuOverlay = document.getElementById('menuOverlay');

	//define menu toggle function to call onclick of the toggle, the overlay, or a menu item
	var toggleMenu = function(event) {
		if(window.getComputedStyle(headerMenu, null).getPropertyValue('visibility') == 'hidden') {
			//console.log('toggle menu');
			headerMenu.style.visibility = 'visible';
			menuOverlay.style.visibility = 'visible';
			menuToggle.style.visibility = 'hidden';
			headerMenu.style.zIndex = '150';
			menuOverlay.style.zIndex = '105';
		} else {
			//console.log('toggle no menu');
			headerMenu.style.visibility = 'hidden';
			menuOverlay.style.visibility = 'hidden';
			menuToggle.style.visibility = 'visible';
			headerMenu.style.zIndex = '-1';
			menuOverlay.style.zIndex = '-1';
		}
	}
	//toggle menu on hamburger click
	menuToggle.addEventListener('click', toggleMenu);
	//toggle menu on overlay click
	menuOverlay.addEventListener('click', toggleMenu);
	//toggle menu on menu item click
	//pick out menu items by class
	var menuItems = [].slice.call(document.getElementsByClassName('header__menu__item'));
	//if the document loads in mobile mode, attach event listeners to menuItems
	if(document.documentElement.clientWidth < 826) {
		removeHighlighting();
	//loop to add event listeners
		for(var i = 0; i < menuItems.length; i++) {
			//add the event listener to toggle the menu closed on item click
			menuItems[i].addEventListener('click', toggleMenu);
		}
	} else {
		//if the document loads in desktop mode, bind to scroll
		window.addEventListener('scroll', onScrollFunction);
	}

	//++++++ on resize, restore proper arrangement for mobile or desktop ++++++
	//if the window size changes
	window.addEventListener('resize', function(event) {
		// if the window is desktop
		if(document.documentElement.clientWidth >= 826) {
			//bind to scroll and highlight current section
			addHighlighting();
			window.addEventListener('scroll', onScrollFunction);
			//show the headerMenu, hide the overlay and the toggle button, and raise the z-index of the header menu back up
			headerMenu.style.visibility = 'visible';
			menuOverlay.style.visibility = 'hidden';
			menuToggle.style.display = 'none';
			headerMenu.style.zIndex = '150';
			menuOverlay.style.zIndex = '-1';
			//loop to remove event listeners
			for(var i = 0; i < menuItems.length; i++) {
				//remove the event listeners that toggle the menu from the menu items
				menuItems[i].removeEventListener('click', toggleMenu);
			}
		} else {
		//if it's a mobile screen
			//remove scroll highlighting
			removeHighlighting();
			//unbind from scroll
			window.removeEventListener('scroll', onScrollFunction);
			//hide the menu & overlay, show the toggle
			headerMenu.style.visibility = 'hidden';
			menuOverlay.style.visibility = 'hidden';
			menuToggle.style.display = 'block';
			headerMenu.style.zIndex = '-1';
			menuOverlay.style.zIndex = '-1';
			//loop to add event listeners
			for(var i = 0; i < menuItems.length; i++) {
				//add the event listener to toggle the menu off on click of a menu item
				menuItems[i].addEventListener('click', toggleMenu);
			}
		}
	});

//++++++ email form ++++++

//++++++ add classes to inputs to enable floating labels ++++++
	//pick out the input fields
	var inputs = [].slice.call(document.getElementsByClassName('contact__input'));
	//console.log(inputs);
	//loop inputs to add event listener
	for(var i = 0; i < inputs.length; i++) {

		inputs[i].addEventListener('blur', function() {
			if(this.value) {
				//when you move out of an input field, if the input has value, apply the class that retains the focus formatting to keep the label floating
				this.classList.add('contact__input--filled');
			} else if(this.classList.contains('contact__input--filled')) {
				//if the input doesn't have a value, restore the non-floating look of an empty input
				this.classList.remove('contact__input--filled');
			}
		});
	}

	//++++++ email form submit ++++++
	//pick out elements to manipulate
	var emailForm = document.getElementById('emailStudioRiehl');
	var replaceMe = document.getElementById('replaceOnSubmit');

	//add event listener to call xhr req on form submit
	emailForm.addEventListener('submit', function(event) {
		submitForm(event, emailForm, replaceMe);
	});
	//++++++ end DOMContentLoaded listener ++++++
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
	window.scrollTo(0, document.body.scrollHeight);
}

//menu item reset jump helper/remove event
var resetJump = function() {
	//console.log('reset jump');
	history.pushState ("", document.title, (window.location.pathname + window.location.search));
}
