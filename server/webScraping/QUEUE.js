class httpQueue {
    constructor() {
        this.running = false;
        this.queue = [];
        this.previousValue = undefined;
        this.timer = 0;
    }

    add({func, args, wait}) {

        this.queue.push({func, args, wait});

        if(!this.running){
            console.log(`START: httpQueue`)
            this.timer = new Date();
            this.dequeue()
        }
    }

    dequeue() {
        console.log(` In Queue : ${this.queue.length}`);
        this.running = this.queue.shift();

        if(!this.running){
            console.log("   STOP: httpQueue");
            return
        }
        Meteor.bindEnvironment(this.running.func(this.running.args))
        Meteor.setTimeout(()=>{
                this.dequeue()
            },
            this.running.wait ? this.running.wait : 0)
    }

    get next() {
        return this.dequeue;
    }
}

webScrapingQueue = new httpQueue();