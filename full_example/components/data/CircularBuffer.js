export default class CircularBuffer {
    
    constructor(length) {
        this.array = new Array(length).fill(null);
        this.cursor = 0;
    }

    write(callback) {
        // create a reusable holder object (if one doesn't exist)
        if(!this.array[this.cursor]) {
            this.array[this.cursor] = {}; 
        }
        callback(this.cursor, this.array);
        this.cursor++;
        if (this.cursor === this.array.length) {
            this.cursor = 0;
        }
    }

    stitch() {
        // creates a new array of equal length, 
        // consistent of one or two slices (at most), first being from current index to end,
        // with second starting at 0 index, upto but not including the current cursor position,
        // thus straightening out the circular loop.

        const first = this.array.slice(this.cursor); 
        const second = this.cursor > 0 ? this.array.slice(0, this.cursor) : [];

        return first.concat(second);
    }
}