import React from 'react';
import { menuContext } from './MenuContext';

export default (props) => {

    const value = { initialized: true };

    return (
        <div className="exograph-menu">
            <menuContext.Provider value={ value }>
                {props.children}
            </menuContext.Provider>
        </div>
    )
}

export function useMenuContext() {
    const context = React.useContext(menuContext);
    return context;
}
