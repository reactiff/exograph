import RndGen from '../../util/RndGen';
export default function getSampleData (now) {
    const waterTempGen = new RndGen(40, 180, null, 5, 0.5);
    const oilTempGen = new RndGen(60, 140, null, 2, 0.2);
    const dataSize = 1800;
    const data = (new Array(dataSize)).fill(null).map((_,i) => ({
        time: now - (dataSize - i) * 1000,
        waterTemp: waterTempGen.next(),
        oilTemp: oilTempGen.next(),
    }));
    return data;
}