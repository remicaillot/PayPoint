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
                        amount: command.payment.methods.cash,
                        timestamp: new Date(parseInt(command.timestamp)).getTime()
                    }, function (err) {
                        console.error(err);
                    });
                }
            }
        });
    }
}