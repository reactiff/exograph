import Aggregator from './Aggregator';

const BUFFER_LENGTH = 1000;

export default function initDataAggregator (props) {

    const { data, children, datasources, scope, setData, className, ...other } = props;
    
    const dsKeys = Object.keys(datasources);
    if (!dsKeys.length) return;

    if (scope.aggregator) {
        // New aggregator should initialize when the mix of datasources changes
        const pHash = dsKeys.join('');
        const aHash = Object.keys(scope.aggregator.datasources).join('');
        if (pHash === aHash) return;
    }

    if (!scope.aggregator) {
        scope.aggregator = new Aggregator({
            bufferLength: BUFFER_LENGTH,
            setData: props.setData,
            createDataPoint: (vector) => ({ 
                time: Date.now(), 
                ...vector 
            }),
            projectData: (data) => ({ 
                timeseries: data
            })
        });
    }

    // add missing datasources
    for (let key in datasources) {
        if (!Object.prototype.hasOwnProperty.call(scope.aggregator.datasources, key)) {
            const datasource = datasources[key].render();
            const subscribe = (ds, log) => {
                ds.onTick((data) => {
                    log(data);
                });
            };
            scope.aggregator.addDatasource(key, datasource, subscribe);
            datasource.start();
            // TODO: If datasource needs to be removed, you need to call .stop() on it first
        }
    }
    
}