import { toDataUrl } from '../utility.ts'
import { Crumb } from '../Crumb.ts'

/* declare global {
    interface Window {
        crumbs: Map<string, FrontCrumb>
    }
} */

interface CrumbData {
    file: string,
    code: string,
    imports: string[],
    exports: string
}

class FrontCrumb extends Crumb {

    constructor({ file, code, imports, exports }: CrumbData) {
        
        super()
        this._file = file
        this._code = code
        this._imports = imports
        this._exports = exports

    }

    /**
     * execute this crumb and return exports
     * @returns 
     */
    eval = async () => await import(toDataUrl(this.code))


    public get importCrumbs () {
        return this._imports.map(i => FrontCrumb.get(i)) || []
    }

    public get code (): string {
        let importString = ''
        this.importCrumbs.forEach(i => {
            if (i) {
                const exp = i.exports ? `const ${i.exports} = ` : ''
                importString += `${exp}await window.crumbs.get('${i.file}').eval() \n`
            }
        })
        const code = importString + this._code

        return code
    }

}

export {
    Crumb
}