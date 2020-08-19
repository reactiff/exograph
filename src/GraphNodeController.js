import React from 'react';
import uuid from 'uuid/v4'
import IDraggable from './IDraggable';
import IDropTarget from './IDropTarget';

export default class GraphNodeController {

    constructor(context, dropEvents, dragEvents, item) {

        this.rendered = false;

        this.guid = uuid();
        this.context = context;
        this.parentNode = null;

        this.sequence = 0;
        this.childNodes = [];

        this.itemChildrenData = null;
        
        if(dropEvents){
            dropEvents.node = this;
            this.dropEvents = dropEvents;
        }

        if(dragEvents){
            dragEvents.node = this;
            this.dragEvents = dragEvents;
        }

        if (item) {
            this.setItem(item);
        }
   
    }

    setItem(item) {
        if (!item.name) throw new Error('Name is required for node');
        if (!item.id) throw new Error('Unique id is required but missing for node ' + item.name);
        

        this.id = item.id;
        
        this.name = item.name;

        this.item = {
            ...item,
        };
    }

    endDrag() {
        this.dragEvents.onDragEnd();
    }

    addChild(node, projectedIndex) { 
        
        let newItem;

        if (!node.item.meta.isDatasource) {

            const {children, setIsDropZone, setIsDragging, setChildren, menuItem, ...other} = node.item;
            newItem = { 
                ...other,
                guid: uuid(),
                // sequence: this.childNodes.length,
            };

            let instance = new GraphNodeController(this.context,
                node.item.allowDrop ? new IDropTarget() : null,
                node.item.allowDrag ? new IDraggable() : null,
                newItem,
            );;
            
            // instance.setItem(newItem);
            newItem.nodeInstance = instance;
            
            instance.parentNode = this;
            this.childNodes.push(instance); 
        }

        // For performance, subdivide children into nodes and datasources
        if (this.rendered) {
            this.item.setChildren(prev => {

                const newState = {...prev};
    
                if (node.item.meta.isDatasource) {
                    // const uniqueKey = getDatasourceKey(prev.datasources);
                    // if (typeof uniqueKey === 'undefined') return prev; // key already exists
                    // Note that datasources is a map...
                    newState.datasources[node.item.id] = node.item;
                }
                else {
                    // ... while children is an array
                    newState.nodes = [...prev.nodes];
                    newState.nodes.splice(projectedIndex, 0, newItem);
                }
    
                return newState;
            });
        }
        else {

            if (!this.itemChildrenData) this.itemChildrenData = { datasources: {}, nodes: [] };

            if (node.item.meta.isDatasource) {
                this.itemChildrenData.datasources[node.item.id] = node.item;
            }
            else {
                this.itemChildrenData.nodes.push(newItem);
            }

        }
        
        // const json = this.context.getGraphJson();
        // console.log(JSON.stringify(json, null, '  '));

        if (newItem) {
            return newItem.nodeInstance;
        }

    }
}