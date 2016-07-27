var manifest = require('nw.gui').App.manifest;
var Chart = require("Chart.js");
function shopingCart(modifCB) {
    var command = {
        products: new Map(),
        total: {
            HT: 0.0,
            TTC: 0.0,
            perTVARate: {
                "5,5": 0,
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
                "5,5": 0,
                7: 0,
                10: 0,
                20: 0
            }
        };
        for (var product of command.products) {
            var price = money.format.numberToPrice(product[1].price * product[1].qts);


            var productTemplate = '<div class="tableLine" data-itemId="' + product[1].itemId + '"><div class="product"><img src="' + product[1].picture + '">' + product[1].name + '</div><div class="qts">' + product[1].qts + '</div><div class="price">' + price + '</div></div>';
            command.total.HT += money.calculTva.TTCtoHT(money.format.priceToNumber(price), product[1].TVARate);
            command.total.TTC += money.format.priceToNumber(price);
            command.total.perTVARate[product[1].TVARate.toString().replace(".", ",")] = money.format.priceToNumber(price);
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
                command.products.get(productWanted.itemId).price = parseFloat(prompt("Prix", "0"));
                command.products.get(productWanted.itemId).qts = parseFloat(prompt("Quantité en " + command.products.get(productWanted.itemId).unit, "0"));
                this.reloadDom();
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
                productWanted.price = "free";
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
        console.log(localcommand);
        commandDb.insert(localcommand, function (err) {
            console.log(err);
        });

    }
}

function SalesManager() {

    this.getTotalSales = function (from, to, cb) {
        var dateFrom = new Date(from);
        var dateTo = new Date(to);
        commandDb.find({}, function (err, data) {
            let add = {
                HT: 0,
                TTC: 0,
                perTVARate: {
                    "5,5": 0,
                    "7": 0,
                    "10": 0,
                    "20": 0
                }
            };
            for (var command of data) {
                let commandDate = new Date(command.timestamp);
                if ((commandDate <= dateTo) && (commandDate >= dateFrom)) {
                    add.HT += command.total.HT;
                    add.TTC += command.total.TTC;
                    add.perTVARate["5,5"] += command.total.perTVARate["5,5"];
                    add.perTVARate["7"] += command.total.perTVARate["7"];
                    add.perTVARate["10"] += command.total.perTVARate["10"];
                    add.perTVARate["20"] += command.total.perTVARate["20"];
                }
            }
            return cb(add);
        });
        return true;
    };
    this.getSalesPerProducts = function (from, to, cb) {
        var dateFrom = new Date(from);
        var dateTo = new Date(to);
        commandDb.find({}, function (err, data) {
            let sales = {
                sales: [
                    {
                        product: "",
                        soldQts: 0,
                        total: 0
                    }
                ],
                chartData: {
                    labels: [],
                    series: []
                }
            };

        });
    };

}
var statistic = new SalesManager();
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

});