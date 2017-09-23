document.addEventListener('DOMContentLoaded', function() {
	//+++++ mobile menu toggle section +++++

	//pick out elements for menu toggle operations
	var menuToggle = document.getElementById('menuToggle');
	var headerMenu = document.getElementById('headerMenu');
	var menuOverlay = document.getElementById('menuOverlay');
	//pick out menu items by class
	var menuItems = [].slice.call(document.getElementsByClassName('header__menu__item'));

	//create anonymous function that's the same to attach & detach from event listeners
	var toggleMenuAnon = function(event) {
		toggleMenu(event, headerMenu, menuToggle, menuOverlay);
	}

	//+++++ document load condition ++++++

	if(document.documentElement.clientWidth < 826) {
	//if the document loads in mobile mode
		//remove scroll highlighting
		removeHighlighting();
	//loop menuItems to add menuItems event listeners
		for(var i = 0; i < menuItems.length; i++) {
			//add the event listener to toggle the menu closed on item click
			menuItems[i].addEventListener('click', toggleMenuAnon);
		}
		//add the event listener to toggle menu on hamburger click
		menuToggle.addEventListener('click', toggleMenuAnon);
		//add the event listener to toggle menu on overlay click
		menuOverlay.addEventListener('click', toggleMenuAnon);
	} else {
	//if the document loads in desktop mode
		//add highlighting
		addHighlighting();
		//bind to scroll
		window.addEventListener('scroll', onScrollFunction);
	}

	//++++++ on resize condition ++++++
	//if the window size changes
	window.addEventListener('resize', function(event) {
		if(document.documentElement.clientWidth < 826) {
		//if it's a mobile screen
			//hide the menu & overlay, show the toggle
			showMobile(headerMenu, menuToggle, menuOverlay);
			//remove scroll highlighting
			removeHighlighting();
			//unbind from scroll
			window.removeEventListener('scroll', onScrollFunction);
			//loop to add menuItems event listeners
			for(var i = 0; i < menuItems.length; i++) {
				//add the event listener to toggle the menu off on click of a menu item
				menuItems[i].addEventListener('click', toggleMenuAnon);
			}
			//add event listener to toggle menu on hamburger click
			menuToggle.addEventListener('click', toggleMenuAnon);
			//add event listener to toggle menu on overlay click
			menuOverlay.addEventListener('click', toggleMenuAnon);
		} else {
		//if it's a desktop screen
			//show the headerMenu, hide the overlay and the toggle button, and raise the z-index of the header menu back up
			showDesktop(headerMenu, menuToggle, menuOverlay);
			//highlight current section
			addHighlighting();
			//bind to scroll
			window.addEventListener('scroll', onScrollFunction);
			//loop to remove menuItems event listeners
			for(var i = 0; i < menuItems.length; i++) {
				//remove the event listeners that toggle the menu from the menu items
				menuItems[i].removeEventListener('click', toggleMenuAnon);
			}
			//remove menuToggle event listener
			menuToggle.removeEventListener('click', toggleMenuAnon);
			//remove menuOverlay event listener
			menuOverlay.removeEventListener('click', toggleMenuAnon);
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
