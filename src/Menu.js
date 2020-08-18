import React from 'react'
import MenuContextProvider from './MenuContextProvider';
import './css/menu.css';

export default (props) => {
    return (
        <MenuContextProvider>
            <div className="flex column menu">
                {props.children}
            </div>
        </MenuContextProvider>
    )
}

