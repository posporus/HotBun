/// <reference lib="dom" />
import {Crumb, Script, Markup} from '../Crumb.ts'
import type {CrumbData} from '../Crumb.ts'

declare const initialCrumbs:string
window.Crumb = Crumb

document.addEventListener("DOMContentLoaded", function (event) {
    const crumbData = JSON.parse(atob(initialCrumbs))
    Crumb.set(crumbData)
    console.log(window.crumbs)

    document.write(window.Crumb.get('index.html')?.code || '')
    window.Crumb.get('index.html')?.eval()
    //console.log(window.crumbs.get('./www/index.html'))
})
