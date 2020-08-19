import React, { useEffect } from 'react';
import { graphContext } from './GraphContext';
import './css/additive.css'
import './css/flex.css'
import './css/exograph.css'

import {parseJson} from './deserialization';
import {parseLayout} from './deserialization';
// import {buildGraph} from './deserialization';
// import {buildDeferredNodes} from './deserialization';

import {getGraphJson as getGraphJsonFn} from './getGraphJson';

export default (props) => {
    
    const scope = React.useRef({
        payload: null,
        dropTarget: null,
        nodes: [],
        nodesById: {},
    }).current;

    const registerNode = (node, isMenuItem) => {
        const identifier = node.id === 'root' || isMenuItem ? node.id : node.guid;
        if (!identifier) throw new Error('ID required');
        if (scope.nodesById[identifier]) {
            throw new Error("Node id '" + identifier + "' is not unique");
        }
        scope.nodes.push(node)
        scope.nodesById[identifier] = node;
    };

    //
    const activateDropZones = (isActive, e) => scope.nodes.forEach(n => {
        if (isActive(n)) {
            // return n.item.activateDropZone(n.rect, e, scope.payload);
        }
        n.item.deleteProjection();
    });

    const projectElement = (e) => scope.dropTarget.item.projectElement(scope.dropTarget.rect, e, scope.payload);


    const findDropTarget = (e) => {

        // find nodes whose rect encloses the cursor location
        const isCusorInside = (rect) => {
            return rect.left <= e.clientX && e.clientX <= rect.right &&
                   rect.top <= e.clientY && e.clientY <= rect.bottom;
        }

        // check if target container is of one of the targetTypes of the payload
        const isCompatibleTarget = (tgt) => {
            const {type} = scope.payload.item.meta;

            const x = {};

            x.accepted = tgt.item.meta.accept.some(t => type.indexOf(t)===0);
            x.rejected = !tgt.item.meta.reject ? false : tgt.item.meta.reject.some(t => type.indexOf(t)===0);

            if (x.accepted && !x.rejected && typeof tgt.item.meta.maxChildren !== 'undefined') {
                x.maxedOut = tgt.childNodes.length >= tgt.item.meta.maxChildren;
            } 
            return x.accepted && !x.rejected && !x.maxedOut;
        };

        // Select relevant nodes under the cursor that can accept the payload
        const layers = scope.nodes.filter(n => {
            n.rect = n.ref.getBoundingClientRect();
            if (!isCusorInside(n.rect)) {
                return false;
            }
            if (!n.item.allowDrop) return false;
            return isCompatibleTarget(n);
        });

        
        if (layers.length === 0) {
            scope.dropTarget = null; 
            activateDropZones(() => false);
            return; 
        }
        layers.sort((a,b) => b.item.level - a.item.level);

        const active = layers[0];

        if (!scope.dropTarget || scope.dropTarget.guid !== active.guid) {
            activateDropZones(n => n.guid === active.guid, e);
            scope.dropTarget = active;
        }
        
        scope.projectedIndex = projectElement(e);
        
        
        return scope.dropTarget;
    };
    
    const tryLoadDeferredLayoutNodes = (deferredNodes) => {
        
        let deferred = [];
        
        for (let dn of deferredNodes) {
            deferred = deferred.concat(parseLayout(dn.node, scope, dn.target));
        }

        setTimeout((d) => {
            tryLoadDeferredLayoutNodes(d);
        }, 1000, deferred);
    };

    // Deserialization
    const layout = props.layout;
    useEffect(() => {
        if (layout) {

            const layoutRoot = parseJson(layout, scope);

            const deferredNodes = parseLayout(layoutRoot, scope);

            if (deferredNodes.length) {
                window.requestAnimationFrame(() => {
                    tryLoadDeferredLayoutNodes(deferredNodes);
                });
            }
        }
    }, [layout]);

    return (
        <div className="exograph fill flex">
            <div className="flex row align self stretch wide">
                <graphContext.Provider 
                    value={
                        {
                            registerNode,
                            findDropTarget,
                            // idraggable events
                            onDragStart: (node) => { 
                                scope.payload = node;
                            },
                            onDragEnd: (node) => { scope.dropTarget = null; activateDropZones(() => false);},
                            onDragEnter: (target) => {},
                            onDragLeave: (target) => {},
                            onDragOver: (target) => {},
                            onDrop: () => {
                                if (!scope.dropTarget) return;
                                scope.dropTarget.addChild(scope.payload, scope.projectedIndex);
                                scope.dropTarget = null;
                                scope.payload.endDrag();
                                activateDropZones(() => false);
                            },
                            // Serialization
                            getGraphJson: () => getGraphJsonFn(scope),
                        }
                    }>
                    {props.children}
                </graphContext.Provider>
            </div>
        </div>
    )
}

export function useGraphContext() {
    return React.useContext(graphContext);
}
