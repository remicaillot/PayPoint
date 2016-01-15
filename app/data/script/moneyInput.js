(function($) {
    $(".pad button").click(function(event) {
        var target = $(this).parent(".pad").attr('target');
        var padValue = $(this).attr("padvalue");
        var hitd = parseInt($(".numericpad." + target + " .number .decimal").attr("hit"));
        var hitint = parseInt($(".numericpad." + target + " .number .int").attr("hit"));
        if (padValue == "VALID") {
            //faire quelque chose avec le montant
            if (target == "manualAmount") {
                if ($(".optionChooser[choiceName='TVA'] .choiceItem.selected").attr("itemID") == undefined) {
                    alert("Veuillez choisir un taux de TVA");
                } else {
                    addFreeAmountToOrderTicket({
                        price: parseFloat($(".numericpad." + target + "  .number .int").text() + "." + $(".numericpad." + target + " .number .decimal").text()),
                        tvaRate: parseInt($(".optionChooser[choiceName='TVA'] .choiceItem.selected").attr("itemID"))
                    });
                }
            } else if (target == "cashAmount") {
                if ($(".optionChooser[choiceName='paymentType'] .choiceItem.selected").attr("itemID") == undefined) {
                    alert("Veuillez choisir une methode de payement");
                } else {
                    currentOrder.cashGived = parseFloat($(".numericpad." + target + "  .number .int").text() + "." + $(".numericpad." + target + " .number .decimal").text());
                    currentOrder.paymentMethod = $(".optionChooser[choiceName='paymentType'] .choiceItem.selected").attr("itemID");
                    currentOrder.givingChanges = money.givingChanges(currentOrder.totalTTC, currentOrder.cashGived);
                    printTicket(currentOrder);
                    alert("Rendre : " + money.givingChanges(currentOrder.totalTTC, parseFloat($(".numericpad." + target + "  .number .int").text() + "." + $(".numericpad." + target + " .number .decimal").text())) + "€");
                    cancelOrder();
                }
            }
        } else if (padValue == "c") {
            $(".numericpad." + target + " .number .decimal").attr("hit", 0);
            $(".numericpad." + target + " .number .decimal").text("00");
            $(".numericpad." + target + " .number .int").attr("hit", 0);
            $(".numericpad." + target + " .number .int").text("0");
        } else {
            if (hitd >= 0 && hitd <= 1) {
                if (hitd == 0) {
                    $(".numericpad." + target + " .number .decimal").html("");
                }
                //temps qu'il n'y a pas deux chiffres
                $(".numericpad." + target + " .number .decimal").append(padValue);
                $(".numericpad." + target + " .number .decimal").attr("hit", hitd + 1);
            } else {
                if (hitd >= 2) {
                    if (hitint == 0) {
                        $(".numericpad." + target + " .number .int").html("");
                    }
                    $(".numericpad." + target + " .number .int").append($(".numericpad." + target + "  .number .decimal").text()[0]);
                    $(".numericpad." + target + " .number .decimal").text(parseInt($(".numericpad." + target + " .number .decimal").text()) - 10 * parseInt($(".numericpad." + target + " .number .decimal").text()[0]));
                    $(".numericpad." + target + " .number .decimal").append(padValue);
                    $(".numericpad." + target + " .number .int").attr("hit", hitint + 1);
                }
            }
        }
    });
})(jQuery);