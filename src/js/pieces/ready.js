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
	})
});
