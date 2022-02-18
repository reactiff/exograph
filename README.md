# exograph

> Exoskeleton for graphs!

[![NPM](https://img.shields.io/npm/v/exograph.svg)](https://www.npmjs.com/package/exograph) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save exograph
```

## Usage

```jsx
import React from 'react'
import xo from 'exograph';

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
```











## License

MIT © [Rick Ellis](https://github.com/reactiff)
