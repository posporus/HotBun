import { esbuild, path } from '../dist.ts'
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
    console.log('newCrumb', file)


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

const cleanPath = (file: string) => {
    const clean = path.normalize(file)

    console.log('clean path', file, clean)

    const isExtendedLengthPath = /^\\\\\?\\/.test(clean);
    const hasNonAscii = /[^\u0000-\u0080]+/.test(clean);

    if (isExtendedLengthPath || hasNonAscii) {
        return clean;
    }

    return clean.replace(/\\/g, "/");

}

export {
    newCrumbFromFile,
    loadTree
}