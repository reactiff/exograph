import React from 'react'
import {useEffect, useState, useRef} from 'react'
import GraphNodeController from '../GraphNodeController';
import IDraggable from '../IDraggable';
import IDropTarget from '../IDropTarget';
import { useGraphContext } from '../GraphContextProvider';
import { useMenuContext } from '../MenuContextProvider';

import createProjectedElement from './createProjectedElement';

const GraphNode = (props) => {

    const ref = React.createRef();
    const graphContext = useGraphContext();
    const isInsideMenu = useMenuContext().initialized;
    
    let childrenInitData;
    if (props.nodeInstance && props.nodeInstance.itemChildrenData) {
        childrenInitData = props.nodeInstance.itemChildrenData;
    } else {
        childrenInitData = { datasources: {}, nodes: [] };
    }

    const [children, setChildren] = useState(childrenInitData);
    const [projectedElement, setProjectedElement] = useState(null);
    
    const [isDropTarget, setIsDropTarget] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    
    const mutable = useRef({}).current;
    const [data, setData] = useState({});
    
    

    // Item data and callbacks
    const item = {
        ...props, 
        children,
        deleteProjection: () => {
            if (mutable.projectElement) {
                mutable.projectElement = null;
                setProjectedElement(null);
            } 
        },
        projectElement: (rect, cursor, payload) => {
            const projection = createProjectedElement({ cursor, payload, rect, children, meta: props.meta });
            if (!mutable.projectElement || mutable.projectElement.index !== projection.index) {
                mutable.projectElement = projection;
                setProjectedElement(projection);
            }
            return projection.index;
        },
        setIsDragging: (value) => {
            setIsDragging(value);
        },
        setChildren: (ch) => {
            setChildren(ch);
        },
    };

    const node = useRef(props.nodeInstance || new GraphNodeController(
        graphContext,
        item.allowDrop ? new IDropTarget() : null,
        item.allowDrag || isInsideMenu ? new IDraggable() : null,
    )).current;

    node.setItem(item);
    node.rendered = true;
    
    const elementClasses = node.item.classesForElement ? node.item.classesForElement({siblings: props.siblings + props.projectedSiblings}) : [];
    const classes = ['graph-node'].concat(elementClasses);

    if (isInsideMenu) classes.push('menu-item');
    if (props.className) classes.push(props.className);
        
    const attributes = {};
    
    if(item.allowDrag || isInsideMenu){
        classes.push('draggable');
        attributes.draggable = true;
        attributes.onDragStart = node.dragEvents.onDragStart;
        attributes.onDragEnd = node.dragEvents.onDragEnd;
    }
    
    if(!isInsideMenu && item.allowDrop) {
        classes.push('allow-drop');
        attributes.onDragEnter = node.dropEvents.onDragEnter;
        attributes.onDragLeave = node.dropEvents.onDragLeave;
        attributes.onDragOver = node.dropEvents.onDragOver;
        attributes.onDrop = node.dropEvents.onDrop;
    } 

    // dynamic state classes

    if(isDropTarget) classes.push('--active');
    if(isDragging) classes.push('--dragging');

    useEffect(() => {
        // Run once    
        node.ref = ref.current;
        graphContext.registerNode(node, isInsideMenu);
    }, [ref.current]);
    
    const basicProps = {
        name: item.name,
        className: classes.join(' '),
        ...attributes,
    };

    if (isInsideMenu) {
        return <div {...basicProps} ref={ref}>
            {props.children || item.placeholder || item.name}
        </div>
    }

    /////////////////////////////////////////////////////////
    // Render meta element

   

    const renderedChildren = children.nodes.map((child, index) => {
        return <GraphNode 
            key={child.guid}
            id={child.id} 
            name={child.name} 
            meta={child.meta} 
            allowDrag={child.allowDrag} 
            allowDrop={child.allowDrop} 
            classesForElement={child.classesForElement}
            render={child.render}
            level={item.level + 1}
            placeholder={child.placeholder}
            siblings={children.nodes.length - 1}
            projectedSiblings={projectedElement ? 1 : 0}
            parent={node}
            nodeInstance={child.nodeInstance}
            sequence={child.sequence}
        />;
    });
    
    if (projectedElement) {
        renderedChildren.splice(projectedElement.index, 0, projectedElement.render());
    };


    const extendedProps = {
        ...basicProps, 
        parent: props.parent,
        siblings: props.siblings,
        children: renderedChildren, 
        datasources: children.datasources, 
        scope: mutable, 
        graphContext,
        setData,
        data,
    };

    const element = item.render(extendedProps, ref);

    return element;
}

export default GraphNode;


