var database = "NLY";
var currentCategory = "";
var productPath = "";

function loadData(dataLocation, firstLoad) {
    if (dataLocation = "local") {
        database = require("./database.json");
    }
    $("#productsContainer").html("");
    if(firstLoad){
    	for (var i = 0; i < database.categories.length; i++) {
            addItemToMenu(database.categories[i]);
            if (database.categories[i].defaultFocused) {
                currentCategory = database.categories[i].itemId;
                console.log(database.categories[i].name);
            }
        }
    }
    if (manifest.devtools) {
        console.log(productPath);
    }
    if (productPath.split("/")[productPath.split("/").length - 1] != "") {
        addItemToHome({
            itemType: "subcategory",
            itemId: "returnBack",
            picture: "./assets/images/Miniatures/back.png",
            name: "Retour"
        });
    }
    for (var i = 0; i < database.subcategories.length; i++) {
        if ((productPath.split("/")[productPath.split("/").length - 1] == database.subcategories[i].subcategoryId) && (database.subcategories[i].category == currentCategory)) {
            addItemToHome(database.subcategories[i]);
        }
    }
    for (var i = 0; i < database.products.length; i++) {
        if ((database.products[i].subCat == productPath.split("/")[productPath.split("/").length - 1]) && (database.products[i].category == currentCategory)) {
            addItemToHome(database.products[i]);
        }
    }

}