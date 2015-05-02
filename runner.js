var runner = module.exports;


runner.startGame = function(version, config){
    console.log("Starting ottd " + version + ((config == "Default")?" with default config":" with config file " + config));
};

runner.install = function(installpath){
    console.log("Installing Openttd version " + installpath);
}