document.addEventListener('DOMContentLoaded', function() {
	//pick out most elements for menu toggle
	var menuToggle = document.getElementById('menuToggle');
	var headerMenu = document.getElementById('headerMenu');
	var menuOverlay = document.getElementById('menuOverlay');

	//define menu toggle function
	var toggleMenu = function() {
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
			menuToggle.style.visibility = 'unset';
			headerMenu.style.zIndex = '-1';
			menuOverlay.style.zIndex = '-1';
		}
	}
	//toggle menu on hamburger click
	menuToggle.addEventListener('click', function(event) {
		toggleMenu();
	});
	//toggle menu on overlay click
	menuOverlay.addEventListener('click', function(event) {
		toggleMenu();
	});
	//toggle menu on menu item click
	//pick out menu items by class
	var menuItems = [].slice.call(document.getElementsByClassName('header__menu__item'));
	//loop to add event listeners
	for(var i = 0; i < menuItems.length; i++) {
		menuItems[i].addEventListener('click', function(event) {
			toggleMenu();
		});
	}


//add classes to inputs to enable floating labels
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
