import { Bun } from './Bun.ts'

class HotBun {
    options: Required<HotBunOptions>
    buns: Map<string, Bun>

    constructor(options?: HotBunOptions) {
        /**
         *      1. scan dependency tree
         *      
         * 
         */
        this.options = {
            ...hotBunDefaultOptions,
            ...options
        }
        this.buns = new Map()

        this.scanDependencyTree(this.options.entry)
    }

    async bundle (production = false): Promise<string> {
        return await new Promise((r => r('helo')))
    }

    private async scanDependencyTree (entry: string) {

    }
}

const hotBunDefaultOptions = {
    entry: './www/index.html',
    testOption: 'hello',

}

type HotBunOptions = Partial<typeof hotBunDefaultOptions

export {
    HotBun
}
export type {
    HotBunOptions
}