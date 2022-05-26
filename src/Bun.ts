import { Crumb } from './Crumb.ts'
import { injectScriptIntoHtml } from './injectScriptIntoHtml.ts'
import { bundle } from './builder.ts'
import { path } from '../dist.ts'
import { newCrumbFromFile, loadTree } from './fromFile.ts'

class Bun {
    options: Required<Hot.Options>

    constructor(options?: Hot.Options) {
        this.options = {
            ...hotBunDefaultOptions,
            ...options
        }

    }

    static async init (options?: Hot.Options) {


        const bun = new Bun(options)
        const { entry } = bun.options

        const entryCrumb = await newCrumbFromFile(entry)
        loadTree(entryCrumb)

        // 1. scan dependency tree
        // 2. 
        //const dependencyTree = await bun.scanDependencyTree()
        await bun.bundle()
        return bun

    }

    async bundle (production = false): Promise<string> {

        return await new Promise((r => r('helo')))
    }

    /* handle (req:Request) {
        return new Response(await hotbun.bundle(), { status: 200 })
    } */

    /* async inject () {
        //get html from entry
        const html = await Deno.readTextFile(this.options.entry)
        //evaluate correct path
        const tsPath = path.join(
            path.relative(Deno.cwd(),
                path.dirname(
                    path.fromFileUrl(import.meta.url))
            ),
            './client/client.ts')
        //bundle script
        const js = await bundle(tsPath)
        //inject script
        return injectScriptIntoHtml(html, js)
    } */

    async dummy () {
        const tsPath = path.join(
            path.relative(Deno.cwd(),
                path.dirname(
                    path.fromFileUrl(import.meta.url))
            ),
            './client/client.ts')
        //bundle script
        const js = await bundle(tsPath)

        const { all } = Crumb
        const allData = all.map(crumb=>crumb.data)



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
    }

}

const hotBunDefaultOptions = {
    entry: './www/index.html',
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
