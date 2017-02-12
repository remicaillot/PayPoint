try{
	var printers = fs.readdirSync("/dev/usb").filter(function(val){ return val.includes("lp");})
	console.log(printers);
}catch(e){
	console.error(e);
}

try{
	var printer = require("node-thermal-printer");
	printer.init({
		type: "epson",
		interface: "/dev/usb/" + printers[0],
		characterSet: 'FRANCE', 
		removeSpecialCharacters: false, 
		replaceSpecialCharacters: true   
	});
} catch(e){
	console.log(e);
}
printer.isPrinterConnected(function(res){
	if(res){
		console.log("Printer connected");
	} else {
		console.error("Printer not found");
	}
});

 
function printTicket(command) {
    if ($(".printTicket").hasClass("checked")) {
        printer.alignCenter();
        printer.printImage('/home/lead/Images/logomh.png', function (done) {
            printer.newLine();
            printer.bold(true);
            printer.println("SNC Les Moulin");
            printer.println("St-Martin d'Arcé");
            printer.println("49150 Baugé-en-Anjou");
            printer.newLine();
            printer.println("02 41 89 06 28");
            printer.println("www.moulinhubeau.fr");
            printer.bold(false);
            printer.newLine();
            printer.println("Société en nom collectif - SIRET 400 534 335");
            printer.newLine();
            printer.println(moment().format("llll"));
            printer.newLine();
            printer.tableCustom([
                {text: "Produit", align: "LEFT", width: 0.45, bold: true},
                {text: "Qts", align: "CENTER", width: 0.15, bold: true},
                {text: "TVA", align: "CENTER", width: 0.15, bold: true},
                {text: "Total", align: "CENTER", width: 0.2, bold: true}
            ]);
            printer.drawLine();
            for (product of command.products) {
                printer.tableCustom([
                    {text: product.name, align: "LEFT", width: 0.45, bold: false},
                    {text: "" + product.qts, align: "CENTER", width: 0.15, bold: false},
                    {text: "" + product.TVARate, align: "CENTER", width: 0.15, bold: false},
                    {
                        text: "" + money.format.numberToPrice(product.price * product.qts, true),
                        align: "CENTER",
                        width: 0.25,
                        bold: false
                    }
                ]);
            }
            printer.drawLine()
            printer.setTextDoubleHeight();
            printer.leftRight("Total HT", "" + money.format.numberToPrice(command.total.HT, true));
            printer.setTextNormal();
            printer.leftRight("TVA 5,5%", "" + money.format.numberToPrice(money.calculTva.TVAfromTTC(command.total.perTVARate["5,5"], 5.5), true));
            printer.leftRight("TVA 10%", "" + money.format.numberToPrice(money.calculTva.TVAfromTTC(command.total.perTVARate["10"], 10), true));
            printer.leftRight("TVA 20%", "" + money.format.numberToPrice(money.calculTva.TVAfromTTC(command.total.perTVARate["20"], 20), true));
            printer.newLine();
            printer.setTextDoubleHeight();
            printer.leftRight("Total TTC", "" + money.format.numberToPrice(command.total.TTC, true));
            printer.setTextNormal();
            printer.newLine();
            printer.setTextQuadArea();
            printer.println("Le Moulin Hubeau");
            printer.println("vous remercie de");
            printer.println("votre visite");
            printer.cut();

            printer.openCashDrawer();
            printer.execute(function (err) {
                if (err) {
                    console.error("Print failed", err);
                } else {
                    console.log("Print done");
                }
            });

        });
    } else {
        printer.openCashDrawer();
        printer.execute(function (err) {
            if (err) {
                console.error("Print failed", err);
            } else {
                console.log("Print done");
            }
        });

    }
}

function openCashDrawer() {
    printer.openCashDrawer();
    printer.execute(function (err) {
        if (err) {
            console.error("Print failed", err);
        } else {
            console.log("Print done");
        }
    });
}
