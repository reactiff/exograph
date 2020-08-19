import React from 'react';
import xo from 'exograph';

export default () => (
    <div className="flex wrap padded items" style={{padding: 0}}>

        <xo.GraphNode 
            menuItem
            id="row"
            name="Row" 
            allowDrag={false}
            allowDrop={true} 
            placeholder={<RowLayout />}
            classesForElement={(props) => {
                const classes = ['relative', 'flex', 'row', 'container', 'row-container'];
                if (props.siblings === 0) classes.push('fill'); 
                if (props.siblings > 0) classes.push('grow'); 
                return classes;
            }}
            render={(props, ref) => {
                const { data, graphContext, parent, siblings, children, datasources, scope, setData, ...other } = props;
                return <div ref={ref} {...other}>
                    { children.length ? children : <LiteralWatermark>Row</LiteralWatermark> }
                </div> 
            }} 
            meta={{
                type: 'container.row',
                accept: ['container'],
                reject: ['container.row'],
            }}
        />

        <xo.GraphNode 
            menuItem
            id="column" 
            name="Column" 
            allowDrag={false} 
            allowDrop={true} 
            placeholder={<ColLayout />}
            classesForElement={(props) => {
                const classes = ['relative', 'flex', 'column', 'container', 'column-container'];
                if (props.siblings === 0) classes.push('fill'); 
                if (props.siblings > 0) classes.push('grow'); 
                return classes;
            }}
            render={(props, ref) => {
                const { data, graphContext, parent, siblings, children, datasources, scope, setData, ...other } = props;
                return <div ref={ref} {...other}>
                    { children.length ? children : <LiteralWatermark>Col</LiteralWatermark> }
                </div> 
                
            }} 
            meta={{
                type: 'container.column',
                accept: ['container'],
                reject: ['container.column'],
            }}
        />

        <xo.GraphNode 
            menuItem 
            id="cell"
            name="Cell" 
            allowDrag={false} 
            allowDrop={true} 
            placeholder={<CellLayout />}
            classesForElement={(props) => {
                return ['relative', 'flex', 'row', 'container', 'cell-container'];
            }}
            render={(props, ref) => {
                const { data, graphContext, parent, siblings, children, datasources, scope, setData, ...other } = props;
                return <div ref={ref} {...other}>
                    { children.length ? children : <LiteralWatermark>Cell</LiteralWatermark> }
                </div> 
                
            }} 
            meta={{
                type: 'container.widget.tight',
                accept: ['container', 'widget'],
                reject: ['container.widget'],
                maxChildren: 1,
            }}
        />

        <xo.GraphNode 
            menuItem 
            id="expander"
            name="Expander" 
            allowDrag={false} 
            allowDrop={true} 
            placeholder={<ExpanderLayout />}
            classesForElement={(props) => {
                const classes = ['relative', 'flex', 'row', 'container', 'growth-container'];
                if (props.siblings === 0) classes.push('fill'); 
                if (props.siblings > 0) classes.push('grow'); 
                return classes;
            }}
            render={(props, ref) => {
                const { data, graphContext, parent, siblings, children, datasources, scope, setData, ...other } = props;
                return <div ref={ref} {...other}>
                    { children.length ? children : <LiteralWatermark><ExpanderIcon /></LiteralWatermark> }
                </div> 
            }} 
            meta={{
                type: 'container.widget.growth',
                accept: ['container', 'widget'],
                reject: ['container.widget'],
                maxChildren: 1,
            }}
        />

    </div>
)

const RowLayout = (props) => {
    return <div className="relative placeholder hover-highlight"> 
        <div className="fill flex row spaced" style={{padding: '5px'}}>
            <div className="grow align-self-stretch solid"></div>
            <div className="grow align-self-stretch solid"></div>
        </div>
    </div>
}

const ColLayout = (props) => {
    return <div className="relative placeholder hover-highlight"> 
        <div className="fill flex column spaced" style={{padding: '5px'}}>
            <div className="grow align-self-stretch solid"></div>
            <div className="grow align-self-stretch solid"></div>
        </div>
    </div>
}

const CellLayout = (props) => {
    return <div className="relative placeholder hover-highlight"> 
        <div className="fill" style={{padding: '5px'}}>
            <div className="solid absolute" style={{width: "50%", height: "50%"}}> 
            </div>
        </div>
    </div>
}

const ExpanderLayout = (props) => {
    return <div className="relative placeholder hover-highlight"> 
        <div className="fill flex column" style={{padding: '5px'}}>
            <div className="flex grow"> 
                <div className="grow align self stretch solid"></div>
                <div className="align-self-stretch flex" style={{fontSize: '2rem'}}>
                    &#8674;
                </div>
            </div>
            <div className="flex">
                <div className="align-self-stretch flex align-center" style={{fontSize: '2rem', lineHeight: 1}}>
                    &#8675;
                </div>
            </div>
        </div>
    </div>
}

const ExpanderIcon = () => <div style={{transform: 'rotate(45deg)', fontSize: '2rem'}}>&#10536;</div>;

const LiteralWatermark = (props) => {
    return <Watermark>
        <div className="fill flex cell"><h3>{props.children}</h3></div>
    </Watermark>
}

const Watermark = (props) => {
    return <div className="watermark">
        {props.children}
    </div>
}