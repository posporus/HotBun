import { cleanPath } from './cleanPath.ts'
import { path as p } from '../dist.ts'


/**
 * Watches the filesystem and calls callback ONLY if a file has changed.
 * @param path 
 * @param func 
 */
export const watcher = (path: string, callback: (data: { file: string, kind: 'modify' | 'remove' }) => void) => {
    console.log('watching for changes', path)
    const watcher = Deno.watchFs(path)

    const notifiers = new Map<string, number>();


    const watchLoop = async () => {
        for await (const event of watcher) {
            const dataString = JSON.stringify(event);
            if (notifiers.has(dataString)) {

                //Workaround to make sure only one event is fired
                clearTimeout(notifiers.get(dataString));
                notifiers.delete(dataString);
            }

            notifiers.set(
                dataString,
                setTimeout(() => {
                    // Send notification here
                    notifiers.delete(dataString);
                    const { kind, paths: [rawPath] } = event
                    const file = p.relative(path, cleanPath(rawPath))
                    if (kind === 'modify' || kind === 'remove')
                        callback({ file, kind })
                }, 50)
            )
        }
    }
    watchLoop()

    return watcher
}