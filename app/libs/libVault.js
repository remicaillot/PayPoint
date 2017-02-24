const crypto = require('crypto');

class UUID {
    static generate() {
        var d = new Date().getTime();
        if(typeof global === "undefined"){
            var global = window;
        }
        if(global.performance && typeof global.performance.now === "function"){
            d += performance.now(); //use high-precision timer if available
        }
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
    }
}
class Event {
    constructor() {
        this.eventListeners = new Map();
    }

    on(eventName, action) {
        var eventIdentifier = UUID.generate();
        if (typeof action === "function") {
            this.eventListeners.set(eventName, new Map());
            this.eventListeners.get(eventName).set(eventIdentifier, action);
        }
        return eventIdentifier;
    }

    trigger(eventName, params) {
        this.eventListeners.get(eventName).forEach(function (value, key, map) {
            value.apply(this, params);
        });
    }

    unbind(eventName, eventIdentifier) {
        try {
            this.eventListeners.get(eventName).delete(eventIdentifier);
            return false;
        } catch (err) {
            return err;
        }
    }
}


class Vault extends Event {
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    static hasher(content, secret) {
        return crypto.createHash('sha256').update(content).digest("hex")
    }

    constructor() {
        super();
    }

    setSecret(secret, cb){
        this.secret = secret;
        console.log("secret", secret);
        if (secret == null) {
            sessionStorage.setItem("secret", Vault.hasher("Lead" + Vault.random(10000, 500000)));
            this.secret = sessionStorage.getItem("secret");
            console.log("Vault first run");
            this.trigger("firstRun", []);
        }
        cb();
    }

    lockFile(path) {
        var origin = fs.readFileSync(path, "UTF-8");
        var hash = Vault.hasher(origin + this.secret);
        fs.writeFile(path + ".locker", hash, "UTF-8", function (err, success) {
            console.log("Locker created");
        });
    }

    checkLock(path, cbSuccess) {
        var origin = fs.readFileSync(path, "UTF-8");
        fs.readFile(path + ".locker", "UTF-8", (err, lockFile) => {
            if (err) {
                console.error("File not locked")
            } else {
                if (Vault.hasher(origin + this.secret) == lockFile) {
                    cbSuccess(true);
                } else {
                    cbSuccess(false);
                }
            }

        });
    }

}
