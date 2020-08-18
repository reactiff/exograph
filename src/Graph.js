import React from 'react'
import GraphNode from './GraphNode';

const Graph = (props) => {
  
  return <GraphNode 
    id="root"
    name="graph" 
    allowDrag={false}
    allowDrop={true} 
    level={0}
    siblings={-1}
    classesForElement={(props) => []}
    render={(props, ref) => {
      const { data, graphContext, parent, siblings, children, datasources, scope, setData, className, ...other } = props;
      const classes = [];
      if (siblings === 0) classes.push('fill'); 
      if (siblings > 0) classes.push('grow'); 
      return (
        <div 
          ref={ref} 
          className={`graph relative flex column align-stretch container graph-container grow ${className} ${classes.join(' ')}`} 
          {...other}>
          {props.children}
        </div> 
      )
    }} 
    meta={{
        type: 'container',
        accept: ['container'],
        maxChildren: 1,
    }}
  />
}

export default Graph;