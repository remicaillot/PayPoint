var keyboardStructure = fs.readFileSync("./libs/keyboard.html", "utf-8");
jQuery.fn.insertAtCaret = function (text, maj, format) {
    if (maj) {
        text = text.toUpperCase();
    }
    return this.each(function () {


        if(format == "money"){

            var numeralValue = parseFloat($(this).data("numeralValue")).toFixed(2);
            if(text == "00"){
                var newNumeralValue =  numeralValue * 100 + parseFloat("0.0"+text);
            }else{
                var newNumeralValue =  numeralValue * 10 + parseFloat("0.0"+text);
            }

            $(this).data("numeralValue", newNumeralValue)
            $(this).val(money.format.numberToPrice(newNumeralValue));
        }else{
            startPos = this.selectionStart;
            endPos = this.selectionEnd;
            scrollTop = this.scrollTop;
            this.value =  this.value.substring(0, startPos) + text + this.value.substring(endPos, this.value.length); this.focus();

            this.selectionStart = startPos + text.length;
            this.selectionEnd = startPos + text.length;
            this.scrollTop = scrollTop;
            this.focus();
        }
    });
};
jQuery.fn.removeAtCaret = function (format) {
    return this.each(function () {
        if(format == "money"){

            var numeralValue = parseFloat($(this).data("numeralValue")).toFixed(2);

            var newNumeralValue =  parseFloat(numeralValue.substring(0, numeralValue.length - 1)).toFixed(2) / 10;
            $(this).data("numeralValue", newNumeralValue)
            $(this).val(money.format.numberToPrice(newNumeralValue));
        }else {
            startPos = this.selectionStart - 1;
            endPos = this.selectionEnd;
            scrollTop = this.scrollTop;
            this.value = this.value.substring(0, startPos) + this.value.substring(endPos, this.value.length);
            this.focus();
            this.selectionStart = startPos;
            this.selectionEnd = startPos;
            this.scrollTop = scrollTop;
        }
    });

};
var currentFocusedInput;

jQuery(document).ready(function ($) {
    $("input[data-realDataType='price']").val("0,00€");
    $("input[data-realDataType='price']").data("numeralValue", 0.00);
    $("#keyboard").click(function(e){
        e.preventDefault();
        e.stopPropagation();
    });
    $("body").append(keyboardStructure);
    var $alphanumericPad = $("#alphanumericPad");
    var $keyboard = $("#keyboard");
    var $numericPad = $("#numericPad");
    var $specialCharPad = $("#specialCharPad");
    var maj = false;
    $(window).click(function (e) {
        if ($(event.target).prop("tagName") != "INPUT" && $(event.target).prop("id") != "keyboard" && !(typeof currentFocusedInput == "undefined" || currentFocusedInput == null)) {

            $("#searchForm form").removeClass('focus');
            $keyboard.css('bottom', '-350px');
            currentFocusedInput.removeClass("focus");
            currentFocusedInput.blur();
            currentFocusedInput = null;
        }
    });
    $("input").focus(function (e) {
        if (!(typeof currentFocusedInput == "undefined" || currentFocusedInput == null)) {
            currentFocusedInput.removeClass("focus");
            currentFocusedInput.blur();
        }
        currentFocusedInput = $(this);
        var inputType = $(this).attr("type");
        var entrymethod = $(this).data("realdatatype");
        $(this).addClass('focus');
        if ((inputType != "submit") && (inputType != "button")) {
            $alphanumericPad.hide();
            $numericPad.hide();
            $specialCharPad.hide();
            switch (entrymethod) {
                case "price":
                    $numericPad.show();
                    break;
                default:
                    $alphanumericPad.show();
                    break;
            }
            if($(this).attr("type") == "text"){
                $keyboard.css("bottom", 0);
            }
        }
    });



    function keypressEventHandler(event) {
        event.preventDefault();
        event.stopPropagation();
        var char = $(this).attr('value');
        switch (char) {
            case "#return":
                if(currentFocusedInput.data("realdatatype")){
                    currentFocusedInput.removeAtCaret("money");
                }else{
                    currentFocusedInput.removeAtCaret("text");
                }
                currentFocusedInput.trigger("newChar");
                break;
            case "#specialChar":

                $alphanumericPad.hide();
                $numericPad.hide();
                $specialCharPad.show();
                break;
            case "#numericPad":
                $numericPad.show();
                $specialCharPad.hide();
                $alphanumericPad.hide();
                break;
            case "#close":
                $keyboard.css('bottom', '-350px');
                $("#searchForm form").removeClass('focus');
                currentFocusedInput.removeClass("focus");
                currentFocusedInput.blur();
                currentFocusedInput = null;
                break;
            case "#enter":
                currentFocusedInput.submit();
                break;
            case "#alphanumericPad":
                $alphanumericPad.show();
                $numericPad.hide();
                $specialCharPad.hide();
                break;
            case "#maj":


                if (maj) {
                    $keyboard.find(".key[value='#maj']").removeClass("active");
                    $keyboard.find(".key").each(function (i) {
                        if (!$(this).data("protected")) {

                            $(this).text($(this).text().toLowerCase());
                        }
                    });
                    maj = false;
                } else {
                    $keyboard.find(".key").each(function (i) {
                        if (!$(this).data("protected")) {
                            $(this).text($(this).text().toUpperCase());
                        }
                    });
                    $keyboard.find(".key[value='#maj']").addClass("active");
                    maj = true;
                }
                break;
            default:

                if (maj) {

                    $alphanumericPad.find(".key[value='#maj']").removeClass("active");
                    $alphanumericPad.find(".key").each(function (i) {
                        $(this).text($(this).text().toLowerCase());
                    });
                }
                if(currentFocusedInput.data("realdatatype")){
                    currentFocusedInput.insertAtCaret(char, maj, "money");
                }else{
                    currentFocusedInput.insertAtCaret(char, maj, "text");
                }
                currentFocusedInput.trigger("newChar");


                maj = false;
                break;
        }
    }
    $(".key").click(keypressEventHandler);
    $("input[data-realDataType='price']").keypress(function(e){
        e.preventDefault();
        $(".key[value='" + String.fromCharCode(e.keyCode) + "'").click();
    });

});
