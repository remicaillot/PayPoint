
function shopingCart(modifCB) {
    var command = {
        products: new Map(),
        total: {
            HT: 0.0,
            TTC: 0.0,
            perTVARate: {
                5.5: 0,
                7: 0,
                10: 0,
                20: 0
            }
        },
        payment: {
            methods: {
                check: 0,
                cash: 0,
                reduction: 0,
                giftcard: 0
            },
            change: 0
        }
    };
    this.reloadDom = function () {

        $("#tableBody").html("");
        command.total = {
            HT: 0.0,
            TTC: 0.0,
            perTVARate: {
                5.5: 0,
                7: 0,
                10: 0,
                20: 0
            }
        };
        for (product of command.products) {
            var price = money.format.numberToPrice(product[1].price * product[1].qts);
            var productTemplate = '<div class="tableLine" data-itemId="' + product[1].itemId + '"><div class="product"><img src="' + product[1].picture + '">' + product[1].name + '</img></div><div class="qts">' + product[1].qts + '</div><div class="price">' + price + '</div></div>';
            command.total.HT += money.calculTva.TTCtoHT(product[1].price * product[1].qts, product[1].TVARate);
            command.total.TTC += product[1].price * product[1].qts;
            command.total.perTVARate[product[1].TVARate] = product[1].price * product[1].qts;
            $("#tableBody").append(productTemplate);
        }
        $("#totalHT .amount").text(money.format.numberToPrice(command.total.HT));
        $("#totalTTC .amount").text(money.format.numberToPrice(command.total.TTC));
        $(".topay").text(money.format.numberToPrice(command.total.TTC));
        $(".paymentrest").text(money.format.numberToPrice(command.total.TTC));
        $(".paymentrest").data("value", command.total.TTC);
        modifCB();

    };
    this.getCommand = function () {

        return command;
    };
    this.setPayment = function () {
        command.payment.methods.cash = money.format.priceToNumber($('input[data-method="cash"]').val());
        command.payment.methods.check = money.format.priceToNumber($('input[data-method="check"]').val());
        command.payment.methods.giftcard = money.format.priceToNumber($('input[data-method="giftcard"]').val());
        command.payment.methods.reduction = money.format.priceToNumber($('input[data-method="reduction"]').val());
        command.payment.change = money.format.priceToNumber($('.paymentrest').text());

    };
    this.getCommandJson = function () {

        let commandCopy = $.extend(true, {}, command);

        commandCopy.products = [];
        for (product of command.products) {
            commandCopy.products.push(product);
        }

        return  commandCopy;

    };
    this.addProduct = function (productWanted) {
        if (typeof command.products.get(productWanted.itemId) !== "undefined") {
            command.products.get(productWanted.itemId).qts++;
        } else {
            productWanted.qts = 1;
            command.products.set(productWanted.itemId, productWanted);
        }

        this.reloadDom();
    }
    this.removeProduct = function (productIdWanted) {
        console.log(productIdWanted);
        if (command.products.get(productIdWanted)) {
            command.products.get(productIdWanted).qts--;
            if (command.products.get(productIdWanted).qts == 0) {
                command.products.delete(productIdWanted);
            }
        }
        this.reloadDom();
    };
    this.resetCommand = function () {
        command = {
            products: new Map(),
            total: {
                HT: 0.0,
                TTC: 0.0,
                perTVARate: {
                    5.5: 0,
                    7: 0,
                    10: 0,
                    20: 0
                }
            }
        };
        this.reloadDom();
    }
    this.saveCommand = function(){
        let localcommand = this.getCommandJson();
        localcommand.timestamp = Math.floor(Date.now() / 1000);
        console.log(localcommand.timestamp);
        storedb("commands").insert(localcommand, function(err, res){
           if(!err){
               console.log(res);
           } else{
               console.error(err);
           }
        });
    }
}
var currentCommand = new shopingCart(function () {
    $(".tableLine").click(function (e) {
        var productId = $(this).data("itemid");
        currentCommand.removeProduct(productId);
    });
});
jQuery(document).ready(function ($) {
    if (database = "NLY") {
        loadData("local", true);
    }

});