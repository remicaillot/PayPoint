var money = {
    calculTva: {
        HTtoTTC: function(HT, TVA) {
            return HT * (1 + TVA / 100);
        },
        TTCtoHT: function(TTC, TVA) {
            return TTC - (TTC  - ((TTC * 100)/(100 + TVA)));
        },
        TVAfromTTC: function(TTC, TVA) {
            return TTC  - ((TTC * 100)/(100 + TVA));
        }
	
    },
    format: {
        numberToPrice: function(number, euro) {
            if(typeof number == "number"){
                number = parseFloat(number.toString()).toFixed(2);
            }else{
                number = parseFloat(number).toFixed(2);
            }
            number =  number.replace(".", ",");
		if(typeof euro === "undefined"){
			number += "€";
		}
            return number;
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
