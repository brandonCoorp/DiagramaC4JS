
//
// Attach a handler to a particular event on an element
// in a browser-independent way.
//
function RegisterEventHandler(element, ev, handler)
{
	if (element.attachEvent)
	{
		// MS registration model
		element.attachEvent('on' + ev, handler);
	}
	else if (element.addEventListener)
	{
		// NN (W4C) regisration model
		element.addEventListener(ev, handler, false);
	}
	else
	{
		// Old regisration model as fall-back
		element[ev] = handler;
	}
}

//
// Get a delegate that refers to an instance method.
//
function GetInstanceDelegate (obj, methodName) {
	return( function(e) {
		e = e || window.event;
		return obj[methodName](e);
	} );
}


//
// Dropdown menu control.
//
function Dropdown(activatorId, dropdownId)
{
	// Store activator and dropdown elements
	this.activator = document.getElementById(activatorId);
	this.dropdown = document.getElementById(dropdownId);

	// Wire up show/hide events
	RegisterEventHandler(this.activator,'mouseover', GetInstanceDelegate(this, "show"));
	RegisterEventHandler(this.activator,'mouseout', GetInstanceDelegate(this, "requestHide"));
	RegisterEventHandler(this.dropdown,'mouseover', GetInstanceDelegate(this, "show"));
	RegisterEventHandler(this.dropdown,'mouseout', GetInstanceDelegate(this, "requestHide"));

	// Fix visibility and position
	this.dropdown.style.visibility = 'hidden';
	this.dropdown.style.position = 'absolute';
	this.reposition(null);

	// Wire up repositioning event
	RegisterEventHandler(window, 'resize', GetInstanceDelegate(this, "reposition"));
}

Dropdown.prototype.show = function(e) {
	clearTimeout(this.timer);
	this.dropdown.style.visibility = 'visible';
}

Dropdown.prototype.hide = function(e) {
	this.dropdown.style.visibility = 'hidden';
}

Dropdown.prototype.requestHide = function(e) {
	this.timer = setTimeout( GetInstanceDelegate(this, "hide"), 250);
}

Dropdown.prototype.reposition = function(e) {

	// Get position of activator
	var offsetLeft = 0;
	var offsetTop = 1;
	var offsetElement = this.activator;
	while (offsetElement) {
		offsetLeft += offsetElement.offsetLeft;
		offsetTop += offsetElement.offsetTop;
		offsetElement = offsetElement.offsetParent;
	}

	// Set position of dropdown relative to it
	this.dropdown.style.left = offsetLeft;
	this.dropdown.style.top = offsetTop + this.activator.offsetHeight;

}
