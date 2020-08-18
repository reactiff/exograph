const Pi2 = Math.PI * 2;

export default class Relay {
    
    history;

    constructor() {
        this.tickCallbacks = [];
        this.historyCallbacks = [];
    }

    setHistory(history) {
        this.history = history;
        if (this.historyCallbacks.length) {
            this.historyCallbacks.forEach(cb => cb(history));
            this.historyCallbacks = [];
        }
    }

    start() {}
    stop() {}
    
    tick = (data) => {
        if (this.tickCallbacks.length) {
            this.tickCallbacks.forEach(cb => cb(data));
        }
    }

    onTick(callback) {
        this.tickCallbacks.push(callback);
    }

    onHistory(callback) {
        if (this.history) {
            callback(this.history);
            return;
        }
        this.historyCallbacks.push(callback);
    }
}
