var fs = require('fs');

console.log("__dirname : ", __dirname);
var player = require(__dirname+'/app/player.js');
var btn_handler = require(__dirname+'/app/btn_handlers.js');
var fileWork = require(__dirname+'/app/file_access.js');

var currectViewName = "loading";
var views = {
    "loading": fs.readFileSync(__dirname+'/app/views/loading.html').toString(),
    "player": fs.readFileSync(__dirname+'/app/views/player.html').toString(),
    "playlist": fs.readFileSync(__dirname+'/app/views/playlist.html').toString(),
}

function changeView(viewName) {
    if (views[viewName]) {
        views[currectViewName] = document.getElementById("mp-body").innerHTML;
        document.getElementById("mp-body").innerHTML = views[viewName];
        currectViewName = viewName;

        switch (viewName) {
            case "loading":

                break;
            case "player":

                break;
            case "playlist":

                break;
        }
    }
    else
        console.log("view Not Found");
}

function makeList(path) {
    changeView('playlist');
    console.log(path);
    var filesList = fileWork.getListInDir(path);
    var html = "";
    for (var i in filesList) {
        html += '<tr> <th> <a class="waves-effect waves-light btn-large music_in_playlist" onclick="playMusic(`' + filesList[i].path.replace("\\", "/") + '`,' + i + ')">' + filesList[i].name + '</a><th></tr>\r\n';
    };

    document.getElementById("table-body").innerHTML = html;
}


changeView('player');