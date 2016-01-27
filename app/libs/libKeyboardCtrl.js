var currentFocusedElement;
	$("input[type='text']").focus(function(event) {
		$("#alphanumericPad").show();
		$("#numericPad").hide();
		$("#keyboard").css('bottom', '0');
		currentFocusedElement = $(this);
		currentFocusedElement.addClass('focused');
	});