var manifest = require('nw.gui').App.manifest;
var Chart = require("chart.js");
function shopingCart(modifCB) {
    var command = {
        products: new Map(),
        total: {
            HT: 0.0,
            TTC: 0.0,
            perTVARate: {
                "5,5": 0,
                "10": 0,
                "20": 0
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
                "5,5": 0,
                "10": 0,
                "20": 0
            }
        };
        for (var product of command.products) {
            var price = money.format.numberToPrice(product[1].price * product[1].qts);
            var productTemplate = '<div class="tableLine" data-itemId="' + product[1].itemId + '"><div class="img"><img src="' + product[1].picture + '"></div><div class="product">' + product[1].name + '</div><div class="qts">' + product[1].qts + '</div><div class="price">' + price + '</div></div>';
            command.total.HT += money.calculTva.TTCtoHT(money.format.priceToNumber(price), product[1].TVARate);
            command.total.TTC += money.format.priceToNumber(price);
            command.total.perTVARate[product[1].TVARate.toString().replace(".", ",")] += money.format.priceToNumber(price);
            $("#tableBody").append(productTemplate);
        }
        $("#totalHT").find(".amount").text(money.format.numberToPrice(command.total.HT));
        $("#totalTTC .amount").text(money.format.numberToPrice(command.total.TTC));
        $(".topay").text(money.format.numberToPrice(command.total.TTC));
        $(".paymentrest").text(money.format.numberToPrice(command.total.TTC));
        $(".paymentrest").data("value", command.total.TTC);
        var paid = 0;
        $('input[data-method]').each(function (i) {
            paid += money.format.priceToNumber($(this).val());
            $(".paymentrest").data("value", command.total.TTC - paid);
        });
        $(".paid").text(money.format.numberToPrice(paid));
        $(".paymentrest").text(money.format.numberToPrice(command.total.TTC - paid));
        this.setPayment();
        modifCB();

    };
    this.getCommand = function () {

        return command;
    };
    this.setPayment = function () {
        command.payment.methods.cash = $('input[data-method="cash"]').data("numeralValue");
        command.payment.methods.check = $('input[data-method="check"]').data("numeralValue");
        command.payment.methods.giftcard = $('input[data-method="giftcard"]').data("numeralValue");
        command.payment.methods.reduction = $('input[data-method="reduction"]').data("numeralValue");
        command.payment.change = money.format.priceToNumber($('.paymentrest').text());

    };
    this.getCommandJson = function () {

        let commandCopy = $.extend(true, {}, command);

        commandCopy.products = [];
        for (product of command.products) {
            commandCopy.products.push(product[1]);
        }

        return commandCopy;

    };
    this.addProduct = function (productWanted) {
        productWanted = Object.assign({}, productWanted);
        if (typeof command.products.get(productWanted.itemId) !== "undefined") {

            if (productWanted.price == "free") {
                var price = prompt("Prix", "0");
                var qts = prompt("Quantité en " + command.products.get(productWanted.itemId).unit, "0");
                if ((price != false) && (qts != false)) {
                    command.products.get(productWanted.itemId).price = parseFloat();
                    command.products.get(productWanted.itemId).qts = parseFloat();
                    this.reloadDom();
                } else {
                    return;
                }

            } else {
                command.products.get(productWanted.itemId).qts++;
                this.reloadDom();
            }

        } else {
            if (productWanted.price == "free") {
                productWanted.price = parseFloat(prompt("Prix", "0"));
                productWanted.qts = parseFloat(prompt("Quantité en " + productWanted.unit, "0"));

                command.products.set(productWanted.itemId, productWanted);
                this.reloadDom();
            } else {
                productWanted.qts = 1;
                command.products.set(productWanted.itemId, productWanted);
                this.reloadDom();
            }

        }

    }
    this.removeProduct = function (productIdWanted) {
        //console.log(productIdWanted);
        if (command.products.get(productIdWanted)) {
            command.products.get(productIdWanted).qts--;
            if (command.products.get(productIdWanted).qts == 0) {
                command.products.delete(productIdWanted);
            } else if (isNaN(command.products.get(productIdWanted).qts)) {
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
                    "5,5": 0,
                    "10": 0,
                    "20": 0
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
        $('input[data-method="cash"]').val("0,00€");
        $('input[data-method="cash"]').data("numeralValue", 0);
        $('input[data-method="check"]').val("0,00€");
        $('input[data-method="check"]').data("numeralValue", 0);
        $('input[data-method="giftcard"]').val("0,00€");
        $('input[data-method="giftcard"]').data("numeralValue", 0);
        $('input[data-method="reduction"]').val("0,00€");
        $('input[data-method="reduction"]').data("numeralValue", 0);
        this.reloadDom();
    }
    this.saveCommand = function () {
        let localcommand = this.getCommandJson();
        localcommand.timestamp = Date.now();
        Accounting.moneyEntry(localcommand.payment.methods.cash,  localcommand.timestamp, function(success){
            if(success){
                try {
                    printTicket(localcommand);
                } catch (e) {
                    console.log(e);
                }
                commandDb.insert(localcommand, function (err) {
                    console.log(err);
                });
            } else {
                console.error("Accounting insertion error");
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
        loadData(true);
    }
    $('input[type="daterange"]').bind('datepicker-change', function (event, obj) {

        console.log(obj.date1.getTime());
        console.log(obj.date2.getTime());

        Statistics.getTotalSales(obj.date1.getTime(), obj.date2.getTime(), function (data) {
            console.log(data);
            //total sales
            $(".TTCTotal").html(money.format.numberToPrice(data.TTC));
            $(".HTTotal").html(money.format.numberToPrice(data.HT));
            $(".55Total").html(money.format.numberToPrice(data.perTVARate["5,5"]));
            $(".10Total").html(money.format.numberToPrice(data.perTVARate["10"]));
            $(".20Total").html(money.format.numberToPrice(data.perTVARate["20"]));

            //sales pe categories
            data.perCategories.forEach(function (val, key) {

                $(".recettecategorie[data-objectid='" + key + "']").children(".tileSubValue").empty();
                $(".recettecategorie[data-objectid='" + key + "']").children(".tileValue").empty();

                $(".recettecategorie[data-objectid='" + key + "']").children(".tileSubValue").append("<span>5,5%</span>");
                $(".recettecategorie[data-objectid='" + key + "']").children(".tileValue").append("<span>" + money.format.numberToPrice(val["5,5"]) + "</span>");

                $(".recettecategorie[data-objectid='" + key + "']").children(".tileSubValue").append("<span>10%</span>");
                $(".recettecategorie[data-objectid='" + key + "']").children(".tileValue").append("<span>" + money.format.numberToPrice(val["10"]) + "</span>");

                $(".recettecategorie[data-objectid='" + key + "']").children(".tileSubValue").append("<span>20%</span>");
                $(".recettecategorie[data-objectid='" + key + "']").children(".tileValue").append("<span>" + money.format.numberToPrice(val["20"]) + "</span>");

                 });
            $(".recettecategorie[data-objectid='cash']").text(money.format.numberToPrice(data.perPaymentMethods.cash));
            $(".recettecategorie[data-objectid='check']").text(money.format.numberToPrice(data.perPaymentMethods.check));
        });
        /* statistic.getSalesPerProducts(obj.date1.getTime(), obj.date2.getTime(), function(data){
         console.log(data);
         });*/

    });
});
