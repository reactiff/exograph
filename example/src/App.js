import React from 'react'
import xo from 'exograph';

import 'exograph/src/css/additive.css';
import 'exograph/src/css/flex.css';
import 'exograph/src/css/menu.css';
import 'exograph/src/css/accordion.css';
import 'exograph/src/css/exograph.css';

import Containers from './containers';
import Widgets from './widgets';
import Sources from './sources';

import layout from './layout';

const App = (props) => {

    const data = {
        containers: <Containers />,
        widgets: <Widgets />,
        sources: <Sources />,
    }

    return (
        <div className="layout fill dark-mode">
            <xo.GraphContextProvider  layout={layout} >
                <xo.Graph />
                <xo.Menu> 
                    <xo.Accordion data={data} />
                </xo.Menu>
            </xo.GraphContextProvider>
        </div>
    )
}

export default App;