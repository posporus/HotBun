/// <reference lib="dom" />
import {Crumb, Script, Markup} from '../Crumb.ts'
import type {CrumbData} from '../Crumb.ts'

declare const initialCrumbs:string
window.Crumb = Crumb

document.addEventListener("DOMContentLoaded", function (event) {
    const crumbData = JSON.parse(atob(initialCrumbs))
    console.log('crumbData',crumbData)
    Crumb.set(crumbData)
    console.log('crumbs',window.crumbs)
    //console.log(window.crumbs)
    //window.Crumb.get('index.html')?.eval
    console.log('ready')
    const entry = window.Crumb.get('index.html')
    entry?.eval(document)
    const ws = new WebSocket('ws://localhost:8000')
    //console.log(ws)
    ws.addEventListener('message', function (event) {
        const crumbData = JSON.parse(event.data) as CrumbData
        console.log('message',crumbData.file)
        const crumb = window.Crumb.get(crumbData.file)
        crumb?.update(crumbData)
        entry?.eval(document)
    });
    
    //console.log(window.crumbs.get('./www/index.html'))
})
