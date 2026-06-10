export class LeaderBoard {
    players = []

    addPlayer(name, time) {
        time = parseInt(time)
        let index = this.findPlayer(name)
        if (index !== -1) {
            if (this.players[index][1] < time){
                return
            }else{
                this.players[index][1] = time
            }
        } else {
            let newPlayer = []
            newPlayer.push(name)
            newPlayer.push(time)
            this.players.push(newPlayer)
            this.sortPlayers()
        }
    }

    sortPlayers() {
        this.players.sort((a, b) => {
            return a[1] - b[1]
        })
    }

    findPlayer(name) {
        for (let i = 0; i < this.players.length; ++i) {
            if (this.players[i][0] === name) {
                return i
            }
        }
        return -1
    }
    render() {
        return this.players.map(player =>
            `<tr>
                <th scope="row"/th>${player[0]}</th>
                <td>${this.convert(player[1])}</td>
            </tr>`).join("")
    }
    convert(time) {
        return `${Math.trunc(time / 60)}:${String(time % 60).padStart(2, "0")}`
    }

}

