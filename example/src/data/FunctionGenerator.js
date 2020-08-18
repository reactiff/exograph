import RndGen from './RndGen';

const Pi2 = Math.PI * 2;

export default class FunctionGenerator {

    constructor(props) {

        this.functionName = props.function || 'sin';
        
        if (props.function === 'rnd') {
            this.rnd = new RndGen(0, 500, Math.random() * 100, Math.random() * 20 + 5, Math.random() * 5);
            this.f =  () => this.rnd.next();
        }
        else {
            this.f =  Math[this.functionName];
        }

        
        
        this.step = props.step || 0.5;
        this.frequency = props.frequency;
        this.name = props.name || this.functionName;
        this.phaseOffset = props.phaseOffset || 0;
        this.valueOffset = props.valueOffset || 0;
        this.ontick = (() => {});
        this.angle = 0;
        this.htimer = null;
    }

    start(frequency) {
        this.htimer = setInterval(() => {
            this.tick();            
        }, 1000 / this.frequency);
    }

    stop() {
        if (this.htimer) {
            clearInterval(this.htimer);
        }
    }
    
    tick = () => {
        
        this.angle += this.step;
        if (this.angle >= Pi2) {
            this.angle = this.angle - Pi2;
        }
        const value = this.f(this.angle + this.phaseOffset) + this.valueOffset;
        const data = { key: this.name, value };

        this.ontick(data);
    }

    onTick(callback) {
        this.ontick = callback;
    }
}
