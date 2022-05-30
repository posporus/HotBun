import {
    importStatementRegEx,
    betweenQuotesRegEx,
    importObjectRegEx,
    findMarkupExtensionRegEx,
    findScriptExtensionRegEx,
    findStyleExtensionRegEx,
    scriptTagSrcRegEx,
    scriptTagRegEx,
    isUrlRegEx
} from './regex.ts'
import { toDataUrl } from './utility.ts'

import { guessType } from './guessType.ts'

import * as path from 'https://cdn.skypack.dev/path-browserify'
import { buildFromFile } from './builder.ts'
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

    constructor(data: CrumbData) {

        this.update(data)

        if (!window.crumbs) window.crumbs = new Map()
        window.crumbs.set(this.file, this)

    }

    update ({ raw, file }: CrumbData) {
        this.raw = raw
        this.file = file
        return this
    }

    /* send (ws: WebSocket) {
        const json = JSON.stringify(this.data)
        ws.send(json)
    } */

    file!: string
    raw!: string

    static root: string

    public abstract type: 'markup' | 'script' | 'style'
    //@ts-ignore <only in browser>
    public abstract eval: (document?: Document) => void

    static get = (moduleName: string): Crumb | undefined => {
        const normal = normalizePath(moduleName)
        //console.log('Crumb request', moduleName, normal)
        return window.crumbs.get(normal)
    }

    static async fromFile (file: string) {
        try {
            const type = guessType(file)
            //const code = await buildFromFile(file)
        }
        catch (e) {
            console.error(e)
        }
    }

    public static get all (): Crumb[] {
        return [...window.crumbs.values()]
    }

    /* static set (dataArray: CrumbData[]) {
        //console.log('Crumb set', dataArray)
        dataArray.forEach((data) => {
            const type = guessType(data.file)
            console.log('hello', data.file)
            if (type === 'markup') new Markup(data)
            if (type === 'script') new Script(data)
            else console.log('dont know which type', data)
        })
    } */

    public abstract get dependencies (): string[]


    public get data (): CrumbData {

        return {
            raw: this.raw,
            file: this.file
        }
    }

    public abstract get code (): string

    /* public get isDeno (): boolean {
        return 'Deno' in window
    } */



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
        //console.log('Crumb code getter', this.isDeno)
        return replaceScriptTags(this.raw)
    }
    //@ts-ignore
    eval = (doc?: Document) => {
        console.log('eval', this.file)
        if (doc) {
            doc.documentElement.innerHTML = this.code
            //doc.write(this.code)
        }
        //evalScripts()
        this.dependencies.forEach(d => {
            console.log('eval deps', d)
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

    eval = () => { }
    /* public get imports() : string {
        return 
    } */

}

class Script extends Crumb {
    type = 'script' as const

    constructor(data: CrumbData) {
        super(data)
        console.log('Script init', data.file)
    }

    public get dependencies () {
        return getImports(this.raw)
    }

    public get code (): string {

        return replaceImports(this.raw)
    }

    eval = async () => {
        console.log('eval', this.file)
        //only evals if code has changed. therefore window.performance.now()
        //TODO: find a nicer workaround
        return await import(toDataUrl(this.code + '\n' + (window.performance.now())))
    }

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
        //no Urls!
        if (isUrlRegEx.test(moduleName)) return m
        //only the imported object eg: {x,y}
        const [importObject] = m.match(importObjectRegEx) || []
        const replacedImport = `const ${importObject} = await window.Crumb.get(${moduleName}).eval()`
        return replacedImport
    })

const getImports = (code: string) =>
    [...code.matchAll(importStatementRegEx)].map(importArray => {
        const i = importArray[0]
        const [list] = i.match(betweenQuotesRegEx) || []
        const imp = list.replace(/['"]+/g, '')
        console.log('import:', imp)
        return imp
    }).filter(i => !isUrlRegEx.test(i))


//TODO: clean this mess up
/* const getImports = (code: string) =>
    [...code.matchAll(importStatementRegEx)].reduce((res, importArray) => {
        const i = importArray[0]
        const [list] = i.match(betweenQuotesRegEx) || []
        const imp = list.replace(/['"]+/g, '')
        console.log('import:', imp, isUrlRegEx.test(imp))
        if (!isUrlRegEx.test(imp)) {
            console.log('importing',imp)
            res.push(imp)
        }
        else {
            console.log('not importing',imp)
        }
        //console.log(res)
        return res
    }, [] ) */

//@ts-ignore <Will be used in browser>
const replaceScriptTags = (code: string) => {
    if ('Deno' in window) {
        console.error('DOMParser only available in Browser')
        return code
    }
    //@ts-ignore
    const parser = new DOMParser()
    //console.log(parser)
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

    //console.log(doc.scripts)


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