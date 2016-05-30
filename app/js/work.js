var database = "NLY";
var currentCategory = "";
var productPath = "";

function loadData(dataLocation, firstLoad) {
    if (dataLocation == "local") {
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
    if (productPath.split("/")[productPath.split("/").length - 1] !== "") {
        addItemToHome({
            itemType: "subcategory",
            itemId: "returnBack",
            picture: "./assets/images/Miniatures/back.png",
            name: "Retour"
        });
    }
    for (var j = 0; j < database.subcategories.length; j++) {
        if ((productPath.split("/")[productPath.split("/").length - 1] == database.subcategories[j].subcategoryId) && (database.subcategories[j].category == currentCategory)) {
            addItemToHome(database.subcategories[j]);
        }
    }
    for (var k = 0; k < database.products.length; k++) {
        if ((database.products[k].subCat == productPath.split("/")[productPath.split("/").length - 1]) && (database.products[k].category == currentCategory)) {
            addItemToHome(database.products[k]);
        }
    }

}
function search(keyword){
    for(var i=0; i < database.products.length; i++){
        if(database.products[i].name.includes(keyword)){
            console.log(database.products[i]);
        }
    }
}

