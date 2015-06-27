var money = {
    calculTva: {
        HTtoTTC: function(HT, TVA) {
            return HT * (1 + TVA / 100);
        },
        TTCtoHT: function(TTC, TVA) {
            return HT / (1 + TVA / 100);
        },
        TVAfromTTC: function(TTC, HT) {
            return TTC * (TVA / 100);
        }
    },
    format: {
        numberToPrice: function(number) {
            number = number.toString();
            number = number.split('.');
            if (number.length == 1) {
                number[1] = "00";
            }
            return number[0] + "," + number[1] + "€";
        },
        priceToNumber: function(price) {
            price = price.replace('€', '');
            number = price.replace(',', '.');
            return parseFloat(number);
        }
    }
}