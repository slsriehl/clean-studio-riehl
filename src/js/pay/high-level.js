
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
