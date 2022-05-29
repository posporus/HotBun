/** @jsxImportSource https://esm.sh/preact */

import { h, Component, render } from "https://esm.sh/preact@10.7.2"
const name = 'Hammelheini'
function MyComponent(props:any) {
    return <div>My name is {props.name}.</div>;
  }

  const test = ()=>{
      alert('i bims '+name)
  }

const App = () => {
    return (
        <div>
            <h1>hello world</h1>
            <div>this is a text</div>
            <MyComponent name={name}></MyComponent>
            <button onClick={test}> click</button>
            
        </div>
    )
}

export {App}