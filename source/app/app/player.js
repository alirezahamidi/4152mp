console.log("Inside Rendrer!");
var musicMeta = require('musicmetadata');
var notPlayTimeout;

function playMusic(path, index) {
    clearTimeout(notPlayTimeout);

    document.getElementById("audio").pause();
    changeView('player');

    var name = path.split("/")[path.split("/").length - 1];
    var nameSplites = name.split('.');
    var noFormatName;

    if (nameSplites.length >= 2) {
        delete nameSplites[nameSplites.length - 1];
        noFormatName = nameSplites.join('');
    }
    else {
        nameSplites.splice(noFormatName.length - 1, 1);
        noFormatName = nameSplites.join();
    }

    document.getElementById('audio').src = path;
    document.getElementById('mp-header').innerText = noFormatName.split("-")[0];
    document.getElementById('mp-desc').innerText = noFormatName.split("-")[1];

    var player = document.getElementById('audio');
    player.addEventListener("timeupdate", function () {
        if (!document.getElementById("timeleft") || document.getElementById("progressbar_range"))
            return;

        var currentTime = player.currentTime;
        var duration = player.duration;

        if (currentTime >= duration) {
            return playNextMusic()
        }

        var time = "";
        if (Math.round(currentTime) >= 60) {
            if ((Math.round(currentTime) / 60 + "").length > 1) {
                time += "" + Math.round(currentTime / 60) + ":" + (((Math.round(currentTime % 60) + "").length == 2) ? (Math.round(currentTime % 60) + "") : ("0" + Math.round(currentTime % 60)));
            }
            else
                time += "0" + Math.round(currentTime / 60) + ":" + (((Math.round(currentTime % 60) + "").length == 2) ? (Math.round(currentTime % 60) + "") : ("0" + Math.round(currentTime % 60)));
        } else {
            time = "00:" + (((Math.round(currentTime % 60) + "").length == 2) ? (Math.round(currentTime % 60) + "") : ("0" + Math.round(currentTime % 60)));
        }

        document.getElementById("timeleft").innerText = time;
        $('.progressbar_range').stop(true, true).animate({ 'width': (currentTime + .25) / duration * 100 + '%' }, 250, 'linear');
    });
    document.getElementById("detile_index").innerText = index;

    setTimeout(function () {
        play();
        notPlayTimeout = setTimeout(function () {
            if (player.currentTime < 1) {
                return playNextMusic();
            }
        }, 2500);
    }, 1000);
    var parser = musicMeta(fs.createReadStream(path), function (err, metadata) {
        if (err)
            return;
        else if (metadata && metadata.picture && metadata.picture.length > 0 && metadata.picture[0].data)
            document.getElementById("cover-art").src = "data:image/png;base64," + metadata.picture[0].data.toString("base64");
    });

}

function playNextMusic() {
    var shuffle_state = document.getElementById("detile_shuffel").innerHTML;
    console.log(shuffle_state)
    var list = fileWork.getPlayList();
    var index = parseInt(document.getElementById("detile_index").innerText);

    if (shuffle_state == "one") {
        document.getElementById("audio").pause();
        playMusic(list[index].path, index)
    }


    if (index + 1 < list.length) {
        document.getElementById("audio").pause();
        playMusic(list[index + 1].path, index + 1)
    }
    else {
        if (shuffle_state == "all") {
            document.getElementById("audio").pause();
            playMusic(list[0].path, 0)
        }
    }
}

function playPrevMusic() {
    var list = fileWork.getPlayList();
    var currectTime = document.getElementById('audio').currentTime;

    if (currectTime < 3) {
        var index = parseInt(document.getElementById("detile_index").innerText);
        if (index - 1 >= 0) {
            document.getElementById("audio").pause();
            playMusic(list[index - 1].path, index - 1)
        }
    } else {
        document.getElementById('audio').currentTime = 0;
    }
}

module.exports.playMusic = function (path, index) {
    document.getElementById("audio").pause();
    changeView('player');

    var name = path.split("/")[path.split("/").length - 1];
    var nameSplites = name.split('.');
    var noFormatName;

    if (nameSplites.length == 2) {
        noFormatName = nameSplites[0];
    }
    else {
        nameSplites.splice(noFormatName.length - 1, 1);
        noFormatName = nameSplites.join();
    }

    document.getElementById('audio').src = path;
    document.getElementById('mp-header').innerText = noFormatName.split("-")[0];
    document.getElementById('mp-desc').innerText = noFormatName.split("-")[1];

    var player = document.getElementById('audio');
    player.addEventListener("timeupdate", function () {
        if (!document.getElementById("timeleft") || document.getElementById("progressbar_range"))
            return;

        var currentTime = player.currentTime;
        var duration = player.duration;

        if (currentTime >= duration) {
            return playNextMusic()
        }

        var time = "";
        if (Math.round(currentTime) >= 60) {
            if ((Math.round(currentTime) / 60 + "").length > 1) {
                time += "" + Math.round(currentTime / 60) + ":" + (((Math.round(currentTime % 60) + "").length == 2) ? (Math.round(currentTime % 60) + "") : ("0" + Math.round(currentTime % 60)));
            }
            else
                time += "0" + Math.round(currentTime / 60) + ":" + (((Math.round(currentTime % 60) + "").length == 2) ? (Math.round(currentTime % 60) + "") : ("0" + Math.round(currentTime % 60)));
        } else {
            time = "00:" + (((Math.round(currentTime % 60) + "").length == 2) ? (Math.round(currentTime % 60) + "") : ("0" + Math.round(currentTime % 60)));
        }

        document.getElementById("timeleft").innerText = time;
        $('.progressbar_range').stop(true, true).animate({ 'width': (currentTime + .25) / duration * 100 + '%' }, 250, 'linear');
    });
    document.getElementById("detile_index").innerText = index;

    setTimeout(function () {
        play();
    }, 1000);
    var parser = musicMeta(fs.createReadStream(path), function (err, metadata) {
        if (err)
            return;
        document.getElementById("cover-art").src = "data:image/png;base64," + metadata.picture[0].data.toString("base64");
    });
}

module.exports.playNextMusic = function () {
    var list = fileWork.getPlayList();
    var index = parseInt(document.getElementById("detile_index").innerText);
    if (index + 1 < list.length) {
        document.getElementById("audio").pause();
        playMusic(list[index + 1].path, index + 1)
    }
}

module.exports.playPrevMusic = function () {
    var list = fileWork.getPlayList();
    var currectTime = document.getElementById('audio').currentTime;

    if (currectTime < 3) {
        var index = parseInt(document.getElementById("detile_index").innerText);
        if (index - 1 >= 0) {
            document.getElementById("audio").pause();
            playMusic(list[index - 1].path, index - 1)
        }
    } else {
        document.getElementById('audio').currentTime = 0;
    }
}

/* var shuffle_state = document.getElementById("detile_shuffel").innerHTML;
    console.log(shuffle_state)
    var list = fileWork.getPlayList();
    var index = parseInt(document.getElementById("detile_index").innerText);

    if (shuffle_state == "one") {
        document.getElementById("audio").pause();
        playMusic(list[index].path, index)
    }


    if (index + 1 < list.length) {
        document.getElementById("audio").pause();
        playMusic(list[index + 1].path, index + 1)
    }
    else {
        if (shuffle_state == "all") {
            document.getElementById("audio").pause();
            playMusic(list[0].path, 0)
        }
    } */