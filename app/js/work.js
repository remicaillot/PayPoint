var fs = require("fs");
var database = "NLY";

function loadData(dataLocation) {
    if (dataLocation = "local") {
        database = require("./database.json");
    }
    
}