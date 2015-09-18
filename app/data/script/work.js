var ppServer = io.connect("http://localhost:3546"),
    client = "niy",
    currentOrder = "niy",
    itemsJquery = false,
    md5 = require("MD5"),
    orderTicket = new Array();

function generateID(seed) {
    if (!seed) seed = 12;
    var ListeCar = new Array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9");
    var Chaine = '';
    for (i = 0; i < seed; i++) {
        Chaine = Chaine + ListeCar[Math.floor(Math.random() * ListeCar.length)];
    }
    return md5(Chaine);
}
(function($) {
    $(document).ready(function() {
        ppServer.emit("init");
    });
    ppServer.on("init", function(initData) {
        client = initData;
        for (var i = 0; i < client.homeItemList.length; i++) {
            addItemToHome(client.homeItemList[i], false);
        }
        for (var i = 0; i < client.packages.length; i++) {
            addItemToHome(client.packages[i], false);
        };
        client.products = new Array();
        for (var i = 0; i < client.homeItemList.length; i++) {
            if (client.homeItemList[i].type == "product") {
                client.products[client.homeItemList[i]._id] = client.homeItemList[i];
            } else if (client.homeItemList[i].type == "category") {
                for (var y = 0; y < client.homeItemList[i].products.length; y++) {
                    client.products[client.homeItemList[i].products[y]._id] = client.homeItemList[i].products[y];
                }
            }
        }
        var packages = new Array();
        for (var i = 0; i < client.packages.length; i++) {
            packages[client.packages[i]._id] = client.packages[i];
        }
        client.packages = packages;
        client.category = new Array();
        for (var i = 0; i < client.homeItemList.length; i++) {
            if (client.homeItemList[i].type == "category") {
                client.category[client.homeItemList[i]._id] = client.homeItemList[i];
            }
        }
    });
})(jQuery);

function initItemsJquery(selector) {
    $("[itemid='" + selector + "']").click(function() {
        var type = $(this).attr("itemType");
        var id = $(this).attr("itemID");
        switch (type) {
            case "category":
                client.category[id]
                $("#category .container").html("");
                for (var i = 0; i < client.category[id].products.length; i++) {
                    addItemToHome(client.category[id].products[i], true);
                }
                $("#category").css("display", "block");
                break;
            case "product":
                //ajouter le produit à la commande
                addProductToOrderTicket(client.products[id]);
                $("#category").css("display", "none");
                break;
            case "package":
                //ajouter le produit à la commande
                addProductToOrderTicket(client.packages[id]);
                $("#category").css("display", "none");
                break;
        }
    });
}

function initProductListJquery(productID) {
    $("tr[productid='" + productID + "']").click(function(event) {
        removeProductFromOrderTicket($(this).attr("productid"));
    });
}

function addProductToOrderTicket(product) {
    var match = false;
    var rank = false;
    $(".productList tbody").html("");
    for (var i = 0; i < orderTicket.length; i++) {
        if (orderTicket[i].productID == product._id) {
            match = true;
            rank = i;
        }
    }
    if (!match) {
        orderTicket.push({
            productID: product._id,
            qts: 1,
            type: product.type
        });
    } else {
        orderTicket[rank].qts++;
    }
    var orderAmountTTC = 0;
    var orderAmountHT = 0;
    for (var i = 0; i < orderTicket.length; i++) {
        if (orderTicket[i].type == "package") {
            var registery = client.packages;
        } else if (orderTicket[i].type == "product") {
            var registery = client.products;
        }
        var productqtzied = registery[orderTicket[i].productID];
        productqtzied.qts = orderTicket[i].qts;
        addProductToOrderList(productqtzied);
        initProductListJquery(productqtzied._id);
        orderAmountTTC = orderAmountTTC + (productqtzied.price * productqtzied.qts);
        orderAmountHT = orderAmountHT + money.calculTva.TTCtoHT(productqtzied.price * productqtzied.qts, productqtzied.tvaRate);
    }
    $(".totalAmount.HT span").text(money.format.numberToPrice(Math.round(orderAmountHT * 100) / 100));
    $(".totalAmount.TTC span").text(money.format.numberToPrice(orderAmountTTC));
}

function addFreeAmountToOrderTicket(amount) {
    var productID = "freeAmount" + generateID(45);
    var product = {
        _id: productID,
        price: amount.price,
        tvaRate: amount.tvaRate,
        name: "Montant libre " + client.tvaRate[amount.tvaRate] + "%",
        type: "product",
        thumb: "data/images/Miniatures/freeAmount.png"
    };
    client.products[productID] = product;
    addProductToOrderTicket(product);
}

function removeProductFromOrderTicket(productID) {
    $(".productList tbody").html("");
    for (var i = 0; i < orderTicket.length; i++) {
        if (orderTicket[i].productID == productID) {
            if (orderTicket[i].qts > 1) {
                orderTicket[i].qts--;
            } else {
                orderTicket.splice(i, 1);
            }
        }
    }
    var orderAmountTTC = 0;
    var orderAmountHT = 0;
    for (var i = 0; i < orderTicket.length; i++) {
        if (orderTicket[i].type == "package") {
            var registery = client.packages;
        } else if (orderTicket[i].type == "product") {
            var registery = client.products;
        }
        var productqtzied = registery[orderTicket[i].productID];
        productqtzied.qts = orderTicket[i].qts;
        addProductToOrderList(productqtzied);
        initProductListJquery(productqtzied._id);
        orderAmountTTC = orderAmountTTC + (productqtzied.price * productqtzied.qts);
        orderAmountHT = orderAmountHT + money.calculTva.TTCtoHT(productqtzied.price * productqtzied.qts, productqtzied.tvaRate);
    }
    $(".totalAmount.HT span").text(money.format.numberToPrice(Math.round(orderAmountHT * 100) / 100));
    $(".totalAmount.TTC span").text(money.format.numberToPrice(orderAmountTTC));
}

function cancelOrder() {
    $(".productList tbody").html("");
    orderTicket.splice(0, orderTicket.length);
    var orderAmountTTC = 0;
    var orderAmountHT = 0;
    for (var i = 0; i < orderTicket.length; i++) {
        if (orderTicket[i].type == "package") {
            var registery = client.packages;
        } else if (orderTicket[i].type == "product") {
            var registery = client.products;
        }
        var productqtzied = registery[orderTicket[i].productID];
        productqtzied.qts = orderTicket[i].qts;
        addProductToOrderList(productqtzied);
        initProductListJquery(productqtzied._id);
        orderAmountTTC = orderAmountTTC + (productqtzied.price * productqtzied.qts);
        orderAmountHT = orderAmountHT + money.calculTva.TTCtoHT(productqtzied.price * productqtzied.qts, productqtzied.tvaRate);
    }
    $(".totalAmount.HT span").text(money.format.numberToPrice(Math.round(orderAmountHT * 100) / 100));
    $(".totalAmount.TTC span").text(money.format.numberToPrice(orderAmountTTC));
    $("#paymentScreen").hide('fast', function() {
            $("#orderScreen").show(0, function() {
                //alert(orderTicket);
            });
        });
}

function validOrder() {
    if (orderTicket.length != 0) {
        $("#orderScreen").hide('fast', function() {
            $("#paymentScreen").show(0, function() {
                //alert(orderTicket);
            });
        });
    }else{
        alert("Action impossible : Votre commande ne comporte aucun produit")
    }
}