document.addEventListener('DOMContentLoaded', function() {
	var menuToggle = document.getElementById('menuToggle');
	var headerMenu = document.getElementById('headerMenu');
	var menuOverlay = document.getElementById('menuOverlay');
	var toggleMenu = function() {
		if(window.getComputedStyle(headerMenu, null).getPropertyValue('visibility') == 'hidden') {
			console.log('toggle menu');
			headerMenu.style.visibility = 'unset';
			menuOverlay.style.visibility = 'unset';
			menuToggle.style.visibility = 'hidden';
			headerMenu.style.zIndex = '150';
			menuOverlay.style.zIndex = '105';
		} else {
			console.log('toggle no menu');
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
	// console.log(siteImgs);
	// for(var i = 0; i < siteImgs.length; i++) {
	// 	console.log(siteImgs[i]);
	// 	siteImgs[i].addEventListener('mouseenter', function() {
	// 		this.parentNode.childNodes[3].style.visibility = 'visible';
	// 	});
	// 	siteImgs[i].addEventListener('mouseleave', function() {
	// 		this.parentNode.childNodes[3].style.visibility = 'hidden';
	// 	});
	// }

	var inputs = [].slice.call(document.getElementsByClassName('contact__input'));
	console.log(inputs);
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
	var hideMe = document.getElementById('hideOnSubmit');
	var replaceMe = document.getElementById('replaceOnSubmit');

	emailForm.addEventListener('submit', function(event) {
		submitForm(event, emailForm, hideMe, replaceMe);
	});

});
