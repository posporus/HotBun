import { Crumb } from './Crumb.ts'
import { path } from '../dist.ts'
import { cleanPath } from './cleanPath.ts'
import { Script } from './plugins/Script.ts'
import { injectScriptIntoHtml } from './injectScriptIntoHtml.ts'
import { bundleFromFile } from './bundle.ts'
import { watcher } from './watcher.ts'
import { sendUpdate } from './messages.ts'
import type { Plugin } from './plugin.ts'
import DEVMODE from './devmode.ts'

export class HotBun {
    options: Required<HotBunOptions>

    //
    // STATIC
    //
    static init (options?: HotBunOptions) {

        //setting dev env variable
        Deno.args.find(a => a === '--dev') ?
            Deno.env.set("HOTBUN_DEVMODE", "true")
            : Deno.env.set("HOTBUN_DEVMODE", "false")

        console.info(`🔥 %cHotBun 🚀 initialized in ${DEVMODE() ? '%cdevelopment mode' : '%cproduction mode'}`,
            'font-weight:bold;',
            `color:${DEVMODE() ? 'red' : 'green'}; font-weight:bold;`)

        const bun = new HotBun(options)

        Crumb.install(bun.options.plugins)
        Crumb.root = bun.options.root

        return bun
    }

    //
    // CONSTRUKTOR
    //
    constructor(options?: HotBunOptions) {

        this.options = {
            ...hotBunDefaultOptions,
            ...options
        }

    }

    async bundle (file: string): Promise<string> {
        const entryCrumb = await Crumb.fromFile(file)
        if (!entryCrumb) return '404'
        const bundle = await entryCrumb.bundle()

        return bundle

    }

    /**
     * True if application rus in devmode. Either by setting 'HOTBUN_DEVMODE' to true or by adding '--dev' flag to run command.
     */
    public get dev (): boolean {
        return DEVMODE()
    }


    watch (socket: WebSocket) {
        socket.addEventListener('open', e => {
            watcher(this.options.root, async fsEvent => {
                const { kind, file } = fsEvent
                //const file = cleanPath(rawPath)
                //TODO: Error handling?
                if (kind === 'modify') {
                    const crumb = await Crumb.fromFile(file)
                    if (crumb)
                        sendUpdate(socket, crumb)
                }
            })
        })
    }

    //TODO: find a way to handle paths in a clean and logical manner.
    async entry (file: string) {
        try {
            file = path.join(this.options.root, file)
            let html = await Deno.readTextFile(file)
            if (this.dev) {
                //console.log('meta', import.meta.url)
                const thisDir = path.dirname(import.meta.url)

                const browserScriptPath = path.join(thisDir, './browser/script.ts')
                const clean = path.fromFileUrl(cleanPath(browserScriptPath))
                const bundle = await bundleFromFile(clean)
                html = injectScriptIntoHtml(html, bundle)
            }
            return html
        }
        catch (err) {
            console.error(err)
        }
    }
}

const hotBunDefaultOptions = {
    root: './www' as string,
    entry: 'index.html' as string,
    production: false as boolean,
    plugins: [Script] as Plugin[],
}


export type HotBunOptions = Partial<typeof hotBunDefaultOptions>