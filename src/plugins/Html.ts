import { Crumb } from '../Crumb.ts'
import type { Pack } from '../Crumb.ts'
export class Html extends Crumb {
    static extensions = ['html', 'htm']

    /* constructor() {
        super()
    } */

    public pack (): Promise<Pack> {
        return new Promise((r) => r({eval:()=>''}))
    }

    public bundle (): Promise<string> {
        return new Promise((r) => r(''))
    }
    public get dependencies (): string[] {
        return ['']
    }


}

/* const html = new Html({raw:'',file:''})
const name = html.constructor.name
console.log('name:',name) */