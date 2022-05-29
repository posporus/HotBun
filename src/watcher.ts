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
export const watcher = (path: string | string[], callback: (crumb: Crumb) => void) => {
    console.log('watching for changes', path)
    const watcher = Deno.watchFs(path)

    const notifiers = new Map<string, number>();


    const watchLoop = async () => {
        for await (const event of watcher) {
            const dataString = JSON.stringify(event);
            if (notifiers.has(dataString)) {
                clearTimeout(notifiers.get(dataString));
                notifiers.delete(dataString);
            }

            notifiers.set(
                dataString,
                setTimeout(() => {
                    // Send notification here
                    notifiers.delete(dataString);

                    handleFileChangeEvent(event, callback)
                }, 20)
            )
        }
    }
    watchLoop()

    /* const fileList: Record<string, number> = {}
 
    for await (const event of watcher) {
        const { kind, paths: [rawPath] } = event
 
        //do nothing on remove event
        if (kind === 'remove') break
 
        const file = p.relative(Crumb.root, cleanPath(rawPath))
 
        const { mtime } = await Deno.stat(rawPath);
        const time = mtime?.getTime()
 
        const hasChanged = fileList[file] !== time
        console.log(hasChanged,fileList[file],time)
        fileList[file] = time || 0
 
 
        if ((kind === 'modify' && hasChanged) || kind === 'create') {
            console.info('Filechange.',file)
            tryUpdate(callback,file)
        
            
        }
        
 
    } */
    return watcher
}

const handleFileChangeEvent = (event: Deno.FsEvent, callback: (crumb: Crumb) => void) => {
    const { kind, paths: [rawPath] } = event
    if (kind === 'remove') return null
    const file = p.relative(Crumb.root, cleanPath(rawPath))

    if ((kind === 'modify') || kind === 'create') {
        console.info('Filechange.', file)
        tryUpdate(callback, file)
    }
}

const tryUpdate = async (callback: (crumb: Crumb) => void, file: string) => {
    let crumb: Crumb
    try {
        crumb = await updateCrumb(file)
    }
    catch {
        crumb = await newCrumbFromFile(file)
    }
    if (crumb)
        callback(crumb)
}