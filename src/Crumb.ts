import { installedPlugins } from './plugin.ts'
import type { Plugin } from './plugin.ts'
import { crumbFromFile } from './fromFile.ts'
import type { UpdateMessage } from './browser/message.ts'
import { MessageType } from './browser/message.ts'
import { crumbStorage } from './storeCrumbs.ts'


export abstract class Crumb {

    //
    // STATIC
    //

    static root: string

    /**
     * Installs plugins.
     * @param plugins 
     */
    static install (plugins: Plugin | Plugin[]) {
        if (!Array.isArray(plugins)) plugins = [plugins]
        installedPlugins.push(...plugins)
    }

    //
    // Constructor
    //

    constructor(data: CrumbData) {

        this.update(data)

        //if (!window.crumbs) window.crumbs = new Map()
        crumbStorage.set(this.file, this)

        console.info(`Registered Crumb >>${this.constructor.name}<< '${this.file}'`)

        this.loadDependencies()

    }

    file!: string
    raw!: string
    /**
     * Sets raw data and filename of Crumb.
     * @param param0 
     * @returns 
     */
    update ({ raw, file }: CrumbData) {
        this.raw = raw
        this.file = file
        return this
    }

    async sendUpdate (socket: WebSocket) {
        const file = this.file
        const data = await this.pack()
        const message: UpdateMessage = {
            type: MessageType.UPDATE,
            file,
            data
        }
        socket.send(JSON.stringify(message))
    }

    public abstract bundle (): Promise<string>

    //public abstract pack (): Promise<Pack>
    public abstract pack (): Promise<Pack>

    public abstract get dependencies (): string[]

    /**
     * Just a shorthand for crumbFromFile().
     * 
     * Creates a new Crumb object from a file or updates an existing one.
     */
    static fromFile = crumbFromFile

    private loadDependencies () {
        const dependencies = this.dependencies
        if (!dependencies.length) return
        return Promise.all(dependencies.map(async dep => {
            await Crumb.fromFile(dep)
        }))
    }

}

/* export interface CrumbBrowserData {
    file:
}
 */

export type Pack = string
export interface CrumbData {
    raw: string
    file: string
}
