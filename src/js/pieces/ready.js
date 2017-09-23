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
