/// <reference lib="dom" />
import { App } from './home.tsx'
import { h, Component, render } from "https://esm.sh/preact@10.7.2"

//import { world } from './test/test.ts'
//console.log(App)
//render(App, document.body)



// Create your app
//const app = h('h1', null, 'hhh!');
/* const App = () => {
    return (
        <div>
            <p>hello world</p>
        </div>
    )
} */


render(App(), document.body);

//console.log('hello',world)
//alert('hello ich bin ein  panda pitbull e')