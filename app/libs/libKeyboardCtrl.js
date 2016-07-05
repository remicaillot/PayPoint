    var keyboardStructure = fs.readFileSync("./libs/keyboard.html", "utf-8");
    jQuery.fn.insertAtCaret = function (text, maj) {
        if (maj) {
            text = text.toUpperCase();
        }
        return this.each(function () {

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
    jQuery.fn.removeAtCaret = function () {
        return this.each(function () {

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
    var currentFocusedInput;

    jQuery(document).ready(function ($) {


        $("body").append(keyboardStructure);
        var $alphanumericPad = $("#alphanumericPad");
        var $keyboard = $("#keyboard");
        var $numericPad = $("#numericPad");
        var $specialCharPad = $("#specialCharPad");
        var maj = false;
        $(window).click(function(e){
            if($(event.target).prop("tagName") != "INPUT" && $(event.target).prop("id") != "keyboard" ){
                $keyboard.css('bottom', '-350px');
                currentFocusedInput.removeClass("focus");
                currentFocusedInput.blur();
                currentFocusedInput = null;
            }
        });
        $("input").focus(function (e) {
            if(typeof currentFocusedInput != "undefined" || typeof currentFocusedInput != "null"){
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
                switch (entrymethod){
                    case "number":
                        $numericPad.show();
                        break;
                    default:
                        $alphanumericPad.show();
                        break;
                }
                $keyboard.css("bottom", 0);
            }
        });


        $(".key").click(function (event) {
            event.preventDefault();
            event.stopPropagation();
            var char = $(this).attr('value');
            switch (char) {
                case "#return":

                    currentFocusedInput.removeAtCaret();
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
                    currentFocusedInput.insertAtCaret(char, maj);
                    currentFocusedInput.trigger("newChar");
                    if (currentFocusedInput.entryMethod == "money") {
                        currentFocusedInput.on("newChar", function (e) {
                            console.log($(this).val());
                            $(this).val(money.format.numberToPrice(parseFloat($(this).val())));
                        });
                    }
                    maj = false;
                    break;
            }
        });
    });
