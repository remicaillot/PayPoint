var md5 = require("MD5"),
    io = require("socket.io").listen(3546),
    nano = require("nano")("http://localhost:5984"),
    config = require("./config.json"),
    log = require("npmlog"),
    category = nano.use("category_paypoint"),
    products = nano.use("products_paypoint"),
    packages = nano.use("package_paypoint"),
    balance_sheet = nano.use("balance_sheet_paypoint");

function updateField(db, doc, field, value) {
    db.get(doc, {
        revs_info: true
    }, function(err, res) {
        var update = res;
        update[field] = value;
        db.insert(update, doc, function(err, res) {
            if (!err) return true;
        });
    });
}

function generateID(seed) {
    if (!seed) seed = 12;
    var ListeCar = new Array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9");
    var Chaine = '';
    for (i = 0; i < seed; i++) {
        Chaine = Chaine + ListeCar[Math.floor(Math.random() * ListeCar.length)];
    }
    return md5(Chaine);
}

function getCategory(cb) {
    var allCategory = new Array();
    var loop = 0;
    var loop = 0;
    var getResult = function(res, i) {
        allCategory.push(res);
        loop++;
        if (loop >= i) {
            return cb(allCategory);
        }
    };
    category.list(function(err, res) {
        var i = 0;
        while (i < res.rows.length) {
            category.get(res.rows[i].id, {
                revs_info: false
            }, function(err, doc) {
                category.attachment.get(doc._id, "thumb.png", function(err, body) {
                    var base64data = new Buffer(body).toString('base64');
                    doc.thumb = "data:image/png;base64," + base64data;
                    getResult(doc, res.rows.length);
                });
            });
            i++;
        }
    });
}

function getProducts(cb) {
    var allProducts = new Array();
    var loop = 0;
    var getResult = function(res, i) {
        allProducts.push(res);
        loop++;
        if (loop >= i) {
            return cb(allProducts);
        }
    };
    products.list(function(err, res) {
        var i = 0;
        while (i < res.rows.length) {
            products.get(res.rows[i].id, {
                revs_info: false
            }, function(err, doc) {
                products.attachment.get(doc._id, "thumb.png", function(err, body) {
                    var base64data = new Buffer(body).toString('base64');
                    doc.thumb = "data:image/png;base64," + base64data;
                    getResult(doc, res.rows.length);
                });
            });
            i++;
        }
    });
}

function getPackages(cb) {
    var allProducts = new Array();
    var loop = 0;
    var loop = 0;
    var getResult = function(res, i) {
        allProducts.push(res);
        loop++;
        if (loop >= i) {
            return cb(allProducts);
        }
    };
    packages.list(function(err, res) {
        var i = 0;
        while (i < res.rows.length) {
            packages.get(res.rows[i].id, {
                revs_info: false
            }, function(err, doc) {
                doc.type = "package";
                packages.attachment.get(doc._id, "thumb.png", function(err, body) {
                    var base64data = new Buffer(body).toString('base64');
                    doc.thumb = "data:image/png;base64," + base64data;
                    getResult(doc, res.rows.length);
                });
            });
            i++;
        }
    });
}

function init(cb) {
    getCategory(function(category) {
        getProducts(function(products) {
            var result = new Array();
            var catID = new Array();
            for (var i = 0; i < category.length; i++) {
                category[i].products = new Array();
                category[i].type = "category";
                result.push(category[i]);
                catID.push(category[i]._id);
                for (var j = 0; j < products.length; j++) {
                    products[j].type = "product";
                    if (products[j].category == category[i]._id) {
                        result[i].products.push(products[j]);
                    }
                }
            }
            for (var j = 0; j < products.length; j++) {
                var attributed = false;
                for (var i = 0; i < catID.length; i++) {
                    if (products[j].category == catID[i]) {
                        attributed = true;
                    }
                }
                if (attributed == false) {
                    result.push(products[j]);
                }
            }
            return cb(result);
        });
    });
}
io.on("connection", function(socket) {
    socket.on("init", function(data) {
        var room = generateID(58);
                log.heading = 'PayPoint';
                log.info('New POS Station number', room);
        getPackages(function(packages) {
            socket.join(room);
            init(function(initData) {
                io.sockets.in(room).emit('init', {
                    clientID: room,
                    homeItemList: initData,
                    packages: packages,
                    tvaRate: config.tvaRate
                });
                log.info('POS Station initialized correctly', initData);
            });
        });
    });
});
