import { loadedImages } from "./helpers.js"

const matrix = [[0, -1], [1, 0]]

export class Tile {
    /*paraméterek:
        incomingCol, incomingRow: bemenő koordináta páros
        outgoingCol, outgoingRow: kimenő koordináta páros
          --azt mondja meg, hogy milyen irányból jöhet, illetve mehet sín
        --mennyivel kell elforgatni az adott mezőt
        hasRail: van-e a mezőn sín
        rotatedBy: milyen nagyságú szöggel van elforgatva
        id: adott típusú mező azonosítója
    */
    constructor(incomingCol, incomingRow, outgoingCol, outgoingRow, hasRail, rotatedBy, id) {
        this.id = id
        this.rotatedBy = 0
        this.hasRail = hasRail
        this.incomingCol = incomingCol
        this.incomingRow = incomingRow
        this.outgoingCol = outgoingCol
        this.outgoingRow = outgoingRow
        this.rotateTile(rotatedBy)
    }
    rotateTile(degree) {

        this.rotatedBy += degree
        if (this.rotatedBy > 360) this.rotatedBy = 0
        //only works with 90 degrees
        while (degree > 0) {
            let newIncoming = this.calculatePosition(this.incomingCol, this.incomingRow)
            let newOutgoing = this.calculatePosition(this.outgoingCol, this.outgoingRow)
            this.incomingCol = newIncoming[0]
            this.incomingRow = newIncoming[1]
            this.outgoingCol = newOutgoing[0]
            this.outgoingRow = newOutgoing[1]
            degree -= 90
        }

    }
    //megadja, a forgatás utáni koordinátákat
    calculatePosition(x, y) {
        let newCol = matrix[0][0] * x + matrix[0][1] * y
        let newRow = matrix[1][0] * x + matrix[1][1] * y
        return [newCol, newRow]
    }
    placeRail() {
        this.hasRail = true
    }
    removeRail() {
        if (this.hasRail) this.hasRail = false

    }
    rotateRail() {
        return
    }
    switchRail() {
        return
    }
    get tileImg() {
        if (this.hasRail) {
            return this.railUrl
        }
        return this.emptyUrl
    }

    interact() {
        this.hasRail ? this.rotateRail() : this.placeRail()
    }
    //visszaadja az adott mezot megelozo mezo indexeit
    previousTile(x, y) {
        return [x + this.incomingCol, y + this.incomingRow]
    }
    //visszaadja az adott mezore rakovetkezo mezo indexeit
    nextTile(x, y) {
        return [x + this.outgoingCol, y + this.outgoingRow]
    }

    stringify() {
        return JSON.stringify(this, ["incomingCol", "incomingRow", "outgoingCol", "outgoingRow"])
    }
    toJSON() {
        return { "id": this.id, "hasRail": this.hasRail, "rotatedBy": this.rotatedBy }
    }

}
export class Empty extends Tile {
    constructor(hasRail, rotatedBy, switched) {
        if (switched) {
            super(0, 1, 1, 0, hasRail, rotatedBy, 0)
        } else {
            super(0, 1, 0, -1, hasRail, rotatedBy, 0)
        }
        this.switched = switched
    }
    removeRail() {
        if (this.hasRail) {
            this.reset()
            this.hasRail = false
        }
    }
    rotateRail() {
        if (!this.hasRail) return

        const rotateAmount = 90
        if (!this.switched && this.rotatedBy !== 0) this.switchRail()
        else {
            this.rotateTile(rotateAmount)
            if (this.rotatedBy + rotateAmount > 360) this.switchRail()
        }
    }
    switchRail() {
        if (this.hasRail) {
            this.switched ? this.reset() : this.curve()
        }
    }

    get tileImg() {
        if (this.hasRail) {
            return this.switched ? loadedImages[5] : loadedImages[4]
        }
        return loadedImages[0]
    }
    curve() {
        this.switched = true
        this.rotatedBy = 0
        this.incomingCol = 0
        this.incomingRow = 1
        this.outgoingCol = 1
        this.outgoingRow = 0
    }
    reset() {
        this.switched = false
        this.rotatedBy = 0
        this.incomingCol = 0
        this.incomingRow = 1
        this.outgoingCol = 0
        this.outgoingRow = -1
    }
    toJSON() {
        return { "id": this.id, "hasRail": this.hasRail, "rotatedBy": this.rotatedBy, "switched": this.switched }
    }

}
export class Bridge extends Tile {
    constructor(hasRail, rotatedBy) {
        super(0, 1, 0, -1, hasRail, rotatedBy, 1)
    }
    get tileImg() {
        if (this.hasRail) {
            return loadedImages[6]
        }
        return loadedImages[1]
    }
}

export class Mountain extends Tile {
    constructor(hasRail, rotatedBy) {
        super(0, 1, 1, 0, hasRail, rotatedBy, 3)
    }
    get tileImg() {
        if (this.hasRail) {
            return loadedImages[7]
        }
        return loadedImages[2]
    }
}

export class Oasis extends Tile {
    constructor() {
        super(0, 0, 0, 0, false, 0, 7)
    }
    placeRail() {
        return
    }
    get tileImg() {
        return loadedImages[3]
    }
}