export class Timer {

    minutes = 0
    seconds = 0
    id      = 0   

    render(){
        return `${this.minutes}:${String(this.seconds).padStart(2,"0")}`
    }

    increase(){
        if(this.seconds + 1 == 60){
            this.seconds = 0
            this.minutes ++
        }else{
            this.seconds ++
        }
    }

    tick(){
        this.increase()
        return this.render()
    }

    stop(){
        clearInterval(this.id)
    }
    start(element){
        if(this.id == 0) this.stop()
        this.id = setInterval(() => {
            element.innerText = this.tick()
        }, 1000)
    }
    save(){
        return String(this.minutes * 60 + this.seconds)
    }
    load(time, element){
        this.minutes = Math.trunc(time / 60)
        this.seconds = time % 60
        this.start(element)
    }
    clear(){
        this.minutes = 0;
        this.seconds = 0;
    }
}