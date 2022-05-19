import { build } from './builder.ts'

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

type UncompiledTypescript = string
type CompiledTypescript = string

export class Bun {

    _code: string
    file!: string | URL
    wsConnection: WebSocket | null = null

    constructor(ts: string) {
        this._code = ts
    }

    static async load (file: string | URL) {
        const code = await Deno.readTextFile(file)
        const bun = new Bun(code)
        bun.file = file
        return file
    }
    /**
     * Compiles the bun and returns js as string
     */
    async bake () {
        return await build(this._code)
    }

    /**
     * returns Array of imports
     */
    public get imports (): Import[] {
        return getImports(this.code)
    }
    /**
     * returns uncompiled code without imports
     */
    public get code (): string {
        const code = shearCode(this._code)
        const { imports } = this

        return putPlaceholder({ code, imports })
    }

    /**
     * sync bun to browser
     */
    sync () {
        try {
            this.wsConnection?.send(
                JSON.stringify(this)
            )
        }
        catch {
            if (!this.wsConnection) throw new Error("no connection specified");
        }
    }

}

const importStatementRegEx = /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g

const getImports = (ts: UncompiledTypescript) =>
    [...ts.matchAll(importStatementRegEx)].map(i => parseImport(i[0]))

const shearCode = (ts: UncompiledTypescript) =>
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