import React, { useEffect } from 'react';
import xo from 'exograph';
import xod from './data';

export default () => {

    const [sources, setSources] = React.useState(['rnd', 'cos', 'tan', 'atan']);

    useEffect(() => {
        setTimeout(()=>setSources(arr => arr.concat(['sin'])), 0);
    }, []);

    return <div className="flex wrap padded">
        {
            sources.map((source, index) => {
                return <FnGen key={index} fn={source} freq={30} step={0.1} />;
            })
        }
    </div>
}

const FnGen = (props) => {

    const p = {...props};

    return <xo.GraphNode 
        menuItem
        id={p.fn}
        name={p.fn} 
        placeholder={<TextIcon text={p.fn} />}
        classesForElement={(props) => []}
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
    return <div className="relative placeholder hover-highlight"> 
        <div className="fill canvas flex align-center" style={{fontSize: '24pt'}}>
            {props.text}
        </div>
    </div>
}
