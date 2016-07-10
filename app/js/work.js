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
function search(keyword){
    var searchResults = {
        products: [],
        categories: [],
        subcategories: []
    };
    try{
        var regex = new RegExp("(" + keyword + "+)[a-z]*", "ig");
    }catch (err){
        return {};
    }
    for(var i = 0; i < database.products.length; i++){
        if(database.products[i].name.match(regex)){
            searchResults.products.push(database.products[i]);
        }
    }
    for(var i = 0; i < database.categories.length; i++){
        if(database.categories[i].name.match(regex)){
            searchResults.categories.push(database.categories[i]);
        }
    }
    for(var i = 0; i < database.subcategories.length; i++){
        if(database.subcategories[i].name.match(regex)){
            searchResults.subcategories.push(database.subcategories[i]);
        }
    }
    if(searchResults.products.length == 0){
        delete searchResults.products;
    }
    if(searchResults.categories.length == 0){
        delete searchResults.categories;
    }
    if(searchResults.subcategories.length == 0){
        delete searchResults.subcategories;
    }
    return searchResults;
}