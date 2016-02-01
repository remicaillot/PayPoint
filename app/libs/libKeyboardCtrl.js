var currentFocusedElement; // current focused input type text jquery identifiant
$("input[type='text']").focus(function(event) {
	$("#alphanumericPad").show();
	$("#numericPad").hide();
	$("#keyboard").css('bottom', '0');
	currentFocusedElement = $(this);
	console.log(currentFocusedElement);
	currentFocusedElement.addClass('focused');
});