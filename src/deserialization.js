export function parseJson(json, scope) {
    const graph = typeof json === 'string' ? JSON.parse(json) : json;
    const result = parseNode(graph);
    return result;
}

function parseNode(node) {
    const key = Object.keys(node)[0];
    const tokens = key.split(':');
    let name = tokens[0];
    let nullable = name[name.length-1] === '?';
    if (nullable) {
        name = name.substring(0, name.length - 1);
    }
    const sequence = tokens.length > 1 ? tokens[1] : '0';
    return {
        key, 
        name, 
        nullable, 
        sequence,
        value: node[key],
        instance: null,
    }
}
function parseChildren (array) {
    const children = array.map(c => parseNode(c));
    children.sort((a,b) => {
        const diff = a.sequence - b.sequence;
        return diff;
    });
    return children;
}
export function parseLayout(node, scope, target) {

    let deferredNodes = [];

    const resource = scope.nodesById[node.name];
    if (!resource) {
        if (node.nullable) {
            return [{ target, node }];
        }
        throw new Error(node.name + ' is not a valid layout component or does not exist yet, did you forget to mark it as nullable i.e. ' + node.name + '?');
    }

    if (target) {
        node.instance = target.addChild(resource);
    } else {
        node.instance = resource;
    }

    const children = parseChildren(node.value);
    
    for (let child of children) {
        const dn = parseLayout(child, scope, node.instance);
        deferredNodes = deferredNodes.concat(dn);
    }
    
    return deferredNodes;

}
