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

    static importOldCommandOperation() {
        commandDb.find({}, function (err, commands) {
            if (!err) {
                for (let command of commands) {
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

    static reloadDom() {
        Statistics.getAccountingDetails(function (details) {
            $(".accountingBalance").text(money.format.numberToPrice(details.balance));
            $("#accountingOperationsList").empty();
            for (let operation of details.operations) {

                var operationType = "Retrait à la banque";
                if(operation.operationType == "deposit"){
                    var operationType = "Dépot à la banque";
                }
                var number = "";
                if(operation.depositID){
                    number = "N°" + operation.depositID;
                }else if(operation.entryID != ""){
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