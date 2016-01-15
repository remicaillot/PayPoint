var money = {
    calculTva: {
        HTtoTTC: function(HT, TVA) {
            TVA = client.tvaRate[TVA];
            return HT * (1 + TVA / 100);
        },
        TTCtoHT: function(TTC, TVA) {
            TVA = client.tvaRate[TVA];
            return TTC / (1 + TVA / 100);
        },
        TVAfromTTC: function(TTC, HT) {
            return TTC * (HT / 100);
        }
    },
    format: {
        numberToPrice: function(number) {
            number = number.toString();
            number = number.split('.');
            if (number.length == 1) {
                number[1] = "00";
            }else if(number.length == 2){
                var intNumber = parseInt(number[1]);
                if(intNumber < 10){
                    
                 number[1] = number[1] + "0";
                }
            }
            return number[0] + "," + number[1] + "€";
        },
        priceToNumber: function(price) {
            price = price.replace('€', '');
            number = price.replace(',', '.');
            return parseFloat(number);
        }
    },
    givingChanges: function(price, money){
        return price - money;
    }
}