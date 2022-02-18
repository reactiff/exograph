import React from 'react';
import xo from 'exograph';
import xod from './data';

export default () => {

    return <div className="flex column padded">

        <FnGen fn="sin" freq={15} step={0.5} />
        <FnGen fn="cos" freq={15} step={0.5}  />
        <FnGen fn="tan" freq={30} step={0.5}  />

    </div>
}

const FnGen = (props) => {

    const p = {...props};

    return <xo.GraphNode 
        menuItem
        name={p.fn} 
        placeholder={<TextIcon text={p.fn} />}
        render={(props) => new xod.FunctionGenerator({ 
            ...props, 
            function: p.fn, 
            step: p.step || 0.2, 
            phaseOffset: 0, 
            valueOffset: 0,
            frequency: p.freq || 10,
        })}
        meta={{
            type: 'data.source',
            isDatasource: true,
        }}
    />
}


const TextIcon = (props) => {
    return <div className="relative placeholder"> 
        <div className="fill canvas flex align-center" style={{fontSize: '24pt'}}>
            {props.text}
        </div>
    </div>
}
