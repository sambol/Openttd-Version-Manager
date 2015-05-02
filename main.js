var program = require('commander');
var config = require("./config");
var request = require('request');
var utils = require("./utils");
var runner = require("./runner");

config.init();
program
    .version('0.0.1')
    .option('-n, --nightly', 'Install Current Nightly')
    .option('-r, --release', 'Install Current Release')
    .option('-s, --specific', 'Install Specific Release')
    .option('-s, --start', 'Start Game')
    .option('-c, --config', 'Run config file')
    .option('-v, --version', 'Run specific version')
    .parse(process.argv);

    // config.set("versions", ["1.4.2", "1.4.1", "1.4.0", "r493"], console.log);
    
    if (program.nightly){
        request('http://finger.openttd.org/versions.txt', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var currentversion = body.split(/\r?\n/)[2].split(/\t/)[0];
                config.get("versions", function(versions){
                    // filter out nightly versions
                    versions = versions.filter(function(d){
                        console.log((d[0]=="r"));
                       return (d[0]=="r");
                    });
                    versions.sort();
                    versions.reverse()
                    var newestInstalled = versions[0];
                    if (utils.compareVersionIDs(newestInstalled, currentversion)){
                        runner.install("/nightlies/" + currentversion);
                    } else {
                        console.log("Installed Version is not newer than online version!");
                    }
                    
                });
                
            } else {
                throw new Error("Unable to reach openttd server");
            }
        });


    } else if (program.release){
        request('http://finger.openttd.org/versions.txt', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var currentversion = body.split(/\r?\n/)[0].split(/\t/)[0];
                config.get("versions", function(versions){
                    // filter out nightly versions
                    versions = versions.filter(function(d){
                       return (!(d[0]=="r"));
                    });
                    versions.sort();
                    versions.reverse()
                    var newestInstalled = versions[0];
                    
                    if (utils.compareVersionIDs(newestInstalled, currentversion)){
                        runner.install("/releases/" + currentversion);
                    } else {
                        console.log("Installed Version is not newer than online version!");
                    }
                    
                });
            
            } else {
                throw new Error("Unable to reach openttd server");
            }
        });

    } else if (program.specific){
        
    } else if (program.start){
        
    } else {
    // Launch console
        require("./console");
    }
    
    
    