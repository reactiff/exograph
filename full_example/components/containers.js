import React from 'react';
import xo from 'exograph';

export default () => (
    <div className="flex column padded items">

        <xo.GraphNode 
            menuItem
            name="Row" 
            allowDrag={false}
            allowDrop={true} 
            placeholder={<RowLayout />}
            render={(props, ref) => {
                const { data, children, datasources, scope, setData, className, ...other } = props;
                return (
                    <div 
                    ref={ref} 
                    className={`flex row container ${className}`} 
                    {...other}>
                    {props.children}
                    </div> 
                )
            }} 
            meta={{
                type: 'container.row',
                accept: ['container'],
                reject: ['container.row'],
            }}
        />

        <xo.GraphNode 
            menuItem 
            name="Column" 
            allowDrag={false} 
            allowDrop={true} 
            placeholder={<ColLayout />}
            render={(props, ref) => {
                const { data, children, datasources, scope, setData, className, ...other } = props;
                return (
                    <div 
                    ref={ref} 
                    className={`flex column container ${className}`} 
                    {...other}>
                    {props.children}
                    </div> 
                )
            }} 
            meta={{
                type: 'container.column',
                accept: ['container'],
                reject: ['container.column'],
            }}
        />

        <xo.GraphNode 
            menuItem 
            name="WidgetContainer" 
            allowDrag={false} 
            allowDrop={true} 
            placeholder={<SingleLayout />}
            render={(props, ref) => {
                const { data, children, datasources, scope, setData, className, ...other } = props;
                return (
                    <div 
                    ref={ref} 
                    className={`flex row container ${className}`} 
                    {...other}>
                    {props.children}
                    </div> 
                )
            }} 
            meta={{
                type: 'container.widget',
                accept: ['widget', 'data.source'],
                maxChildren: 1,
            }}
        />

    </div>
)

const RowLayout = (props) => {
    return <div className="relative placeholder"> 
        <div className="fill flex row border spaced" style={{padding: '15px'}}>
            <div className="grow align-self-stretch border-dashed"></div>
            <div className="grow align-self-stretch border-dashed"></div>
            <div className="align-self-stretch flex align-center">&#8594;</div>
            
        </div>
    </div>
}

const ColLayout = (props) => {
    return <div className="relative placeholder"> 
        <div className="fill flex column border spaced" style={{padding: '15px'}}>
            <div className="grow align-self-stretch border-dashed"></div>
            <div className="grow align-self-stretch border-dashed"></div>
            <div className="align-self-stretch">&#8595;</div>
        </div>
    </div>
}

const SingleLayout = (props) => {
    return <div className="relative placeholder"> 
        <div className="fill flex border spaced" style={{padding: '15px'}}>
            <div className="grow align self stretch border-dashed"></div>
        </div>
    </div>
}