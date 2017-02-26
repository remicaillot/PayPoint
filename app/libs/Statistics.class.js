class Statistics {

    constructor() {

    }
    static exportLogs() {
        if (typeof $('input[type="daterange"]').data('dateRangePicker').getRange !== "undefined") {
            var doc = new jsPDF("p", "pt");
            doc.setProperties({
                title: 'Example: ',
                subject: 'A jspdf-autotable example pdf'
            });
            var selectedRange = $('input[type="daterange"]').data('dateRangePicker').getRange();
            var columns = [];
            var rows = [];
            for(let i = 0; i < database.categories.length; i++){
                columns.push({
                    title: database.categories[i].name,
                    dataKey: database.categories[i].itemid
                });
            }
            for(let i = 0; i < 1; i++){
                rows.push({})
                for(let y = 0; y < database.categories.length; y++){
                    Statistics.getSalesPerProducts(selectedRange.date1, selectedRange.date2, function(products){
                        Object.defineProperty(rows[i], database.categories[y].name, {
                            value: database.categories[y].name
                        });
                        console.log(products)
                    });

                }
            }

            doc.autoTable(columns, rows, {
                styles: {
                    fillColor: [100, 255, 255]
                },
                columnStyles: {
                    id: {
                        fillColor: 255
                    }
                },
                margin: {
                    top: 60
                },
                addPageContent: function (data) {
                    doc.text("Compte caisse " + moment().year(), data.settings.margin.left +data.table.width / 2, 40, null, null, "center");
                }
            });

            doc.save("test.pdf");

        } else {
            alert("Veuillez sélectionner une période");
        }

    }

    static getTotalSales(from, to, cb) {
        console.log("log beetween", from, "and", to);

        var dateFrom = new Date(parseInt(from));
        var dateTo = new Date(parseInt(to));
        var search = {};
        if(typeof from === "object"){
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
                    cash: 0
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
		console.log("commande traité");
		console.log(command);
                for(let product of command.products){
                	    if(typeof add.perCategories.get(product.category) === "undefined"){
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
            console.log("the real Add var", add);
            cb(add, commands);
        });
    }

    static getSalesPerProducts(from, to) {
        var dateFrom = new Date(from);
        var dateTo = new Date(to);
        commandDb.find({
            $and: [
                {timestamp: {$lte: dateTo.getTime()}},
                {timestamp: {$gte: dateFrom.getTime()}}
            ]

        }, function (err, data) {
            let sales = {
                labels: [],
                values: []
            }
            for (let product of database.products) {
                sales.values.push({
                    product: product.itemId,
                    name: product.name,
                    soldQts: 0,
                    price: product.price
                });
                sales.labels.push(product.name);
            }
            for (command of data) {
                for (product of command.products) {
                    let productIndex = sales.labels.indexOf(product.name);
                    console.log("index", productIndex);
                    if (productIndex !== -1) {
                        sales.values[productIndex].soldQts += product.qts;
                    }
                }
            }
            console.log(sales);
        });
        return true;
    }

    static getAccountingDetails(cb){
        cashDrawerDb.find({}, function (err, data) {
            let accountDetails = {
                balance: 0,
                perMonth: [],
                lastDeposit: null
            }
            if(!err){
                for (let operation of data) {
                    if(operation.operationType == "deposit"){
                        accountDetails.balance -= operation.amount;
                        accountDetails.lastDeposit = operation;
                    }else{
                        accountDetails.balance += operation.amount;
                    }
                }
                cb(accountDetails);
            }else{
                console.error(err);
            }
        });
    }

}
