var inquirer = require("inquirer");
var config = require("./config");
var utils = require("./utils");
var runner = require("./runner");
var request = require('request');
var _ = require("underscore");

inquirer.prompt([
  {
    type: "list",
    name: "menu",
    message: "Main Menu",
    choices: [
      "1: Start Game",
      "2: Install new version",
    ]
  }], function( answers ) {
        switch(answers.menu.substr(0,1)){
            case "1":
                startGame();
                break;
            case "2":
                chooseInstallVersionType();
                break;
        }
});

function startGame(){
    config.get("versions", function(versions){
        versions = versions || ["No Versions Exist"];
        inquirer.prompt([{
            type: "list",
            name: "menu",
            message: "Please select version to launch",
            choices: versions
          }], function( answers ) {
              chooseGamestartConfig(answers.menu);
        });
    });


};

function chooseGamestartConfig(version){
    config.get("gameconfigs", function(gameconfigs){
        gameconfigs = gameconfigs || [];
        gameconfigs.unshift("Default");
        inquirer.prompt([{
            type: "list",
            name: "menu",
            message: "Please select version to launch",
            choices: gameconfigs
          }], function( answers ) {
              var gameconfig = answers.menu;
              runner.startGame(version, (gameconfig == "Default")?"Default": "./gameConfigs/" + gameconfig + ".cfg");
        });
    });


};

function chooseInstallVersionType(){
    inquirer.prompt([{
        type: "list",
        name: "menu",
        message: "Choose New Version Type",
        choices: [
          "Current Release",
          "Current Nightly",
          "Previous Releases",
        ]
      }], function( answers ) {
            switch(answers.menu){
                case "Current Release":
                    // check new version against previous version - http://finger.openttd.org/versions.txt
                    checkNewRelease();
                break;
                case "Current Nightly":
                    // check nightly version against previous version - http://finger.openttd.org/versions.txt
                    checkNightlyRelease();
                break;
                case "Previous Releases":
                    // show a list of previous versions - http://finger.openttd.org/branches.txt
                    showVersionList();
                break;
            }
    });
};

function checkNewRelease(){
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
                    inquirer.prompt([{
                        type: "confirm",
                        name: "confirm",
                        message: "Install version " + currentversion + "?",
                    }], function( answers ) {
                        if (answers.confirm){
                            runner.install("/releases/" + currentversion);
                        }
                    });
                } else {
                    console.log("Installed Version is not newer than online version!");
                }
                
            });
            
        } else {
            throw new Error("Unable to reach openttd server");
        }
    });

}


function checkNightlyRelease(){
    request('http://finger.openttd.org/versions.txt', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var currentversion = body.split(/\r?\n/)[2].split(/\t/)[0];
            config.get("versions", function(versions){
                // filter out nightly versions
                versions = versions.filter(function(d){
                   return (d[0]=="r");
                });
                versions.sort();
                versions.reverse()
                var newestInstalled = versions[0];
                if (utils.compareVersionIDs(newestInstalled, currentversion)){
                    inquirer.prompt([{
                        type: "confirm",
                        name: "confirm",
                        message: "Install version " + currentversion + "?",
                    }], function( answers ) {
                        if (answers.confirm){
                            runner.install("/nightlies/" + currentversion);
                        }
                    });
                } else {
                    console.log("Installed Version is not newer than online version!");
                }
                
            });
            
        } else {
            throw new Error("Unable to reach openttd server");
        }
    });

}
function showVersionList(){
    request('http://finger.openttd.org/tags.txt', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var versiondata = body.split(/\r?\n/);
            var versionlist = versiondata.map(function(item){
                return item.split(/\t/)[2]; 

            });
            config.get("versions", function(installedversions){
    
                // clear out the junk and installed versions
                versionlist = versionlist.filter(function(item){
                    return (item); 
                });
                // remove installed versions
                versionlist = _.difference(versionlist, installedversions);
                inquirer.prompt([{
                    type: "list",
                    name: "menu",
                    message: "Choose New Version Type",
                    choices: versionlist
                }], function( answers ) {
                    var installversion = answers.menu;
                    inquirer.prompt([{
                        type: "confirm",
                        name: "confirm",
                        message: "Install version " + installversion + "?",
                    }], function( answers ) {
                        if (answers.confirm){
                            runner.install("/releases/" + installversion);
                        }
                    });
                  });
            });
        } else {
            throw new Error("Unable to reach openttd server");
        }
    });

}
