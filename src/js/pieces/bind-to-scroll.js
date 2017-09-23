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
