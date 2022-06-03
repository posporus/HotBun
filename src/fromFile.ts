import { path } from '../dist.ts'
import { Crumb } from './Crumb.ts'
import { getPluginRequestFromString, requestPlugin, guessPluginFromExtension } from './plugin.ts'
import { crumbStorage } from './storeCrumbs.ts'
import { cleanPath } from './cleanPath.ts'


/**
 * Creates a new Crumb object from a file or updates an existing one.
 * @param file 
 */
export async function crumbFromFile (file: string) {
    try {
        //console.log('input file',file)
        file = cleanPath(file)
        //console.log('clean file',file)
        const joinRoot = path.join(Crumb.root, file)
        //console.log('file',file,'join',joinRoot)
        const raw = await Deno.readTextFile(joinRoot)

        const pluginRequest = getPluginRequestFromString(raw) || guessPluginFromExtension(file)
        if (!pluginRequest) throw new Error(`Couldn't guess Plugin Type for file '${file}'.`)

        const pluginClass = requestPlugin(pluginRequest)
        if (!pluginClass) throw new Error(`Cannot resolve plugin '${pluginRequest}' in file ${file}.`)

        //TODO: does not treats the case when CrumbType changes.
        const crumb = crumbStorage.get(file)
        if (crumb) {
            return crumb.update({ file, raw })
        }

        const newCrumb = new pluginClass({ raw, file })
        crumbStorage.set(file, newCrumb)
        return newCrumb

    }
    catch (e) {
        console.error(e)
    }

}