export default class Interval {
    constructor() {
        this._intervalId = 0
        this._step = 0
    }
    start(ms, callback) {
        this.stop()
        this._intervalId = setInterval(() => {
            callback ? callback(this._step) : ''
            this._step++
        }, ms)
    }
    resetStep() {
        this._step = 0
    }
    stop() {
        clearInterval(this._intervalId)
        this.resetStep()
    }
}
