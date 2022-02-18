import React from 'react';
import uuid from 'uuid/v4';
import GaugeChart from 'react-gauge-chart';

export default (props) => {

    const mutableRef = React.useRef({ id: uuid() });
    const mutable = mutableRef.current;

    return <GaugeChart id={props.id} 
        nrOfLevels={2} 
        percent={0.79} 
        animate={false}
        // hideText={true}
        arcsLength={[0.8, 0.2]}
        // cornerRadius={5}
        // arcPadding={0.05}
        arcWidth={0.05}
        colors={['#ccc', '#888']}
        formatTextValue={value => value + ' deg'}

    />
}