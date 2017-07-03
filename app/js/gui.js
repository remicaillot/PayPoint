function Pop() {
    this.hide = function () {
        $("#Pop").hide();
    };
    this.alert = function (txt) {

    };
    this.prompt = function (query, type, cb) {
        $("#prompt h3").text(query);
        $("#prompt input").attr("placeholder", "réponse de type " + type + " attendue");
        $("#Pop").show();
        $("#Pop #valid").click(function (e) {
            $("#Pop").hide();
            return cb($("#prompt input").val());
        });
        $("#Pop #cancel").click(function (e) {
            $("#Pop").hide();
            return cb(false);
        });
    };

}
var popupM = new Pop();
jQuery(document).ready(function ($) {
    moment.locale('fr');
    popupM.hide();

    $('.inputTypeDate').daterangepicker({
        "singleDatePicker": true,
        "autoApply": true,
        "locale": {
            "format": "D MMMM YYYY",
            "separator": " au ",
            "applyLabel": "Valider",
            "cancelLabel": "Annuler",
            "fromLabel": "De",
            "toLabel": "à",
            "customRangeLabel": "Custom",
            "weekLabel": "Sem.",
            "daysOfWeek": [
                "Dim",
                "Lun",
                "Mar",
                "Mer",
                "Jeu",
                "Ven",
                "Sam"
            ],
            "monthNames": [
                "Janvier",
                "Février",
                "Mars",
                "Avril",
                "Mai",
                "Juin",
                "Juillet",
                "Août",
                "Septembre",
                "Octobre",
                "Novembre",
                "Décembre"
            ],
            "firstDay": 1
        },
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "alwaysShowCalendars": true,
        "startDate": moment()
    }, function (start, end, label) {});
    $('input[type="daterange"]').daterangepicker({
        "autoApply": true,
        "ranges": {
            "Aujourd'hui": [
                moment().hour(0).toDate(),
                moment().hour(23).toDate()
            ],
            "Hier": [
                moment().startOf('day').subtract(1, "day").toDate(),
                moment().endOf('day').subtract(1, "day").toDate()
            ],
            "Cette semaine": [
                moment().startOf('isoWeek').toDate(),
                moment().endOf('isoWeek').toDate()
            ],
            "Ce mois ci": [
                moment().startOf('month').toDate(),
                moment().toDate()
            ],
            "Le mois dernier": [
                moment().startOf('month').subtract(1, "month").toDate(),
                moment().endOf('month').subtract(1, "month").toDate()
            ],
            "Cette année": [
                moment().startOf('year').toDate(),
                moment().endOf('year').toDate()
            ],
            "L'année dernière": [
                moment().startOf('year').subtract(1, "year").toDate(),
                moment().endOf('year').subtract(1, "year").toDate()
            ]
        },
        "locale": {
            "format": "D MMMM YYYY",
            "separator": " au ",
            "applyLabel": "Valider",
            "cancelLabel": "Annuler",
            "fromLabel": "De",
            "toLabel": "à",
            "customRangeLabel": "Custom",
            "weekLabel": "Sem.",
            "daysOfWeek": [
                "Dim",
                "Lun",
                "Mar",
                "Mer",
                "Jeu",
                "Ven",
                "Sam"
            ],
            "monthNames": [
                "Janvier",
                "Février",
                "Mars",
                "Avril",
                "Mai",
                "Juin",
                "Juillet",
                "Août",
                "Septembre",
                "Octobre",
                "Novembre",
                "Décembre"
            ],
            "firstDay": 1
        },
        "linkedCalendars": false,
        "alwaysShowCalendars": true,
        "startDate": moment().hour(0).minute(0),
        "endDate": moment().hour(23).minute(59)
    }, function (start, end, label) {

    });
    Statistics.getSalesPerProducts($('input[type="daterange"]').data("daterangepicker").startDate.toDate().getTime(), $('input[type="daterange"]').data("daterangepicker").endDate.toDate().getTime(), function (data) {
        console.log("statsProduct", data);
        $("#productStatsContainer").empty();
        for (product of data.values) {
            console.log(product);
            if(product.soldQts != 0){
                console.log(product.sellMode);
                if(product.sellMode == "weight"){
                    product.soldQts = product.soldQts + " " + product.unit;
                    product.soldQts = product.soldQts.replace('.', ',');
                }
                $("#productStatsContainer").append('<div class="tile leftRight"><div class="tileLabel">' + product.name + '</div><div class="tileSubValue">' + money.format.numberToPrice(product.price) + '</div><div class="tileValue">' + product.soldQts +'</div></div>');

            }
        }
    });

    Statistics.getTotalSales($('input[type="daterange"]').data("daterangepicker").startDate.toDate().getTime(), $('input[type="daterange"]').data("daterangepicker").endDate.toDate().getTime(), function (data) {

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

    $("#searchForm form input[type='text']").focus(function (event) {

        //$("#searchForm form input[type='text']").addClass('focus');
        $("#searchForm form").addClass('focus');
        var totalHeight = 0;
        for (let elem of $("#searchAutocompletion").children()) {
            totalHeight += $(elem).height() + 10;
        }
        $("#searchAutocompletion").css("height", totalHeight + "px");
    });
    $("#sideBarMenu").click(function (e) {

        if ($("#leftPanel").attr("open") == "open") {
            $("#leftPanel").attr("open", false).css('width', '50px');
            $(".categorie").css('width', '50px');
            $(".categorie:active .catContent").css('-webkit-transform', 'scale3d(0.93,0.93,0.93)');
        } else {
            $("#leftPanel").attr("open", true).css('width', '230px');
            $(".categorie").css('width', '230px');
            $(".categorie:active .catContent").css('-webkit-transform', 'scale3d(0.89,0.89,0.89)');
        }
    });
    $("#settingsButton").click(function (e) {
        $("#commandStep").hide();
        $("#paymentStep").hide();
        $("#orderTicket").hide();
        $("#sales").hide();
        $("#settings").show();
    });
    $("#salesButton").click(function (e) {
        $("#commandStep").hide();
        $("#paymentStep").hide();
        $("#orderTicket").hide();
        $("#settings").hide();
        $("#sales").show();
        previousScreen = [];
        ScreenManager.resetScreen();
        Accounting.reloadDom();


    });
    $(".categorie").click(function (event) {
        if ($(this).attr('id') != "sideBarMenu") {
            $(".categorie").removeClass('activated');
            $(this).addClass('activated');
            $("#leftPanel").attr("open", false);
            $("#leftPanel").css('width', '50px');
            $(".categorie").css('width', '50px');

            $("#searchForm form").removeClass('focus');
            $("#searchForm form input[type='text']").removeClass('focus');
            $("#searchAutocompletion").css("height", 0);

            $(".categorie:active .catContent").css('-webkit-transform', 'scale3d(0.93,0.93,0.93)');
        }
    });
    $('html').click(function () {
        $("#leftPanel").attr("open", false);
        $("#leftPanel").css('width', '50px');
        $(".categorie").css('width', '50px');
        $(".categorie:active .catContent").css('-webkit-transform', 'scale3d(0.93,0.93,0.93)');
        $("#searchForm form").removeClass('focus');
        $("#searchForm form input[type='text']").removeClass('focus');
        $("#searchAutocompletion").css("height", 0);

        try {
            currentFocusedInput.removeClass('focused');
        } catch (e) {
        }
    });
    $("#leftPanel").click(function (event) {
        event.stopPropagation();
    });
    $("#searchForm form").click(function (event) {
        event.stopPropagation();
    });
    $("#searchForm form").submit(function (event) {
        event.preventDefault();
    });

    var currentStep = 0;
    $("#cancelTicket").click(function (e) {
        $("#commandStep").show();
        $("#paymentStep").hide();
        $("#leftPanel").show();
        currentCommand.resetCommand();
        currentStep = 0;
    });
    $("#validTicket").click(function () {
        if (currentStep === 0) {
            if (currentCommand.getCommand().products.size !== 0) {
                $(".topay").text(money.format.numberToPrice(currentCommand.getCommand().total.TTC));
                $(".printTicket").removeClass("checked");
                $(".printTicket").children(".checkBoxContainer").children(".checkbox").removeClass("checked");
                $(".paid").text("0,00€");

                $(".paymentrest").text(money.format.numberToPrice(currentCommand.getCommand().total.TTC));
                $(".paymentrest").data("value", currentCommand.getCommand().total.TTC);
                $("#commandStep").hide();
                $("#paymentStep").show();
                $("#leftPanel").hide();
                currentStep = 1;

                $("#validTicket").text("Enregistrer la commande");


            }

        } else if (currentStep === 1) {
            if ($(".paymentrest").data("value") <= 0) {
                //enregistrement saisie

                currentCommand.setPayment();
                currentCommand.saveCommand();
                $("#cancelTicket").hide();
                $("#validTicket").text("Nouvelle commande");
                currentStep = 2;
            }
        } else if (currentStep === 2) {

            $("#commandStep").show();
            $("#leftPanel").show();
            $("#paymentStep").hide();
            currentCommand.resetCommand();
            currentStep = 0;
            $("#cancelTicket").show();
            $("#validTicket").text("Suivant");
        }

    });

    $('input[data-method]').on("newChar", function () {
        var paid = 0;
        $('input[data-method]').each(function (i) {
            paid += money.format.priceToNumber($(this).val());
            $(".paymentrest").data("value", currentCommand.getCommand().total.TTC - paid);
        });
        $(".paid").text(money.format.numberToPrice(paid));
        $(".paymentrest").text(money.format.numberToPrice(currentCommand.getCommand().total.TTC - paid));
        currentCommand.setPayment();
    });
    $(".printTicket").click(function (e) {
        $(this).toggleClass("checked");
        $(this).children(".checkBoxContainer").children(".checkbox").toggleClass("checked");
    });
    var productTile = function (event) {
        //console.log($(this).data("objecttype") + "/" + $(this).data("objectid"));
        if ($(this).data("objecttype") == "subcategory" && $(this).data("objectid") != "returnBack") {
            productPath += "/" + $(this).data("objectid");
        } else if ($(this).data("objectid") == "returnBack") {
            var newProductPath = productPath.split("/");
            newProductPath.splice(newProductPath.length - 1, 1);
            newProductPath.splice(0, 1);
            productPath = "";
            for (let i = 0; i < newProductPath.length; i++) {
                productPath += "/" + newProductPath[i];
            }
        } else {
            //console.log("product " + $(this).data("objectid"));
            for (let i = 0; i < database.products.length; i++) {
                if (database.products[i].itemId == $(this).data("objectid")) {

                    currentCommand.addProduct(database.products[i]);


                }
            }
        }
        loadData(false);
        $(document).trigger('tileReload');
    };
    $(document).on('tileReload', function (event) {
        $(".productTile").click(productTile);
    });
    $(".productTile").click(productTile);
    $("#categories .categorie").click(function (event) {
        $("#commandStep").show();
        $("#settings").hide();

        $("#sales").hide();
        $("#orderTicket").show();
        currentCategory = $(this).data("objectid");
        productPath = "";
        loadData(false);
        $(document).trigger('tileReload');
        $("input").each(function () {
            $(this).removeClass('focused');
            $(this).blur();
        });
    });
    $("#searchForm form input[type='text']").keyup(searchInput);
    $("#searchForm form input[type='text']").on("newChar", searchInput);
    $("#keyboard").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    $(".toolbar-item[data-action='cashin']").click(function (e) {

    });
    $(".toolbar-item[data-action='cashout']").click(function (e) {

    });
    $(".toolbar-item[data-action='exportPdf']").click(function (e) {
        Statistics.exportLogs();
    });
    $("#openCashDrawerButton").click(function () {
        openCashDrawer();
    });
    $('.toolbar-item[data-action="printlog"]').click(function () {
        printLogs();
    });
});

function searchInput(event) {
    var searchResult = search($(this).val());
    $("#searchAutocompletion").empty();
    for (var res in searchResult) {
        $("#searchAutocompletion").append(' <div class="searchSection" data-objecttype="' + res + '"><div class="sectionName">' + getLabelFromObjecttype(res, true) + '<!--<div class="more">Plus</div>--></div><div class="searchResult"> </div></div>');
        for (let item of searchResult[res]) {
            if (item.itemType == "product") {
                var price = money.format.numberToPrice(item.price);
                if (item.price === "free") {
                    price = "Prix libre";
                }
                $(".searchSection[data-objecttype='" + res + "'] .searchResult").append('<div class="searchResultTile" data-objecttype="' + item.itemType + '" data-objectid="' + item.itemId + '"><img src="' + item.picture + '"/> <div class="content"> <span>' + item.name + '</span><div>' + price + '</div></div></div>');
            } else if (item.itemType == "category") {
                $(".searchSection[data-objecttype='" + res + "'] .searchResult").append('<div class="searchResultTile" data-objecttype="' + item.itemType + '" data-objectid="' + item.itemId + '"><img style="background: #333; height: 30px; width: 30px; padding: 10px; " src="' + item.picture + '"/> <div class="content"> <span class="centered">' + item.name + '</span></div></div>');

            } else {
                $(".searchSection[data-objecttype='" + res + "'] .searchResult").append('<div class="searchResultTile" data-objecttype="' + item.itemType + '" data-objectid="' + item.itemId + '" data-catId="' + item.category + '"><img src="' + item.picture + '"/> <div class="content"> <span class="centered">' + item.name + '</span></div></div>');

            }
        }
    }
    if (Object.keys(searchResult).length == 0) {
        $("#searchAutocompletion").html("<h2>Rechercher dans les produits, catégories et sous-catégories...</h2>");
    }
    var totalHeight = 0;
    for (let elem of $("#searchAutocompletion").children()) {
        totalHeight += $(elem).height() + 10;
    }
    $("#searchAutocompletion").css("height", totalHeight + "px");
    $(".searchResultTile").click(function (e) {
        if ($(this).data("objecttype") == "subcategory") {
            var catID = $(this).attr("data-catId");
            var subCatID = $(this).data("objectid");
            $(".categorie[data-objectid='" + catID + "']").click();
            productPath = "/" + subCatID;
            loadData(false);
            $(document).trigger('tileReload');
        }

        if ($(this).data("objecttype") == "product") {
            //console.log("product " + $(this).data("objectid"));
            for (var i = 0; i < database.products.length; i++) {
                if (database.products[i].itemId == $(this).data("objectid")) {
                    currentCommand.addProduct(database.products[i]);
                }
            }
        }

        if ($(this).data("objecttype") == "category") {
            $(".categorie[data-objectid='" + $(this).data("objectid") + "']").click();
        }
    });

}
function addItemToHome(data) {
    if(!fs.existsSync(data.picture)){
            data.picture = "assets/images/Miniatures/notFound.png";

    }
    if (data.itemType == "product") {
        if(data.sellMode == "weight"){
            data.price += '<span> / ' + data.unit + '</span>';
        }

        var productTemplate = '<div class="productTile" data-objectid="' + data.itemId + '" data-objecttype="product"><div class="coverImage" style="background-image: url(' + data.picture + ')"></div><div class="price">' + data.price + '</div><div class="name">' + data.name + '</div></div>';
        $("#productsContainer").append(productTemplate)
    } else if (data.itemType == "subcategory") {
        var subcategoryTemplate = '<div class="productTile" data-objectid="' + data.itemId + '" data-objecttype="subcategory"><div class="coverImage" style="background-image: url(' + data.picture + ')"></div><div class="subcategory"></div><div class="name">' + data.name + '</div></div>';
        $("#productsContainer").append(subcategoryTemplate)
    } else {
        console.error("unknown item type", data);
    }
}

function addItemToMenu(data) {
    var activated = "";
    if (data.defaultFocused) {
        activated = "activated";
    }
    $("#categories").append('<div class="categorie ' + activated + '" data-objectid="' + data.itemId + '" data-objecttype="category"><div class="catContent"><img class="sideBarIcon" src="' + data.picture + '"/>' + data.name + '</div></div>')
    $('.screen[screenId="saleReport"]').append('<div class="tile leftRight recettecategorie" data-objectid="' + data.itemId + '"><div class="tileLabel">' + data.name + '</div> <div class="tileSubValue column"></div><div class="tileValue column">0,00€</div></div>');
}
function getLabelFromObjecttype(objectType, plurial) {
    switch (objectType) {
        case "product":
        case "products":
            if (plurial) {
                return "Produits";
            } else {
                return "Produit";
            }
            break;
        case "category":
        case "categories":
            if (plurial) {
                return "Catégories";
            } else {
                return "Catégorie";
            }
            break;
        case "subcategory":
        case "subcategories":
            if (plurial) {
                return "Sous-catégories";
            } else {
                return "Sous-catégorie";
            }
            break;
        default:
            return "Autres";
            break;
    }
}
