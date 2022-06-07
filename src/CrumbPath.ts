import { path } from '../dist.ts'
import { Crumb } from './Crumb.ts'
import { cleanPath } from './cleanPath.ts'

export class CrumbPath {

    constructor(path: string) {
        this.path = path
    }

    path: string

    public get projectDir (): string {
        return path.dirname(Deno.cwd())
    }

    public get root (): string {
        return Crumb.root
    }

    public get absolute (): string {
        return path.join(this.projectDir, this.root, this.path)
    }

    public get cleanPath (): string {
        return cleanPath(this.path)
    }

    public get relativeToProject (): string {
        return path.relative(this.projectDir, this.absolute)
    }

    }