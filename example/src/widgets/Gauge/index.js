import React, { useEffect } from 'react';

export default (props, ref) => {

    const { options, value, children, ...other } = props;

    const canvasRef = React.useRef();
    const controllerRef = React.useRef();

    const assignParams = () => {
        controllerRef.current.setOptions(options);
        controllerRef.current.maxValue = value.max; 
        controllerRef.current.setMinValue(value.min);  
        controllerRef.current.set(value.latest || 0); 
    };

    useEffect(() => {
        controllerRef.current = new window.Gauge(canvasRef.current); 
        controllerRef.current.animationSpeed = 1; 
        assignParams();
    }, []);

    useEffect(() => {
        if (!controllerRef.current) return; 
        assignParams();
    }, [controllerRef.current, options, value]);

    return <div ref={ref} {...other}> 
        <div className="gauge-labels fill">
            {
                value.name &&
                <>
                    <div className="gauge-value-label">{value.latest.toFixed(2)}</div>
                    <div className="gauge-name-label">{value.name}</div>
                </>
            }
        </div>
        <canvas ref={canvasRef} className="wide tall fill" />
    </div>
}