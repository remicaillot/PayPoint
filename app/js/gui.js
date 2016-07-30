jQuery(document).ready(function ($) {
    moment.locale('fr');
    $('input[type="daterange"]').dateRangePicker({

        format: 'DD/MM/YYYY',
        separator: ' au ',
        language: 'fr',
        startOfWeek: 'monday',// or monday
        showShortcuts: true,
        customShortcuts: [
            //if return an array of two dates, it will select the date range between the two dates
            {
                name: 'Aujourd\'hui',
                dates: function () {
                    var start = moment().hour(0).toDate();
                    var end = moment().hour(23).toDate();
                    return [start, end];
                }
            }, {
                name: 'Cette semaine',
                dates: function () {
                    var start = moment().day(1).hour(0).toDate();
                    var end = moment().day(7).hour(23).toDate();
                    return [start, end];
                }
            },
            {
                name: 'Ce mois-ci',
                dates: function () {
                    var start = moment().date(1).hour(0).toDate();
                    var end = moment().hour(23).toDate();
                    return [start, end];
                }
            },
            {
                name: 'Le mois dernier',
                dates: function () {
                    var start = moment(moment().month(), "MM").date(1).hour(0).toDate();
                    var end = moment(moment().month(), "MM").date(31).hour(23).toDate();
                    return [start, end];
                }
            },
            {
                name: 'Cette année',
                dates: function () {
                    var start = moment().dayOfYear(1).hour(0).toDate();
                    var end = moment().dayOfYear(366).hour(23).toDate();
                    return [start, end];
                }
            },
            {
                name: 'L\'année dernière',
                dates: function () {
                    var start = moment(moment().year() - 1, "YYYY").dayOfYear(1).hour(0).toDate();
                    var end = moment(moment().year() - 1, "YYYY").dayOfYear(365).hour(23).toDate();
                    return [start, end];
                }
            }
        ],
        starttime: "00:00",
        endtime: "23:59",
        duration: 0,
        format: "dddd D MMMM YYYY"
    });
    $("#searchForm form input[type='text']").focus(function (event) {

        $('input[type="daterange"]').data('dateRangePicker').close();
        //$("#searchForm form input[type='text']").addClass('focus');
        $("#searchForm form").addClass('focus');
        var totalHeight = 0;
        for (elem of $("#searchAutocompletion").children()) {
            totalHeight += $(elem).height() + 10;
        }
        $("#searchAutocompletion").css("height", totalHeight + "px");
    });
    $("#sideBarMenu").click(function (e) {

        $('input[type="daterange"]').data('dateRangePicker').close();
        if ($("#leftPanel").attr("open") == "open") {
            $("#leftPanel").attr("open", false).css('width', '50px');
            $(".categorie").css('width', '50px');
            $(".categorie:active .catContent").css('-webkit-transform', 'scale3d(0.93,0.93,0.93)');
        } else {
            $("#leftPanel").attr("open", true).css('width', '200px');
            $(".categorie").css('width', '200px');
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
    });
    $(".categorie").click(function (event) {

        $('input[type="daterange"]').data('dateRangePicker').close();
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
                currentStep++;
            }

        } else if (currentStep === 1) {
            if ($(".paymentrest").data("value") <= 0) {
                //enregistrement saisie

                currentCommand.setPayment();
                currentCommand.saveCommand();
                if ($(".printTicket").hasClass("checked")) {
                    printTicket();
                }
                $("#commandStep").show();
                $("#leftPanel").show();
                $("#paymentStep").hide();
                currentCommand.resetCommand();
                currentStep = 0;
            }
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
            for (var i = 0; i < newProductPath.length; i++) {
                productPath += "/" + newProductPath[i];
            }
        } else {
            //console.log("product " + $(this).data("objectid"));
            for (var i = 0; i < database.products.length; i++) {
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
    });
    $("#searchForm form input[type='text']").keyup(searchInput);
    $("#searchForm form input[type='text']").on("newChar", searchInput);
    $("#keyboard").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
});

function searchInput(event) {
    var searchResult = search($(this).val());
    $("#searchAutocompletion").empty();
    for (var res in searchResult) {
        $("#searchAutocompletion").append(' <div class="searchSection" data-objecttype="' + res + '"><div class="sectionName">' + getLabelFromObjecttype(res, true) + '<!--<div class="more">Plus</div>--></div><div class="searchResult"> </div></div>');
        for (item of searchResult[res]) {
            if (item.itemType == "product") {
                if(item.price === "free"){
                    var price = "Prix libre";
                }else{
                    var price = money.format.numberToPrice(item.price);
                }
                $(".searchSection[data-objecttype='" + res + "'] .searchResult").append('<div class="searchResultTile" data-objecttype="' + item.itemType + '" data-objectid="' + item.itemId + '"><img src="' + item.picture + '"/> <div class="content"> <span>' + item.name + '</span><div>' + price + '</div></div></div>');
            } else if (item.itemType == "category") {
                $(".searchSection[data-objecttype='" + res + "'] .searchResult").append('<div class="searchResultTile" data-objecttype="' + item.itemType + '" data-objectid="' + item.itemId + '"><img style="background: #333; height: 30px; width: 30px; padding: 10px; " src="' + item.picture + '"/> <div class="content"> <span class="centered">' + item.name + '</span></div></div>');

            } else {
                $(".searchSection[data-objecttype='" + res + "'] .searchResult").append('<div class="searchResultTile" data-objecttype="' + item.itemType + '" data-objectid="' + item.itemId + '"><img src="' + item.picture + '"/> <div class="content"> <span class="centered">' + item.name + '</span></div></div>');

            }
        }
    }
    if (Object.keys(searchResult).length == 0) {
        $("#searchAutocompletion").html("<h2>Vous pouvez rechercher ce que vous voulez</h2>");
    }
    var totalHeight = 0;
    for (elem of $("#searchAutocompletion").children()) {
        totalHeight += $(elem).height() + 10;
    }
    $("#searchAutocompletion").css("height", totalHeight + "px");
    $(".searchResultTile").click(function (e) {
        if ($(this).data("objecttype") == "subcategory") {
            productPath += "/" + $(this).data("objectid");

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
    if (data.itemType == "product") {
        var productTemplate = '<div class="productTile" data-objectid="' + data.itemId + '" data-objecttype="product"><img src="' + data.picture + '"/><div class="price">' + data.price + '</div><div class="name">' + data.name + '</div></div>';
        $("#productsContainer").append(productTemplate)
    } else if (data.itemType == "subcategory") {
        var subcategoryTemplate = '<div class="productTile" data-objectid="' + data.itemId + '" data-objecttype="subcategory"><img src="' + data.picture + '"/><div class="subcategory"></div><div class="name">' + data.name + '</div></div>';
        $("#productsContainer").append(subcategoryTemplate)
    } else {
        console.error("unknown item type", data);
    }
}

function addItemToMenu(data) {
    var activated = "";
    if (data.defaultFocused) {
        var activated = "activated";
    }
    $("#categories").append('<div class="categorie ' + activated + '" data-objectid="' + data.itemId + '" data-objecttype="category"><div class="catContent"><img class="sideBarIcon" src="' + data.picture + '"/>' + data.name + '</div></div>')
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
