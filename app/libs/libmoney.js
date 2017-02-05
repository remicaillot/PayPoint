var money = {
    calculTva: {
        HTtoTTC: function(HT, TVA) {
            return HT * (1 + TVA / 100);
        },
        TTCtoHT: function(TTC, TVA) {
            return TTC * (1 - (TVA / 100));
        },
        TVAfromTTC: function(TTC, TVA) {
            return TTC  - (TTC * (1 - (TVA / 100)));
        }
	
    },
    format: {
        numberToPrice: function(number) {
            if(typeof number == "number"){
                number = parseFloat(number.toString()).toFixed(2);
            }else{
                number = parseFloat(number).toFixed(2);
            }
            number =  number.replace(".", ",");
            return number + "€";
        },
        priceToNumber: function(price) {
            price = price.replace('€', '');
            var number = price.replace(',', '.');
            return parseFloat(number);
        }
    },
    givingChanges: function(price, money){
        return price - money;
    }
}
