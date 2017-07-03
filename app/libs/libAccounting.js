class Accounting {

    static bankDeposit(amount, date, id, cb) {
        cashDrawerDb.insert({
            operationType: "deposit",
            amount: amount,
            timestamp: date.getTime(),
            depositID: id
        }, function (err) {
            console.error(err);
            cb(true);
        });
    }

    static moneyEntry(amount, date, id, cb) {
        cashDrawerDb.insert({
            operationType: "entry",
            amount: amount,
            timestamp: date.getTime(),
            entryID: id
        }, function (err) {
            console.error(err);
            cb(true);
        });
    }

    static saveCommand(amount, date, cb){
        date = new Date(date);
        cashDrawerDb.insert({
            operationType: "command",
            amount: amount,
            timestamp: date.getTime(),
        }, function (err) {
            console.error(err);
            cb(true);
        });
    }


    static reloadDom() {
        Statistics.getAccountingDetails(function (details) {
            $(".accountingBalance").text(money.format.numberToPrice(details.balance));
            $("#accountingOperationsList").empty();
            for (let operation of details.operations) {

                var operationType = "Retrait à la banque";
                if(operation.operationType == "deposit"){
                    var operationType = "Dépot à la banque";
                } else if(operation.operationType == "command"){

                    var operationType = "Commande";
                }
                var number = "";
                if(typeof operation.depositID !== "undefined"){
                    number = "N°" + operation.depositID;
                }else if((typeof operation.entryID  !== "undefined") && (operation.entryID != "")){
                    number ="N°" + operation.entryID;
                }

                $("#accountingOperationsList").prepend('<div class="tile leftRight">' +
                    '<div class="tileLabel">' + operationType + '</div>' +
                    '<div class="tileSubValue lastDepositNumber">' + number +'</div>' +
                    '<div class="tileSubValue lastDepositDate">Le ' + moment(operation.timestamp).format("ll") + '</div>' +
                    '<div class="tileValue lastDepositAmount">' + money.format.numberToPrice(operation.amount) + '</div>' +
                    '</div>');
            }
        })
    }
}
$(document).ready(function () {
    $("#depositForm").submit(function (e) {
        e.preventDefault();
        var date = $(".inputTypeDate").data("daterangepicker").startDate;
        var amount = money.format.priceToNumber($("#depositAmount").val());
        var id = $("#depositID").val();
        if (amount != 0) {
            Accounting.bankDeposit(amount, date.toDate(), id, function () {
                Accounting.reloadDom();
                ScreenManager.back();
            });
        }
    });
    $("#entryForm").submit(function (e) {
        e.preventDefault();
        var date = $(".inputTypeDate").data("daterangepicker").startDate;
        var amount = money.format.priceToNumber($("#entryAmount").val());
        var id = $("#entryID").val();
        if (amount != 0) {
            Accounting.moneyEntry(amount, date.toDate(), id, function () {
                Accounting.reloadDom();
                ScreenManager.back();
            });
        }
    });
});