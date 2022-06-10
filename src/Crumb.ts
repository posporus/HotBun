import { installedPlugins } from './plugin.ts'
import { crumbFromFile } from './fromFile.ts'
import { crumbStorage } from './storeCrumbs.ts'
import {CrumbPath} from './CrumbPath.ts'
import type { Plugin } from './plugin.ts'


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

        crumbStorage.set(this.file, this)

        console.info(`Registered Crumb >>${this.constructor.name}<< '${this.file}'`)

        this.loadDependencies()

    }

    path!:CrumbPath

    //file!: string
    raw!: string
    /**
     * Sets raw data and filename of Crumb.
     * @param param0 
     * @returns 
     */
    update ({ raw, file }: CrumbData) {
        this.path = new CrumbPath(file)
        this.raw = raw
        return this
    }

    /**
     * the filepath relative to the root folder and with '/' slashes and without './'
     */
    public get file() : string {
        return this.path.cleanPath
    }
    


    /**
     * Bundle the crumb the HotBun way.
     */
    public abstract bundle (): Promise<string>

    /**
     * Pack everything up for delivery to browser.
     */
    public abstract pack (): Promise<Pack>

    /**
     * Any dependency files as an array.
     */
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

export type Pack = {
    code:string,
    dependencies:string[]
}
export interface CrumbData {
    raw: string
    file: string
}
