import { Timer } from "./timer.js"
import { Levels } from "./levels.js"
import { Game } from "./game.js"
//Szabó Máté Benedek /FVGUM1
/*display*/
const btn = document.querySelector("#man")
const man = document.querySelector("#man-wrap")
const close = document.querySelector("#close")
const pname = document.querySelector("#name")
const difficulties = document.querySelector("#difficulties")
const start = document.querySelector("#start")
const main = document.querySelector("main")
const game = document.querySelector("#game")
const tableDiv = document.querySelector("#game #tab")
const currentPlayer = document.querySelector("#pname")
const time = document.querySelector("#ptime")
let currGame = new Game(tableDiv)
let maps = new Levels()
let timer = new Timer()
const won = document.querySelector("#won")
const saveBtn = document.querySelector("#save")
const againBtn = document.querySelector("#againBtn")
const anotherBtn = document.querySelector("#anotherBtn")

//lehetovi teszi hogy a nehezseget, ugy is ki lehessen valasztani hogy a tabla meretet jelzo mezore kattintunk
difficulties.addEventListener("click", e => {
    if (e.target.matches(".difficulty .game-button")) {
        let p = e.target.parentNode
        let choosen = p.querySelector(".diff_radio")
        choosen.checked = true
    }
})

//játékos neve nem lehet üres
pname.addEventListener("keyup", () => {
    if (pname.value === "") {
        start.disabled = true
    } else {
        start.disabled = false

    }
})

//leiras megjeleneitese
btn.addEventListener("click", () => {
    man.style.display = "flex"
})

//leiras bezarasa
close.addEventListener("click", () => man.style.display = "none")

//sin torlese
tableDiv.addEventListener("contextmenu", removeRail)

tableDiv.addEventListener("click", selectTile)

//saveBtn.addEventListener("click", s)

start.addEventListener("click", () => {
    // 1. Simple function to turn dangerous HTML characters into harmless text
    const escapeHTML = (str) => {
        return str.replace(/[&<>"']/g, (match) => {
            const escapeMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return escapeMap[match];
        });
    };

    // 2. Escape the player's input immediately
    const safeName = escapeHTML(pname.value.trim());

    // 3. Use the safe name for the game session
    currentPlayer.textContent = safeName;
    switchToGame();
    
    const selected = document.querySelector(".diff_radio:checked");
    const diffValue = selected.value;
    let lev = maps.choose(diffValue);
    currGame.initGame(lev);
    timer.start(time);
});

saveBtn.addEventListener("click", save)

againBtn.addEventListener("click", () => {
    clearGameBoard()
    currGame.initGame(maps.restart());
})

anotherBtn.addEventListener("click", () => {
    clearGameBoard()
    currGame.initGame(maps.next())

})
function clearGameBoard(){
    timer.clear()
    timer.start(time)
    tableDiv.addEventListener("click", selectTile)
    tableDiv.addEventListener("contextmenu", removeRail)
    won.style.display = "none"
    saveBtn.hidden = false
    saveBtn.disabled = false

}

function switchToGame() {
    main.style.display = "none"
    game.style.display = "flex"
}

function selectTile(e) {
    if (!e.target.matches("img")) return

    const row = e.target.closest("tr").rowIndex
    const cell = e.target.closest("td").cellIndex
    if (currGame.play(row, cell)) {
        gameWon()
    }
}

function removeRail(e) {
    e.preventDefault()
    if (!e.target.matches("img")) return
    const row = e.target.closest("tr").rowIndex
    const cell = e.target.closest("td").cellIndex
    currGame.remove(row, cell)
}

function gameWon() {
    removeGameEvents()
    const totalTime = document.querySelector("#won #pb")
    totalTime.innerText = timer.render()
    console.log(totalTime.innerText)
    addLeaderBoard()
    won.style.display = "flex"
}

function removeGameEvents() {
    timer.stop()
    tableDiv.removeEventListener("click", selectTile)
    tableDiv.removeEventListener("contextmenu", removeRail)
    saveBtn.disabled = true
    saveBtn.hidden = true
}

function addLeaderBoard() {
    const leaderboard = document.querySelector("#leaderbody")
    maps.addToLeaderBoard(currentPlayer.textContent, timer.save())
    leaderboard.innerHTML = maps.showLeaderBoard()


}

function save() {
    setCookie("name", currentPlayer.textContent)
    setCookie("time", timer.save())
    setCookie("state", currGame.save())
    setCookie("savedLevel", maps.save())
}


function setCookie(name, value) {
    document.cookie = `${name}=${value}`


}
function getCookie(name) {
    const cookies = document.cookie.split("; ")
    for (let i = 0; i < cookies.length; ++i) {
        if (cookies[i].startsWith(name))
            return cookies[i].substring(name.length + 1);
    }
}


if (document.cookie) {
    load()
}

function load() {
    switchToGame()
    currentPlayer.textContent = getCookie("name")
    timer.load(parseInt(getCookie("time")), time)
    let state = JSON.parse(getCookie("state"))
    currGame.load(state)
    maps.loadCurrent(JSON.parse(getCookie("savedLevel")))
    //console.log(currGame.currentMap)

}

