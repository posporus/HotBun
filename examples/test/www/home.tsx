/** @jsxImportSource https://esm.sh/preact */

import { h, Component, render } from "https://esm.sh/preact@10.7.2"
import { useState } from "https://esm.sh/preact@10.7.2/hooks"
const name = 'Hammelheini'
function MyComponent (props: any) {
    return <div>My name is {props.name}.</div>;
}

const test = () => {
    alert('i bims ' + name)
}

function Counter () {
    const [value, setValue] = useState(0);

    return (
        <div>
            <div>Counter: {value}</div>
            <button onClick={() => setValue(value + 1)}>Increment</button>
            <button onClick={() => setValue(value - 1)}>Decrement</button>
        </div>
    )
}

const App = () => {
    return (
        <div>
            <h1>hello world</h1>
            <div>this is a text</div>
            <MyComponent name={name}></MyComponent>
            <Counter></Counter>
            <button onClick={test}> click</button>

        </div>
    )
}

export { App }