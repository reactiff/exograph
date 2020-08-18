export default class IDropTarget {

    constructor(itemCallbacks = {}) {
        this.node = null;
        this.itemCallbacks = itemCallbacks;
    }
        
    onDragEnter = (e) => {}
    onDragLeave = (e) => {}

    onDragOver = (e) => {
        // Find the top level container under the cursor
        const target = this.node.context.findDropTarget(e);
        if (!target) return;
        e.preventDefault();
    }
        
    onDrop = (e) => this.node.context.onDrop();
}