import { esbuild,path } from '../dist.ts'
import { Crumb, Script, Markup, Style } from './Crumb.ts'

import {
    importStatementRegEx,
    betweenQuotesRegEx,
    importObjectRegEx,
    findMarkupExtensionRegEx,
    findScriptExtensionRegEx,
    findStyleExtensionRegEx
} from './regex.ts'

const newCrumbFromFile = (file: string) => {
    console.log('newCrumb',file,findScriptExtensionRegEx.test(file))


    //if (findScriptExtensionRegEx.test(file)) 
    if (findMarkupExtensionRegEx.test(file)) return markupCrumpFromFile(file)
    return scriptCrumbFromFile(file)
}

const scriptCrumbFromFile = async (file: string) => {
    file = path.join('www',file)
    console.log('script file', file)
    const uncompiled = await Deno.readTextFile(file)
    //build file
    const { code, map, warnings } = await esbuild.transform(uncompiled, {
        sourcefile: file,
        format: 'esm',
        sourcemap: 'inline',
    })

    if (warnings) console.warn(warnings)

    const raw = code

    const scriptCrumb = new Script({ raw, file })

    return scriptCrumb
}

const markupCrumpFromFile = async (file: string) => {
    console.log('markup file', file)
    const raw = await Deno.readTextFile(file)
    const markupCrumb = new Markup({ raw, file })

    return markupCrumb
}

const loadTree = (entry:Crumb) => {
    const dependencies = entry.dependencies
    dependencies.forEach(async dep => {
        const crumb = await newCrumbFromFile(dep)
        loadTree(crumb)
    })
}

export {
    newCrumbFromFile,
    loadTree
}