import {
    importStatementRegEx,
    betweenQuotesRegEx,
    importObjectRegEx,
    findMarkupExtensionRegEx,
    findScriptExtensionRegEx,
    findStyleExtensionRegEx,
    scriptTagSrcRegEx
} from './regex.ts'
import { toDataUrl } from './utility.ts'


declare global {
    interface Window {
        crumbs: Map<string, Crumb>
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

    public abstract type: 'markup' | 'script' | 'style'

    static get = (moduleName: string): Crumb | undefined => window.crumbs.get(moduleName)
    
    public static get all() : Crumb[] {
        return [...window.crumbs.values()]
    }

    static set(dataArray:CrumbData[]) {
        dataArray.forEach((data) => {
            if(findMarkupExtensionRegEx.test(data.file)) new Markup(data)
            if(findScriptExtensionRegEx.test(data.file)) new Script(data)
        })
    }
    
    public abstract dependencies: string[]


    public get data (): CrumbData {

        return {
            raw: this.raw,
            file: this.file
        }
    }



    /* public get isDeno (): boolean {
        return 'Deno' in window
    } */



}

class Markup extends Crumb {
    type = 'markup' as const

    public get dependencies () {
        return getScriptTagSrcUrls(this.raw)
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

    public get dependencies () {
        return []
    }

    /* public get imports() : string {
        return 
    } */

}

class Script extends Crumb {
    type = 'script' as const

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
        const replacedImport = `const ${importObject} = await window.crumbs.get(${moduleName}).eval()`
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


const getScriptTagSrcUrls = (code: string): string[] => {
    return [...code.matchAll(scriptTagSrcRegEx)].map(src => src[1])
}

/**
 * Determines the type of a crumb from a given filename and its extension.
 * @param file 
 * @returns CrumbType
 */
/* export const newCrumbFromExtension = (file: string | URL): Markup | Style | Script => {
    if (typeof file !== 'string') file = file.toString()
    if (file.endsWith('.ts')) return
    //if (file.endsWith('.css')) return new Style()
    //if (file.endsWith('.html')) return new Markup()
    else throw new Error('cant get type from extension')
} */

/* const CrumbfromFile = async (file: string): Promise<Markup | Style | Script> => {
    const crumb = newCrumbFromExtension(file)
    crumb.file = file
    crumb.code = await Deno.readTextFile(file)
    return crumb
} */


export {
    Crumb,
    Markup,
    Script,
    Style
}