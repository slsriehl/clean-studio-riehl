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
