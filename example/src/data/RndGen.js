export default class RndGen {

    constructor(min, max, start, maxTrend, maxStep) {
        this.min = min;
        this.max = max;
        this.maxTrend = maxTrend;
        this.maxStep = maxStep;
        this.value = start || Math.random() * ((max - min)/2) + min;
        this.trendRem = 0;
    }

    /**
     * PRIVATE.  DO NOT USE.
     */
    _createTrend() {
        this.trendDir = Math.round(Math.random() * 2 - 1); // -1, 0, 1
        const trendWeight = this.trendDir === 0 ? 0.2 : 1;

        this.trendRem = Math.random() * this.maxTrend * trendWeight;
        this.momentum = Math.random();
    }

    next() {
        if (this.trendRem<=0) {
            this._createTrend();
        }
        const step = Math.random() * this.maxStep;
        this.trendRem -= step;
        this.value += step * this.trendDir * this.momentum;

        //cap at max and reverse trend
        if (this.value >=this.max) {
            this._createTrend();
            this.trendDir = -1;
            this.value -= step;
        }

        //cap at min and reverse trend
        if (this.value <=this.min) {
            this._createTrend();
            this.trendDir = 1;
            this.value += step;
        }

        return this.value;
    }
}