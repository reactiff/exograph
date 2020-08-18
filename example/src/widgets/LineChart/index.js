// LineChart widget
import React from 'react';
import uuid from 'uuid/v4';
import {camelToSentenceCase} from '../../util/string';
import './style.css';
import {getRandomColor, webSafe as colors} from '../colors';

import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

export default (props, ref) => {

    const {data, children, ...other} = props;
    const now = Date.now();

    let series = Array.isArray(data) 
        ? Object.keys(data[data.length-1]).filter(k => k!=='time')
        : [];

    // pick a random color 
    const [colorOffset] = React.useState(getRandomColor());

    return (
        <div ref={ref} {...other}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                    data={props.data}
                    margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    <XAxis 
                        tickCount={6}
                        tick={false}
                        dataKey="time" 
                        scaleToFit={false}
                        tickFormatter={(tick) => {
                            const elapsedMs = now - tick;
                            const minutes = Math.round(elapsedMs / 60000);
                            return '-' + minutes;
                        }} />
                    <YAxis/>
                    <CartesianGrid strokeDasharray="2 5" stroke="rgba(128,128,128,0.3)"/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend formatter={(value, entry, index) => camelToSentenceCase(value) }/>
                    {
                        series.map((key, index) => {
                            return (
                                <Line 
                                    key={key}
                                    type="monotone" 
                                    dataKey={key}
                                    stroke={colors[(index + colorOffset) % colors.length]} 
                                    strokeWidth={1}
                                    dot={false} 
                                />
                            )
                        })
                    }
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

const CustomXAxisLabel = (props) => {
    return null;
}

const CustomTooltip = (props) => {
      
    if (!props.active) return null;
      
    const { payload, label } = props;

    if (!payload) return null;

    return (
        <div className="custom-tooltip" style={{textAlign: 'left'}}>
            <div className="flex column">
                <h2 style={{lineHeight: 0}}>{formatTime(label)}</h2>
                <table>
                    <tbody>
                        {
                            payload.map(series => {
                                const caption = camelToSentenceCase(series.name);
                                return <tr key={series.name}>
                                    <td>{caption} :</td>
                                    <td>{series.value.toFixed(1)}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const formatTime = (ms) => {
    const elapsedMs = Date.now() - ms;
    const seconds = Math.round(elapsedMs / 1000);
    const minutes = Math.round(elapsedMs / 60000);
    if (seconds<60) {
        return seconds + ' seconds ago';
    }
    else {
        return minutes + ' minutes ago';
    }
}