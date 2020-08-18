import React from 'react';
import {camelToSentenceCase} from './util/string';
import './css/accordion.css';

export default ({data, defaultKey}) => {

    const keys = Object.keys(data);

    const [activeKey, setActiveKey] = React.useState(defaultKey || keys[0]);

    const toggleSection = (key) => {
        setActiveKey(active => active === key ? null : key);
    };

    

    return <div className="accordion">
        {
            keys.map(key => {

                return <div key={key} className={`accordion-section ${(activeKey===key ? 'active' : '')}`}>
                    <button 
                        className={`accordion-section-header`}
                        onClick={() => toggleSection(key)}
                    >
                        {camelToSentenceCase(key)}
                    </button>
                    <div className="accordion-section-content">
                        {data[key]}
                    </div>
                </div>
            })
        }
    </div>
}