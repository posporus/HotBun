import { Crumb } from './Crumb.ts'
import { injectScriptIntoHtml } from './injectScriptIntoHtml.ts'
import { bundle } from './builder.ts'
import { path } from '../dist.ts'
import { newCrumbFromFile, loadTree } from './fromFile.ts'
import { watcher } from './watcher.ts'

class Bun {
    options: Required<Hot.Options>

    constructor(options?: Hot.Options) {
        this.options = {
            ...hotBunDefaultOptions,
            ...options
        }

        Crumb.root = this.options.root

    }

    static async init (options?: Hot.Options) {


        const bun = new Bun(options)
        const { root, entry } = bun.options

        const entryCrumb = await newCrumbFromFile(entry)
        await loadTree(entryCrumb)

        return bun

    }

    /* async dummy () {
        const tsPath = path.join(
            path.relative(Deno.cwd(),
                path.dirname(
                    path.fromFileUrl(import.meta.url))
            ),
            './client/client.ts')
        //bundle script
        const js = await bundle(tsPath)
        

        const { all } = Crumb
        const allData = all.map(crumb => crumb.data)



        return `
        <html>
        <head>
        <script type="module">
        const initialCrumbs = "${btoa(JSON.stringify(allData))}"
        ${js}
        </script>
        </head>
        </html>
        `
    } */

    watcher = (callback: (crumb?:Crumb) => void) => watcher(this.options.root, callback)

    async inject(file:string){
        const html = await Deno.readTextFile(file)

        const tsPath = path.join(
            path.relative(Deno.cwd(),
                path.dirname(
                    path.fromFileUrl(import.meta.url))
            ),
            './client/client.ts')
        //bundle script
        const js = await bundle(tsPath)
        //console.log(js)
        return injectScriptIntoHtml(html,js)
    }

    async bundle(file:string) {

    }

}

const hotBunDefaultOptions = {
    root: './www',
    entry: 'index.html',
    production: false,
}

namespace Hot {
    export type Options = Partial<typeof hotBunDefaultOptions>
}

export {
    Bun
}
/* export type {
    Options
} */
