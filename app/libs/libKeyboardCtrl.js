$(".key").click(function(event) {
	var valueOfInput = currentFocusedInput.value();
	valueOfInput += $(this).attr('value');
	currentFocusedInput.val(valueOfInput);
});