import { Crumb, CrumbData } from './Crumb.ts'

export const installedPlugins: Plugin[] = []

export type Plugin = (new (data: CrumbData) => Crumb) & {
    extensions?: string[],
    name: string
}

/**
 * Extraxts the plugin request (a word) written after '@hotBun' from a given string.
 * @param code 
 * @returns 
 */

export const getPluginRequestFromString = (code: string) => {
    const match = code.match(/(?<=@hotBun ).*$/m)
    return match ? match[0] : null
}

export const requestPlugin = (request: string): Plugin | undefined => {
    return installedPlugins.find(p => p.name === request)
}

export const guessPluginFromExtension = (file: string) => {
    //only extension
    const ext = file.split('.').pop()

    return installedPlugins.find(p => {
        if (!p.extensions) return false
        return !!p.extensions.find(e => e === ext)
    })?.name || null
}