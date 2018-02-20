console.log("Inside Query")


function play() {
    console.log("Play");
    if (document.getElementById("audio").src) {
        document.getElementById("audio").play();
        document.getElementById("play_btn").style.display = "none";
        document.getElementById("pause_btn").style.display = "block";
    }
    // document.getElementById("pause_btn").show();
}

function pause() {
    console.log("Pause");
    document.getElementById("audio").pause();
    document.getElementById("play_btn").style.display = "block";
    document.getElementById("pause_btn").style.display = "none";

}

function playControlls(type = "any") {
    switch (type) {
        case "play":
            console.log("Play");
            if (document.getElementById("audio").src) {
                document.getElementById("audio").play();
                document.getElementById("play_btn").style.display = "none";
                document.getElementById("pause_btn").style.display = "block";
            }
            break;
        case "pause":
            console.log("Pause");
            document.getElementById("audio").pause();
            document.getElementById("play_btn").style.display = "block";
            document.getElementById("pause_btn").style.display = "none";
            break;
        case "any":
            if (document.getElementById("audio").paused)
                playControlls("play");
            else
                playControlls("pause");
            break;
    }
}

function previews() {
    console.log("Pause");

}

function next() {
    console.log("Pause");

}

function playlist() {
    console.log("Playlist");
    // window.location.href = "./playlist.html";
    changeView('playlist');
}

function changeShuffle() {
    var off = document.getElementById("shuffel-off");
    var one = document.getElementById("shuffel-one");
    var all = document.getElementById("shuffel-all");
    var detile_shuffel = document.getElementById("detile_shuffel");


    if (off.style.display == "block") {
        off.style.display = "none";
        one.style.display = "block";
        detile_shuffel.innerHTML = "one";
        return;
    }

    if (one.style.display == "block") {
        one.style.display = "none";
        all.style.display = "block";
        detile_shuffel.innerHTML = "all";
        return;
    }

    if (all.style.display == "block") {
        all.style.display = "none";
        off.style.display = "block";
        detile_shuffel.innerHTML = "off";
        return;
    }

    return;
}