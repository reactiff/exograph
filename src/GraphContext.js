import React from 'react';

const defaultValue = {
    status: null,
    data: null,
    registerNode: () => {},
    findDropTarget: () => {},
    
    // idragable events
    onDragStart: () => {},
    onDragEnd: () => {},

    // idroptarget events
    onDragEnter: () => {},
    onDragOver: () => {},
    onDragLeave: () => {},
    onDrop: () => {},

    getGraphJson: () => {},
};

export const graphContext = React.createContext(defaultValue);
