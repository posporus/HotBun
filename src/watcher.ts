import { path as p } from '../dist.ts'
import { checksum } from './checksum.ts'
import { cleanPath } from './cleanPath.ts'
import { updateCrumb, newCrumbFromFile } from './fromFile.ts'
import { Crumb } from './Crumb.ts'

/**
 * Watches the filesystem and calls callback ONLY if a file has changed.
 * @param path 
 * @param func 
 */
export const watcher = async (path: string | string[], callback: (crumb: Crumb) => void) => {
    console.log('watching for changes', path)
    const watcher = Deno.watchFs(path)

    const fileList: Record<string, number> = {}

    for await (const event of watcher) {
        const { kind, paths: [rawPath] } = event

        //do nothing on remove event
        if (kind === 'remove') break

        const file = p.relative(Crumb.root, cleanPath(rawPath))

        const { mtime } = await Deno.stat(rawPath);
        const time = mtime?.getTime()

        const hasChanged = fileList[file] !== time
        fileList[file] = time || 0

        if (kind === 'modify' && hasChanged) {
            console.log('File has changed.', file)
            const crumb = await updateCrumb(file)
            if (crumb)
                callback(crumb)
        }
        if (kind === 'create') {
            console.log('File has been created.', file)
            const crumb = await newCrumbFromFile(file)
            if (crumb)
                callback(crumb)
        }

        //console.log(kind, file, check)




        /* event.paths.forEach(async file => {
            file = cleanPath(file)
            //console.log('clean',file)
            const relativeFile = p.relative(Crumb.root,file)
            //console.log('relavive',file)

            const check = await checksum(file)
            console.log('CHECK:',fileList[file], check)

            if (fileList[file] && fileList[file] !== check) {
                console.log('file has changed.',relativeFile)
                
                const crumb = await updateCrumb(relativeFile)

                if (crumb)
                    callback(crumb)
            }
            fileList[file] = check
        }) */
    }
}


