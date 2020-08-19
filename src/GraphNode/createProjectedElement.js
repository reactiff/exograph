import React from 'react';

const indexInRow = (props) => {

    if (!props.children.nodes.length) {
        console.log('No children.  Index 0');
        return 0;
    }

    const totalCount = props.children.nodes.length + 1;
    const totalWidth = props.rect.width;
    const childWidth = totalWidth / totalCount;
    
    const x = props.cursor.clientX - props.rect.left;

    let index = totalCount;
    while(index--) {
        if (x >= childWidth * index) {

            console.log({
                index,
                totalWidth,
                childWidth,
                x,
            });

            return index; // this is the projected relative index
        }
    }
}


const indexInColumn = (props) => {

    if (!props.children.nodes.length) {
        console.log('No children.  Index 0');
        return 0;
    }

    const totalCount = props.children.nodes.length + 1;
    const totalHeight = props.rect.height;
    const childHeight = totalHeight / totalCount;
    
    const y = props.cursor.clientY - props.rect.top;

    let index = totalCount;
    while(index--) {
        if (y >= childHeight * index) {

            console.log({
                index,
                totalHeight,
                childHeight,
                y,
            });

            return index; // this is the projected relative index
        }
    }
}

const getProjectedIndex = (props) => {
    switch(props.meta.type) {
        case 'container.row':
            return indexInRow(props);
        case 'container.column':
            return indexInColumn(props);
        default: 
            return indexInRow(props);
    }
}

const createProjectedElement = (props) => {
    const p = {siblings: props.children.nodes.length};
    const classes = ['projected-element-placeholder'].concat(props.payload.item.classesForElement({siblings: props.children.nodes.length}));
    // console.log(classes.join(' '));
    return {
        index: getProjectedIndex(props),
        render: () => <div key="projected" className={classes.join(' ')} />
    }
};

export default createProjectedElement;