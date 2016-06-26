jQuery.fn.insertAtCaret = function(text, maj) {
    if(maj){
        text = text.toUpperCase();
    }
    return this.each(function() {

            startPos = this.selectionStart;
            endPos = this.selectionEnd;
            scrollTop = this.scrollTop;
            this.value = this.value.substring(0, startPos) + text + this.value.substring(endPos, this.value.length);
            this.focus();
            this.selectionStart = startPos + text.length;
            this.selectionEnd = startPos + text.length;
            this.scrollTop = scrollTop;

    });
};
jQuery.fn.removeAtCaret = function() {
      return this.each(function() {

        startPos = this.selectionStart - 1;
        endPos = this.selectionEnd;
        scrollTop = this.scrollTop;
        this.value = this.value.substring(0, startPos) + this.value.substring(endPos, this.value.length);
        this.focus();
        this.selectionStart = startPos;
        this.selectionEnd = startPos;
        this.scrollTop = scrollTop;

    });

};
jQuery(document).ready(function($) {
	var currentFocusedInput;
	$("input[type='text']").focus(function(event) {
	    $("#alphanumericPad").show();
	    $("#numericPad").hide();
	    $("#specialCharPad").hide();
	    $("#keyboard").css('bottom', '0');
	    currentFocusedInput = $(this);
        $(this).off("focus");
	});
    var maj = false;
	$(".key").click(function(event) {
	    var char = $(this).attr('value');
        switch(char){
            case "#return":

                currentFocusedInput.removeAtCaret();
                currentFocusedInput.trigger("newChar");
                break;
            case "#specialChar":

                $("#alphanumericPad").hide();
                $("#numericPad").hide();
                $("#specialCharPad").show();
                break;
            case "#numericPad":
                $("#alphanumericPad").hide();
                $("#numericPad").show();
                $("#specialCharPad").hide();
                break;
            case "#close":
                addFocusevent();
                $("#keyboard").css('bottom', '-350px');
                break;
            case "#enter":
                break;
            case "#alphanumericPad":
                $("#alphanumericPad").show();
                $("#numericPad").hide();
                $("#specialCharPad").hide();
                break;
            case "#maj":
                if(maj){
                    $("#keyboard .key[value='#maj']").removeClass("active");
                    $("#keyboard .key").each(function(i){
                       if(!$(this).data("protected")){

                            $(this).text($(this).text().toLowerCase());
                        }
                    });
                    maj = false;
                }else {
                    $("#keyboard .key[value='#maj']").addClass("active");
                    $("#keyboard .key").each(function (i) {
                       if(!$(this).data("protected")){
                            $(this).text($(this).text().toUpperCase());
                        }
                    });
                    maj = true;
                }
                break;
            default:
                if(maj){
                    $("#alphanumericPad .key[value='#maj']").removeClass("active");
                    $("#alphanumericPad .key").each(function(i){
                        $(this).text($(this).text().toLowerCase());
                    });
                }
                currentFocusedInput.insertAtCaret(char, maj);
                currentFocusedInput.trigger("newChar");
                maj = false;
                break;
        }
	});
});