import {
    importStatementRegEx,
    betweenQuotesRegEx,
    importObjectRegEx,
    findMarkupExtensionRegEx,
    findScriptExtensionRegEx,
    findStyleExtensionRegEx,
    scriptTagSrcRegEx,
    scriptTagRegEx
} from './regex.ts'
import { toDataUrl } from './utility.ts'

import * as path from 'https://cdn.skypack.dev/path-browserify'
//import { path } from '../dist.ts'


declare global {
    interface Window {
        crumbs: Map<string, Crumb>
        Crumb: typeof Crumb
    }

}

export interface CrumbData {
    raw: string
    file: string
}

abstract class Crumb {

    constructor({ raw, file }: CrumbData) {

        this.raw = raw
        this.file = file

        if (!window.crumbs) window.crumbs = new Map()
        window.crumbs.set(this.file, this)

    }

    file!: string
    raw!: string

    static root: string

    public abstract type: 'markup' | 'script' | 'style'

    public abstract eval: () => void

    static get = (moduleName: string): Crumb | undefined => {
        const normal = normalizePath(moduleName)
        console.log('Crumb request', moduleName,normal)
        return window.crumbs.get(normal)
    }

    public static get all (): Crumb[] {
        return [...window.crumbs.values()]
    }

    static set (dataArray: CrumbData[]) {
        console.log('Crumb set', dataArray)
        dataArray.forEach((data) => {
            if (findMarkupExtensionRegEx.test(data.file)) new Markup(data)
            if (findScriptExtensionRegEx.test(data.file)) new Script(data)
        })
    }

    public abstract get dependencies (): string[]


    public get data (): CrumbData {

        return {
            raw: this.raw,
            file: this.file
        }
    }

    public abstract get code (): string

    public get isDeno (): boolean {
        return 'Deno' in window
    }



}

class Markup extends Crumb {
    type = 'markup' as const

    constructor(data: CrumbData) {
        super(data)
        console.log('Markup init')
    }

    public get dependencies () {
        return getScriptTagSrcUrls(this.raw)
    }


    public get code (): string {
        console.log('Crumb code getter', this.isDeno)
        return replaceScriptTags(this.raw)
    }

    eval = () => {
        //evalScripts()
        this.dependencies.forEach(d=>{
            window.Crumb.get(d)?.eval()
        })
    }
    /* public get scripts() : string {
        if(this.runtime === 'deno')

        return 
    } */

    /* public get styles() : string {
        return 
    } */


}

class Style extends Crumb {
    type = 'style' as const

    constructor(data: CrumbData) {
        super(data)
        console.log('Style init')
    }

    public get dependencies () {
        return []
    }

    public get code (): string {
        return ''
    }

    eval = () => {}
    /* public get imports() : string {
        return 
    } */

}

class Script extends Crumb {
    type = 'script' as const

    constructor(data: CrumbData) {
        super(data)
        console.log('Script init')
    }

    public get dependencies () {
        return getImports(this.raw)
    }

    public get code (): string {
        return replaceImports(this.raw)
    }

    eval = async () => await import(toDataUrl(this.code))

}

/**
 * replaces all import statements
 * 
 * `import {x,y} from './square.ts' -> const {x,y} = await window.crumbs.get('.square.ts').eval()`
 * 
 * @param code 
 * @returns 
 */
//TODO: Clean this up
const replaceImports = (code: string) =>
    code.replaceAll(importStatementRegEx, m => {
        //only the module name eg: './square.ts' (without quotes)
        const [moduleName] = m.match(betweenQuotesRegEx) || []
        //only the imported object eg: {x,y}
        const [importObject] = m.match(importObjectRegEx) || []
        const replacedImport = `const ${importObject} = await window.Crumb.get(${moduleName}).eval()`
        return replacedImport
    })


//TODO: clean this mess up
const getImports = (code: string) =>
    [...code.matchAll(importStatementRegEx)].map(importArray => {
        const i = importArray[0]
        const [list] = i.match(betweenQuotesRegEx) || []
        return list.replace(/['"]+/g, '')
    }
    )

//@ts-ignore <Will be used in browser>
const replaceScriptTags = (code: string) => {
    if ('Deno' in window) {
        console.error('DOMParser only available in Browser')
        return code
    }
    //@ts-ignore
    const parser = new DOMParser()
    console.log(parser)
    const doc = parser.parseFromString(code, "text/html")
    //@ts-ignore
    const { scripts }: { scripts: HTMLCollection } = doc
    const scriptList = Array.from(scripts)

    scriptList.forEach(script => {
        //@ts-ignore
        const src = script.getAttribute('src') || ''
        const importScript = `window.Crumb.get('${src}').eval()`
        //const importScript = 'alert("haha")'
        //@ts-ignore
        //script.setAttribute('src', toDataUrl(importScript))

        //@ts-ignore
        script.removeAttribute('src')

        //@ts-ignore
        //script.innerHTML = `window.Crumb.get('${src}').eval()`
        script.innerHTML = `//${src}`
    })

    console.log(doc.scripts)


    return doc.documentElement.innerHTML || ''

    /* return code.replaceAll(scriptTagRegEx, m => {
        const match = m.matchAll(scriptTagSrcRegEx) || []
        const filename = [...match][0][1]
        

        const replaceWith = `<script type="module">window.crumb.get('${filename}').eval\(\)\</script>`
        //const replaceWith = '<script>'
        console.log('ditte', replaceWith) 
        return m
    }) */
}


const getScriptTagSrcUrls = (code: string): string[] => {
    return [...code.matchAll(scriptTagSrcRegEx)].map(src => src[1])
}

const normalizePath = (file: string) => {
    file = path.normalize(file)
    return file
}

export {
    Crumb,
    Markup,
    Script,
    Style
}