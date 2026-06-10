import { tables } from "./helpers.js"
import { LeaderBoard } from "./leaderBoard.js"
import { Empty, Bridge, Mountain, Oasis} from "./tile.js"

export class Levels{

    currDifficulty
    currIndex
    //minden palyahoz tartozik egy ranglista is
    levels = {"5": [], "7": []}
    constructor(){
        for (const difficulty in this.levels )
        this.levels[difficulty] = tables[difficulty].map(level => ({"level": level, "LeaderBoard": new LeaderBoard()}))
    }
    //kivalaszt egy palyat a megadott nehezseg es index alapjan es fel is dolgozza
    select(difficulty, index){
        this.currDifficulty = difficulty
        this.currIndex = index
        return this.levels[difficulty][index].level.map((row) => row.map((id) => Levels.getTileType(id)))
    }
    //kivalaszt egy random palyat a megadott nehezseg alapjan
    choose(difficulty){
        const randomInt = Math.trunc(Math.random() * this.levels[difficulty].length);
        return this.select(difficulty, randomInt)
    }
    //adott palyat ujrainditja
    restart(){
        return this.select(this.currDifficulty, this.currIndex)
    }
    //a megadott nehezseg alapjan kivalaszt egy uj palyat, lehet hogy pont az elozot valasztja
    next(){
        return this.choose(this.currDifficulty)
    }
    addToLeaderBoard(name, time){

        const currentScoreBoard =  this.levels[this.currDifficulty][this.currIndex].LeaderBoard

        let leaderboards = localStorage.getItem("leaderBoards")

        if(!leaderboards){
            localStorage.setItem("leaderBoards", JSON.stringify({"5": {}, "7":{}}))
        }
        leaderboards = JSON.parse(localStorage.getItem("leaderBoards"))
        let loadedScoreBoard = leaderboards[this.currDifficulty][String(this.currIndex)]
        if(loadedScoreBoard){
            //eddigi játékosok hozzáadása
            loadedScoreBoard["players"].forEach(player => currentScoreBoard.addPlayer(player[0],player[1]))
        }
        //jelenlegi játékos hozzáadása
            currentScoreBoard.addPlayer(name,time)

        //uj leaderboard mentese
        leaderboards[this.currDifficulty][String(this.currIndex)] = currentScoreBoard
        let teszt = JSON.stringify(leaderboards)
        localStorage.setItem("leaderBoards", JSON.stringify(leaderboards))
    }
    showLeaderBoard(){
        return this.levels[this.currDifficulty][this.currIndex].LeaderBoard.render()
    }
    toJSON(){
        return {"difficulty": this.currDifficulty, "index": this.currIndex}
    }
    save(){
        return JSON.stringify(this)
    }
    loadCurrent(obj){
        this.currDifficulty = obj["difficulty"]
        this.currIndex = parseInt(obj["index"])
    }

    static getTileType(number){
        switch(number){
            case 1:
                return new Bridge(false, 0)
            case 2:
                return new Bridge(false, 90)
            case 3:
                return new Mountain(false, 90)
            case 4:
                return new Mountain(false, 180)
            case 5:
                return new Mountain(false, 270)
            case 6:
                return new Mountain(false, 0)
            case 7:
                return new Oasis()
            default:
                return new Empty(false, 0, false)
        }
    }
    static load(obj){
        switch(obj.id){
            case 1:
                return new Bridge(obj.hasRail, obj.rotatedBy)
            case 2:
                return new Bridge(obj.hasRail, obj.rotatedBy)
            case 3:
                return new Mountain(obj.hasRail, obj.rotatedBy)
            case 4:
                return new Mountain(obj.hasRail, obj.rotatedBy)
            case 5:
                return new Mountain(obj.hasRail, obj.rotatedBy)
            case 6:
                return new Mountain(obj.hasRail, obj.rotatedBy)
            case 7:
                return new Oasis()
            default:
                return new Empty(obj.hasRail, obj.rotatedBy, obj.switched)
        }
    }

}



