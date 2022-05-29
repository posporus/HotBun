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

/**
 * Separates imports and code.
 * @param ts 
 * @returns 
 */

const splitImports = (ts: string):RawSplitBun => {
    //match import regex
    //thanks https://regexr.com/47jlq
    const r = /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g

    const imports = [...ts.matchAll(r)].map(i => parseImport(i[0]))
    const code = ts.replace(r, '')

    return { imports, code }

}

/**
 * Split import statement into
 * obj -> variable/object of import as string
 *  - e.g.: test , {test}
 * file -> path of import file as string
 * @param ts 
 * 
 */
//TODO: handle 'import * as foo from XY' cases
//TODO: handle 'import foo, {bar} from XY'cases
//TODO: normalize path
const parseImport = (importString: string):  Import => {

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

/**
 * Inserts import placeholder, so that compiler does'nt cry
 *  - const {importObject} = {} as any
 * @param param0 
 * @returns 
 */
const putPlaceholder = ({ code, imports }:RawSplitBun) => {
    let fin = ''
    imports.forEach(i => {
        fin += `const ${i.obj} = {} as any \n`
    })
    return fin += code

}

/**
 * 
 */
const prepareCode = (input: string):PreparedBun => {
    const raw = splitImports(input)
    return {
        imports: raw.imports,
        code: putPlaceholder(raw)
    }
}

export {
    splitImports,
    parseImport,
    putPlaceholder,
    prepareCode
}
export type {
    Import
}
