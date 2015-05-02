var config = module.exports;
var storage = require('node-persist');



config.init = function(){
     
        

    storage.initSync({
        dir:'./config/',
        stringify: JSON.stringify,
        parse: JSON.parse,
        encoding: 'utf8',
        logging: false,  // can also be custom logging function
        continuous: true,
        interval: false,
        ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS
    })
};

config.get = function(key, cb){
    storage.getItem(key, function(err, data){
        if (err){
            throw new Error("Unable to get value from config");
        } else {
            cb(data);
        }
    });
};

config.set = function (key, data, cb){
    storage.setItem(key, data, function(err) {
        if (err){
            throw new Error("Unable to get value from config");
        } else {
            cb();
        }
    });
}