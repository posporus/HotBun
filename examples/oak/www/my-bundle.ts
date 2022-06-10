/// <reference lib="dom" />
import { App } from './home.tsx'
import { render } from "https://esm.sh/preact@10.7.2"

console.log('hey i am the bundle.')

render(App(), document.body);