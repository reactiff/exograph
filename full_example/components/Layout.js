import React from 'react'
import xo from 'exograph';

import Containers from './containers';
import Widgets from './widgets';
import Sources from './sources';

export default (props) => {

    const data = {
        containers: <Containers />,
        widgets: <Widgets />,
        sources: <Sources />,
    }

    return (
        <div className="layout fill dark-mode">
            <xo.GraphContextProvider>
                <xo.Graph />
                <xo.Menu> 
                    <xo.Accordion data={data} />
                </xo.Menu>
            </xo.GraphContextProvider>
        </div>
    )
}
