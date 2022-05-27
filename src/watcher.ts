import {path as p }from '../dist.ts'
import { checksum } from './checksum.ts'
import { cleanPath } from './cleanPath.ts'
import { updateCrumb } from './fromFile.ts'
import { Crumb } from './Crumb.ts'

/**
 * Watches the filesystem and calls callback ONLY if a file has changed.
 * @param path 
 * @param func 
 */
export const watcher = async (path: string | string[], callback: (crumb: Crumb) => void) => {
    console.log('watching for changes', path)
    const watcher = Deno.watchFs(path)

    const fileList: Record<string, string> = {}

    for await (const event of watcher) {
        event.paths.forEach(async file => {
            file = cleanPath(file)
            //console.log('clean',file)
            const relativeFile = p.relative(Crumb.root,file)
            //console.log('relavive',file)

            const check = await checksum(file)

            if (fileList[file] !== check) {
                //console.log('file has changed.',relativeFile)
                const crumb = await updateCrumb(relativeFile)
                if (crumb)
                    callback(crumb)
            }
            fileList[file] = check
        })
    }
}
