/// <reference lib="dom" />
import { App } from './home.tsx'
import { h, Component, render } from "https://esm.sh/preact@10.7.2"

console.log('hey i am the test script')

render(App(), document.body);