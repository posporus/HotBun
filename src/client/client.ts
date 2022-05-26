/// <reference lib="dom" />
import {Crumb, Script, Markup} from '../Crumb.ts'
import type {CrumbData} from '../Crumb.ts'

declare const initialCrumbs:string//Record<string,CrumbData>


/* const entry = Crumb.fromFile('') */

//alert('test')
document.addEventListener("DOMContentLoaded", function (event) {
    const crumbData = JSON.parse(atob(initialCrumbs))
    Crumb.set(crumbData)
    console.log(window.crumbs)

    document.write(window.crumbs.get('./www/index.html')?.raw || '')

    /* document.write(`
    <html>
        <body>
            hello world
        </body>
    </html>
`) */
/* window.setTimeout(()=>{
    document.write(`
    <html>
        <body>
            hello mars
        </body>
    </html>
`)
},1000) */
})


//const crumbs = new Map<string, ClientCrumb>()


/* const testscript = new Crumb({
    file:'./script1.ts',
    code: `
        func()
        console.log(color)
    `,
    imports: ['./script2.ts'],
    exports: ''
})

new Crumb({
    file:'./script2.ts',
    code: `
        export const func = () => {
            console.log('func1')
        }
        console.log('inside mod1')
        export const color = 'green'
    `,
    imports: [],
    exports: '{color,func}'
})

const test = new Crumb({
    file:'./test.ts',
    code: `
        alert('hello')
    `,
    imports: ['./script1.ts'],
    exports: ''
}) */


//testscript.eval()