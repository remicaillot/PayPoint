var config = require("./config.json");

function shopingCart(modifCB){
    var products = new Map();
    this.reloadDom = function(){

        $("#tableBody").html("");
        var total={
            HT: 0.0,
            TTC: 0.0
        };
        for(product of products){
            var price = money.format.numberToPrice(product[1].price * product[1].qts);
            var productTemplate = '<div class="tableLine" data-itemId="' + product[1].itemId + '"><div class="product"><img src="' + product[1].picture + '">' + product[1].name + '</img></div><div class="qts">' + product[1].qts + '</div><div class="price">' + price + '</div></div>';
            total.HT += money.calculTva.TTCtoHT(product[1].price * product[1].qts, product[1].TVARate);
            total.TTC += product[1].price * product[1].qts;
            $("#tableBody").append(productTemplate);
        }
        $("#totalHT .amount").text(money.format.numberToPrice(total.HT));
        $("#totalTTC .amount").text(money.format.numberToPrice(total.TTC));
        modifCB();

    };
     this.getCommand = function(){
         var command = {
             products: products,
             total: {
                 TTC: 0,
                 HT: 0,
                 perTVARate: {
                     5.5: 0,
                     7: 0,
                     10: 0,
                     20: 0
                 }
             }
         };

         return products;
     }
    this.addProduct= function(productWanted){
        if(typeof products.get(productWanted.itemId) !== "undefined"){
            products.get(productWanted.itemId).qts++;

        }else{
            productWanted.qts = 1;
            products.set(productWanted.itemId, productWanted);
        }

        this.reloadDom();
    }
    this.removeProduct= function(productIdWanted){
        console.log(productIdWanted);
        if(products.get(productIdWanted)){
            products.get(productIdWanted).qts--;
            if(products.get(productIdWanted).qts == 0){
                products.delete(productIdWanted);
            }
        }
        this.reloadDom();
    };
    this.resetCommand = function(){
        products.clear();
        this.reloadDom();
    }
}
var currentCommand = new shopingCart(function(){
    $(".tableLine").click(function (e) {
        var productId = $(this).data("itemid");
        currentCommand.removeProduct(productId);
    });
});
jQuery(document).ready(function($) {
    if (database = "NLY") {
        loadData(config.dataLocation, true);
    }

});