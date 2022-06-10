/** @jsxImportSource https://esm.sh/preact */

import { h } from "https://esm.sh/preact@10.7.2"
import { useState } from "https://esm.sh/preact@10.7.2/hooks"


function NameComponent (props: any) {
    return <div>My name is {props.name}.</div>;
}

function Counter () {
    const [value, setValue] = useState(5);
    return (
        <div>
            <div>Counter:</div>
            <div>
                <button onClick={() => setValue(value - 1)}>-</button>
                <input size={1} type="text" value={value} />
                <button onClick={() => setValue(value + 1)}>+</button>
            </div>
        </div>
    )
}

const App = () => {
    const name = 'Erik'

    return (
        <div>
            <h1>hello world</h1>
            <div>this is a text</div>
            <NameComponent name={name}></NameComponent>
            <Counter></Counter>
        </div>
    )
}

export { App }