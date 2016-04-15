var printer = require("node-thermal-printer");
printer.init({
    type: "epson",
    interface: "/dev/usb/lp1"
});

function printTicket(order) {
    printer.alignCenter();
    printer.bold(true);
    printer.setTextDoubleHeight();
    printer.println("\x1b\x74\x14");
    printer.println("Bienvenue au Moulin Hubeau");
    printer.println("");
    printer.setTextNormal();
    printer.bold(false);
    printer.println("Ouvert tout les jours \n sauf le mercredi de 8h a 18h");
    printer.println("www.moulinhubeau.fr");
    printer.println("Tel : 02 41 89 06 28");
    printer.println("");
    printer.println("Pisciculture du Moulin Hubeau \n Saint-Martin d'Arce \n 49150 Bauge en anjou");
    printer.println("");
    printer.bold(true);
    printer.println("Designation          P.U. x Qts      Montant TTC");
    printer.bold(false);
    for (var i = 0; i < order.orderTicket.length; i++) {
        if (order.orderTicket[i].type == "package") {
        	var lineText = client.packages[order.orderTicket[i].productID].name.replace("é", "e").replace("è", "e").replace("à", "a") + client.packages[order.orderTicket[i].productID].price + "x" + order.orderTicket[i].qts +  client.packages[order.orderTicket[i].productID].price * order.orderTicket[i].qts;
        	var nspace = (47 - lineText.length) / 2;
        	var space = ""
        	for (var j = 0; j < nspace; j++) {
        		space += " "; 	
        	}
            printer.println(client.packages[order.orderTicket[i].productID].name.replace("é", "e").replace("è", "e").replace("à", "a") + space + client.packages[order.orderTicket[i].productID].price + "x" + order.orderTicket[i].qts + space + client.packages[order.orderTicket[i].productID].price * order.orderTicket[i].qts); //47 char max 
        } else if (order.orderTicket[i].type == "product") {
        	var lineText = client.products[order.orderTicket[i].productID].name.replace("é", "e").replace("è", "e").replace("à", "a") + client.products[order.orderTicket[i].productID].price + "x" + order.orderTicket[i].qts +  client.products[order.orderTicket[i].productID].price * order.orderTicket[i].qts;
        	var nspace = (47 - lineText.length) / 2 ;
        	var space = ""
        	for (var j = 0; j < nspace; j++) {
        		space += " "; 	
        	}
            printer.println(client.products[order.orderTicket[i].productID].name.replace("é", "e").replace("è", "e").replace("à", "a") + space + client.products[order.orderTicket[i].productID].price + "x" + order.orderTicket[i].qts + space + client.products[order.orderTicket[i].productID].price * order.orderTicket[i].qts); //47 char max 
        }
    };
    printer.drawLine();
    printer.bold(true);
    printer.println("  " + order.orderTicket.length + " ARTICLE(S)");
    printer.println("TOTAL A PAYER HT                      " + money.format.numberToPrice(Math.round(order.totalHT * 100) / 100).replace("€", " EUR"));
    printer.println("Montant TVA                         " + money.format.numberToPrice((Math.round((order.totalTTC - order.totalHT) * 100) / 100)).replace("€", " EUR"));
    printer.setTextDoubleHeight();
    printer.print("TOTAL A PAYER TTC                    " + money.format.numberToPrice(order.totalTTC).replace("€", " EUR"));
    printer.setTextNormal();
    printer.bold(false);
    printer.drawLine();
    alert(order.paymentMethod);
    switch (order.paymentMethod) {
        case "0":
            printer.println("Especes                             " + money.format.numberToPrice(order.cashGived).replace("€", " EUR"));
            printer.print("A RENDRE                              " + money.format.numberToPrice(Math.round(order.givingChanges * 100) / 100).replace("€", " EUR"));
            printer.drawLine();
            break;
        case "1":
            printer.println("Cheques                               " + money.format.numberToPrice(order.totalTTC).replace("€", " EUR"));
            printer.drawLine();
            break;
        case "2":
            printer.println("Virement                              " + money.format.numberToPrice(order.totalTTC).replace("€", " EUR"));
            printer.drawLine();
            break;
    }
    printer.alignCenter();
    printer.bold(true);
    printer.setTextDoubleHeight();
    printer.println("A bientot");
    printer.setTextNormal();
    printer.println("");
    printer.println("SNC Les Moulins - RCS Cherbourg D 400 534 335 ");
    printer.cut();
    printer.execute();
}