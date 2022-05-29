import { build } from './builder.ts'
import type { Typescript, Javascript } from './types.ts'

interface PreparedBun {
    imports: Import[]
    code: string
}
interface RawSplitBun {
    imports: Import[]
    code: string
}
interface Import {
    obj: string,
    file: string
}

enum CrumpType {
    STYLE,
    MARKUP,
    SCRIPT
}
/**
 * A crumb o a bun.
 */
export class Crumb {

    _raw!: string
    _file!: string | URL

    dependencys: Crumb[] = []




    static async fromFile (file: string | URL) {
        const crumb = new Crumb()
        crumb._file = file
        crumb._raw = await Deno.readTextFile(file)
        return crumb
    }

    async reload () {
        this._raw = await Deno.readTextFile(this._file)
        return this
    }


    /* public get dependencies (): Crumb[] {
        return
    } */

    
    public get type() : CrumpType {
        return getTypeFromExtension(this._file)
    }
    



    /**
     * Compiles the Crumb and returns js as string
     */
    /*  async bake () {
         return await build(this._code)
     } */

    /**
     * returns Array of imports
     */
    /* public get imports (): Import[] {
        return getImports(this.code)
    } */
    /**
     * returns uncompiled code without imports
     */
    /* public get code (): string {
        const { imports } = this

        const code = shearCode(this._code)
        return putPlaceholder({ code, imports })
    } */

    /**
     * sync bun to browser
     */
    sync (ws: WebSocket) {

        ws.send(
            //JSON.stringify(this)
            'sent'
        )


    }

}

const getTypeFromExtension = (file:string | URL):CrumpType => {
    if(typeof file !== 'string') file = file.toString()
    if(file.endsWith('.ts')) return CrumpType.SCRIPT
    if(file.endsWith('.css')) return CrumpType.STYLE
    if(file.endsWith('.html')) return CrumpType.MARKUP
    else throw new Error('cant get type from extension')
}

const importStatementRegEx = /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g

const getImports = (ts: Typescript) =>
    [...ts.matchAll(importStatementRegEx)].map(i => parseImport(i[0]))

const shearCode = (ts: Typescript) =>
    ts.replace(importStatementRegEx, '')

const parseImport = (importString: string): Import => {

    importString = importString
        // removing whitespaces
        .replace(/\s+/g, '')
        //removing import
        .replace('import', '')

    //split into import and from parts
    const [obj, f] = importString.split('from')
    //remove quotes
    const file = f.replace(/['"]/g, '')

    return { obj, file }
}

const putPlaceholder = ({ code, imports }: RawSplitBun) => {
    let fin = ''
    imports.forEach(i => {
        fin += `const ${i.obj} = {} as any \n`
    })
    return fin += code

}
//const bun = Bun.load('./')