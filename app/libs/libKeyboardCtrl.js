var currentFocusedInput;

$("input[type='text']").focus(function(event) {
	$("#alphanumericPad").show();
	$("#numericPad").hide();
	$("#keyboard").css('bottom', '0');
	currentFocusedInput = $(this);
	currentFocusedInput.addClass('focused');
});

$(".key").click(function(event) {
	var valueOfInput = currentFocusedInput.value();
	console.log(valueOfInput);
	valueOfInput += $(this).attr('value');
	currentFocusedInput.value(valueOfInput);
});