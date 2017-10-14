//instantiate stripe with public key
var stripe = new Stripe('pk_live_4IUfJ0HnfL0HMYA6yUfiH898');

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
