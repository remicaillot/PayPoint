var printer = require("node-thermal-printer-driver");
printer.init({
	type: "epson",
	interface: "/dev/lp0",
	
});
printer.isPrinterConnected(function(res){
	if(res){
		console.log("Printer connected");
	} else {
		console.error("Printer not found");
	}
});

function printTicket(command){
printer.init({
  type: 'epson',
  interface: '/dev/usb/lp1'
});
printer.alignCenter();
printer.println("Hello world");
printer.cut();
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
