import { esbuild } from '../../dist.ts'
import { Crumb } from '../Crumb.ts'
import { cleanPath } from '../cleanPath.ts'
import { getTreeData } from '../storeCrumbs.ts'
import DEVMODE from '../devmode.ts'
export class Script extends Crumb {
    static extensions = ['js', 'ts', 'jsx', 'tsx']

    async build () {
        //compile script
        const { code, warnings, map } = await esbuild.transform(this.raw, {
            loader: 'tsx',
            jsxFactory: 'h',
            sourcefile: this.file,
            sourcemap: (DEVMODE() ? 'inline' : false)
        })
        //replace imports
        const replaced = replaceImports(code)
        //console.log('replaced:', replaced)
        //pack

        return replaced
    }

    async pack () {
        const code = await this.build()
        const dependencies = this.dependencies
        return { code, dependencies }
    }

    public get dependencies (): string[] {
        const imp = getImports(this.raw)
        return imp.map(i => cleanPath(i))
    }

    async bundle () {
        const crumbs = await getTreeData(this.file)
        if (!crumbs) return 'failed'
        const json = JSON.stringify(crumbs)
        //
        /* const initScript = `
            window.crumbs = ${json}
            window.eval = (crumbName) => import("data:text/javascript;base64," + btoa(window.crumbs[crumbName] + '//'+window.performance.now()))
            window.eval('${this.file}')
        ` */
        const initScript = `window.crumbs=${json},window.eval=a=>import("data:text/javascript;base64,"+btoa(window.crumbs[a].code+"//"+window.performance.now())),window.eval("${this.file}")`
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
        const cleanModuleName = cleanPath(moduleName.replaceAll('"', ''))
        //console.log(`moduleMame ${moduleName}, cleanModuleName ${cleanModuleName}`)
        //no Urls!
        if (isUrlRegEx.test(moduleName)) return m
        //only the imported object eg: {x,y}
        const [importObject] = m.match(importObjectRegEx) || []
        const replacedImport = `const ${importObject} = await window.eval('${cleanModuleName}')`
        return replacedImport
    })


const toDataUrl = (text: string) =>
    "data:text/javascript;base64," + btoa(text)