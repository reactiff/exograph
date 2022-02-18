import DataGen from '../../util/DataGen';
export default function getSampleData (now) {
    const waterTempGen = new DataGen(40, 180, null, 5, 0.5);
    const oilTempGen = new DataGen(60, 140, null, 2, 0.2);
    const dataSize = 1800;
    const data = (new Array(dataSize)).fill(null).map((_,i) => ({
        time: now - (dataSize - i) * 1000,
        waterTemp: waterTempGen.next(),
        oilTemp: oilTempGen.next(),
    }));
    return data;
}