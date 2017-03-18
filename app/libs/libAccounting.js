class Accounting{

    static bankDeposit(amount, date, cb){
        date = new Date(parseInt(date));
        cashDrawerDb.insert({
            operationType: "deposit",
            amount: amount,
            timestamp: date.getTime()
        }, function (err) {
            console.error(err);
            cb(true);
        });
    }
    static moneyEntry(amount, date, cb){
        date = new Date(parseInt(date));
        cashDrawerDb.insert({
            operationType: "entry",
            amount: amount,
            timestamp: date.getTime()
        }, function (err) {
            console.error(err);
            cb(true);
        });
    }
    static importOldCommandOperation(){
        commandDb.find({}, function(err, commands){
            if(!err){
                for(let command of commands){
                    cashDrawerDb.insert({
                        operationType: "entry",
                        operationCategory: "command",
                        amount: command.payment.methods.cash,
                        timestamp: new Date(parseInt(command.timestamp)).getTime()
                    }, function (err) {
                        console.error(err);
                    });
                }
            }
        });
    }
    static reloadDom(){
        Statistics.getAccountingDetails(function(details){
            $(".accountingBalance").text(money.format.numberToPrice(details.balance));
            if(typeof details.lastDeposit === "undefined"){
                $(".lastDepositDate").text("Jamais");
                $(".lastDepositAmount").text("0,00€");
            } else {
                $(".lastDepositDate").text(moment(details.lastDeposit.timestamp).calendar());
                $(".lastDepositAmount").text(money.format.numberToPrice(details.lastDeposit.amount));
            }

        })
    }
}
$(document).ready(function(){
    $("#newDeposit").click(function(e){
        var depotVal = prompt("Valeur du dépot en euros");
        if(depotVal){
            Accounting.bankDeposit(parseFloat(depotVal), Date.now(), function(){
                Accounting.reloadDom();
            });
        }
    });
    $("#newEntry").click(function(e){
        var entryVal = prompt("Valeur du retrait en euros");
        if(entryVal){
            Accounting.moneyEntry(parseFloat(entryVal), Date.now(), function(){
                Accounting.reloadDom();
            });
        }
    });
});