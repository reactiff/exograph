export default class IDraggable {

    constructor(itemCallbacks = {}) {
        this.node = null;
        this.itemCallbacks = itemCallbacks;
    }

    onDragStart = (e) => {
        this.node.item.setIsDragging(true);
        this.node.context.onDragStart(this.node);
        this.itemCallbacks.onDragStart && this.itemCallbacks.onDragStart(e)
    }
    
    onDragEnd = (e) => {
        this.node.item.setIsDragging(false);
        this.node.context.onDragEnd(this.node);
        this.itemCallbacks.onDragEnd && this.itemCallbacks.onDragEnd(e);
    }
}