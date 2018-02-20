console.log("inside File Access");

// const fs = require('fs');
const os = require('os');

const homeDir = os.homedir();
var platform = os.platform();

var appDataDir = (homeDir + "\\AppData\\local\\MP4152").replace(/\\/g, "/");
var listFilePath = (homeDir + "\\AppData\\local\\MP4152\\list.json").replace(/\\/g, "/");

if (platform == 'linux') {
    appDataDir = homeDir + "/Music/MP4152";
    listFilePath = homeDir + "/Music/MP4152/list.json";
}
var appDataDirExist = fs.existsSync(listFilePath);

if (!appDataDirExist) {

    if (platform != 'linux') {
        if (!fs.existsSync(homeDir + "\\AppData")) {
            fs.mkdirSync(homeDir + "\\AppData")
        }


        if (!fs.existsSync(homeDir + "\\AppData\\local")) {
            fs.mkdirSync(homeDir + "\\AppData\\local")
        }
    }
    else {
        if (!fs.existsSync(homeDir + "/Music")) {
            fs.mkdirSync(homeDir + "/Music")
        }
    }

    if (!fs.existsSync(appDataDir)) {
        fs.mkdirSync(appDataDir)
    }
    
    if (!fs.existsSync(listFilePath)) {
        console.log("Linux : ", platform, appDataDir, listFilePath);
        var state=fs.writeFileSync(listFilePath, JSON.stringify({ dir: "", list: [], last_list: [], lists: [] }));
        console.log("State : ",state);
    }
}
console.log(appDataDir);


var setting_lists = JSON.parse(fs.readFileSync(listFilePath).toString());

module.exports.getSettings = function () {
    return JSON.parse(fs.readFileSync(listFilePath).toString())
}

module.exports.getFilesList = function (path) {
    return fs.readdirSync(path);
}

module.exports.getListInDir = function (path) {
    if (fs.existsSync(path)) {
        setting_lists.dir = path;
        filesList = fs.readdirSync(path);

        var outfiles = [];
        filesList.forEach(function (element) {
            var parts = element.split(".");
            if (parts.length > 0 &&
                (parts[parts.length - 1] == 'mp3' ||
                    (parts[parts.length - 1] == 'MP3'))) {
                outfiles.push({
                    path: path + "/" + element,
                    name: element
                })
            }
        }, this);

        setting_lists["list"] = outfiles;
        fs.writeFileSync(listFilePath, JSON.stringify(setting_lists));
        return outfiles;
    }
    else {
        console.log("Bad Path!");
    }
}

module.exports.getPlayList = function () {
    return module.exports.getSettings().list;
}