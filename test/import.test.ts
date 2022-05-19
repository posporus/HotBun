import { splitImports, parseImport, prepareCode } from '../imports.ts'

Deno.test({
    name: 'getImportsFromString',
    fn: t => {
        const importString = `import {test} from './test.ts'`
        const imports = parseImport(importString)
        console.log(imports)
    }
})

Deno.test({
    name: 'extractImports',
    fn: t => {
        const testString = `
        import {test} from './test.ts'
        import kack from 'https://kacka.com/kack@1.0.1'

        const test = kack.yolo('pommes')
        console.log(test)
        `
        const test = splitImports(testString)
        console.log(test)
    }
})

Deno.test({
    name: 'prepareCode',
    fn: t => {
        const testString = `
        import {test} from './test.ts'
        import kack from 'https://kacka.com/kack@1.0.1'

        const test = kack.yolo('pommes')
        console.log(test)
        `
        const test = splitImports(testString)
        const fin = prepareCode(test)
        console.log(fin)
    }
})