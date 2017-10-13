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

//high level function to attach a listener to an element that appears onload in order to attach a listener to a dynamically loaded element
var attachDynamicListener = function(staticEle, staticEvent, dynamicEle, dynamicEvent, dynamicFunction) {
	staticEle.addEventListener(staticEvent, function(event) {
		dynamicListener(event.target, dynamicEle, dynamicEvent, dynamicFunction);
	});
}

//high level function to create an event listener for an element that is hidden on load
var dynamicListener = function(clickTarget, dynamicElement, listenerType, listenerFunction) {
	//if the user clicked on the dynamic element
	if (clickTarget == dynamicElement) {
		//add a listener of type listenerType
		dynamicElement.addEventListener(listenerType, function(event) {
			//and call the listener function
			listenerFunction(event);
		});
	}
}

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

//instantiate stripe with public key
var stripe = new Stripe('pk_test_7BPc7AnQJn5jjWxU8G9O7DiF');

//instantiate elements for stripe input
var elements = stripe.elements();

//style the card element
var card = elements.create('card', {
	'style': {
		'base': {
			//'fontFamily': 'HiltonSerif, Arial, sans-serif',
			'fontSize': '30px',
			'color': '#444444',
		},
		'invalid': {
			'color': 'red',
		},
	}
});

//set token attribute in hidden input and call submit form
function stripeTokenHandler(token, errorElement) {
	if(errorElement.textContent) {
		errorElement.textContent = errorElement.textContent + "  You cannot submit a payment while there's an error";
	} else {
		// Insert the token ID into the form so it gets submitted to the server
	  var form = document.getElementById('payment-form');
	  var hiddenInput = document.createElement('input');
	  hiddenInput.setAttribute('type', 'hidden');
	  hiddenInput.setAttribute('name', 'stripeToken');
	  hiddenInput.setAttribute('value', token.id);
	  form.appendChild(hiddenInput);
		//console.log(form.elements);
	  // Submit the form
	  form.submit();
	}
}

//promise to create a token based on the stripe instance and card element (and call token handler to add hidden input to form and call submit).  display errors.
function createToken() {
  stripe.createToken(card)
	.then(function(result) {
		var errorElement = document.getElementById('card-errors');
    if (result.error) {
      // Inform the user if there was an error
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server
      stripeTokenHandler(result.token, errorElement);
    }
  });
}


var showSwitchInput = function(thisSwitch) {
	//pick out additional elements
	//checkbox element of switch for partial payment
	var checkbox = thisSwitch.parentNode.childNodes[1];
	//hidden container of partialInput
	var partialInputContainer = thisSwitch.parentNode.parentNode.parentNode.childNodes[3];
	//hidden partialInput
	var partialInput = partialInputContainer.childNodes[1].childNodes[1];
	//hide show button field and add correct value to hidden input and charge button
	if(checkbox.checked == true) {
		//if the checkbox is already checked
		if(partialInput) {
			//clear the partial input
			partialInput.value = "";
			//add correct value to hidden input and charge button based on original full values
			revertButton(partialInput);
		}
		//uncheck the checkbox
		checkbox.checked = false;
		//hide the container
		partialInputContainer.style.display = "none";
	} else {
		//if the checkbox is not checked
		//check it
		checkbox.checked = true;
		//display the container for the partialInput
		partialInputContainer.style.display = "block";
	}
}

var getTotalDue = function() {
	//invoice total span
	var invTotal = document.getElementById('invoiceTotal');
	//balance due span
	var balDue = document.getElementById('balanceDue');
	if(balDue) {
		return balDue.textContent;
	} else {
		return invTotal.textContent;
	}
}

//function to readd the correct value to the hidden input and button in case the partial amount is changed
var revertButton = function(partialInputAmt) {
	//call elements for use in event listeners
	var totalDue = getTotalDue();
	//submit button total span, should equal totalToCharge
	var buttonSpan = document.getElementById('amountReplace');
	//hidden input for charge amount, should equal buttonInsert
	var hiddenTotalAmt = document.getElementById('amount');
	//if the partial input says empty and there is no balance due field (no previous partial payment)
	if(!partialInputAmt.value) {
		console.log('foo');
		//change the display button and the hidden total input to the invoice total
		buttonSpan.textContent = totalDue;
		hiddenTotalAmt.value = totalDue;
	}
}

var changeListenerForCorrectCharge = function(event) {
	//call elements for use
	var totalDue = getTotalDue();
	//submit button total span, should equal totalToCharge
	var buttonSpan = document.getElementById('amountReplace');
	//hidden input for charge amount, should equal buttonInsert
	var hiddenTotalAmt = document.getElementById('amount');
	var displayError = document.getElementById('card-errors');
	var partialAmt = event.target.value;
	var cleanPartialAmt;
	if(partialAmt.indexOf('$') != -1) {
		cleanPartialAmt = partialAmt.replace('$', '').trim();
	} else {
		cleanPartialAmt = partialAmt.trim();
	}
	if(isNaN(parseFloat(cleanPartialAmt))) {
		displayError.textContent = "The partial payment amount must be a number";
	} else if(cleanPartialAmt > totalDue) {
		displayError.textContent = "You cannot pay more than you owe.";
	} else {
		displayError.textContent = "";
		//set the submit button value to that of the dynamic element
		buttonSpan.textContent = cleanPartialAmt;
		//set the hidden input value to that of the dynamic element
		hiddenTotalAmt.value = cleanPartialAmt;
		//change the values if the dynamicElement value is 0
		revertButton(event.target);
	}
}
