/// <reference lib="dom" />
import {Crumb, Script, Markup} from '../Crumb.ts'
import type {CrumbData} from '../Crumb.ts'

declare const initialCrumbs:string
window.Crumb = Crumb

document.addEventListener("DOMContentLoaded", function (event) {
    const crumbData = JSON.parse(atob(initialCrumbs))
    Crumb.set(crumbData)
    console.log(window.crumbs)
    //window.Crumb.get('index.html')?.eval
    console.log('ready')
    window.Crumb.get('index.html')?.eval(document)

    const ws = new WebSocket('ws://localhost:8000')
    console.log(ws)
    ws.addEventListener('message', function (event) {
        const crumbData = JSON.parse(event.data) as CrumbData
        const crumb = window.Crumb.get(crumbData.file)
        crumb?.update(crumbData)
        crumb?.eval(document)
        console.log(window.crumbs.get('index.html'))
        //console.log(event.data)
    });
    
    //console.log(window.crumbs.get('./www/index.html'))
})
