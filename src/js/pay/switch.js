
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

//function to readd the correct value to the hidden input and button in case the partial amount is changed
var revertButton = function(partialInputAmt) {
	//call elements for use in event listeners
	//submit button total span, should equal totalToCharge
	var buttonSpan = document.getElementById('amountReplace');
	//invoice total span
	var invTotal = document.getElementById('invoiceTotal');
	//balance due span
	var balDue = document.getElementById('balanceDue');
	//hidden input for charge amount, should equal buttonInsert
	var hiddenTotalAmt = document.getElementById('amount');
	//if the partial input says empty and there is no balance due field (no previous partial payment)
	if(!partialInputAmt.value && !balDue) {
		console.log('foo');
		//change the display button and the hidden total input to the invoice total
		buttonSpan.innerHTML = invTotal.innerHTML;
		hiddenTotalAmt.value = invTotal.innerHTML;
	} else if (!partialInputAmt.value) {
	//else if the partial input says empty (but there is a balance due field)
		console.log('bar');
		//change the display button and the hidden total input to the balance due
		buttonSpan.innerHTML = balDue.innerHTML;
		hiddenTotalAmt.value = balDue.innerHTML;
	}
}

var changeListenerForCorrectCharge = function(event) {
	//call elements for use
	//submit button total span, should equal totalToCharge
	var buttonSpan = document.getElementById('amountReplace');
	//hidden input for charge amount, should equal buttonInsert
	var hiddenTotalAmt = document.getElementById('amount');

	//set the submit button value to that of the dynamic element
	buttonSpan.innerHTML = event.target.value;
	//set the hidden input value to that of the dynamic element
	hiddenTotalAmt.value = event.target.value;
	//change the values if the dynamicElement value is 0
	revertButton(event.target);
}
