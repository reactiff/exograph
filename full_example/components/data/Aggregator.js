import CircularBuffer from "./CircularBuffer";

/**
 * Listens to data events from multiple datasources and consolidates them into a single data set.
 */
export default class Aggregator {

    /**
     * 
     * @param { setData: function, createDataPoint(): function } options 
     */
    constructor(options) {
        Object.assign(this, options);
        this.buffer = new CircularBuffer(this.bufferLength);
        this.data = {};
        this.datasources = {};
    }

    /**
     * Private, do not use.
     * Creates a new datapoint at the current instant, with latest values from each datasource as properties, and emits data to GraphNode through setData callback.
     */
    writeData() {
        this.buffer.write((index, array) => {
            const dp = this.createDataPoint(this.data);
            for (let key in dp) {
                array[index][key] = dp[key];
            }
        });

        const data = this.projectData(this.buffer.stitch());
        this.setData(data);
    } 


    /**
     * Registers a unique (must have name prop) datasource which fires an event when new data is available
     * @param {string} key - A unique name or alias for the datasource
     * @param {object} datasource - An eventful datasource
     * @param {function} subscribe - A function which subscribes to a data event with a callback to receive(scalar) e.g. (ds, receive) => ds.onData(receive) 
     */
    addDatasource(key, datasource, subscribe) {

        subscribe(datasource, (scalar) => {
            this.data[scalar.key] = scalar.value;
            window.requestAnimationFrame(() => this.writeData());
        });

        this.datasources[key] = datasource;

        // TODO: Implement a way to remove datasources and unsubscribe
    }
    
}