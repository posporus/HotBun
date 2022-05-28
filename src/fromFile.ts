import { esbuild, path } from '../dist.ts'
import { Crumb, Script, Markup, Style } from './Crumb.ts'
import { cleanPath } from './cleanPath.ts'

import {
    importStatementRegEx,
    betweenQuotesRegEx,
    importObjectRegEx,
    findMarkupExtensionRegEx,
    findScriptExtensionRegEx,
    findStyleExtensionRegEx
} from './regex.ts'

const newCrumbFromFile = (file: string) => {
    //if (findScriptExtensionRegEx.test(file)) 
    if (findMarkupExtensionRegEx.test(file)) return markupCrumpFromFile(file)
    return scriptCrumbFromFile(file)
}

const scriptCrumbFromFile = async (file: string) => {
    file = cleanPath(path.join(file))
    console.log('script file', file)
    const uncompiled = await Deno.readTextFile(path.join(Crumb.root, file))
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
    file = cleanPath(file)
    console.log('markup file', file)
    const raw = await Deno.readTextFile(path.join(Crumb.root, file))
    const markupCrumb = new Markup({ raw, file })

    return markupCrumb
}

const loadTree = (entry: Crumb) => {
    const dependencies = entry.dependencies
    return Promise.all(dependencies.map(async dep => {
        const crumb = await newCrumbFromFile(dep)
        await loadTree(crumb)
    }))
}

const updateCrumb = async (file:string) => {
    const crumb = window.crumbs.get(file)

    //console.log('update Crumb:',crumb)
    if(!crumb) {
        console.log('new file detected:',file)
        return newCrumbFromFile(file)
    }
    const raw = await Deno.readTextFile(path.join(Crumb.root, file))
    const updated = crumb.update({file,raw})
    return updated
}


export {
    newCrumbFromFile,
    loadTree,
    updateCrumb
}