document.addEventListener("DOMContentLoaded", function() {

	var buttonInsert = document.getElementById('amountReplace');
	var invoiceTotal = document.getElementById('invoiceTotal');
	var balanceDue = document.getElementById('balanceDue');
	var totalToCharge = document.getElementById('amount');

//switches
	var switches = [].slice.call(document.getElementsByClassName('payment--slider'));

	for(var i = 0; i < switches.length; i++) {
		switches[i].addEventListener('click', function(event) {
			var childInput = event.target.parentNode.childNodes[1];
			var hiddenEle = event.target.parentNode.parentNode.parentNode.childNodes[3];
			var hiddenInput = event.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[1].childNodes[1];
			console.log(hiddenInput);
			console.log(hiddenEle);
			if(childInput.checked == true) {
				if(hiddenInput) {
					hiddenInput.value = "";
					revertButton(buttonInsert, hiddenInput, invoiceTotal, balanceDue, totalToCharge);
				}
				childInput.checked = false;
				hiddenEle.style.display = "none";
				//childInput.checked = "checked";
			} else {
				childInput.checked = true;
				hiddenEle.style.display = "block";
			}

		});
	}

var revertButton = function(buttonSpan, partialInputAmt, invTotal, balDue, amtToCharge) {
	if(!partialInputAmt.value && !balDue) {
		console.log('foo');
		buttonSpan.innerHTML = invTotal.innerHTML;
		amtToCharge.value = invTotal.innerHTML;
	} else if (!partialInputAmt.value) {
		console.log('bar');
		buttonSpan.innerHTML = balDue.innerHTML;
		amtToCharge.value = balDue.innerHTML;
	}
}

//partial payment amount
	document.querySelector('body').addEventListener('click', function(event) {
	  if (event.target == document.getElementById('partial-payment-amount')) {
	    var partialAmt = document.getElementById('partial-payment-amount');
			partialAmt.addEventListener('change', function(event) {
				buttonInsert.innerHTML = event.target.value;
				totalToCharge.value = event.target.value;
				revertButton(buttonInsert, event.target, invoiceTotal, balanceDue, totalToCharge);
			});
	  }
	});
});

var stripe = new Stripe('pk_test_7BPc7AnQJn5jjWxU8G9O7DiF');
//
//pk_test_7BPc7AnQJn5jjWxU8G9O7DiF
var elements = stripe.elements();

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

// Add an instance of the card UI component into the `card-element` <div>
card.mount('#card-element');

card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Create a token when the form is submitted.
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  createToken();
});
