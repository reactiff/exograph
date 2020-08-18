import React from 'react';
import xo from 'exograph';

import Gauge from './Gauge';
import LineChart from './LineChart';

import initDataAggregator from '../data/initDataAggregator';

import gaugeIcon from './Gauge/gauge.png'; 
import stat from '../data/statistical';
import { camelToSentenceCase } from '../util/string';

export default () => (
    <div className="flex wrap padded">

        <xo.GraphNode 
            menuItem
            id="lineChart" 
            name="LineChart" 
            allowDrag={false}
            allowDrop={true} 
            placeholder={<LineChartIcon />}
            classesForElement={(props) => {
                const classes = ['widget'];
                if (props.siblings === 0) classes.push('fill'); 
                if (props.siblings > 0) classes.push('grow'); 
                return classes;
            }}
            render={(props, ref) => {
                const { data, graphContext, parent, siblings, children, datasources, scope, setData, ...other } = props;
                initDataAggregator(props);
                return LineChart({...other, data: data.timeseries, children }, ref);
            }} 
            meta={{
                type: 'widget.lineChart',
                accept: [ 'data.source' ],
            }}
        />

        <xo.GraphNode 
            menuItem
            id="gauge" 
            name="Gauge" 
            allowDrag={false}
            allowDrop={true} 
            placeholder={<GaugeIcon />}
            classesForElement={(props) => {
                const classes = ['widget', 'flex', 'cell'];
                if (props.siblings === 0) classes.push('fill'); 
                if (props.siblings > 0) classes.push('grow'); 
                return classes;
            }}
            render={renderGauge} 
            meta={{
                type: 'widget.gauge',
                accept: [ 'data.source' ],
                maxChildren: 1,
            }}
        />

    </div>
)


const LineChartIcon = (props) => {
    return <div className="relative placeholder hover-highlight"> 
        <div className="fill canvas flex align-center" style={{fontSize: '80pt'}}>
            &#8605;
        </div>
    </div>
}

// The idea is to create a label value which is nice and round without losing granularity for the given range
const roundRangeValue = (value, range) => {
    let divisor;
    for (let power = -10; power < 12; power++) {
        if (range < 10 ** power) {
            divisor = 10 ** (power - 2);
            break;
        }
    }
    const rem = value % divisor;
    return value - rem;
}


// Gauge
const renderGauge = (props, ref) => {
                
    const { data, graphContext, parent, siblings, children, datasources, scope, setData, ...other } = props;
    
    const dsKeys = Object.keys(datasources);
    const value = { min: 0, max: 100, latest: -1 };
    const params = { staticZones: [ {strokeStyle: "rgba(255,255,255,0.1)", min: 0, max: 100, height: 0.2} ] };

    if (dsKeys.length && data.timeseries && data.timeseries.length) {
        
        const dsKey = dsKeys[0]; // only one datasource is allowed for a gauge
        const dsValues = data.timeseries.map(point => {
            return point ? point[dsKey] : undefined;
        });
        
        const values = dsValues.filter(x => typeof x !== 'undefined');

        const min = Math.min(...values);
        const max = Math.max(...values);
        const mean = stat.average(values);
        const SD = stat.stDev(values);

        // Calculate implied operating range
        params.min = Math.min(mean - SD * 3, min);
        params.max = Math.max(mean + SD * 3, max);

        params.rangeMin = roundRangeValue(mean - SD, params.max - params.min);
        params.rangeMax = roundRangeValue(mean + SD, params.max - params.min);
        params.critical = roundRangeValue(mean + SD * 2, params.max - params.min);

        value.name = camelToSentenceCase(dsKey);
        value.min = params.min;
        value.max = params.max;
        value.latest = values[values.length - 1];

        params.staticZones = [
            {strokeStyle: "rgba(255,255,255,0.1)", min: params.min, max: params.rangeMin, height: 0.2},
            {strokeStyle: "rgba(0,255,0,0.1)", min: params.rangeMin, max: params.rangeMax, height: 1},
            {strokeStyle: "rgb(255,128,0)", min: params.rangeMax, max: params.critical, height: 0.1},
            {strokeStyle: "rgb(255,0,0)", min: params.critical, max: params.max, height: 0.8},
        ];

        params.staticLabels = {
            font: "10px sans-serif",  // Specifies font
            labels: [params.rangeMin, params.rangeMax, params.critical],  // Print labels at these values
            color: "#fff",  // Optional: Label text color
            fractionDigits: 1  // Optional: Numerical precision. 0=round off.
        };

    }

    initDataAggregator({
        ...props, 
        projectSet: (data) => ({ 
            timeseries: data
        }),
        bufferLength: 30 * 60,
    });

    
    var options = {
        angle: -0.22, // The span of the gauge arc
        lineWidth: 0.1, // The line thickness
        radiusScale: 0.8, // Relative radius
        pointer: {
          length: 0.5, // Relative to gauge radius
          strokeWidth: 0.02, // The thickness
          color: '#fff' // Fill color
        },
        limitMax: false,     // If false, max value increases automatically if value > maxValue
        limitMin: false,     // If true, the min value of the gauge will be fixed
        // colorStart: '#ffff00',   // Colors
        // colorStop: '#ff0000',    // just experiment with them
        // strokeColor: '#fff',  // to see which ones work best for you
        generateGradient: true,
        highDpiSupport: true,     // High resolution support

        staticZones: params.staticZones,
        staticLabels: params.staticLabels,
    };

    return Gauge({
        ...other, 
        options,
        value, 
        children, 
    }, ref);
}

const GaugeIcon = (props) => {
    return <div className="relative placeholder hover-highlight"> 
        <div className="fill cell flex align-center">
            <img src={gaugeIcon} alt="Gauge Icon" className="fill" />
        </div>
    </div>

    
}

