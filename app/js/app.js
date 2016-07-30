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
            var productTemplate = '<div class="tableLine" data-itemId="' + product[1].itemId + '"><div class="product"><img src="' + product[1].picture + '">' + product[1].name + '</img></div><div class="qts">' + product[1].qts + '</div><div class="price">' + price + '</div></div>';
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
var currentCommand = new shopingCart(function () {
    $(".tableLine").click(function (e) {
        var productId = $(this).data("itemid");
        currentCommand.removeProduct(productId);
    });
});
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
            add.HT = parseFloat(parseFloat(add.HT).toFixed(2));
            add.TTC = parseFloat(parseFloat(add.TTC).toFixed(2));
            add.perTVARate["5,5"] = parseFloat(parseFloat(add.perTVARate["5,5"]).toFixed(2));
            add.perTVARate["7"] = parseFloat(parseFloat(add.perTVARate["7"]).toFixed(2));
            add.perTVARate["10"] = parseFloat(parseFloat(add.perTVARate["10"]).toFixed(2));
            add.perTVARate["20"] = parseFloat(parseFloat(add.perTVARate["20"]).toFixed(2));
            return cb(add);
        });
        return true;
    };
    this.getSalesPerProducts = function (from, to, cb) {
        var dateFrom = new Date(from);
        var dateTo = new Date(to);
        commandDb.find({
            $and: [
                {timestamp: {$lte: dateTo.getTime()}},
                {timestamp: {$gte: dateFrom.getTime()}}
            ]

        }, function (err, data) {
            let salesResume = {
                sales: [],
                chartData: {
                    perQts: {
                        labels: [],
                        series: []
                    },
                    perPrice: {
                        labels: [],
                        series: []
                    }
                }
            };
            for (let product of database.products) {
                salesResume.sales.push({
                    product: product.itemId,
                    name: product.name,
                    soldQts: 0,
                    price: product.price
                });
                salesResume.chartData.perQts.labels.push(product.name);
                salesResume.chartData.perQts.series.push(0);
                salesResume.chartData.perPrice.labels.push(product.name);
                salesResume.chartData.perPrice.series.push(0);
            }
            for (command of data) {
                for (product of command.products) {
                    var productIndex = salesResume.chartData.perQts.labels.indexOf(product.name);
                    console.log(productIndex);
                    if (productIndex !== -1) {
                        salesResume.chartData.perQts.series[productIndex] += product.qts;
                        salesResume.chartData.perPrice.series[productIndex] += (product.price * product.qts);
                    }
                }
            }
            return cb(salesResume);
        });
        return true;
    };

}
var statistic = new SalesManager();

jQuery(document).ready(function ($) {
    if (database = "NLY") {
        loadData(true);
    }
    $('input[type="daterange"]').bind('datepicker-change', function (event, obj) {
        console.log(obj.date2.getTime());
        console.log(obj.date1.getTime());

       statistic.getTotalSales(obj.date1.getTime(),obj.date2.getTime(),function(data){
           console.log(data);
           $(".TTCTotal").html(money.format.numberToPrice(data.TTC));
           $(".HTTotal").html(money.format.numberToPrice(data.HT));
           $(".55Total").html(money.format.numberToPrice(data.perTVARate["5,5"]));
           $(".7Total").html(money.format.numberToPrice(data.perTVARate["7"]));
           $(".10Total").html(money.format.numberToPrice(data.perTVARate["10"]));
           $(".20Total").html(money.format.numberToPrice(data.perTVARate["20"]));
       });
        /* statistic.getSalesPerProducts(obj.date1.getTime(), obj.date2.getTime(), function(data){
         console.log(data);
         });*/

    });
});