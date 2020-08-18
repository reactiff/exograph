export function getGraphJson(scope) {
    
    const root = scope.nodesById['root'];

    const result =  parseNode(root, root.childNodes.length - 1);

    return result;

}

function parseNode(n, siblings) {

    const sequence = (typeof n.item.sequence !== 'undefined' && siblings > 0 ? (':' + n.item.sequence + '') : '');

    const id = n.id + sequence;

    const result = { [id]: [] };

    let j = n.childNodes.length;
    while(j--) { 
        const child = n.childNodes[j];
        const childResult = parseNode(child, n.childNodes.length - 1);
        result[id].push(childResult);
    }

    return result;

}

