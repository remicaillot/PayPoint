var database = "NLY";
var productPath = "";

function loadData(dataLocation) {
    if (dataLocation = "local") {
        database = require("./database.json");
    }
    $("#productsContainer").html("");
    console.log(productPath);
     if (productPath.split("/")[productPath.split("/").length - 1] != "") {
        addItemToWindow({
            itemType: "subcategory",
            itemId: "returnBack",
            picture: "./assets/images/Miniatures/back.png",
            name: "Retour"
        });
    }
    for (var i = 0; i < database.subcategories.length; i++) {
        if (productPath.split("/")[productPath.split("/").length - 1] == database.subcategories[i].subcategoryId) {
            addItemToWindow(database.subcategories[i]);
        }
    }
   
    for (var i = 0; i < database.products.length; i++) {
        if (database.products[i].subCat == productPath.split("/")[productPath.split("/").length - 1]) {
            addItemToWindow(database.products[i]);
        }
    }
}