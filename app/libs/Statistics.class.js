class Statistics {

    constructor() {

    }

    static exportLogs() {
        var pathToSave = "Caisse Moulin Hubeau - " + moment().format("YYYY") + ".pdf";
        var columns = [
            {title: "", dataKey: "cat"},


        ];
        for(let i = 0; i < 12; i++){
            let month = moment().startOf('year').add(i, "month").format("MMMM");
            let key = "mois" + moment().startOf('year').add(i, "month").format("MM");
            columns.push({
                title: month.charAt(0).toUpperCase() + month.slice(1),
                dataKey: key
            })

        }
        var rows = [];
        for(let category of database.categories){
            rows.push({
                cat: category.name + "\r\n 5,5% \r\n 10% \r\n 20%"
            });
        }
        for(var i = 1; i <= 12; i++){
            var start = moment().startOf('year').add(i - 1, "month").toDate().getTime();
            var end = moment().startOf('year').add(i, "month").toDate().getTime();
            Statistics.getTotalSales(start, end, function(results){
                let y = 0;
                let month = "mois" + moment.unix(results.period.from / 1000).format("MM");
                for(let category of database.categories){
                    var catVal = results.perCategories.get(category.itemId);
                    if(typeof catVal !== "undefined"){
                        let text = "\r\n" +money.format.numberToPrice(catVal["5,5"]) + "\r\n" + money.format.numberToPrice(catVal["10"]) + "\r\n" + money.format.numberToPrice(catVal["20"]);
                        Object.defineProperty(rows[y], month, {
                            value: text
                        });
                    } else {
                        Object.defineProperty(rows[y], month, {
                            value: "\r\n" +money.format.numberToPrice(0)+ "\r\n" + money.format.numberToPrice(0)+ "\r\n" + money.format.numberToPrice(0)+ "\r\n"
                        });
                    }
                    y++;
                }

                if(month === "mois12"){
                    console.log(columns, rows);

                    var doc = new jsPDF({
                        orientation: 'landscape'
                    });
                    doc.autoTable(columns, rows, {
                        theme: "striped",
                        margin: {
                            top: 30
                        },
                        addPageContent: function (data) {
                            doc.text("Caisse Moulin Hubeau " + moment().format("YYYY"), 40, 20);
                        }
                    });
                    console.log(doc.save(pathToSave));
                    nw.Shell.showItemInFolder(pathToSave);
                }

            });

        }



    }

    static getTotalSales(from, to, cb) {

        var dateFrom = new Date(parseInt(from));
        var dateTo = new Date(parseInt(to));
        var search = {};
        if (typeof from === "object") {
            search = {
                $and: [
                    {timestamp: {$lte: dateFrom.getTime()}},
                    {timestamp: {$gte: dateTo.getTime()}}
                ]
            }
        }
        commandDb.find(search, function (err, commands) {
            database = JSON.parse(fs.readFileSync("./database.json", "UTF-8"));

            let add = {
                period: {
                    from: dateFrom.getTime(),
                    to: dateTo.getTime()
                },
                HT: 0,
                TTC: 0,
                perTVARate: {
                    "5,5": 0,
                    "10": 0,
                    "20": 0
                },
                perCategories: new Map(),
                perPaymentMethods: {
                    check: 0,
                    cash: 0,
                    transfer: 0
                }
            };
            for (let command of commands) {
                let commandDate = new Date(command.timestamp);
                if ((commandDate.getTime() <= dateTo.getTime()) && (commandDate.getTime() >= dateFrom.getTime())) {
                    add.HT += command.total.HT;
                    add.TTC += command.total.TTC;
                    add.perTVARate["5,5"] += command.total.perTVARate["5,5"];
                    add.perTVARate["10"] += command.total.perTVARate["10"];
                    add.perTVARate["20"] += command.total.perTVARate["20"];
                    add.perPaymentMethods.check += command.payment.methods.check;
                    add.perPaymentMethods.cash += command.payment.methods.cash;
                    add.perPaymentMethods.cash += command.payment.methods.transfer;

                    for (let product of command.products) {
                        if (typeof add.perCategories.get(product.category) === "undefined") {
                            add.perCategories.set(product.category, {
                                "5,5": 0,
                                "10": 0,
                                "20": 0
                            });
                        }
                        add.perCategories.get(product.category)[product.TVARate.toString().replace(".", ",")] += product.price * product.qts;
                    }
                }
            }
            add.HT = parseFloat(parseFloat(add.HT).toFixed(2));
            add.TTC = parseFloat(parseFloat(add.TTC).toFixed(2));
            add.perTVARate["5,5"] = parseFloat(parseFloat(add.perTVARate["5,5"]).toFixed(2));
            add.perTVARate["10"] = parseFloat(parseFloat(add.perTVARate["10"]).toFixed(2));
            add.perTVARate["20"] = parseFloat(parseFloat(add.perTVARate["20"]).toFixed(2));

            cb(add, commands);
        });
    }

    static getSalesPerProducts(from, to, cb) {
        var dateFrom = new Date(parseInt(from));
        var dateTo = new Date(parseInt(to));
        var search = {};
        if (typeof from === "number") {
            search = {
                $and: [
                    {timestamp: {$lte: to}},
                    {timestamp: {$gte: from}}
                ]
            }
        }
        commandDb.find(search, function (err, data) {

            let sales = {
                labels: [],
                values: []
            }
            for (let product of database.products) {
                sales.values.push({
                    product: product.itemId,
                    name: product.name,
                    soldQts: 0,
                    price: product.price,
                    sellMode: product.sellMode,
                    unit: product.unit
                });
                sales.labels.push(product.name);
            }
            for (let command of data) {
                for (let product of command.products) {
                    let productIndex = sales.labels.indexOf(product.name);
                    console.log(productIndex);
                    if (productIndex !== -1) {
                        sales.values[productIndex].soldQts += product.qts;
                    }
                }
            }
            cb(sales);
        });
        return true;
    }

    static getAccountingDetails(cb) {
        cashDrawerDb.find({}, function (err, data) {
            let accountDetails = {
                balance: 0,
                lastDeposit: [],
                operations: []
            }
            if (!err) {
                for (let operation of data) {
                    if (operation.operationType == "deposit") {
                        accountDetails.balance -= operation.amount;
                    } else {
                        accountDetails.balance += operation.amount;
                    }
                    accountDetails.operations.push(operation);
                }
                console.info("Details", accountDetails);
                cb(accountDetails);
            } else {
                console.error(err);
            }
        });
    }

}
