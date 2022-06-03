import { esbuild } from '../../dist.ts'
import { Crumb } from '../Crumb.ts'
import { cleanPath } from '../cleanPath.ts'
import { getTreeData } from '../storeCrumbs.ts'

export class Script extends Crumb {
    static extensions = ['js', 'ts', 'jsx', 'tsx']

    async build () {
        //compile script
        const { code, warnings, map } = await esbuild.transform(this.raw, {
            loader: 'ts',
            sourcefile:this.file,
            sourcemap:'inline'
        })
        //replace imports
        const replaced = replaceImports(code)
        //pack

        return replaced
    }

    async pack () {
        const code = await this.build()
        const dataUrl = toDataUrl(code)
        const name = this.file
        return dataUrl
    }

    public get dependencies (): string[] {
        const imp = getImports(this.raw)
        return imp.map(i => cleanPath(i))
    }

    async bundle () {
        const crumbs = await getTreeData(this.file)
        if (!crumbs) return 'failed'
        //const entries = Object.entries(crumbs)
        const json = JSON.stringify(crumbs)
        const base64 = btoa(json)
        //const crumbDataUrl = toDataUrl(json)
        //console.log('base64', base64, 'atob', atob(base64))
        const initScript = `
            window.crumbs = ${json}
            window.eval = (crumbName) => import(window.crumbs[crumbName])
            window.eval('${this.file}')
        `
        return initScript
    }

}

const importStatementRegEx = /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/gm
const betweenQuotesRegEx = /([\'\"\`])(.*)\1/g
const isUrlRegEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
const importObjectRegEx = /(?<=import).*(?=from)/

const getImports = (code: string) =>
    [...code.matchAll(importStatementRegEx)].map(importArray => {
        const i = importArray[0]
        const [list] = i.match(betweenQuotesRegEx) || []
        const imp = list.replace(/['"]+/g, '')
        //console.log('import:', imp)
        return imp
    }).filter(i => !isUrlRegEx.test(i))

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
        const cleanModuleName = cleanPath(moduleName.replaceAll('"',''))
        //console.log(`moduleMame ${moduleName}, cleanModuleName ${cleanModuleName}`)
        //no Urls!
        if (isUrlRegEx.test(moduleName)) return m
        //only the imported object eg: {x,y}
        const [importObject] = m.match(importObjectRegEx) || []
        const replacedImport = `const ${importObject} = await window.eval('${cleanModuleName}')`
        return replacedImport
    })


/* const packScript = (code: string) => {
    const dataUrl = toDataUrl(code)
    const pack = {
        dataUrl: dataUrl,
        
        eval(){
            return import(this.dataUrl)
        }
    }
    return pack
} */

const toDataUrl = (text: string) =>
    "data:text/javascript;base64," + btoa(text)