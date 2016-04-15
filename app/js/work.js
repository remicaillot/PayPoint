var database = "NLY";
var productPath = "";

function loadData(dataLocation) {
    if (dataLocation = "local") {
        database = require("./database.json");
    }
    $("#productsContainer").html("");
    if (productPath.split("/")[productPath.split("/").length - 1] == "") {
        for (var i = 0; i < database.subcategories.length; i++) {
            addItemToWindow(database.subcategories[i]);
        }
    } else {
        addItemToWindow({
            itemType: "subcategory",
            itemId: "returnBack",
            picture: "./assets/images/Miniatures/back.png",
            name: "Retour"
        });
    }
    for (var i = 0; i < database.products.length; i++) {
        if (database.products[i].subCat == productPath.split("/")[productPath.split("/").length - 1]) {
            addItemToWindow(database.products[i]);
        }
    }
}