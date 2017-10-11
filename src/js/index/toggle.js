//define menu toggle function to call onclick of the toggle, the overlay, or a menu item
var toggleMenu = function(event, menu, toggle, overlay) {
	if(window.getComputedStyle(menu, null).getPropertyValue('visibility') == 'hidden') {
		//console.log('toggle menu');
		menu.style.visibility = 'visible';
		overlay.style.visibility = 'visible';
		toggle.style.display = 'none';
		menu.style.zIndex = '150';
		overlay.style.zIndex = '105';
	} else {
		//console.log('toggle no menu');
		menu.style.visibility = 'hidden';
		overlay.style.visibility = 'hidden';
		toggle.style.display = 'block';
		menu.style.zIndex = '-1';
		overlay.style.zIndex = '-1';
	}
}

//define show mobile for window resize listener
var showMobile = function(menu, toggle, overlay) {
	menu.style.visibility = 'hidden';
	overlay.style.visibility = 'hidden';
	toggle.style.display = 'block';
	menu.style.zIndex = '-1';
	overlay.style.zIndex = '-1';
}
//define show desktop for window resize listener
var showDesktop = function(menu, toggle, overlay) {
	menu.style.visibility = 'visible';
	overlay.style.visibility = 'hidden';
	toggle.style.display = 'none';
	menu.style.zIndex = '150';
	overlay.style.zIndex = '-1';
}
