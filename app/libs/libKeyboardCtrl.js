jQuery.fn.insertAtCaret = function(text) {
    return this.each(function() {
        if (document.selection && this.tagName == 'TEXTAREA') {
            //IE textarea support
            this.focus();
            sel = document.selection.createRange();
            sel.text = text;
            this.focus();
        } else if (this.selectionStart || this.selectionStart == '0') {
            //MOZILLA/NETSCAPE support
            startPos = this.selectionStart;
            endPos = this.selectionEnd;
            scrollTop = this.scrollTop;
            this.value = this.value.substring(0, startPos) + text + this.value.substring(endPos, this.value.length);
            this.focus();
            this.selectionStart = startPos + text.length;
            this.selectionEnd = startPos + text.length;
            this.scrollTop = scrollTop;
        } else {
            // IE input[type=text] and other browsers
            this.value += text;
            this.focus();
            this.value = this.value;    // forces cursor to end
        }
    });
};
jQuery(document).ready(function($) {
	var currentFocusedInput;
	$("input[type='text']").focus(function(event) {
	    $("#alphanumericPad").show();
	    $("#numericPad").hide();
	    $("#keyboard").css('bottom', '0');
	    currentFocusedInput = $(this);
	});
	$(".key").click(function(event) {
	    var char = $(this).attr('value');
        switch(char){
            case "#return":
                
                break;
            default:
                currentFocusedInput.insertAtCaret(char);
                currentFocusedInput.trigger("newChar");
                break;
        }
	});
});