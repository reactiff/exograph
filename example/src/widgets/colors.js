export const getRandomColor = () => {
    return Math.floor(Math.random() * webSafe.length - 0.001);
}

export const webSafe = [
    '#006600',
    '#33FFFF',
    '#6600FF',
    '#6666FF',
    '#9966FF',
    '#99FF00',
    '#0066FF',
    '#CC00FF',
    '#CC6600',
    '#FF0000',
    '#00CC00',
    '#FF6600',
    '#FF9900',
    '#FFCC00',
];