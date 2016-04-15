var config=require("./config.json");
jQuery(document).ready(function($) {
	if(database = "NLY"){
		loadData(config.dataLocation);
	}
});