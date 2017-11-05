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

    static saveCommand(amount, date, cb) {
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
            let commandQueue = [];
            for (let operation of details.operations) {
                if ((operation.operationType === "deposit")) {
                    if (commandQueue.length > 0) {
                        let commands = {
                            amount: 0,
                            timestamp: 0
                        };
                        for (let command of commandQueue) {
                            commands.amount += command.amount;
                            commands.timestamp = command.timestamp;
                        }
                        $("#accountingOperationsList").prepend('<div class="tile leftRight">' +
                            '<div class="tileLabel">Commande</div>' +
                            '<div class="tileSubValue lastDepositNumber"></div>' +
                            '<div class="tileSubValue lastDepositDate">Du ' + moment(commands.timestamp).format("ll") + '</div>' +
                            '<div class="tileValue lastDepositAmount">' + money.format.numberToPrice(commands.amount) + '</div>' +
                            '</div>');
                        commandQueue = [];
                    }

                    let operationType = "Dépot à la banque";
                    let number = "N°" + operation.depositID;

                    $("#accountingOperationsList").prepend('<div class="tile leftRight">' +
                        '<div class="tileLabel">' + operationType + '</div>' +
                        '<div class="tileSubValue lastDepositNumber">' + number + '</div>' +
                        '<div class="tileSubValue lastDepositDate">Le ' + moment(operation.timestamp).format("ll") + '</div>' +
                        '<div class="tileValue lastDepositAmount">' + money.format.numberToPrice(operation.amount) + '</div>' +
                        '</div>');

                } else if (operation.operationType === "entry") {
                    if (commandQueue.length > 0) {
                        let commands = {
                            amount: 0,
                            timestamp: 0
                        };
                        for (let command of commandQueue) {
                            commands.amount += command.amount;
                            commands.timestamp = command.timestamp;
                        }
                        $("#accountingOperationsList").prepend('<div class="tile leftRight">' +
                            '<div class="tileLabel">Commande</div>' +
                            '<div class="tileSubValue lastDepositNumber"></div>' +
                            '<div class="tileSubValue lastDepositDate">Du ' + moment(commands.timestamp).format("ll") + '</div>' +
                            '<div class="tileValue lastDepositAmount">' + money.format.numberToPrice(commands.amount) + '</div>' +
                            '</div>');
                        commandQueue = [];
                    }

                    let operationType = "Retrait à la banque";

                    let number = "N°" + operation.entryID;

                    $("#accountingOperationsList").prepend('<div class="tile leftRight">' +
                        '<div class="tileLabel">' + operationType + '</div>' +
                        '<div class="tileSubValue lastDepositNumber">' + number + '</div>' +
                        '<div class="tileSubValue lastDepositDate">Le ' + moment(operation.timestamp).format("ll") + '</div>' +
                        '<div class="tileValue lastDepositAmount">' + money.format.numberToPrice(operation.amount) + '</div>' +
                        '</div>');
                } else {
                    if(commandQueue.length === 0){
                        commandQueue.push(operation);
                    }else if(moment(operation.timestamp).format('l') === moment(commandQueue[commandQueue.length - 1]).format('l')){
                            commandQueue.push(operation);

                    } else{
                        let commands = {
                            amount: 0,
                            timestamp: 0
                        };
                        for (let command of commandQueue) {
                            commands.amount += command.amount;
                            commands.timestamp = command.timestamp;
                        }
                        $("#accountingOperationsList").prepend('<div class="tile leftRight">' +
                            '<div class="tileLabel">Commande</div>' +
                            '<div class="tileSubValue lastDepositNumber"></div>' +
                            '<div class="tileSubValue lastDepositDate">Du ' + moment(commands.timestamp).format("ll") + '</div>' +
                            '<div class="tileValue lastDepositAmount">' + money.format.numberToPrice(commands.amount) + '</div>' +
                            '</div>');
                        commandQueue = [];
                    }
                }
            }
        });
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