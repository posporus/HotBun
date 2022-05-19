import * as p from 'https://deno.land/std@0.139.0/path/mod.ts'
import { checksum } from './checksum.ts'
import { cleanPath } from './cleanPath.ts'

/**
 * Watches the filesystem and calls callback ONLY if a file has changed.
 * @param path 
 * @param func 
 */
export const watcher = async (path: string | string[], callback: (file?: string) => void) => {
    const watcher = Deno.watchFs(path)

    const fileList: Record<string, string> = {}



    for await (const event of watcher) {
        event.paths.forEach(async path => {
            path = cleanPath(path)
            const check = await checksum(path)
            if (fileList[path] !== check) callback(path)
            fileList[path] = check
        })
    }
}
