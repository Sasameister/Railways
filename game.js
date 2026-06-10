import { Levels } from "./levels.js"
export class Game{
    constructor(tableDiv){
        this.tableDiv = tableDiv
    }

    play(row, col){
        this.currentMap[row][col].interact()
        this.#render()
        return this.#state(row, col)
    }

    initGame(level){
        this.maxTrackLength = this.countPlayableTiles(level)
        this.currentMap = level
        this.#render()
    }

    remove(row,col){
        this.currentMap[row][col].removeRail()
        this.#render()
    }


    #state(row, col){
        //console.log("previous neighbour:", this.currentMap[row][col].previousTile(col, row))
        //console.log("next neighbour:", this.currentMap[row][col].nextTile(col, row))
        let currentRow = row
        let currentCol = col
        let nextRow = row + this.currentMap[currentRow][currentCol].outgoingRow
        let nextCol = col + this.currentMap[currentRow][currentCol].outgoingCol
    
        let currLength = this.#check2(col, row, col, row, nextCol, nextRow, 1)
        //console.log(currLength)
        return this.maxTrackLength === currLength ? true : false
    }
    #checkBorders(row, col){
        return  this.currentMap[row] && this.currentMap[row][col]
    }
    #equalIndices(currX, currY, newX, newY){

        return currX === newX && currY === newY
    }

    #check2(startCol, startRow, col, row,  nextCol, nextRow, currentlength){
        if(!this.#checkBorders(nextRow, nextCol)) return currentlength - 1

        let cell = this.currentMap[nextRow][nextCol]

        if(!cell.hasRail) return currentlength - 1

        let previous = cell.previousTile(nextCol, nextRow)
        let next = cell.nextTile(nextCol, nextRow)

        if(this.#equalIndices(startCol, startRow, nextCol, nextRow)){
            if(this.#equalIndices(col,row, previous[0], previous[1]) 
                || this.#equalIndices(col,row, next[0], next[1])){
                return currentlength
            }else{
                return currentlength - 1
            }
        } 
            
        if(this.#equalIndices(col,row, previous[0], previous[1])){
            return this.#check2(startCol, startRow, nextCol, nextRow, next[0], next[1], currentlength + 1)
        } 
        else if(this.#equalIndices(col,row, next[0], next[1])){
            return this.#check2(startCol, startRow, nextCol, nextRow, previous[0], previous[1], currentlength + 1)
        }
        
        return currentlength - 1
    }

    #render(){
        this.tableDiv.innerHTML = ""
        let table = document.createElement("table")
        for(let i = 0; i < this.currentMap.length; ++i){
            let row = table.insertRow()
            for(let j = 0; j < this.currentMap.length; ++j){
                let column = row.insertCell()
                let tile = this.currentMap[i][j]
                //let image = document.createElement("img")
                let image = tile.tileImg.cloneNode(false)
                image.style.transform = `rotate(${tile.rotatedBy}deg)`
                column.appendChild(image)
            }
        }
        this.tableDiv.appendChild(table)
    }

    save(){
        return JSON.stringify(this.currentMap)
    }
    load(jsonObject){
        let level = jsonObject.map(row => row.map(col => Levels.load(col)))
        //let level = jsonObject.map(row => row.map(tileObj => console.log(tileObj)))
        //console.log(level)
        this.initGame(level)
    }

    countPlayableTiles(level){
        let count = level.length * level.length
        level.forEach(row => row.forEach(e => {
            if(e.incomingCol === 0 &&
                e.incomingRow === 0 &&
                e.outgoingCol === 0 &&
                e.outgoingRow === 0
            ) count --
        }))
        return count
    }

}
