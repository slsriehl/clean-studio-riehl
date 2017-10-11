document.addEventListener("DOMContentLoaded", function() {

	//++++++ switch/amount event listeners ++++++

	//array of switch elements on the page
	var switches = [].slice.call(document.getElementsByClassName('payment--slider'));

	//loop switches
	for(var i = 0; i < switches.length; i++) {
		//attach event listeners for switches.  these listeners are general to all switches
		switches[i].addEventListener('click', function(event) {
			//toggle input field under switch, complete appropriate inputs
			showSwitchInput(event.target);
		});
	}

	//attach document listener to listen for click on page so that click on partial-payment-amount input will be able to attach to dynamically loaded field.  this listener is specific to the partial-payment-amount input
	attachDynamicListener(document.querySelector('body'), 'click', document.getElementById('partial-payment-amount'), 'change', changeListenerForCorrectCharge);

	//++++++ stripe instantiation and event listeners ++++++

	//pick out form element
	var form = document.getElementById('payment-form');
	// Add an instance of the card UI component into the `card-element` <div>
	card.mount('#card-element');

	//event listener for front end validation of card input elements
	card.addEventListener('change', function(event) {
		//pick out error display element
	  var displayError = document.getElementById('card-errors');
		//if error on change, display
	  if (event.error) {
	    displayError.textContent = event.error.message;
	  } else {
		//if no error on change, remove error message
	    displayError.textContent = '';
	  }
	});

	// on form submit, delay submission to get a token and add it to a hidden form input
	form.addEventListener('submit', function(e) {
	  e.preventDefault();
	  createToken();
	});
});
