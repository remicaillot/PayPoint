var printer = require("node-thermal-printer-driver");
printer.init({
	type: "epson",
	interface: "/dev/usb/lp1",
	
});
printer.isPrinterConnected(function(res){
	if(res){
		console.log("Printer connected");
	} else {
		console.error("Printer not found");
	}
});

function printTicket(command){
printer.alignCenter();
printer.bold(true);
printer.println("SNC Les Moulin");
printer.println("St-Martin d'Arcé");
printer.println("49150 Baugé-en-Anjou");
printer.bold(false);
printer.newLine();
printer.println("Société en nom collectif - SIRET 400 534 335");
printer.newLine();
printer.println(moment().format("llll"));
printer.newLine();
printer.tableCustom([
  { text:"Produit", align:"LEFT", width:0.45, bold: true },
  { text:"Qts", align:"CENTER", width:0.15, bold:true },
  { text:"TVA", align:"CENTER", width:0.15, bold: true },
  { text:"Total", align:"CENTER", width:0.2, bold: true }
]);
printer.drawLine();
for(product of command.products){
	printer.tableCustom([
	  { text: product.name, align:"LEFT", width:0.45, bold: false },
	  { text: ""+product.qts, align:"CENTER", width:0.15, bold: false },
	  { text: ""+product.TVARate, align:"CENTER", width:0.15, bold: false },
	  { text: ""+(product.price * product.qts), align:"CENTER", width:0.25, bold: false }
	]);
}
printer.drawLine()
printer.setTextDoubleHeight();
printer.leftRight("Total HT", ""+command.total.HT);
printer.setTextNormal();
printer.leftRight("TVA 5,5%", ""+command.total.perTVARate["5,5"]);
printer.leftRight("TVA 10%", ""+command.total.perTVARate["10"]);
printer.leftRight("TVA 20%", ""+command.total.perTVARate["20"]);
printer.newLine();
printer.setTextDoubleHeight();
printer.leftRight("Total TTC", ""+command.total.TTC);
printer.setTextNormal();

printer.cut();
printer.openCashDrawer();
printer.execute(function(err){
  if (err) {
    console.error("Print failed", err);
  } else {
   console.log("Print done");
  }
});
}
function openCashDrawer(){
	printer.openCashDrawer();
	 printer.execute(function(err){
    if (err) {
      console.error("Print failed", err);
    } else {
     console.log("Print done");
    }
  });
}
