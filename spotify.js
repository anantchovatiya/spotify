let currentSong = new Audio();

function convertSecondsToMinutesAndSeconds(seconds) {

    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs
}

const playmusic = (track) => {
    currentSong.src = "/songs/" + track;
    currentSong.play();
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}
async function main() {

    let songs = await getsongs();
    currentSong.src = "/songs/" + songs[0];
    document.querySelector(".songinfo").innerHTML = songs[0];
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="music.svg" class="invert" alt="">
        <div class="info">
            <div>${song.replaceAll("%20"," ")}</div>
        </div>
        <img src="play2.svg" class="invert" alt="">
    </li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playmusic(e.querySelector(".info>div").innerHTML.trim())
        })
    })

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg"
        } else {
            currentSong.pause();
            play.src = "play2.svg"
        }
    })
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutesAndSeconds(currentSong.currentTime)}/${convertSecondsToMinutesAndSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = ((currentSong.currentTime / currentSong.duration) * 100) + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let per = ((e.offsetX / e.target.getBoundingClientRect().width) * 100);
        document.querySelector(".circle").style.left = per + "%";
        currentSong.currentTime = (currentSong.duration * per) / 100;
    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = -110 + "%";
    })
}
main();